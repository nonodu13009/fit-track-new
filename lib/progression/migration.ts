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
  // Les anciens steps (25 steps en 4 blocs) ne correspondent pas directement aux nouveaux pas (64 pas en 5 cycles)
  // Stratégie choisie : Réinitialiser la progression des pas mais préserver XP, niveau, badges, streak
  // Les utilisateurs recommencent leur progression des techniques mais gardent leur niveau global
  
  // Option : Si on veut préserver les notes utilisateur, on peut les stocker dans un champ séparé
  // Mais pour l'instant, on réinitialise complètement les pas pour un nouveau départ propre
  
  // Les pas seront créés progressivement quand l'utilisateur les débloquera
  // newProgress.pas reste vide {} pour commencer une progression fraîche
  
  // Note : Si on voulait créer un mapping partiel, on pourrait faire :
  // if (stepId.match(/^step-(\d+)-(\d+)$/)) {
  //   const [, block, step] = stepId.match(/^step-(\d+)-(\d+)$/) || [];
  //   // Tenter un mapping si possible (ex: step-01-01 → pas-01-01 si similaire)
  //   // Mais pour l'instant, on préfère réinitialiser
  // }

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
