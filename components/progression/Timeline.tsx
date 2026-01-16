"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { PasWithProgress, UserProgress } from "@/lib/progression/types";
import { SwipeCard } from "./SwipeCard";
import { getTargetPasIdForScroll } from "@/lib/progression/compute";
import { getPasByCycle } from "@/lib/progression/pas";

interface TimelineProps {
  progress: UserProgress;
  pasWithProgress: PasWithProgress[];
  onSwipeShort?: (pasId: string) => void;
  onSwipeLong?: (pasId: string) => void;
}

export function Timeline({
  progress,
  pasWithProgress,
  onSwipeShort,
  onSwipeLong,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetPasId = getTargetPasIdForScroll(progress);

  useEffect(() => {
    if (targetPasId && containerRef.current) {
      const element = document.getElementById(`pas-${targetPasId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [targetPasId]);

  // Grouper par cycle
  const pasByCycle: Record<number, PasWithProgress[]> = {};
  for (const pas of pasWithProgress) {
    if (!pasByCycle[pas.cycle]) {
      pasByCycle[pas.cycle] = [];
    }
    pasByCycle[pas.cycle].push(pas);
  }

  return (
    <div ref={containerRef} className="space-y-8">
      {[1, 2, 3, 4].map((cycle) => {
        const cyclePas = pasByCycle[cycle] || [];
        if (cyclePas.length === 0) return null;

        return (
          <div key={cycle} id={`cycle-${cycle}`} className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">
              Cycle {cycle} - {cycle === 1 ? "Fondations" : cycle === 2 ? "Intermédiaire" : cycle === 3 ? "Avancé" : "Expérimenté"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cyclePas.map((pas) => (
                <motion.div
                  key={pas.id}
                  id={`pas-${pas.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    pas.id === targetPasId
                      ? "ring-2 ring-accent-purple rounded-lg p-1"
                      : ""
                  }
                >
                  <SwipeCard
                    pas={pas}
                    onSwipeShort={onSwipeShort}
                    onSwipeLong={onSwipeLong}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
