import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function useCoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

      // Ajouter le message utilisateur
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/coach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            message: content.trim(),
            includeContext: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la communication avec le coach");
        }

        const data = await response.json();

        // Ajouter la réponse de l'IA
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
        console.error("Erreur useCoach:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
