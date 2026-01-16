"use client";

import { MasteryTier } from "@/lib/progression/types";
import { motion } from "motion/react";

interface MasteryBadgeProps {
  tier: MasteryTier;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function MasteryBadge({ tier, size = "md", animated = false }: MasteryBadgeProps) {
  const tierConfig = {
    bronze: {
      icon: "🥉",
      color: "text-amber-600",
      bgColor: "bg-amber-600/20",
      borderColor: "border-amber-600/50",
      label: "Bronze",
    },
    argent: {
      icon: "🥈",
      color: "text-gray-300",
      bgColor: "bg-gray-300/20",
      borderColor: "border-gray-300/50",
      label: "Argent",
    },
    or: {
      icon: "🥇",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/20",
      borderColor: "border-yellow-400/50",
      label: "Or",
    },
  };

  const config = tierConfig[tier];
  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  const content = (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${config.bgColor} ${config.borderColor} ${config.color} ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      <span className="font-medium">{config.label}</span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
