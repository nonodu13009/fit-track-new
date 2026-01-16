"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserProgress } from "@/lib/progression/types";
import {
  loadProgress,
  updateProgress,
} from "@/lib/progression/progressStore";
import {
  enrichAllStepsWithProgress,
  getTargetStepIdForScroll,
  computeGlobalCompletion,
  computeBlockProgress,
} from "@/lib/progression/compute";
import { Timeline } from "@/components/progression/Timeline";
import { GamificationHeader } from "@/components/progression/GamificationHeader";
import { BadgesGrid } from "@/components/progression/BadgesGrid";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { scrollToActiveStep } from "@/lib/progression/scroll";
import { getCurrentStepId } from "@/lib/progression/compute";

export default function ProgressionPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");
  const [targetStepId, setTargetStepId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const loadedProgress = await loadProgress(user?.uid || null);
        setProgress(loadedProgress);

        // Calculer la step cible pour auto-scroll
        const targetId = getTargetStepIdForScroll(loadedProgress);
        setTargetStepId(targetId);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  useEffect(() => {
    if (targetStepId && !loading) {
      scrollToActiveStep(targetStepId);
    }
  }, [targetStepId, loading]);

  const handleUpdate = async (updatedProgress: UserProgress) => {
    const finalProgress = await updateProgress(updatedProgress, user?.uid || null);
    setProgress(finalProgress);

    // Recalculer la step cible
    const targetId = getTargetStepIdForScroll(finalProgress);
    setTargetStepId(targetId);
  };

  const handleScrollToActive = () => {
    if (!progress) return;
    const currentId = getCurrentStepId(progress);
    if (currentId) {
      scrollToActiveStep(currentId);
      setTargetStepId(currentId);
    }
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

  const enrichedSteps = enrichAllStepsWithProgress(progress);
  const globalCompletion = computeGlobalCompletion(progress);
  const blockProgress = computeBlockProgress(progress);

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Gamification Header */}
      <GamificationHeader gamification={progress.gamification} />

      {/* Stats globales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card variant="glass">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Completion globale</p>
            <p className="text-3xl font-bold text-accent-cyan">{globalCompletion}%</p>
          </div>
        </Card>
        {blockProgress.map((block) => (
          <Card key={block.block} variant="glass">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Bloc {block.block}</p>
              <p className="text-3xl font-bold text-accent-purple">
                {block.completionPercentage}%
              </p>
              <p className="text-xs text-gray-500">
                {block.completedSteps}/{block.totalSteps}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "timeline" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("timeline")}
          >
            Timeline
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            Liste
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleScrollToActive}
        >
          Aller à l'étape active
        </Button>
      </div>

      {/* Timeline ou Liste */}
      {viewMode === "timeline" ? (
        <Timeline
          steps={enrichedSteps}
          targetStepId={targetStepId}
          onStepClick={(stepId) => {
            setTargetStepId(stepId);
            scrollToActiveStep(stepId);
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrichedSteps.map((step) => (
            <div key={step.id} id={`step-node-${step.id}`}>
              <Timeline
                steps={[step]}
                targetStepId={step.id === targetStepId ? step.id : undefined}
                onStepClick={(stepId) => {
                  setTargetStepId(stepId);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      <BadgesGrid badges={progress.gamification.badges} />
    </div>
  );
}
