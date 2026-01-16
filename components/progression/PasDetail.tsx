"use client";

import { useState } from "react";
import { Pas, PasProgress, UserProgress } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { canPasBeValidated } from "@/lib/progression/compute";
import { validatePalierK, validatePalierE, validatePalierA, validatePalierI } from "@/lib/progression/validation";
import { calculateMasteryTier } from "@/lib/progression/validation";
import { HoldToConfirm } from "./HoldToConfirm";
import { MasteryBadge } from "./MasteryBadge";
import { useToast } from "@/hooks/useToast";

interface PasDetailProps {
  pas: Pas;
  progress: UserProgress;
  onUpdate: (updatedProgress: UserProgress) => Promise<void>;
}

export function PasDetail({ pas, progress, onUpdate }: PasDetailProps) {
  const { success } = useToast();
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

  const [isUpdating, setIsUpdating] = useState(false);
  const masteryTier = calculateMasteryTier(pas, pasProgress);

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
      success("Pas validé avec succès !");
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
          <h2 className="text-lg font-semibold mb-2">Checkpoints</h2>
          <ul className="space-y-2">
            {pas.checkpoints.map((checkpoint, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    pasProgress.paliersState.K.status === "completed" ||
                    pasProgress.paliersState.E.status === "completed"
                  }
                  disabled
                  className="w-4 h-4 rounded border-white/20 bg-surface"
                />
                <span className="text-gray-300">{checkpoint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Paliers */}
        <div className="mb-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Paliers de validation</h2>

          {/* Palier K */}
          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">K - Connaissance</h3>
              <Badge
                variant={
                  pasProgress.paliersState.K.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.K.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.K.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.K.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              10 répétitions propres d&apos;affilée (vitesse lente)
            </p>
            <div className="text-xs text-gray-500">
              Répétitions complétées: {pasProgress.paliersState.K.repsCompleted} / 10
            </div>
          </div>

          {/* Palier E */}
          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">E - Exécution</h3>
              <Badge
                variant={
                  pasProgress.paliersState.E.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.E.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.E.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.E.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              50 reps totales + 10 reps propres à vitesse normale
            </p>
            <div className="text-xs text-gray-500">
              Total: {pasProgress.paliersState.E.totalReps} / 50 • Propre:{" "}
              {pasProgress.paliersState.E.cleanReps} / 10
            </div>
          </div>

          {/* Palier A */}
          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">A - Application</h3>
              <Badge
                variant={
                  pasProgress.paliersState.A.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.A.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.A.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.A.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Positional sparring: ≥ {pasProgress.paliersState.A.targetRate}% de réussite
            </p>
            <div className="text-xs text-gray-500">
              Taux: {pasProgress.paliersState.A.positionalTest.successRate}% (
              {pasProgress.paliersState.A.positionalTest.successes} /{" "}
              {pasProgress.paliersState.A.positionalTest.attempts})
            </div>
          </div>

          {/* Palier I */}
          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-white">I - Intégration</h3>
              <Badge
                variant={
                  pasProgress.paliersState.I.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.I.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.I.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.I.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Sparring libre: ≥ {pasProgress.paliersState.I.occurrencesMin} occurrence(s) sur{" "}
              {pasProgress.paliersState.I.sessionsRequired} séances
            </p>
            <div className="text-xs text-gray-500">
              Occurrences: {pasProgress.paliersState.I.freeSparringTest.occurrences} /
              {pasProgress.paliersState.I.occurrencesMin} • Séances:{" "}
              {new Set(pasProgress.paliersState.I.freeSparringTest.sessions).size} /
              {pasProgress.paliersState.I.sessionsRequired}
            </div>
          </div>
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
  );
}
