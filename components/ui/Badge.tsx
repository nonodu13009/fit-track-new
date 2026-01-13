"use client";

import { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "cyan" | "purple" | "lime" | "gray" | "red" | "green";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "cyan",
  size = "sm",
  className = "",
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-full";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const variantClasses = {
    cyan: "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30",
    purple:
      "bg-accent-purple/20 text-accent-purple border border-accent-purple/30",
    lime: "bg-accent-lime/20 text-accent-lime border border-accent-lime/30",
    gray: "bg-gray-800/50 text-gray-400 border border-gray-700",
    red: "bg-red-500/20 text-red-400 border border-red-500/30",
    green: "bg-green-500/20 text-green-400 border border-green-500/30",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
