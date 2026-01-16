/**
 * Système de gamification : XP, niveaux, badges, streak
 */

import {
  UserProgress,
  Step,
  StepProgress,
  Badge,
  ProgressLogEntry,
  Gamification,
} from "./types";
import { STEPS, getStepsByBlock } from "./steps";
import { computeStepStatus } from "./compute";

/**
 * Constantes de gamification
 */
export const XP_REWARDS = {
  CHECKLIST_REQUIRED: 5,
  CHECKLIST_OPTIONAL: 2,
  KPI_REACHED: 10, // par KPI required
  STEP_VALIDATION: 50,
  BLOC_COMPLETION: 200,
  STREAK_DAY: 20, // par jour de streak (cap 7 jours = 140 max)
} as const;

export const XP_PER_LEVEL = 250;

/**
 * Calcule le niveau à partir de l'XP total
 */
export function calculateLevel(xpTotal: number): number {
  return Math.floor(xpTotal / XP_PER_LEVEL) + 1;
}

/**
 * Calcule l'XP nécessaire pour le prochain niveau
 */
export function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * XP_PER_LEVEL;
}

/**
 * Calcule l'XP déjà gagnée dans le niveau actuel
 */
export function getXPInCurrentLevel(xpTotal: number): number {
  const currentLevel = calculateLevel(xpTotal);
  const xpForCurrentLevel = (currentLevel - 1) * XP_PER_LEVEL;
  return xpTotal - xpForCurrentLevel;
}

/**
 * Calcule le pourcentage de progression vers le prochain niveau
 */
export function getLevelProgress(xpTotal: number): number {
  const currentLevel = calculateLevel(xpTotal);
  const xpInCurrentLevel = getXPInCurrentLevel(xpTotal);
  const xpNeededForNext = XP_PER_LEVEL;
  return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));
}

/**
 * Calcule l'XP gagnée pour un item de checklist
 */
export function getChecklistItemXP(itemType: "REQUIRED" | "OPTIONAL"): number {
  return itemType === "REQUIRED"
    ? XP_REWARDS.CHECKLIST_REQUIRED
    : XP_REWARDS.CHECKLIST_OPTIONAL;
}

/**
 * Calcule l'XP gagnée pour un KPI atteint
 */
export function getKPIReachedXP(kpiType: "REQUIRED" | "OPTIONAL"): number {
  return kpiType === "REQUIRED" ? XP_REWARDS.KPI_REACHED : 0; // Seuls les KPIs required donnent XP
}

/**
 * Calcule l'XP totale à partir de l'état actuel (déterministe)
 */
export function calculateXPFromState(progress: UserProgress): number {
  let totalXP = 0;

  // Parcourir toutes les steps
  for (const step of STEPS) {
    const stepProgress = progress.steps[step.id];
    if (!stepProgress) {
      continue;
    }

    // Checklist items cochés
    for (const item of step.checklist) {
      if (stepProgress.checklistState[item.id]) {
        totalXP += getChecklistItemXP(item.type);
      }
    }

    // KPIs atteints (required uniquement)
    for (const kpi of step.kpis) {
      if (kpi.type === "REQUIRED") {
        const current = stepProgress.kpisState[kpi.id] || 0;
        if (current >= kpi.target) {
          totalXP += XP_REWARDS.KPI_REACHED;
        }
      }
    }

    // Step validée
    if (stepProgress.validatedAt) {
      totalXP += XP_REWARDS.STEP_VALIDATION;
    }
  }

  // Blocs complétés
  for (let blockNum = 1; blockNum <= 4; blockNum++) {
    const blockSteps = getStepsByBlock(blockNum);
    const allBlockStepsDone = blockSteps.every((step) => {
      const status = computeStepStatus(step, progress);
      return status === "DONE";
    });

    if (allBlockStepsDone) {
      totalXP += XP_REWARDS.BLOC_COMPLETION;
    }
  }

  // Streak (optionnel, calculé séparément)
  // Le streak est géré dans updateStreak()

  return totalXP;
}

/**
 * Met à jour le streak
 * +20 XP par jour de streak (cap 7 jours = 140 max)
 */
export function updateStreak(
  gamification: Gamification,
  currentDate: string = new Date().toISOString().split("T")[0]
): { streak: number; xpBonus: number } {
  const lastActiveDate = gamification.lastActiveDate
    ? new Date(gamification.lastActiveDate).toISOString().split("T")[0]
    : null;

  // Si même jour, pas de changement
  if (lastActiveDate === currentDate) {
    return {
      streak: gamification.streak,
      xpBonus: 0,
    };
  }

  // Si jour suivant, incrémenter streak
  if (lastActiveDate) {
    const lastDate = new Date(lastActiveDate);
    const current = new Date(currentDate);
    const diffDays = Math.floor(
      (current.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Jour consécutif
      const newStreak = Math.min(gamification.streak + 1, 7); // Cap à 7 jours
      const xpBonus = newStreak > gamification.streak ? XP_REWARDS.STREAK_DAY : 0;
      return {
        streak: newStreak,
        xpBonus,
      };
    } else if (diffDays > 1) {
      // Streak cassé, réinitialiser
      return {
        streak: 1,
        xpBonus: XP_REWARDS.STREAK_DAY, // Premier jour du nouveau streak
      };
    }
  }

  // Premier jour d'activité
  return {
    streak: 1,
    xpBonus: XP_REWARDS.STREAK_DAY,
  };
}

/**
 * Génère un badge pour une step validée
 */
export function createStepClearBadge(stepId: string, stepTitle: string): Badge {
  return {
    id: `badge-step-${stepId}`,
    name: `Step Clear: ${stepTitle}`,
    description: `Étape "${stepTitle}" complétée`,
    earnedAt: new Date().toISOString(),
  };
}

/**
 * Génère un badge pour un bloc complété
 */
export function createBlocClearBadge(block: number): Badge {
  return {
    id: `badge-bloc-${block}`,
    name: `Bloc ${block} Clear`,
    description: `Toutes les étapes du bloc ${block} sont complétées`,
    earnedAt: new Date().toISOString(),
  };
}

/**
 * Vérifie si un badge existe déjà
 */
export function hasBadge(badges: Badge[], badgeId: string): boolean {
  return badges.some((badge) => badge.id === badgeId);
}

/**
 * Ajoute un badge s'il n'existe pas déjà
 */
export function addBadgeIfNotExists(
  badges: Badge[],
  newBadge: Badge
): Badge[] {
  if (hasBadge(badges, newBadge.id)) {
    return badges;
  }
  return [...badges, newBadge];
}

/**
 * Crée une entrée de log
 */
export function createLogEntry(
  type: "checklist" | "kpi" | "validation" | "block_completion",
  stepId: string | undefined,
  xpDelta: number,
  label: string
): ProgressLogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ts: new Date().toISOString(),
    type,
    stepId,
    xpDelta,
    label,
  };
}

/**
 * Ajoute une entrée de log (limite aux 200 derniers)
 */
export function addLogEntry(
  log: ProgressLogEntry[] | undefined,
  entry: ProgressLogEntry
): ProgressLogEntry[] {
  const newLog = log ? [...log, entry] : [entry];
  // Garder seulement les 200 derniers
  return newLog.slice(-200);
}

/**
 * Calcule l'XP gagnée pour une action spécifique
 */
export function calculateActionXP(
  action: "checklist" | "kpi" | "validation" | "block_completion",
  step: Step,
  itemId?: string
): number {
  switch (action) {
    case "checklist": {
      if (!itemId) return 0;
      const item = step.checklist.find((i) => i.id === itemId);
      if (!item) return 0;
      return getChecklistItemXP(item.type);
    }
    case "kpi": {
      if (!itemId) return 0;
      const kpi = step.kpis.find((k) => k.id === itemId);
      if (!kpi) return 0;
      return getKPIReachedXP(kpi.type);
    }
    case "validation":
      return XP_REWARDS.STEP_VALIDATION;
    case "block_completion":
      return XP_REWARDS.BLOC_COMPLETION;
    default:
      return 0;
  }
}

/**
 * Recalcule l'XP totale et met à jour la gamification
 * Ajoute automatiquement les badges pour les steps validées et blocs complétés
 */
export function recalculateGamification(progress: UserProgress): Gamification {
  const xpFromState = calculateXPFromState(progress);
  
  // Mettre à jour le streak
  const streakUpdate = updateStreak(progress.gamification);
  const totalXP = xpFromState + (streakUpdate.xpBonus > 0 ? streakUpdate.xpBonus : 0);

  // Ajouter les badges pour les steps validées
  let updatedBadges = [...progress.gamification.badges];
  
  for (const step of STEPS) {
    const stepProgress = progress.steps[step.id];
    if (stepProgress?.validatedAt) {
      const stepBadge = createStepClearBadge(step.id, step.title);
      updatedBadges = addBadgeIfNotExists(updatedBadges, stepBadge);
    }
  }

  // Ajouter les badges pour les blocs complétés
  for (let blockNum = 1; blockNum <= 4; blockNum++) {
    const blockSteps = getStepsByBlock(blockNum);
    const allBlockStepsDone = blockSteps.every((step) => {
      const status = computeStepStatus(step, progress);
      return status === "DONE";
    });

    if (allBlockStepsDone) {
      const blocBadge = createBlocClearBadge(blockNum);
      updatedBadges = addBadgeIfNotExists(updatedBadges, blocBadge);
    }
  }

  return {
    ...progress.gamification,
    xpTotal: totalXP,
    level: calculateLevel(totalXP),
    streak: streakUpdate.streak,
    lastActiveDate: new Date().toISOString().split("T")[0],
    badges: updatedBadges,
  };
}
