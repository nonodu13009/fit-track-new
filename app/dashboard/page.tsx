"use client";

import { Card, Loading } from "@/components/ui";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { WeightChart } from "@/components/features/WeightChart";
import { VolumeChart } from "@/components/features/VolumeChart";
import { StreakCard } from "@/components/features/StreakCard";
import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { useUserProfile } from "@/hooks/useUserProfile";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { workoutsCount, totalMinutes, avgRPE, loading } = useWeeklyStats();
  const { profile } = useUserProfile();
  const targetWeight = profile?.physical?.targetWeight;

  const getIntensityLabel = (rpe: number) => {
    if (rpe === 0) return "Aucune activité";
    if (rpe < 4) return "Intensité légère";
    if (rpe < 7) return "Intensité modérée";
    if (rpe < 9) return "Intensité élevée";
    return "Intensité maximale";
  };

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return mins === 0 ? `${hours}h` : `${hours}h${mins}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Stats Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" color="purple" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Séances (7j)</p>
                <p className="text-3xl font-bold text-accent-cyan">
                  {workoutsCount}
                </p>
                <p className="text-xs text-gray-500">
                  {workoutsCount === 0
                    ? "Commencez votre semaine !"
                    : workoutsCount === 1
                      ? "1 séance cette semaine"
                      : `${workoutsCount} séances cette semaine`}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Minutes totales</p>
                <p className="text-3xl font-bold text-accent-purple">
                  {totalMinutes}
                </p>
                <p className="text-xs text-gray-500">
                  {formatHours(totalMinutes)} cette semaine
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">RPE moyen</p>
                <p className="text-3xl font-bold text-accent-lime">
                  {avgRPE > 0 ? avgRPE : "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {getIntensityLabel(avgRPE)}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Streak */}
      <StreakCard />

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeightChart targetWeight={targetWeight} />
        <VolumeChart />
      </div>

      {/* À faire aujourd'hui */}
      <Card variant="elevated">
        <h2 className="mb-4 text-lg font-semibold text-white">
          À faire aujourd&apos;hui
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-purple" />
            <div>
              <p className="text-sm font-medium text-white">Entraînement JJB</p>
              <p className="text-xs text-gray-500">18:00 - 90 min</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
