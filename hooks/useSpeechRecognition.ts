"use client";

/// <reference path="../types/speech-recognition.d.ts" />

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
  const previousFinalTranscriptRef = useRef<string>("");

  // Vérifier si l'API est supportée
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        previousFinalTranscriptRef.current = ""; // Réinitialiser au début
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        // Construire le transcript complet depuis le début
        // Les résultats finaux s'accumulent, les intermédiaires se remplacent
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Résultats finaux : on les accumule
            finalTranscript += transcript + " ";
            previousFinalTranscriptRef.current += transcript + " ";
          } else {
            // Résultat intermédiaire : on remplace (pas d'accumulation)
            interimTranscript = transcript;
          }
        }

        // Combiner : résultats finaux accumulés + dernier résultat intermédiaire
        const fullTranscript = (
          previousFinalTranscriptRef.current + interimTranscript
        ).trim();
        setTranscript(fullTranscript);

        // Appeler onResult seulement quand on a de nouveaux résultats finaux
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
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError("Reconnaissance vocale non disponible");
      return;
    }

    try {
      setTranscript("");
      setError(null);
      recognition.start();
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
    const recognition = recognitionRef.current;
    if (recognition && isListening) {
      recognition.stop();
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
