"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserProgress } from "@/lib/progression/types";
import {
  loadProgress,
  updateProgress,
} from "@/lib/progression/progressStore";
import { BossFight } from "@/components/progression/BossFight";
import { createBossFightResult } from "@/lib/progression/gamification";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function BossFightPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const cycleId = parseInt(params.cycleId as string);

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const loadedProgress = await loadProgress(user?.uid || null);
        setProgress(loadedProgress);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const handleComplete = async (result: {
    cycle: number;
    score: number;
    medal: "bronze" | "argent" | "or";
    attempts: number;
    successes: number;
  }) => {
    if (!progress) return;

    const bossResult = createBossFightResult(
      result.cycle,
      result.successes,
      result.attempts
    );

    const updatedProgress: UserProgress = {
      ...progress,
      gamification: {
        ...progress.gamification,
        bossFights: {
          ...progress.gamification.bossFights,
          [result.cycle]: bossResult,
        },
      },
    };

    const finalProgress = await updateProgress(updatedProgress, user?.uid || null);
    setProgress(finalProgress);

    // Rediriger après 3 secondes
    setTimeout(() => {
      router.push("/dashboard/progression");
    }, 3000);
  };

  if (loading || !progress) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <div className="flex justify-center py-12">
          <Loading size="lg" color="purple" />
        </div>
      </div>
    );
  }

  if (cycleId < 1 || cycleId > 4) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <Card variant="elevated">
          <div className="text-center py-8">
            <p className="text-lg text-gray-400 mb-4">Cycle invalide</p>
            <Button variant="primary" onClick={() => router.push("/dashboard/progression")}>
              Retour à la progression
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <DashboardHeader />
      <div className="max-w-2xl mx-auto">
        <BossFight cycle={cycleId} onComplete={handleComplete} />
      </div>
    </div>
  );
}
