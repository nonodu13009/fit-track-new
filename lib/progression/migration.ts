/**
 * Migration depuis l'ancien système (steps/blocs) vers le nouveau (pas/cycles)
 */

import { UserProgress, PasProgress, Paliers } from "./types";

/**
 * Ancien format (pour référence)
 */
interface OldUserProgress {
  steps: Record<string, any>;
  gamification: any;
  log?: any[];
}

/**
 * Migre les données de l'ancien format vers le nouveau
 */
export function migrateOldProgressToNew(oldProgress: OldUserProgress): UserProgress {
  const newProgress: UserProgress = {
    pas: {},
    gamification: {
      xpTotal: oldProgress.gamification?.xpTotal || 0,
      level: oldProgress.gamification?.level || 1,
      tokens: 0, // Nouveau champ
      streak: oldProgress.gamification?.streak || 0,
      streakFreeze: 0, // Nouveau champ
      lastActiveDate: oldProgress.gamification?.lastActiveDate,
      badges: oldProgress.gamification?.badges || [],
      mastery: {}, // Nouveau champ
      bossFights: {}, // Nouveau champ
    },
    quests: [], // Nouveau champ
    log: oldProgress.log || [],
  };

  // Migrer les steps vers les pas
  // Note: Cette migration est basique car la structure a complètement changé
  // Les anciens steps ne correspondent pas directement aux nouveaux pas
  // On peut soit réinitialiser, soit essayer de mapper les IDs si possible
  for (const [stepId, stepProgress] of Object.entries(oldProgress.steps || {})) {
    // Créer un pas progress initial avec les paliers
    const pasProgress: PasProgress = {
      paliersState: createInitialPaliers(),
      updatedAt: stepProgress.updatedAt || new Date().toISOString(),
      notes: stepProgress.notes,
      volumeCompleted: 0,
      sessions: [],
    };

    // Si l'ancien step était validé, on peut marquer les paliers K et E comme complétés
    if (stepProgress.validatedAt) {
      pasProgress.validatedAt = stepProgress.validatedAt;
      pasProgress.paliersState.K = {
        status: "completed",
        repsCompleted: 10,
        completedAt: stepProgress.validatedAt,
      };
      pasProgress.paliersState.E = {
        status: "completed",
        totalReps: 50,
        cleanReps: 10,
        completedAt: stepProgress.validatedAt,
      };
    }

    // Essayer de mapper l'ancien stepId vers un nouveau pasId
    // Pour simplifier, on ne fait pas de mapping automatique
    // L'utilisateur devra recommencer sa progression
    // Mais on garde les données pour référence
  }

  return newProgress;
}

/**
 * Crée des paliers initiaux
 */
function createInitialPaliers(): Paliers {
  return {
    K: {
      status: "not_started",
      repsCompleted: 0,
    },
    E: {
      status: "not_started",
      totalReps: 0,
      cleanReps: 0,
    },
    A: {
      status: "not_started",
      positionalTest: {
        attempts: 0,
        successes: 0,
        successRate: 0,
        sessions: [],
      },
      targetRate: 40,
    },
    I: {
      status: "not_started",
      freeSparringTest: {
        rounds: 0,
        occurrences: 0,
        sessions: [],
      },
      occurrencesMin: 1,
      sessionsRequired: 2,
    },
  };
}

/**
 * Vérifie si une progression est dans l'ancien format
 */
export function isOldFormat(progress: any): boolean {
  return progress && "steps" in progress && !("pas" in progress);
}

/**
 * Migre automatiquement si nécessaire
 */
export function migrateIfNeeded(progress: any): UserProgress {
  if (isOldFormat(progress)) {
    console.log("Migration détectée: ancien format vers nouveau");
    return migrateOldProgressToNew(progress);
  }
  return progress as UserProgress;
}
