/**
 * Logique de calcul pour status, completion, et progression
 * Système Gracie Barra avec paliers K-E-A-I et cycles
 */

import {
  Pas,
  PasStatus,
  PasProgress,
  UserProgress,
  PasWithProgress,
  CycleProgress,
  MasteryTier,
} from "./types";
import { PAS, getPasById, getPasByCycle } from "./pas";
import { calculateMasteryTier, canValidatePas } from "./validation";

/**
 * Vérifie si un pas est verrouillé (prérequis non remplis)
 * En mode développement, tous les pas sont débloqués pour faciliter le travail sur le contenu
 */
function isPasLocked(pas: Pas, progress: UserProgress): boolean {
  // TODO: Réactiver le verrouillage en production
  // En phase de dev, ouvrir toutes les cartes pour étudier le contenu
  return false;

  // Code original (désactivé pour le dev) :
  // if (!pas.prerequisites || pas.prerequisites.length === 0) {
  //   return false;
  // }
  // return pas.prerequisites.some((prereqId) => {
  //   const prereqProgress = progress.pas[prereqId];
  //   return !prereqProgress || !prereqProgress.validatedAt;
  // });
}

/**
 * Calcule le status d'un pas
 */
export function computePasStatus(pas: Pas, progress: UserProgress): PasStatus {
  const pasProgress = progress.pas[pas.id];

  // Si verrouillé par prérequis
  if (isPasLocked(pas, progress)) {
    return "LOCKED";
  }

  // Si pas de progression, disponible
  if (!pasProgress) {
    return "AVAILABLE";
  }

  // Si validé
  if (pasProgress.validatedAt) {
    return "DONE";
  }

  // Si en cours (au moins un palier commencé)
  const hasProgress =
    pasProgress.paliersState.K.status !== "not_started" ||
    pasProgress.paliersState.E.status !== "not_started" ||
    pasProgress.paliersState.A.status !== "not_started" ||
    pasProgress.paliersState.I.status !== "not_started";

  return hasProgress ? "IN_PROGRESS" : "AVAILABLE";
}

/**
 * Calcule le pourcentage de completion d'un pas
 */
export function computePasCompletion(
  pas: Pas,
  pasProgress?: PasProgress
): number {
  if (!pasProgress) {
    return 0;
  }

  // Compter les paliers complétés
  const paliersCompleted =
    (pasProgress.paliersState.K.status === "completed" ? 1 : 0) +
    (pasProgress.paliersState.E.status === "completed" ? 1 : 0) +
    (pasProgress.paliersState.A.status === "completed" ? 1 : 0) +
    (pasProgress.paliersState.I.status === "completed" ? 1 : 0);

  return Math.round((paliersCompleted / 4) * 100);
}

/**
 * Calcule la completion globale (tous les pas)
 */
export function computeGlobalCompletion(progress: UserProgress): number {
  if (PAS.length === 0) {
    return 0;
  }

  let totalCompletion = 0;
  for (const pas of PAS) {
    const pasProgress = progress.pas[pas.id];
    totalCompletion += computePasCompletion(pas, pasProgress);
  }

  return Math.round(totalCompletion / PAS.length);
}

/**
 * Calcule la progression d'un cycle
 */
export function computeCycleProgress(
  cycle: number,
  progress: UserProgress
): CycleProgress {
  const cyclePas = getPasByCycle(cycle);
  const totalPas = cyclePas.length;

  let completedPas = 0;
  let bronzeCount = 0;
  let argentCount = 0;
  let orCount = 0;

  for (const pas of cyclePas) {
    const pasProgress = progress.pas[pas.id];
    if (pasProgress?.validatedAt) {
      completedPas++;
    }

    // Compter les mastery tiers
    if (pasProgress?.masteryTier) {
      switch (pasProgress.masteryTier) {
        case "bronze":
          bronzeCount++;
          break;
        case "argent":
          argentCount++;
          break;
        case "or":
          orCount++;
          break;
      }
    }
  }

  const completionPercentage =
    totalPas > 0 ? Math.round((completedPas / totalPas) * 100) : 0;

  return {
    cycle,
    totalPas,
    completedPas,
    completionPercentage,
    masteryDistribution: {
      bronze: bronzeCount,
      argent: argentCount,
      or: orCount,
    },
  };
}

/**
 * Enrichit un pas avec les données de progression
 */
export function enrichPasWithProgress(
  pas: Pas,
  progress: UserProgress
): PasWithProgress {
  const pasProgress = progress.pas[pas.id];
  const status = computePasStatus(pas, progress);
  const completion = computePasCompletion(pas, pasProgress);
  const masteryTier = pasProgress
    ? calculateMasteryTier(pas, pasProgress)
    : undefined;

  // Calculer XP gagnée sur ce pas
  let xpEarned = 0;
  if (pasProgress) {
    // Checkpoints validés (via paliers K/E)
    if (pasProgress.paliersState.K.status === "completed") {
      xpEarned += pas.checkpoints.length * 5; // 5 XP par checkpoint
    }
    if (pasProgress.paliersState.E.status === "completed") {
      xpEarned += pas.checkpoints.length * 5;
    }
    // KPI atteint (palier A)
    if (pasProgress.paliersState.A.status === "completed") {
      xpEarned += 30; // KPI_REACHED
    }
    // Pas validé
    if (pasProgress.validatedAt) {
      xpEarned += 80; // PAS_VALIDATION
    }
  }

  return {
    ...pas,
    status,
    progress: pasProgress,
    completion,
    xpEarned,
  };
}

/**
 * Enrichit tous les pas avec les données de progression
 */
export function enrichAllPasWithProgress(
  progress: UserProgress
): PasWithProgress[] {
  return PAS.map((pas) => enrichPasWithProgress(pas, progress));
}

/**
 * Détermine le pas cible pour le scroll automatique
 */
export function getTargetPasIdForScroll(progress: UserProgress): string | null {
  // Trouver le premier pas IN_PROGRESS
  for (const pas of PAS) {
    const status = computePasStatus(pas, progress);
    if (status === "IN_PROGRESS") {
      return pas.id;
    }
  }

  // Sinon, trouver le premier pas AVAILABLE
  for (const pas of PAS) {
    const status = computePasStatus(pas, progress);
    if (status === "AVAILABLE") {
      return pas.id;
    }
  }

  return null;
}

/**
 * Détermine le pas actuel (le dernier modifié ou le premier IN_PROGRESS)
 */
export function getCurrentPasId(progress: UserProgress): string | null {
  // Trouver le pas avec la date de mise à jour la plus récente
  let latestPas: Pas | null = null;
  let latestDate: string = "";

  for (const pas of PAS) {
    const pasProgress = progress.pas[pas.id];
    if (pasProgress && pasProgress.updatedAt > latestDate) {
      latestDate = pasProgress.updatedAt;
      latestPas = pas;
    }
  }

  if (latestPas) {
    return latestPas.id;
  }

  // Sinon, utiliser getTargetPasIdForScroll
  return getTargetPasIdForScroll(progress);
}

/**
 * Vérifie si un pas peut être validé
 */
export function canPasBeValidated(
  pas: Pas,
  progress: UserProgress
): boolean {
  const pasProgress = progress.pas[pas.id];
  if (!pasProgress) {
    return false;
  }

  return canValidatePas(pas, pasProgress);
}

/**
 * Obtient tous les pas d'un cycle avec progression
 */
export function getPasByCycleWithProgress(
  cycle: number,
  progress: UserProgress
): PasWithProgress[] {
  const cyclePas = getPasByCycle(cycle);
  return cyclePas.map((pas) => enrichPasWithProgress(pas, progress));
}

/**
 * Obtient le nombre de pas complétés par cycle
 */
export function getCompletedPasCountByCycle(
  cycle: number,
  progress: UserProgress
): number {
  const cyclePas = getPasByCycle(cycle);
  return cyclePas.filter((pas) => {
    const pasProgress = progress.pas[pas.id];
    return pasProgress?.validatedAt !== undefined;
  }).length;
}

/**
 * Obtient le prochain pas à débloquer
 */
export function getNextAvailablePas(progress: UserProgress): Pas | null {
  for (const pas of PAS) {
    const status = computePasStatus(pas, progress);
    if (status === "AVAILABLE") {
      return pas;
    }
  }
  return null;
}

/**
 * Obtient tous les pas verrouillés
 */
export function getLockedPas(progress: UserProgress): Pas[] {
  return PAS.filter((pas) => computePasStatus(pas, progress) === "LOCKED");
}

/**
 * Obtient tous les pas en cours
 */
export function getInProgressPas(progress: UserProgress): Pas[] {
  return PAS.filter((pas) => computePasStatus(pas, progress) === "IN_PROGRESS");
}

/**
 * Obtient tous les pas complétés
 */
export function getCompletedPas(progress: UserProgress): Pas[] {
  return PAS.filter((pas) => computePasStatus(pas, progress) === "DONE");
}
