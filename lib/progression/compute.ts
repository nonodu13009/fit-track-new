/**
 * Logique de calcul pour status, completion, et progression
 */

import { Step, StepStatus, StepProgress, UserProgress, StepWithProgress, BlockProgress } from "./types";
import { STEPS, getStepById } from "./steps";

/**
 * Vérifie si une step est verrouillée (prérequis non remplis)
 */
function isStepLocked(step: Step, progress: UserProgress): boolean {
  if (!step.prerequisites || step.prerequisites.length === 0) {
    return false;
  }

  return step.prerequisites.some((prereqId) => {
    const prereqProgress = progress.steps[prereqId];
    return !prereqProgress || !prereqProgress.validatedAt;
  });
}

/**
 * Vérifie si tous les items REQUIRED de la checklist sont cochés
 */
function areRequiredChecklistItemsChecked(step: Step, stepProgress: StepProgress): boolean {
  const requiredItems = step.checklist.filter((item) => item.type === "REQUIRED");
  
  if (requiredItems.length === 0) {
    return true;
  }

  return requiredItems.every((item) => stepProgress.checklistState[item.id] === true);
}

/**
 * Vérifie si tous les KPIs REQUIRED ont atteint leur target
 */
function areRequiredKPIsReached(step: Step, stepProgress: StepProgress): boolean {
  const requiredKPIs = step.kpis.filter((kpi) => kpi.type === "REQUIRED");
  
  if (requiredKPIs.length === 0) {
    return true;
  }

  return requiredKPIs.every((kpi) => {
    const current = stepProgress.kpisState[kpi.id] || 0;
    return current >= kpi.target;
  });
}

/**
 * Vérifie si une step peut être validée (DONE)
 */
function canStepBeValidated(step: Step, stepProgress: StepProgress): boolean {
  return (
    areRequiredChecklistItemsChecked(step, stepProgress) &&
    areRequiredKPIsReached(step, stepProgress)
  );
}

/**
 * Calcule le status d'une step
 */
export function computeStepStatus(
  step: Step,
  progress: UserProgress
): StepStatus {
  const stepProgress = progress.steps[step.id];

  // Si verrouillée par prérequis
  if (isStepLocked(step, progress)) {
    return "LOCKED";
  }

  // Si pas de progression, disponible
  if (!stepProgress) {
    return "AVAILABLE";
  }

  // Si validée
  if (stepProgress.validatedAt) {
    return "DONE";
  }

  // Si en cours (au moins un item modifié)
  return "IN_PROGRESS";
}

/**
 * Calcule le pourcentage de completion d'une step
 */
export function computeStepCompletion(
  step: Step,
  stepProgress?: StepProgress
): number {
  if (!stepProgress) {
    return 0;
  }

  const totalItems = step.checklist.length + step.kpis.length;
  if (totalItems === 0) {
    return stepProgress.validatedAt ? 100 : 0;
  }

  let completed = 0;

  // Checklist items cochés
  step.checklist.forEach((item) => {
    if (stepProgress.checklistState[item.id]) {
      completed++;
    }
  });

  // KPIs atteints
  step.kpis.forEach((kpi) => {
    const current = stepProgress.kpisState[kpi.id] || 0;
    if (current >= kpi.target) {
      completed++;
    }
  });

  return Math.round((completed / totalItems) * 100);
}

/**
 * Trouve la step actuellement en cours (IN_PROGRESS)
 */
export function getCurrentStepId(progress: UserProgress): string | null {
  for (const step of STEPS) {
    const status = computeStepStatus(step, progress);
    if (status === "IN_PROGRESS") {
      return step.id;
    }
  }
  return null;
}

/**
 * Trouve la step la plus récemment mise à jour
 */
export function getLastUpdatedStepId(progress: UserProgress): string | null {
  let lastUpdated: { stepId: string; updatedAt: string } | null = null;

  for (const [stepId, stepProgress] of Object.entries(progress.steps)) {
    if (!lastUpdated || stepProgress.updatedAt > lastUpdated.updatedAt) {
      lastUpdated = {
        stepId,
        updatedAt: stepProgress.updatedAt,
      };
    }
  }

  return lastUpdated?.stepId || null;
}

/**
 * Trouve la step cible pour auto-scroll
 * Priorité : lastUpdated > current > first AVAILABLE
 */
export function getTargetStepIdForScroll(progress: UserProgress): string | null {
  // 1. Dernière mise à jour
  const lastUpdated = getLastUpdatedStepId(progress);
  if (lastUpdated) {
    return lastUpdated;
  }

  // 2. Step en cours
  const current = getCurrentStepId(progress);
  if (current) {
    return current;
  }

  // 3. Première step disponible
  for (const step of STEPS) {
    const status = computeStepStatus(step, progress);
    if (status === "AVAILABLE") {
      return step.id;
    }
  }

  return null;
}

/**
 * Calcule le pourcentage de completion global
 */
export function computeGlobalCompletion(progress: UserProgress): number {
  if (STEPS.length === 0) {
    return 0;
  }

  let completed = 0;
  for (const step of STEPS) {
    const status = computeStepStatus(step, progress);
    if (status === "DONE") {
      completed++;
    }
  }

  return Math.round((completed / STEPS.length) * 100);
}

/**
 * Calcule le pourcentage de completion par bloc
 */
export function computeBlockProgress(progress: UserProgress): BlockProgress[] {
  const blocks: BlockProgress[] = [];

  for (let blockNum = 1; blockNum <= 4; blockNum++) {
    const blockSteps = STEPS.filter((step) => step.block === blockNum);
    const totalSteps = blockSteps.length;

    let completedSteps = 0;
    for (const step of blockSteps) {
      const status = computeStepStatus(step, progress);
      if (status === "DONE") {
        completedSteps++;
      }
    }

    blocks.push({
      block: blockNum,
      totalSteps,
      completedSteps,
      completionPercentage: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    });
  }

  return blocks;
}

/**
 * Enrichit une step avec son status et sa progression
 */
export function enrichStepWithProgress(
  step: Step,
  progress: UserProgress
): StepWithProgress {
  const status = computeStepStatus(step, progress);
  const stepProgress = progress.steps[step.id];
  const completion = computeStepCompletion(step, stepProgress);

  return {
    ...step,
    status,
    progress: stepProgress,
    completion,
  };
}

/**
 * Enrichit toutes les steps avec leur status et progression
 */
export function enrichAllStepsWithProgress(
  progress: UserProgress
): StepWithProgress[] {
  return STEPS.map((step) => enrichStepWithProgress(step, progress));
}

/**
 * Vérifie si une step peut être validée
 */
export function canValidateStep(step: Step, stepProgress?: StepProgress): boolean {
  if (!stepProgress) {
    return false;
  }
  return canStepBeValidated(step, stepProgress);
}
