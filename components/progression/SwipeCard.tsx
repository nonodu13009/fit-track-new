"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { PasWithProgress } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { detectSwipe, getSwipeType } from "@/lib/progression/interactions";
import { getLogActionXP } from "@/lib/progression/gamification";
import Link from "next/link";

interface SwipeCardProps {
  pas: PasWithProgress;
  onSwipeShort?: (pasId: string) => void; // Log activité
  onSwipeLong?: (pasId: string) => void; // Test terminé
  onClick?: () => void;
}

export function SwipeCard({ pas, onSwipeShort, onSwipeLong, onClick }: SwipeCardProps) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [xpFeedback, setXpFeedback] = useState<{ show: boolean; xp: number }>({
    show: false,
    xp: 0,
  });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);

  const statusColors = {
    LOCKED: "gray",
    AVAILABLE: "cyan",
    IN_PROGRESS: "purple",
    DONE: "green",
  } as const;

  const statusLabels = {
    LOCKED: "Verrouillée",
    AVAILABLE: "Disponible",
    IN_PROGRESS: "En cours",
    DONE: "Terminée",
  } as const;

  // Calculer completion basé sur les paliers
  const completion = pas.progress
    ? Math.round(
        ((pas.progress.paliersState.K.status === "completed" ? 1 : 0) +
          (pas.progress.paliersState.E.status === "completed" ? 1 : 0) +
          (pas.progress.paliersState.A.status === "completed" ? 1 : 0) +
          (pas.progress.paliersState.I.status === "completed" ? 1 : 0)) /
          4 *
          100
      )
    : 0;

  const handleDragStart = () => {
    setIsSwiping(true);
  };

  const handleDrag = (_: any, info: PanInfo) => {
    if (!startPosRef.current) {
      startPosRef.current = { x: info.point.x, y: info.point.y };
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!startPosRef.current) {
      return;
    }

    const swipe = detectSwipe(
      startPosRef.current.x,
      startPosRef.current.y,
      info.point.x,
      info.point.y
    );

    if (swipe) {
      const swipeType = getSwipeType(swipe);

      if (swipeType === "short" && onSwipeShort) {
        // Swipe court = log activité
        const xpGained = getLogActionXP(undefined, new Date().toISOString());
        setXpFeedback({ show: true, xp: xpGained });
        setTimeout(() => setXpFeedback({ show: false, xp: 0 }), 2000);
        onSwipeShort(pas.id);
      } else if (swipeType === "long" && onSwipeLong) {
        // Swipe long = test terminé
        onSwipeLong(pas.id);
      }
    }

    // Reset
    startPosRef.current = null;
    setIsSwiping(false);
    x.set(0);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ x, opacity, scale }}
      className="relative"
    >
      <Link href={`/dashboard/progression/${pas.id}`} onClick={onClick}>
        <Card
          variant="elevated"
          hoverable
          className={`relative ${
            pas.status === "IN_PROGRESS"
              ? "ring-2 ring-accent-purple/50 shadow-glow-purple"
              : ""
          } ${pas.status === "LOCKED" ? "opacity-70" : ""} ${
            isSwiping ? "cursor-grabbing" : ""
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-gray-500">
                  Cycle {pas.cycle} • Sem. {pas.week} • Pas {pas.order}
                </span>
                <Badge variant={statusColors[pas.status] as any} size="sm">
                  {statusLabels[pas.status]}
                </Badge>
                {pas.progress?.masteryTier && (
                  <Badge
                    variant={
                      pas.progress.masteryTier === "or"
                        ? "lime"
                        : pas.progress.masteryTier === "argent"
                          ? "cyan"
                          : "gray"
                    }
                    size="sm"
                  >
                    {pas.progress.masteryTier === "or"
                      ? "Or"
                      : pas.progress.masteryTier === "argent"
                        ? "Argent"
                        : "Bronze"}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{pas.title}</h3>
            </div>
            {pas.status === "DONE" && (
              <div className="text-2xl">✅</div>
            )}
          </div>

          {pas.progress && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Progression</span>
                <span className="text-xs text-gray-400">{completion}%</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-purple to-indigo-600 transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          )}

          {/* Indicateur de swipe */}
          {!isSwiping && (
            <div className="absolute top-2 right-2 text-xs text-gray-500">
              ← Swipe
            </div>
          )}

          {/* Feedback XP */}
          {xpFeedback.show && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0, y: -40 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            >
              <div className="bg-accent-purple/90 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                +{xpFeedback.xp} XP
              </div>
            </motion.div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}
