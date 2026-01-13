"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Warning, X } from "@phosphor-icons/react";
import { Button } from "./Button";

export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger",
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantColors = {
    danger: {
      icon: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      button: "danger" as const,
    },
    warning: {
      icon: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      button: "primary" as const,
    },
    info: {
      icon: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
      border: "border-accent-cyan/30",
      button: "primary" as const,
    },
  };

  const colors = variantColors[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-deep-black/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="glass relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${colors.bg} ${colors.border} border`}
              >
                <Warning size={24} weight="bold" className={colors.icon} />
              </div>

              {/* Title */}
              {title && (
                <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
              )}

              {/* Message */}
              <p className="mb-6 text-gray-300">{message}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={onClose}
                >
                  {cancelText}
                </Button>
                <Button
                  variant={colors.button}
                  className="flex-1"
                  onClick={handleConfirm}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
