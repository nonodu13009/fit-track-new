"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Info,
  Warning,
  X,
} from "@phosphor-icons/react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: <CheckCircle size={20} weight="fill" />,
    error: <XCircle size={20} weight="fill" />,
    info: <Info size={20} weight="fill" />,
    warning: <Warning size={20} weight="fill" />,
  };

  const colorClasses = {
    success:
      "bg-green-500/20 border-green-500/30 text-green-400 shadow-glow-lime",
    error: "bg-red-500/20 border-red-500/30 text-red-400",
    info: "bg-accent-cyan/20 border-accent-cyan/30 text-accent-cyan shadow-glow-cyan",
    warning:
      "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`glass flex min-w-[300px] items-start gap-3 rounded-lg border p-4 ${colorClasses[type]}`}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 text-current opacity-50 transition-opacity hover:opacity-100"
        aria-label="Fermer"
      >
        <X size={16} weight="bold" />
      </button>
    </motion.div>
  );
}

/**
 * Container pour les toasts (à placer dans le layout)
 */
export interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex max-w-md flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
