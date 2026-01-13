"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Button, Loading, Badge } from "@/components/ui";
import { useCoach } from "@/hooks/useCoach";
import { useToastContext } from "@/components/providers/ToastProvider";
import { shareContent } from "@/lib/utils/share";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperPlaneRight,
  Robot,
  User as UserIcon,
  Sparkle,
  Trash,
  Copy,
  Share,
  CheckCircle,
} from "@phosphor-icons/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function CoachPage() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useCoach();
  const toast = useToastContext();
  const [inputValue, setInputValue] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  // Copier un message
  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast.success("Message copié !");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  };

  // Copier toute la conversation
  const copyAllMessages = async () => {
    try {
      const conversationText = messages
        .map((msg) => {
          const role = msg.role === "user" ? "Vous" : "Coach IA";
          const time = format(msg.timestamp, "HH:mm", { locale: fr });
          return `[${time}] ${role}:\n${msg.content}\n`;
        })
        .join("\n");

      await navigator.clipboard.writeText(conversationText);
      toast.success("Conversation copiée !");
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  };

  // Partager la conversation
  const shareConversation = async () => {
    const conversationText = messages
      .map((msg) => {
        const role = msg.role === "user" ? "💬 Vous" : "🤖 Coach IA";
        return `${role}:\n${msg.content}\n`;
      })
      .join("\n---\n\n");

    const success = await shareContent({
      title: "Ma conversation avec le Coach IA",
      text: `🤖 Conversation Coach IA - JJB Tracking\n\n${conversationText}\n\n🔗 JJB Tracking`,
    });

    if (success) {
      toast.success("Conversation partagée !");
    } else {
      toast.info("Texte copié dans le presse-papier");
    }
  };

  const suggestions = [
    { text: "Comment améliorer ma guard retention ?", emoji: "🥋" },
    { text: "Crée-moi un plan pour la semaine", emoji: "📅" },
    { text: "Analyse mes stats récentes", emoji: "📊" },
    { text: "Conseils pour ma prochaine compétition", emoji: "🏆" },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gradient">
            <span>🤖</span> Coach IA
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            <Badge variant="purple" size="sm" className="mr-2">
              Mistral AI
            </Badge>
            Posez vos questions, je connais vos données
          </p>
        </div>
        {messages.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAllMessages}
              icon={<Copy size={16} weight="bold" />}
            >
              Copier tout
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareConversation}
              icon={<Share size={16} weight="bold" />}
            >
              Partager
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              icon={<Trash size={16} weight="bold" />}
            >
              Effacer
            </Button>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <Card variant="glass" className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-purple/20">
                  <Robot size={48} weight="fill" className="text-accent-purple" />
                </div>
              </motion.div>

              <h2 className="mb-2 text-xl font-semibold text-white">
                👋 Bonjour ! Je suis votre coach IA
              </h2>
              <p className="mb-6 text-center text-gray-400">
                Posez-moi vos questions, je peux vous aider avec vos
                entraînements 🥋, votre nutrition 🍽️, et créer des plans
                personnalisés 📅.
              </p>

              {/* Suggestions */}
              <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setInputValue(suggestion.text)}
                    className="rounded-lg border border-white/10 bg-surface p-3 text-left text-sm text-gray-300 transition-colors hover:border-accent-purple/50 hover:bg-elevated"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-lg">{suggestion.emoji}</span>
                      <Sparkle
                        size={16}
                        weight="fill"
                        className="text-accent-purple"
                      />
                    </div>
                    {suggestion.text}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-purple/20">
                      <Robot size={20} weight="fill" className="text-accent-purple" />
                    </div>
                  )}

                  <div className="group relative max-w-[80%]">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-accent-purple text-white"
                          : "bg-surface text-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs opacity-50">
                          {format(message.timestamp, "HH:mm", { locale: fr })}
                        </p>
                      </div>
                    </div>

                    {/* Bouton copier (visible au hover) */}
                    <button
                      onClick={() => copyMessage(message.content, message.id)}
                      className={`absolute -bottom-2 right-2 rounded-lg border border-white/10 bg-elevated p-1.5 text-gray-400 opacity-0 shadow-lg transition-all hover:text-accent-cyan group-hover:opacity-100 ${
                        copiedMessageId === message.id ? "opacity-100" : ""
                      }`}
                      title="Copier ce message"
                    >
                      {copiedMessageId === message.id ? (
                        <CheckCircle size={14} weight="fill" className="text-green-400" />
                      ) : (
                        <Copy size={14} weight="bold" />
                      )}
                    </button>
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-cyan/20">
                      <UserIcon size={20} weight="fill" className="text-accent-cyan" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Loading */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-purple/20">
                <Robot size={20} weight="fill" className="text-accent-purple" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-3">
                <Loading size="sm" color="purple" />
                <span className="text-sm text-gray-400">
                  Le coach réfléchit...
                </span>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez votre question..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-white/10 bg-surface px-4 py-3 text-white placeholder:text-gray-600 transition-all focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50 disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            icon={<PaperPlaneRight size={20} weight="fill" />}
            className="shrink-0"
          >
            Envoyer
          </Button>
        </form>
      </Card>
    </div>
  );
}

