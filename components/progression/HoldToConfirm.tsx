"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  initHoldToConfirm,
  startHold,
  updateHoldProgress,
  isHoldCompleted,
  stopHold,
  type HoldToConfirmState,
} from "@/lib/progression/interactions";

interface HoldToConfirmProps {
  onConfirm: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  blocked?: boolean;
  blockedMessage?: string;
  children: React.ReactNode;
}

export function HoldToConfirm({
  onConfirm,
  onCancel,
  disabled = false,
  blocked = false,
  blockedMessage = "Conditions non remplies",
  children,
}: HoldToConfirmProps) {
  const [holdState, setHoldState] = useState<HoldToConfirmState>(
    initHoldToConfirm()
  );
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);

  useEffect(() => {
    if (holdState.isHolding) {
      const frame = requestAnimationFrame(() => {
        const updated = updateHoldProgress(holdState);
        setHoldState(updated);

        if (isHoldCompleted(updated)) {
          onConfirm();
          setHoldState(stopHold());
        }
      });
      setAnimationFrame(frame);
    } else {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        setAnimationFrame(null);
      }
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdState.isHolding, holdState.startTime]);

  const handleMouseDown = () => {
    if (disabled || blocked) {
      return;
    }
    setHoldState(startHold());
  };

  const handleMouseUp = () => {
    if (holdState.isHolding) {
      setHoldState(stopHold());
      if (onCancel) {
        onCancel();
      }
    }
  };

  const handleMouseLeave = () => {
    if (holdState.isHolding) {
      setHoldState(stopHold());
      if (onCancel) {
        onCancel();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (disabled || blocked) {
      return;
    }
    setHoldState(startHold());
  };

  const handleTouchEnd = () => {
    if (holdState.isHolding) {
      setHoldState(stopHold());
      if (onCancel) {
        onCancel();
      }
    }
  };

  return (
    <div
      className="relative"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}

      {/* Anneau radial */}
      {holdState.isHolding && !blocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-700"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-accent-purple"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - holdState.progress / 100)}
              initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 44 * (1 - holdState.progress / 100),
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </svg>
          <div className="absolute text-xs text-white font-medium">
            {Math.round(holdState.progress)}%
          </div>
        </motion.div>
      )}

      {/* Animation blocked */}
      {blocked && (
        <motion.div
          className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="text-sm text-red-400 font-medium text-center px-4">
            {blockedMessage}
          </div>
        </motion.div>
      )}
    </div>
  );
}
