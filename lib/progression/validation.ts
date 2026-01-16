/**
 * Système de validation par paliers (K-E-A-I) et par type de pas
 */

import {
  Pas,
  PasType,
  PasProgress,
  Paliers,
  PalierK,
  PalierE,
  PalierA,
  PalierI,
  ValidationCriteria,
  MasteryTier,
} from "./types";

// ============================================================================
// Validation par palier
// ============================================================================

/**
 * Valide le palier K (Connaissance)
 * Critère : 10 répétitions propres d'affilée (à vitesse lente)
 */
export function validatePalierK(
  palierK: PalierK,
  repsCompleted: number
): PalierK {
  const target = 10;
  const newReps = Math.max(palierK.repsCompleted, repsCompleted);

  if (newReps >= target && palierK.status !== "completed") {
    return {
      status: "completed",
      repsCompleted: newReps,
      completedAt: new Date().toISOString(),
    };
  }

  if (newReps > 0 && palierK.status === "not_started") {
    return {
      ...palierK,
      status: "in_progress",
      repsCompleted: newReps,
    };
  }

  return {
    ...palierK,
    repsCompleted: newReps,
  };
}

/**
 * Valide le palier E (Exécution)
 * Critère : 50 reps totales + 10 reps propres à vitesse normale
 */
export function validatePalierE(
  palierE: PalierE,
  totalReps: number,
  cleanReps: number
): PalierE {
  const newTotalReps = palierE.totalReps + totalReps;
  const newCleanReps = Math.max(palierE.cleanReps, cleanReps);

  const totalTarget = 50;
  const cleanTarget = 10;

  if (
    newTotalReps >= totalTarget &&
    newCleanReps >= cleanTarget &&
    palierE.status !== "completed"
  ) {
    return {
      status: "completed",
      totalReps: newTotalReps,
      cleanReps: newCleanReps,
      completedAt: new Date().toISOString(),
    };
  }

  if ((newTotalReps > 0 || newCleanReps > 0) && palierE.status === "not_started") {
    return {
      ...palierE,
      status: "in_progress",
      totalReps: newTotalReps,
      cleanReps: newCleanReps,
    };
  }

  return {
    ...palierE,
    totalReps: newTotalReps,
    cleanReps: newCleanReps,
  };
}

/**
 * Valide le palier A (Application - Positional sparring)
 * Critère : ≥ 40% de réussite sur 10 tentatives (ou ≥ 2 réussites sur 5 rounds)
 */
export function validatePalierA(
  palierA: PalierA,
  attempts: number,
  successes: number,
  sessionDate: string
): PalierA {
  const newAttempts = palierA.positionalTest.attempts + attempts;
  const newSuccesses = palierA.positionalTest.successes + successes;
  const newSuccessRate =
    newAttempts > 0 ? Math.round((newSuccesses / newAttempts) * 100) : 0;

  const newSessions = palierA.positionalTest.sessions.includes(sessionDate)
    ? palierA.positionalTest.sessions
    : [...palierA.positionalTest.sessions, sessionDate];

  // Critère : ≥ 40% OU ≥ 2 réussites sur 5 rounds (2 min)
  const meetsTarget = newSuccessRate >= palierA.targetRate;
  const meetsAlternative = newAttempts >= 5 && newSuccesses >= 2;

  if ((meetsTarget || meetsAlternative) && palierA.status !== "completed") {
    return {
      status: "completed",
      positionalTest: {
        attempts: newAttempts,
        successes: newSuccesses,
        successRate: newSuccessRate,
        sessions: newSessions,
      },
      targetRate: palierA.targetRate,
      completedAt: new Date().toISOString(),
    };
  }

  if (newAttempts > 0 && palierA.status === "not_started") {
    return {
      ...palierA,
      status: "in_progress",
      positionalTest: {
        attempts: newAttempts,
        successes: newSuccesses,
        successRate: newSuccessRate,
        sessions: newSessions,
      },
    };
  }

  return {
    ...palierA,
    positionalTest: {
      attempts: newAttempts,
      successes: newSuccesses,
      successRate: newSuccessRate,
      sessions: newSessions,
    },
  };
}

/**
 * Valide le palier I (Intégration - Sparring libre)
 * Critère : ≥ 1 occurrence utile sur 3 rounds libres, sur 2 séances différentes
 */
export function validatePalierI(
  palierI: PalierI,
  occurrences: number,
  sessionDate: string
): PalierI {
  const newRounds = palierI.freeSparringTest.rounds + 3; // On ajoute 3 rounds par session
  const newOccurrences = palierI.freeSparringTest.occurrences + occurrences;

  const newSessions = palierI.freeSparringTest.sessions.includes(sessionDate)
    ? palierI.freeSparringTest.sessions
    : [...palierI.freeSparringTest.sessions, sessionDate];

  const uniqueSessions = Array.from(new Set(newSessions));

  const meetsOccurrences = newOccurrences >= palierI.occurrencesMin;
  const meetsSessions = uniqueSessions.length >= palierI.sessionsRequired;

  if (meetsOccurrences && meetsSessions && palierI.status !== "completed") {
    return {
      status: "completed",
      freeSparringTest: {
        rounds: newRounds,
        occurrences: newOccurrences,
        sessions: uniqueSessions,
      },
      occurrencesMin: palierI.occurrencesMin,
      sessionsRequired: palierI.sessionsRequired,
      completedAt: new Date().toISOString(),
    };
  }

  if (newOccurrences > 0 && palierI.status === "not_started") {
    return {
      ...palierI,
      status: "in_progress",
      freeSparringTest: {
        rounds: newRounds,
        occurrences: newOccurrences,
        sessions: uniqueSessions,
      },
    };
  }

  return {
    ...palierI,
    freeSparringTest: {
      rounds: newRounds,
      occurrences: newOccurrences,
      sessions: uniqueSessions,
    },
  };
}

// ============================================================================
// Validation par type de pas
// ============================================================================

/**
 * Valide un pas de type "fondamental"
 * Critère : 100 reps cumulées + 3 checkpoints + 1 usage en sparring
 */
export function validateFundamental(
  pas: Pas,
  progress: PasProgress,
  volumeCompleted: number,
  checkpointsValidated: string[]
): boolean {
  const allCheckpointsValid = pas.checkpoints.every((cp) =>
    checkpointsValidated.includes(cp)
  );
  const volumeOK = volumeCompleted >= pas.validationCriteria.volumeMin;
  const usedInSparring = progress.sessions.length >= 1;

  return allCheckpointsValid && volumeOK && usedInSparring;
}

/**
 * Valide un pas de type "escape"
 * Critère : ≥ 50-60% de sorties sur 10 départs, sur 2 séances
 */
export function validateEscape(
  pas: Pas,
  progress: PasProgress
): boolean {
  const palierA = progress.paliersState.A;
  if (palierA.status !== "completed") {
    return false;
  }

  const successRate = palierA.positionalTest.successRate;
  const sessions = palierA.positionalTest.sessions;
  const uniqueSessions = Array.from(new Set(sessions));

  return successRate >= 50 && uniqueSessions.length >= 2;
}

/**
 * Valide un pas de type "sweep"
 * Critère : ≥ 40% sur 10 tentatives, sur 2 séances + 1 enchaînement
 */
export function validateSweep(
  pas: Pas,
  progress: PasProgress,
  hasEnchainement: boolean
): boolean {
  const palierA = progress.paliersState.A;
  if (palierA.status !== "completed") {
    return false;
  }

  const successRate = palierA.positionalTest.successRate;
  const sessions = palierA.positionalTest.sessions;
  const uniqueSessions = Array.from(new Set(sessions));

  return (
    successRate >= pas.validationCriteria.positionalTest.targetRate &&
    uniqueSessions.length >= pas.validationCriteria.stability.sessionsRequired &&
    hasEnchainement
  );
}

/**
 * Valide un pas de type "passage"
 * Critère : ≥ 30-40% sur 10 tentatives en positional, sur 2 séances
 */
export function validatePassage(
  pas: Pas,
  progress: PasProgress
): boolean {
  const palierA = progress.paliersState.A;
  if (palierA.status !== "completed") {
    return false;
  }

  const successRate = palierA.positionalTest.successRate;
  const sessions = palierA.positionalTest.sessions;
  const uniqueSessions = Array.from(new Set(sessions));

  return (
    successRate >= pas.validationCriteria.positionalTest.targetRate &&
    uniqueSessions.length >= pas.validationCriteria.stability.sessionsRequired
  );
}

/**
 * Valide un pas de type "contrôle"
 * Critère : Side/mount : tenir 10s, 5 fois | Back : tenir 10s + empêcher 1 escape
 */
export function validateControle(
  pas: Pas,
  progress: PasProgress,
  holdTime: number,
  timesHeld: number,
  preventedEscape?: boolean
): boolean {
  const palierA = progress.paliersState.A;
  if (palierA.status !== "completed") {
    return false;
  }

  // Pour side/mount : tenir 10s, 5 fois
  if (pas.title.includes("side") || pas.title.includes("mount")) {
    return holdTime >= 10 && timesHeld >= 5;
  }

  // Pour back : tenir 10s + empêcher 1 escape
  if (pas.title.includes("back") || pas.title.includes("Back")) {
    return holdTime >= 10 && preventedEscape === true;
  }

  return false;
}

/**
 * Valide un pas de type "soumission"
 * Critère : ≥ 30% finish OU ≥ 60% near-finish en positional
 * OU ≥ 1 fois/séance en free sparring, sur 2 séances
 */
export function validateSoumission(
  pas: Pas,
  progress: PasProgress
): boolean {
  const palierA = progress.paliersState.A;
  const palierI = progress.paliersState.I;

  // Positional : ≥ 30% finish OU ≥ 60% near-finish
  if (palierA.status === "completed") {
    const successRate = palierA.positionalTest.successRate;
    if (successRate >= 30) {
      return true;
    }
  }

  // Free sparring : ≥ 1 fois/séance, sur 2 séances
  if (palierI.status === "completed") {
    const sessions = palierI.freeSparringTest.sessions;
    const uniqueSessions = Array.from(new Set(sessions));
    const occurrences = palierI.freeSparringTest.occurrences;

    if (occurrences >= uniqueSessions.length && uniqueSessions.length >= 2) {
      return true;
    }
  }

  return false;
}

/**
 * Valide un pas selon son type
 */
export function validatePasByType(
  pas: Pas,
  progress: PasProgress,
  additionalData?: {
    volumeCompleted?: number;
    checkpointsValidated?: string[];
    hasEnchainement?: boolean;
    holdTime?: number;
    timesHeld?: number;
    preventedEscape?: boolean;
  }
): boolean {
  switch (pas.type) {
    case "fondamental":
      return validateFundamental(
        pas,
        progress,
        additionalData?.volumeCompleted || 0,
        additionalData?.checkpointsValidated || []
      );
    case "escape":
      return validateEscape(pas, progress);
    case "sweep":
      return validateSweep(
        pas,
        progress,
        additionalData?.hasEnchainement || false
      );
    case "passage":
      return validatePassage(pas, progress);
    case "contrôle":
      return validateControle(
        pas,
        progress,
        additionalData?.holdTime || 0,
        additionalData?.timesHeld || 0,
        additionalData?.preventedEscape
      );
    case "soumission":
      return validateSoumission(pas, progress);
    default:
      return false;
  }
}

// ============================================================================
// Calcul de stabilité
// ============================================================================

/**
 * Vérifie si un pas est stable (critères atteints sur 2 séances minimum)
 */
export function isPasStable(progress: PasProgress): boolean {
  const palierA = progress.paliersState.A;
  const palierI = progress.paliersState.I;

  // Pour palier A : au moins 2 séances différentes
  if (palierA.status === "completed") {
    const sessions = Array.from(new Set(palierA.positionalTest.sessions));
    if (sessions.length >= 2) {
      return true;
    }
  }

  // Pour palier I : au moins 2 séances différentes
  if (palierI.status === "completed") {
    const sessions = Array.from(new Set(palierI.freeSparringTest.sessions));
    if (sessions.length >= 2) {
      return true;
    }
  }

  return false;
}

/**
 * Vérifie si un pas peut être validé (tous les paliers requis + stabilité)
 */
export function canValidatePas(
  pas: Pas,
  progress: PasProgress,
  additionalData?: {
    volumeCompleted?: number;
    checkpointsValidated?: string[];
    hasEnchainement?: boolean;
    holdTime?: number;
    timesHeld?: number;
    preventedEscape?: boolean;
  }
): boolean {
  // Tous les paliers doivent être complétés
  const allPaliersCompleted =
    progress.paliersState.K.status === "completed" &&
    progress.paliersState.E.status === "completed" &&
    progress.paliersState.A.status === "completed" &&
    progress.paliersState.I.status === "completed";

  if (!allPaliersCompleted) {
    return false;
  }

  // Validation selon le type de pas
  const typeValidation = validatePasByType(pas, progress, additionalData);

  if (!typeValidation) {
    return false;
  }

  // Stabilité requise
  return isPasStable(progress);
}

// ============================================================================
// Calcul de mastery tier
// ============================================================================

/**
 * Calcule le tier de mastery (bronze/argent/or)
 */
export function calculateMasteryTier(
  pas: Pas,
  progress: PasProgress
): MasteryTier | undefined {
  if (!canValidatePas(pas, progress)) {
    return undefined;
  }

  const palierA = progress.paliersState.A;
  const palierI = progress.paliersState.I;

  // Bronze : validé (seuil minimal)
  const isBronze = palierA.status === "completed" && palierI.status === "completed";

  // Argent : stable (réussi sur 2 séances)
  const isArgent =
    isBronze &&
    isPasStable(progress) &&
    palierA.positionalTest.successRate >= pas.validationCriteria.positionalTest.targetRate;

  // Or : robuste (réussi vs profils variés / sous fatigue)
  // Critères : ≥ 60% en positional + ≥ 2 occurrences en libre + 4 séances
  const isOr =
    isArgent &&
    palierA.positionalTest.successRate >= 60 &&
    palierI.freeSparringTest.occurrences >= 2 &&
    Array.from(new Set(palierI.freeSparringTest.sessions)).length >= 4;

  if (isOr) {
    return "or";
  }
  if (isArgent) {
    return "argent";
  }
  if (isBronze) {
    return "bronze";
  }

  return undefined;
}

// ============================================================================
// Anti-triche
// ============================================================================

/**
 * Vérifie si une action est un spam (toggle en boucle)
 * Retourne true si l'action est suspecte
 */
export function isSpamAction(
  lastActionTime: string | undefined,
  currentTime: string
): boolean {
  if (!lastActionTime) {
    return false;
  }

  const timeDiff = new Date(currentTime).getTime() - new Date(lastActionTime).getTime();
  // Si moins de 2 secondes entre deux actions, c'est suspect
  return timeDiff < 2000;
}

/**
 * Enregistre une action avec vérification anti-spam
 */
export function recordAction(
  lastActionTime: string | undefined,
  currentTime: string
): { isValid: boolean; newLastActionTime: string } {
  const isSpam = isSpamAction(lastActionTime, currentTime);

  return {
    isValid: !isSpam,
    newLastActionTime: currentTime,
  };
}
