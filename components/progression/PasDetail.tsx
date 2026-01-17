"use client";

import { useState, useRef } from "react";
import { Pas, PasProgress, UserProgress } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { canPasBeValidated } from "@/lib/progression/compute";
import { validatePalierK, validatePalierE, validatePalierA, validatePalierI } from "@/lib/progression/validation";
import { calculateMasteryTier } from "@/lib/progression/validation";
import { HoldToConfirm } from "./HoldToConfirm";
import { MasteryBadge } from "./MasteryBadge";
import { PalierTimeline } from "./PalierTimeline";
import { ConfettiEffect } from "./ConfettiEffect";
import { useToast } from "@/hooks/useToast";

interface PasDetailProps {
  pas: Pas;
  progress: UserProgress;
  onUpdate: (updatedProgress: UserProgress) => Promise<void>;
}

export function PasDetail({ pas, progress, onUpdate }: PasDetailProps) {
  const { success } = useToast();
  const previousStatusRef = useRef<Record<string, string>>({});
  
  const pasProgress: PasProgress = progress.pas[pas.id] || {
    paliersState: {
      K: { status: "not_started", repsCompleted: 0 },
      E: { status: "not_started", totalReps: 0, cleanReps: 0 },
      A: {
        status: "not_started",
        positionalTest: { attempts: 0, successes: 0, successRate: 0, sessions: [] },
        targetRate: pas.validationCriteria.positionalTest.targetRate,
      },
      I: {
        status: "not_started",
        freeSparringTest: { rounds: 0, occurrences: 0, sessions: [] },
        occurrencesMin: pas.validationCriteria.freeSparringTest.occurrencesMin,
        sessionsRequired: pas.validationCriteria.stability.sessionsRequired,
      },
    },
    updatedAt: new Date().toISOString(),
    volumeCompleted: 0,
    sessions: [],
  };

  // Initialiser les statuts précédents
  if (!previousStatusRef.current.K) {
    previousStatusRef.current = {
      K: pasProgress.paliersState.K.status,
      E: pasProgress.paliersState.E.status,
      A: pasProgress.paliersState.A.status,
      I: pasProgress.paliersState.I.status,
    };
  }

  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const masteryTier = calculateMasteryTier(pas, pasProgress);

  const handleUpdatePalier = async (palierKey: "K" | "E" | "A" | "I", value: any) => {
    setIsUpdating(true);
    
    try {
      let updatedPalier: any;
      let updatedPasProgress: PasProgress;

      const previousStatus = pasProgress.paliersState[palierKey].status;

      if (palierKey === "K") {
        // validatePalierK prend une valeur absolue (utilise Math.max)
        const reps = typeof value === "number" ? value : parseInt(value) || 0;
        updatedPalier = validatePalierK(pasProgress.paliersState.K, reps);
        const oldReps = pasProgress.paliersState.K.repsCompleted;
        updatedPasProgress = {
          ...pasProgress,
          paliersState: {
            ...pasProgress.paliersState,
            K: updatedPalier,
          },
          updatedAt: new Date().toISOString(),
          volumeCompleted: pasProgress.volumeCompleted + Math.max(0, updatedPalier.repsCompleted - oldReps),
        };
      } else if (palierKey === "E") {
        const totalReps = value.totalReps || 0;
        const cleanReps = value.cleanReps || 0;
        const oldTotal = pasProgress.paliersState.E.totalReps;
        // validatePalierE additionne totalReps mais prend le max pour cleanReps
        const incrementTotal = Math.max(0, totalReps - oldTotal);
        updatedPalier = validatePalierE(pasProgress.paliersState.E, incrementTotal, cleanReps);
        updatedPasProgress = {
          ...pasProgress,
          paliersState: {
            ...pasProgress.paliersState,
            E: updatedPalier,
          },
          updatedAt: new Date().toISOString(),
          volumeCompleted: pasProgress.volumeCompleted + incrementTotal,
        };
      } else if (palierKey === "A") {
        const sessionDate = new Date().toISOString().split("T")[0];
        const attempts = value.attempts || 0;
        const successes = value.successes || 0;
        const oldAttempts = pasProgress.paliersState.A.positionalTest.attempts;
        const oldSuccesses = pasProgress.paliersState.A.positionalTest.successes;
        updatedPalier = validatePalierA(
          pasProgress.paliersState.A,
          attempts - oldAttempts,
          successes - oldSuccesses,
          sessionDate
        );
        updatedPasProgress = {
          ...pasProgress,
          paliersState: {
            ...pasProgress.paliersState,
            A: updatedPalier,
          },
          updatedAt: new Date().toISOString(),
          sessions: [...new Set([...pasProgress.sessions, sessionDate])],
        };
      } else {
        // Palier I
        const sessionDate = new Date().toISOString().split("T")[0];
        const occurrences = typeof value === "number" ? value : parseInt(value) || 0;
        const oldOccurrences = pasProgress.paliersState.I.freeSparringTest.occurrences;
        updatedPalier = validatePalierI(
          pasProgress.paliersState.I,
          occurrences - oldOccurrences,
          sessionDate
        );
        updatedPasProgress = {
          ...pasProgress,
          paliersState: {
            ...pasProgress.paliersState,
            I: updatedPalier,
          },
          updatedAt: new Date().toISOString(),
          sessions: [...new Set([...pasProgress.sessions, sessionDate])],
        };
      }

      // Vérifier si le palier vient d'être complété
      if (previousStatus !== "completed" && updatedPalier.status === "completed") {
        setShowConfetti(true);
        success(`Palier ${palierKey} complété ! 🎉`);
      } else {
        success(`Palier ${palierKey} mis à jour !`);
      }

      previousStatusRef.current[palierKey] = updatedPalier.status;

      const updatedProgress: UserProgress = {
        ...progress,
        pas: {
          ...progress.pas,
          [pas.id]: updatedPasProgress,
        },
      };

      await onUpdate(updatedProgress);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleValidate = async () => {
    if (!canPasBeValidated(pas, progress)) {
      return;
    }

    setIsUpdating(true);
    try {
      const updatedPasProgress: PasProgress = {
        ...pasProgress,
        validatedAt: new Date().toISOString(),
        masteryTier: masteryTier || "bronze",
        updatedAt: new Date().toISOString(),
      };

      const updatedProgress: UserProgress = {
        ...progress,
        pas: {
          ...progress.pas,
          [pas.id]: updatedPasProgress,
        },
      };

      await onUpdate(updatedProgress);
      setShowConfetti(true);
      success("Pas validé avec succès ! 🎉");
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const canValidate = canPasBeValidated(pas, progress);
  const blockedMessage = !canValidate
    ? "Tous les paliers doivent être complétés"
    : undefined;

  return (
    <>
      <ConfettiEffect
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      
      <div className="space-y-6">
        <Card variant="elevated">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-500">
                Cycle {pas.cycle} • Sem. {pas.week} • Pas {pas.order}
              </span>
              {masteryTier && <MasteryBadge tier={masteryTier} size="sm" />}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{pas.title}</h1>
            <div className="text-sm text-gray-400 mb-4">
              Type: <Badge variant="cyan" size="sm">{pas.type}</Badge>
            </div>
          </div>

          {/* Objectifs */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Objectifs</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {pas.objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>

          {/* Checkpoints */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Keypoints</h2>
            <p className="text-xs text-gray-500 mb-3">
              Points clés à vérifier lors de l&apos;exécution
            </p>
            <div className="space-y-2">
              {pas.checkpoints.map((checkpoint, idx) => {
                const isChecked =
                  pasProgress.paliersState.K.status === "completed" ||
                  pasProgress.paliersState.E.status === "completed";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      isChecked
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-surface/50 border-white/10"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        isChecked
                          ? "bg-green-500 text-white"
                          : "bg-gray-600 border-2 border-gray-500"
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            isChecked ? "text-gray-200" : "text-gray-400"
                          }`}
                        >
                          {checkpoint.label}
                        </span>
                        {checkpoint.youtubeUrl && (
                          <a
                            href={checkpoint.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-red-500 hover:text-red-400 transition-colors"
                            title="Rechercher sur YouTube"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                          </a>
                        )}
                      </div>
                      {checkpoint.explanation && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          {checkpoint.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline des paliers */}
          <div className="mb-6">
            <PalierTimeline
              pas={pas}
              pasProgress={pasProgress}
              onUpdate={handleUpdatePalier}
            />
          </div>

          {/* Validation */}
          <HoldToConfirm
            onConfirm={handleValidate}
            disabled={isUpdating || !canValidate}
            blocked={!canValidate}
            blockedMessage={blockedMessage}
          >
            <Button
              variant="primary"
              disabled={isUpdating || !canValidate}
              className="w-full"
            >
              {isUpdating ? "Validation..." : "Valider le pas"}
            </Button>
          </HoldToConfirm>
        </Card>
      </div>
    </>
  );
}
