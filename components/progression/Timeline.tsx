"use client";

import { useEffect, useRef } from "react";
import { StepWithProgress } from "@/lib/progression/types";
import { StepCard } from "./StepCard";
import { scrollToStep } from "@/lib/progression/scroll";

interface TimelineProps {
  steps: StepWithProgress[];
  targetStepId?: string | null;
  onStepClick?: (stepId: string) => void;
}

export function Timeline({ steps, targetStepId, onStepClick }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetStepId && targetRef.current) {
      // Petit délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        targetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 100);
    }
  }, [targetStepId]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto overflow-y-hidden md:overflow-x-auto md:overflow-y-hidden"
      style={{
        scrollSnapType: "x mandatory",
      }}
    >
      {/* Mobile: Vertical layout */}
      <div className="flex flex-col gap-4 md:hidden">
        {steps.map((step) => (
          <div
            key={step.id}
            id={`step-node-${step.id}`}
            ref={step.id === targetStepId ? targetRef : null}
            className="scroll-snap-align-start"
          >
            <StepCard
              step={step}
              onClick={() => onStepClick?.(step.id)}
            />
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex md:flex-row md:gap-4 md:pb-4">
        {steps.map((step) => (
          <div
            key={step.id}
            id={`step-node-${step.id}`}
            ref={step.id === targetStepId ? targetRef : null}
            className="scroll-snap-align-start flex-shrink-0 w-80"
          >
            <StepCard
              step={step}
              onClick={() => onStepClick?.(step.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
