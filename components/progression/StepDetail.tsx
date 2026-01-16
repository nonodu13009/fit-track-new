"use client";

import { useState } from "react";
import { Step, StepProgress, UserProgress } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { canValidateStep } from "@/lib/progression/compute";
import { calculateActionXP, getChecklistItemXP, getKPIReachedXP } from "@/lib/progression/gamification";
import { useToast } from "@/hooks/useToast";

interface StepDetailProps {
  step: Step;
  progress: UserProgress;
  onUpdate: (updatedProgress: UserProgress) => Promise<void>;
}

export function StepDetail({ step, progress, onUpdate }: StepDetailProps) {
  const { success } = useToast();
  const stepProgress = progress.steps[step.id] || {
    checklistState: {},
    kpisState: {},
    updatedAt: new Date().toISOString(),
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const handleChecklistToggle = async (itemId: string, checked: boolean) => {
    setIsUpdating(true);
    try {
      const item = step.checklist.find((i) => i.id === itemId);
      if (!item) return;

      const newChecklistState = {
        ...stepProgress.checklistState,
        [itemId]: checked,
      };

      const updatedStepProgress: StepProgress = {
        ...stepProgress,
        checklistState: newChecklistState,
        updatedAt: new Date().toISOString(),
      };

      const updatedProgress: UserProgress = {
        ...progress,
        steps: {
          ...progress.steps,
          [step.id]: updatedStepProgress,
        },
      };

      // Calculer XP gagnée
      if (checked) {
        const xpGained = getChecklistItemXP(item.type);
        success(`+${xpGained} XP`, 2000);
      }

      await onUpdate(updatedProgress);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKPIUpdate = async (kpiId: string, value: number) => {
    setIsUpdating(true);
    try {
      const kpi = step.kpis.find((k) => k.id === kpiId);
      if (!kpi) return;

      const previousValue = stepProgress.kpisState[kpiId] || 0;
      const wasReached = previousValue >= kpi.target;
      const isNowReached = value >= kpi.target;

      const newKpisState = {
        ...stepProgress.kpisState,
        [kpiId]: value,
      };

      const updatedStepProgress: StepProgress = {
        ...stepProgress,
        kpisState: newKpisState,
        updatedAt: new Date().toISOString(),
      };

      const updatedProgress: UserProgress = {
        ...progress,
        steps: {
          ...progress.steps,
          [step.id]: updatedStepProgress,
        },
      };

      // Calculer XP gagnée si KPI atteint pour la première fois
      if (!wasReached && isNowReached && kpi.type === "REQUIRED") {
        const xpGained = getKPIReachedXP(kpi.type);
        success(`+${xpGained} XP`, 2000);
      }

      await onUpdate(updatedProgress);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleValidate = async () => {
    if (!canValidateStep(step, stepProgress)) {
      return;
    }

    setIsUpdating(true);
    try {
      const updatedStepProgress: StepProgress = {
        ...stepProgress,
        validatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedProgress: UserProgress = {
        ...progress,
        steps: {
          ...progress.steps,
          [step.id]: updatedStepProgress,
        },
      };

      const xpGained = calculateActionXP("validation", step);
      success(`Étape validée ! +${xpGained} XP`, 3000);

      await onUpdate(updatedProgress);
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnvalidate = async () => {
    setIsUpdating(true);
    try {
      const updatedStepProgress: StepProgress = {
        ...stepProgress,
        validatedAt: undefined,
        updatedAt: new Date().toISOString(),
      };

      const updatedProgress: UserProgress = {
        ...progress,
        steps: {
          ...progress.steps,
          [step.id]: updatedStepProgress,
        },
      };

      await onUpdate(updatedProgress);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const canValidate = canValidateStep(step, stepProgress);
  const isValidated = !!stepProgress.validatedAt;

  return (
    <div className="space-y-6">
      {/* Objectifs */}
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-3">Objectifs</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {step.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </Card>

      {/* Checklist */}
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4">Checklist</h2>
        <div className="space-y-3">
          {step.checklist.map((item) => {
            const isChecked = stepProgress.checklistState[item.id] || false;
            const xpGain = getChecklistItemXP(item.type);

            return (
              <label
                key={item.id}
                className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-white/5 hover:border-white/10 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleChecklistToggle(item.id, e.target.checked)
                  }
                  disabled={isUpdating || isValidated}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-surface text-accent-purple focus:ring-accent-purple focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{item.label}</span>
                    <Badge
                      variant={item.type === "REQUIRED" ? "red" : "gray"}
                      size="sm"
                    >
                      {item.type === "REQUIRED" ? "Requis" : "Optionnel"}
                    </Badge>
                    {!isChecked && (
                      <span className="text-xs text-gray-500">
                        (+{xpGain} XP)
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </Card>

      {/* KPIs */}
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4">Indicateurs de performance</h2>
        <div className="space-y-4">
          {step.kpis.map((kpi) => {
            const current = stepProgress.kpisState[kpi.id] || 0;
            const isReached = current >= kpi.target;
            const xpGain = getKPIReachedXP(kpi.type);

            return (
              <div
                key={kpi.id}
                className="p-4 bg-surface rounded-lg border border-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{kpi.label}</span>
                    <Badge
                      variant={kpi.type === "REQUIRED" ? "red" : "gray"}
                      size="sm"
                    >
                      {kpi.type === "REQUIRED" ? "Requis" : "Optionnel"}
                    </Badge>
                  </div>
                  {isReached && kpi.type === "REQUIRED" && (
                    <Badge variant="green" size="sm">
                      ✓ Atteint (+{xpGain} XP)
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="0"
                    value={current}
                    onChange={(e) =>
                      handleKPIUpdate(kpi.id, parseInt(e.target.value) || 0)
                    }
                    disabled={isUpdating || isValidated}
                    className="flex-1"
                  />
                  <span className="text-gray-400">
                    / {kpi.target} {kpi.unit || ""}
                  </span>
                </div>
                {current > 0 && (
                  <div className="mt-2 w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-purple to-indigo-600 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (current / kpi.target) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Notes */}
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-3">Notes</h2>
        <textarea
          value={stepProgress.notes || ""}
          onChange={async (e) => {
            const updatedStepProgress: StepProgress = {
              ...stepProgress,
              notes: e.target.value,
              updatedAt: new Date().toISOString(),
            };
            const updatedProgress: UserProgress = {
              ...progress,
              steps: {
                ...progress.steps,
                [step.id]: updatedStepProgress,
              },
            };
            await onUpdate(updatedProgress);
          }}
          disabled={isUpdating}
          placeholder="Ajoutez vos notes personnelles..."
          className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:border-accent-cyan focus:ring-accent-cyan/50 min-h-[100px]"
        />
      </Card>

      {/* Bouton de validation */}
      <div className="flex gap-3">
        {isValidated ? (
          <Button
            variant="secondary"
            onClick={handleUnvalidate}
            disabled={isUpdating}
            className="flex-1"
          >
            Annuler la validation
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleValidate}
            disabled={!canValidate || isUpdating}
            className="flex-1"
          >
            {canValidate
              ? "Valider l'étape (+50 XP)"
              : "Conditions non remplies"}
          </Button>
        )}
      </div>
    </div>
  );
}
