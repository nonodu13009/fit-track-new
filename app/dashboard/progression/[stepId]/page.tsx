"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserProgress } from "@/lib/progression/types";
import {
  loadProgress,
  updateProgress,
} from "@/lib/progression/progressStore";
import { getStepById } from "@/lib/progression/steps";
import { enrichStepWithProgress } from "@/lib/progression/compute";
import { StepDetail } from "@/components/progression/StepDetail";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Badge } from "@/components/ui/Badge";

export default function StepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const stepId = params.stepId as string;

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

  const handleUpdate = async (updatedProgress: UserProgress) => {
    const finalProgress = await updateProgress(updatedProgress, user?.uid || null);
    setProgress(finalProgress);
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

  const step = getStepById(stepId);
  if (!step) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <Card variant="elevated">
          <div className="text-center py-8">
            <p className="text-lg text-gray-400 mb-4">Étape introuvable</p>
            <Button variant="primary" onClick={() => router.push("/dashboard/progression")}>
              Retour à la progression
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const enrichedStep = enrichStepWithProgress(step, progress);

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Header de l'étape */}
      <Card variant="elevated">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-400">
                Bloc {step.block} • Step {step.order}
              </span>
              <Badge
                variant={
                  enrichedStep.status === "DONE"
                    ? "green"
                    : enrichedStep.status === "IN_PROGRESS"
                      ? "purple"
                      : enrichedStep.status === "AVAILABLE"
                        ? "cyan"
                        : "gray"
                }
                size="sm"
              >
                {enrichedStep.status === "DONE"
                  ? "Terminée"
                  : enrichedStep.status === "IN_PROGRESS"
                    ? "En cours"
                    : enrichedStep.status === "AVAILABLE"
                      ? "Disponible"
                      : "Verrouillée"}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{step.title}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/progression")}
          >
            ← Retour
          </Button>
        </div>
      </Card>

      {/* Détails de l'étape */}
      <StepDetail step={step} progress={progress} onUpdate={handleUpdate} />
    </div>
  );
}
