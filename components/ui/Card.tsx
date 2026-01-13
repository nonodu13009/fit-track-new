"use client";

import { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "glass";
  hoverable?: boolean;
  children: ReactNode;
}

export function Card({
  variant = "elevated",
  hoverable = false,
  children,
  className = "",
  ...props
}: CardProps) {
  const baseClasses = "rounded-xl p-4 transition-all duration-300";

  const variantClasses = {
    elevated: "bg-elevated border border-white/5",
    flat: "bg-surface",
    glass: "glass", // Utilise la classe CSS custom
  };

  const hoverClasses = hoverable
    ? "hover:scale-[1.02] hover:shadow-lg cursor-pointer"
    : "";

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...(props as any)}
    >
      {children}
    </MotionDiv>
  );
}
