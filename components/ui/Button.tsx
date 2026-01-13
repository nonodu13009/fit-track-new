"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-accent-purple to-indigo-600 text-white hover:shadow-glow-purple active:scale-95",
    secondary:
      "bg-elevated text-white hover:bg-elevated/80 border border-white/10 active:scale-95",
    ghost:
      "text-gray-400 hover:text-white hover:bg-elevated/50 active:scale-95",
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:shadow-glow-cyan active:scale-95",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const MotionButton = motion.button;

  return (
    <MotionButton
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </MotionButton>
  );
}
