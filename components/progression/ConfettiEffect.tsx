"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface ConfettiEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ show, onComplete }: ConfettiEffectProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  const colors = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i * 360) / 50;
        const distance = 200 + Math.random() * 100;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = Math.random() * 0.5;

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
            style={{
              backgroundColor: color,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x,
              y,
              scale: 0,
              opacity: 0,
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              delay,
              ease: "easeOut",
            }}
          />
        );
      })}
      {/* Particules supplémentaires en forme de pétard */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * 360;
        const distance = 150 + Math.random() * 100;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <motion.div
            key={`spark-${i}`}
            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 2,
              opacity: 1,
            }}
            animate={{
              x,
              y,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
