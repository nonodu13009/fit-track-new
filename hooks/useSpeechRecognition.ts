"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useSpeechRecognition({
  onResult,
  onError,
  language = "fr-FR",
  continuous = false,
  interimResults = true,
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Vérifier si l'API est supportée
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript.trim());

        if (finalTranscript && onResult) {
          onResult(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = "Erreur de reconnaissance vocale";

        switch (event.error) {
          case "no-speech":
            errorMessage = "Aucune parole détectée";
            break;
          case "audio-capture":
            errorMessage = "Microphone non disponible";
            break;
          case "not-allowed":
            errorMessage = "Permission microphone refusée";
            break;
          case "network":
            errorMessage = "Erreur réseau";
            break;
          case "aborted":
            // Ignorer l'erreur si l'utilisateur a arrêté manuellement
            return;
          default:
            errorMessage = `Erreur: ${event.error}`;
        }

        setError(errorMessage);
        setIsListening(false);
        if (onError) {
          onError(errorMessage);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      setError("Reconnaissance vocale non supportée par votre navigateur");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, continuous, interimResults, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Reconnaissance vocale non disponible");
      return;
    }

    try {
      setTranscript("");
      setError(null);
      recognitionRef.current.start();
    } catch (err: any) {
      const errorMsg =
        err.message || "Impossible de démarrer la reconnaissance vocale";
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    }
  }, [onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
