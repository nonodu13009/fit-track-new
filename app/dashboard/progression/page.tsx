"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserProgress } from "@/lib/progression/types";
import {
  loadProgress,
  updateProgress,
} from "@/lib/progression/progressStore";
import {
  enrichAllPasWithProgress,
  getTargetPasIdForScroll,
  computeGlobalCompletion,
  computeCycleProgress,
} from "@/lib/progression/compute";
import { Timeline } from "@/components/progression/Timeline";
import { GamificationHeader } from "@/components/progression/GamificationHeader";
import { BadgesGrid } from "@/components/progression/BadgesGrid";
import { Quests } from "@/components/progression/Quests";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { refreshQuests, updateAllQuests } from "@/lib/progression/quests";
import { getLogActionXP } from "@/lib/progression/gamification";
import { createLogEntry, addLogEntry } from "@/lib/progression/gamification";

export default function ProgressionPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let loadedProgress = await loadProgress(user?.uid || null);
        
        // Rafraîchir les quêtes
        loadedProgress.quests = refreshQuests(loadedProgress);
        loadedProgress.quests = updateAllQuests(loadedProgress);
        
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

  const handleSwipeShort = async (pasId: string) => {
    if (!progress) return;
    
    const xpGained = getLogActionXP(
      progress.gamification.lastActiveDate,
      new Date().toISOString()
    );
    
    if (xpGained > 0) {
      const logEntry = createLogEntry("log", pasId, undefined, xpGained, undefined, `Log activité: ${pasId}`);
      const updatedProgress: UserProgress = {
        ...progress,
        log: addLogEntry(progress.log, logEntry),
      };
      await handleUpdate(updatedProgress);
    }
  };

  const handleSwipeLong = async (pasId: string) => {
    // Swipe long = test terminé (KPI enregistré)
    // À implémenter selon les besoins
    console.log("Swipe long sur pas:", pasId);
  };

  if (loading || !progress) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <Loading />
      </div>
    );
  }

  const pasWithProgress = enrichAllPasWithProgress(progress);
  const globalCompletion = computeGlobalCompletion(progress);
  const cycleProgresses = [1, 2, 3, 4].map((cycle) =>
    computeCycleProgress(cycle, progress)
  );

  return (
    <div className="space-y-6 pb-20">
      <DashboardHeader />
      
      <GamificationHeader gamification={progress.gamification} />

      {/* Stats globales */}
      <Card variant="elevated">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-purple">
              {globalCompletion}%
            </div>
            <div className="text-xs text-gray-400">Complétion globale</div>
          </div>
          {cycleProgresses.map((cp) => (
            <div key={cp.cycle} className="text-center">
              <div className="text-2xl font-bold text-white">
                {cp.completionPercentage}%
              </div>
              <div className="text-xs text-gray-400">Cycle {cp.cycle}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quêtes */}
      <Quests quests={progress.quests || []} />

      {/* Toggle view mode */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={viewMode === "timeline" ? "primary" : "secondary"}
          onClick={() => setViewMode("timeline")}
          size="sm"
        >
          Timeline
        </Button>
        <Button
          variant={viewMode === "list" ? "primary" : "secondary"}
          onClick={() => setViewMode("list")}
          size="sm"
        >
          Liste
        </Button>
      </div>

      {/* Timeline */}
      {viewMode === "timeline" && (
        <Timeline
          progress={progress}
          pasWithProgress={pasWithProgress}
          onSwipeShort={handleSwipeShort}
          onSwipeLong={handleSwipeLong}
        />
      )}

      {/* Liste */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pasWithProgress.map((pas) => (
            <div key={pas.id}>
              {/* Utiliser SwipeCard ou un composant de liste simplifié */}
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      <BadgesGrid badges={progress.gamification.badges} />
    </div>
  );
}
