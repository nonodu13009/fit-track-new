"use client";

import { Card, Loading } from "@/components/ui";
import { useStreak } from "@/hooks/useStreak";
import { Fire } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function StreakCard() {
  const { activeDays, totalDays, percentage, loading } = useStreak();

  if (loading) {
    return (
      <Card variant="glass">
        <div className="flex h-32 items-center justify-center">
          <Loading size="md" color="lime" />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-lime/20"
        >
          <Fire size={32} weight="fill" className="text-accent-lime" />
        </motion.div>

        <div className="flex-1">
          <p className="mb-1 text-sm text-gray-400">Jours actifs</p>
          <p className="mb-2 text-3xl font-bold text-accent-lime">
            {activeDays}/{totalDays}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-accent-lime"
              />
            </div>
            <span className="text-xs text-gray-400">{percentage}%</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {activeDays === 7
          ? "🔥 Semaine parfaite ! Incroyable !"
          : activeDays >= 5
            ? "💪 Excellente semaine !"
            : activeDays >= 3
              ? "👍 Bon rythme, continuez !"
              : activeDays > 0
                ? "🌱 Vous avez commencé, c'est bien !"
                : "📅 Aucune activité cette semaine"}
      </p>
    </Card>
  );
}
