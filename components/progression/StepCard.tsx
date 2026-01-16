"use client";

import { StepWithProgress } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface StepCardProps {
  step: StepWithProgress;
  onClick?: () => void;
}

export function StepCard({ step, onClick }: StepCardProps) {
  const statusColors = {
    LOCKED: "gray",
    AVAILABLE: "cyan",
    IN_PROGRESS: "purple",
    DONE: "green",
  } as const;

  const statusLabels = {
    LOCKED: "Verrouillée",
    AVAILABLE: "Disponible",
    IN_PROGRESS: "En cours",
    DONE: "Terminée",
  } as const;

  const completion = step.progress
    ? Math.round(
        ((Object.values(step.progress.checklistState).filter(Boolean).length +
          Object.values(step.progress.kpisState).filter(
            (v, i) => v >= (step.kpis[i]?.target || 0)
          ).length) /
          (step.checklist.length + step.kpis.length)) *
          100
      )
    : 0;

  return (
    <Link href={`/progression/${step.id}`} onClick={onClick}>
      <Card
        variant="elevated"
        hoverable
        className={`relative ${
          step.status === "IN_PROGRESS"
            ? "ring-2 ring-accent-purple/50 shadow-glow-purple"
            : ""
        } ${step.status === "LOCKED" ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-500">
                Bloc {step.block} • Step {step.order}
              </span>
              <Badge variant={statusColors[step.status] as any} size="sm">
                {statusLabels[step.status]}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
          </div>
          {step.status === "DONE" && (
            <div className="text-2xl">✅</div>
          )}
        </div>

        {step.status !== "LOCKED" && step.progress && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Progression</span>
              <span className="text-xs text-gray-400">{completion}%</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-purple to-indigo-600 transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        )}

        {step.status === "LOCKED" && (
          <div className="mt-2 text-sm text-gray-500">
            Prérequis non remplis
          </div>
        )}
      </Card>
    </Link>
  );
}
