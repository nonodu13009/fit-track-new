/**
 * Système de gamification : XP, niveaux, badges, streak, tokens, mastery, boss fights
 */

import {
  UserProgress,
  Pas,
  PasProgress,
  Badge,
  ProgressLogEntry,
  Gamification,
  MasteryTier,
  BossFightResult,
  BossMedal,
} from "./types";
import { PAS, getPasByCycle } from "./pas";
import { calculateMasteryTier } from "./validation";

/**
 * Constantes de gamification (nouvelles valeurs)
 */
export const XP_REWARDS = {
  LOG_ACTION: 2, // Action "log" (swipe court) - cap/jour
  COMBO_SUCCESS: 10, // Combo réussi
  KPI_REACHED: 30, // KPI atteint
  PAS_VALIDATION: 80, // Validation d'un pas
  CYCLE_COMPLETION: 250, // Fin de cycle (au lieu de bloc)
  STREAK_DAY: 20, // Par jour de streak (cap 7 jours = 140 max)
  QUEST_DAILY: 5, // Quête quotidienne
  QUEST_WEEKLY: 20, // Quête hebdo
  BOSS_FIGHT_BRONZE: 50, // Boss fight bronze
  BOSS_FIGHT_ARGENT: 100, // Boss fight argent
  BOSS_FIGHT_OR: 200, // Boss fight or
} as const;

export const XP_PER_LEVEL = 250;

export const TOKEN_REWARDS = {
  PAS_VALIDATION: 5,
  CYCLE_COMPLETION: 20,
  QUEST_DAILY: 2,
  QUEST_WEEKLY: 10,
  BOSS_FIGHT_BRONZE: 10,
  BOSS_FIGHT_ARGENT: 25,
  BOSS_FIGHT_OR: 50,
} as const;

export const STREAK_FREEZE_MAX = 2; // Jokers par mois
export const STREAK_CAP_DAYS = 7; // Cap à 7 jours
export const STREAK_CAP_XP = STREAK_CAP_DAYS * XP_REWARDS.STREAK_DAY; // 140 max

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
 * Calcule l'XP gagnée pour une action "log" (swipe court)
 * Cap par jour pour éviter le spam
 */
export function getLogActionXP(
  lastLogDate: string | undefined,
  currentDate: string
): number {
  if (!lastLogDate) {
    return XP_REWARDS.LOG_ACTION;
  }

  const lastDate = new Date(lastLogDate).toISOString().split("T")[0];
  const current = new Date(currentDate).toISOString().split("T")[0];

  // Si même jour, pas d'XP (déjà donné)
  if (lastDate === current) {
    return 0;
  }

  return XP_REWARDS.LOG_ACTION;
}

/**
 * Calcule l'XP gagnée pour un combo réussi
 */
export function getComboSuccessXP(): number {
  return XP_REWARDS.COMBO_SUCCESS;
}

/**
 * Calcule l'XP gagnée pour un KPI atteint
 */
export function getKPIReachedXP(): number {
  return XP_REWARDS.KPI_REACHED;
}

/**
 * Calcule l'XP gagnée pour la validation d'un pas
 */
export function getPasValidationXP(): number {
  return XP_REWARDS.PAS_VALIDATION;
}

/**
 * Calcule l'XP gagnée pour la complétion d'un cycle
 */
export function getCycleCompletionXP(): number {
  return XP_REWARDS.CYCLE_COMPLETION;
}

/**
 * Calcule l'XP totale à partir de l'état actuel (déterministe)
 */
export function calculateXPFromState(progress: UserProgress): number {
  let totalXP = 0;

  // Parcourir tous les pas
  for (const pas of PAS) {
    const pasProgress = progress.pas[pas.id];
    if (!pasProgress) {
      continue;
    }

    // Checkpoints validés (équivalent aux anciens checklist items)
    // On compte les checkpoints validés comme +5 XP chacun
    const validatedCheckpoints = pas.checkpoints.filter((cp) => {
      // Vérifier si le checkpoint est validé (via les paliers)
      return (
        pasProgress.paliersState.K.status === "completed" ||
        pasProgress.paliersState.E.status === "completed"
      );
    }).length;
    totalXP += validatedCheckpoints * 5; // 5 XP par checkpoint validé

    // KPIs atteints (via palier A)
    if (pasProgress.paliersState.A.status === "completed") {
      totalXP += XP_REWARDS.KPI_REACHED;
    }

    // Pas validé
    if (pasProgress.validatedAt) {
      totalXP += XP_REWARDS.PAS_VALIDATION;
    }
  }

  // Cycles complétés
  for (let cycleNum = 1; cycleNum <= 4; cycleNum++) {
    const cyclePas = getPasByCycle(cycleNum);
    const allCyclePasDone = cyclePas.every((pas) => {
      const pasProgress = progress.pas[pas.id];
      return pasProgress?.validatedAt !== undefined;
    });

    if (allCyclePasDone) {
      totalXP += XP_REWARDS.CYCLE_COMPLETION;
    }
  }

  // Quêtes complétées
  if (progress.quests) {
    for (const quest of progress.quests) {
      if (quest.status === "completed") {
        totalXP += quest.xpReward;
      }
    }
  }

  // Boss fights
  if (progress.gamification.bossFights) {
    for (const bossResult of Object.values(progress.gamification.bossFights)) {
      switch (bossResult.medal) {
        case "bronze":
          totalXP += XP_REWARDS.BOSS_FIGHT_BRONZE;
          break;
        case "argent":
          totalXP += XP_REWARDS.BOSS_FIGHT_ARGENT;
          break;
        case "or":
          totalXP += XP_REWARDS.BOSS_FIGHT_OR;
          break;
      }
    }
  }

  // Streak (calculé séparément dans updateStreak)

  return totalXP;
}

/**
 * Calcule les tokens à partir de l'état actuel
 */
export function calculateTokensFromState(progress: UserProgress): number {
  let totalTokens = 0;

  // Pas validés
  for (const pas of PAS) {
    const pasProgress = progress.pas[pas.id];
    if (pasProgress?.validatedAt) {
      totalTokens += TOKEN_REWARDS.PAS_VALIDATION;
    }
  }

  // Cycles complétés
  for (let cycleNum = 1; cycleNum <= 4; cycleNum++) {
    const cyclePas = getPasByCycle(cycleNum);
    const allCyclePasDone = cyclePas.every((pas) => {
      const pasProgress = progress.pas[pas.id];
      return pasProgress?.validatedAt !== undefined;
    });

    if (allCyclePasDone) {
      totalTokens += TOKEN_REWARDS.CYCLE_COMPLETION;
    }
  }

  // Quêtes complétées
  if (progress.quests) {
    for (const quest of progress.quests) {
      if (quest.status === "completed") {
        totalTokens += quest.tokenReward;
      }
    }
  }

  // Boss fights
  if (progress.gamification.bossFights) {
    for (const bossResult of Object.values(progress.gamification.bossFights)) {
      switch (bossResult.medal) {
        case "bronze":
          totalTokens += TOKEN_REWARDS.BOSS_FIGHT_BRONZE;
          break;
        case "argent":
          totalTokens += TOKEN_REWARDS.BOSS_FIGHT_ARGENT;
          break;
        case "or":
          totalTokens += TOKEN_REWARDS.BOSS_FIGHT_OR;
          break;
      }
    }
  }

  return totalTokens;
}

/**
 * Met à jour le streak avec jokers
 * +20 XP par jour de streak (cap 7 jours = 140 max)
 */
export function updateStreak(
  gamification: Gamification,
  currentDate: string = new Date().toISOString().split("T")[0]
): { streak: number; xpBonus: number; usedFreeze: boolean } {
  const lastActiveDate = gamification.lastActiveDate
    ? new Date(gamification.lastActiveDate).toISOString().split("T")[0]
    : null;

  // Si même jour, pas de changement
  if (lastActiveDate === currentDate) {
    return {
      streak: gamification.streak,
      xpBonus: 0,
      usedFreeze: false,
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
      const newStreak = Math.min(gamification.streak + 1, STREAK_CAP_DAYS);
      const xpBonus = newStreak > gamification.streak ? XP_REWARDS.STREAK_DAY : 0;
      return {
        streak: newStreak,
        xpBonus,
        usedFreeze: false,
      };
    } else if (diffDays > 1) {
      // Streak cassé - utiliser un joker si disponible
      if (gamification.streakFreeze < STREAK_FREEZE_MAX) {
        // Utiliser un joker
        return {
          streak: gamification.streak, // Maintien du streak
          xpBonus: 0,
          usedFreeze: true,
        };
      } else {
        // Pas de joker disponible, réinitialiser
        return {
          streak: 1,
          xpBonus: XP_REWARDS.STREAK_DAY,
          usedFreeze: false,
        };
      }
    }
  }

  // Premier jour d'activité
  return {
    streak: 1,
    xpBonus: XP_REWARDS.STREAK_DAY,
    usedFreeze: false,
  };
}

/**
 * Génère un badge pour un pas validé
 */
export function createPasClearBadge(pasId: string, pasTitle: string): Badge {
  return {
    id: `badge-pas-${pasId}`,
    name: `Pas Clear: ${pasTitle}`,
    description: `Pas "${pasTitle}" complété`,
    earnedAt: new Date().toISOString(),
  };
}

/**
 * Génère un badge pour un cycle complété
 */
export function createCycleClearBadge(cycle: number): Badge {
  return {
    id: `badge-cycle-${cycle}`,
    name: `Cycle ${cycle} Clear`,
    description: `Tous les pas du cycle ${cycle} sont complétés`,
    earnedAt: new Date().toISOString(),
  };
}

/**
 * Génère un badge de mastery
 */
export function createMasteryBadge(
  pasId: string,
  pasTitle: string,
  tier: MasteryTier
): Badge {
  const tierNames = {
    bronze: "Bronze",
    argent: "Argent",
    or: "Or",
  };

  return {
    id: `badge-mastery-${pasId}-${tier}`,
    name: `${tierNames[tier]} Mastery: ${pasTitle}`,
    description: `Maîtrise ${tierNames[tier].toLowerCase()} du pas "${pasTitle}"`,
    earnedAt: new Date().toISOString(),
  };
}

/**
 * Génère un badge de boss fight
 */
export function createBossFightBadge(cycle: number, medal: BossMedal): Badge {
  const medalNames = {
    bronze: "Bronze",
    argent: "Argent",
    or: "Or",
  };

  return {
    id: `badge-boss-${cycle}-${medal}`,
    name: `Boss Cycle ${cycle} - ${medalNames[medal]}`,
    description: `Boss fight du cycle ${cycle} complété avec médaille ${medalNames[medal].toLowerCase()}`,
    earnedAt: new Date().toISOString(),
  };
}

/**
 * Génère les badges intelligents
 */
export function createIntelligentBadges(progress: UserProgress): Badge[] {
  const badges: Badge[] = [];

  // Consistency : 3 semaines régulières
  if (progress.gamification.streak >= 21) {
    badges.push({
      id: "badge-consistency",
      name: "Consistency",
      description: "3 semaines régulières",
      earnedAt: new Date().toISOString(),
    });
  }

  // Comeback : retour après 7 jours
  if (progress.gamification.lastActiveDate) {
    const lastDate = new Date(progress.gamification.lastActiveDate);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays >= 7 && progress.gamification.streak === 1) {
      badges.push({
        id: "badge-comeback",
        name: "Comeback",
        description: "Retour après 7 jours",
        earnedAt: new Date().toISOString(),
      });
    }
  }

  // Quality : 10 reps parfaites d'affilée (vérifié via palier K)
  let perfectRepsCount = 0;
  for (const pas of PAS) {
    const pasProgress = progress.pas[pas.id];
    if (pasProgress?.paliersState.K.repsCompleted >= 10) {
      perfectRepsCount++;
    }
  }
  if (perfectRepsCount >= 10) {
    badges.push({
      id: "badge-quality",
      name: "Quality",
      description: "10 reps parfaites d'affilée",
      earnedAt: new Date().toISOString(),
    });
  }

  // Clutch : valider un KPI sous fatigue (détecté via notes ou contexte)
  // À implémenter selon le contexte

  // Balanced : 1 pas garde + 1 pas passage la même semaine
  // À implémenter selon le contexte

  // Defense first : escapes stabilisés argent
  let escapeArgentCount = 0;
  for (const pas of PAS) {
    if (pas.type === "escape") {
      const pasProgress = progress.pas[pas.id];
      if (pasProgress?.masteryTier === "argent") {
        escapeArgentCount++;
      }
    }
  }
  if (escapeArgentCount >= 3) {
    badges.push({
      id: "badge-defense-first",
      name: "Defense First",
      description: "Escapes stabilisés argent",
      earnedAt: new Date().toISOString(),
    });
  }

  return badges;
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
 * Calcule le score d'un boss fight et détermine la médaille
 */
export function calculateBossFightMedal(
  successes: number,
  attempts: number
): BossMedal {
  const successRate = attempts > 0 ? (successes / attempts) * 100 : 0;

  if (successRate >= 80) {
    return "or";
  } else if (successRate >= 60) {
    return "argent";
  } else {
    return "bronze";
  }
}

/**
 * Crée un résultat de boss fight
 */
export function createBossFightResult(
  cycle: number,
  successes: number,
  attempts: number,
  notes?: string
): BossFightResult {
  const medal = calculateBossFightMedal(successes, attempts);
  const score = attempts > 0 ? Math.round((successes / attempts) * 100) : 0;

  return {
    cycle,
    score,
    medal,
    attempts,
    successes,
    notes,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Crée une entrée de log
 */
export function createLogEntry(
  type: "log" | "combo" | "kpi" | "validation" | "cycle_completion" | "quest" | "boss_fight",
  pasId: string | undefined,
  questId: string | undefined,
  xpDelta: number,
  tokenDelta: number | undefined,
  label: string
): ProgressLogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ts: new Date().toISOString(),
    type,
    pasId,
    questId,
    xpDelta,
    tokenDelta,
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
 * Recalcule l'XP totale, tokens, mastery et met à jour la gamification
 */
export function recalculateGamification(progress: UserProgress): Gamification {
  const xpFromState = calculateXPFromState(progress);
  const tokensFromState = calculateTokensFromState(progress);

  // Mettre à jour le streak
  const streakUpdate = updateStreak(progress.gamification);
  const totalXP = xpFromState + streakUpdate.xpBonus;

  // Mettre à jour mastery tiers pour tous les pas
  const mastery: Record<string, MasteryTier> = {};
  for (const pas of PAS) {
    const pasProgress = progress.pas[pas.id];
    if (pasProgress) {
      const tier = calculateMasteryTier(pas, pasProgress);
      if (tier) {
        mastery[pas.id] = tier;
      }
    }
  }

  // Ajouter les badges pour les pas validés
  let updatedBadges = [...progress.gamification.badges];

  for (const pas of PAS) {
    const pasProgress = progress.pas[pas.id];
    if (pasProgress?.validatedAt) {
      const pasBadge = createPasClearBadge(pas.id, pas.title);
      updatedBadges = addBadgeIfNotExists(updatedBadges, pasBadge);

      // Badge de mastery si applicable
      if (pasProgress.masteryTier) {
        const masteryBadge = createMasteryBadge(
          pas.id,
          pas.title,
          pasProgress.masteryTier
        );
        updatedBadges = addBadgeIfNotExists(updatedBadges, masteryBadge);
      }
    }
  }

  // Ajouter les badges pour les cycles complétés
  for (let cycleNum = 1; cycleNum <= 4; cycleNum++) {
    const cyclePas = getPasByCycle(cycleNum);
    const allCyclePasDone = cyclePas.every((pas) => {
      const pasProgress = progress.pas[pas.id];
      return pasProgress?.validatedAt !== undefined;
    });

    if (allCyclePasDone) {
      const cycleBadge = createCycleClearBadge(cycleNum);
      updatedBadges = addBadgeIfNotExists(updatedBadges, cycleBadge);
    }
  }

  // Ajouter les badges de boss fights
  if (progress.gamification.bossFights) {
    for (const [cycleStr, bossResult] of Object.entries(
      progress.gamification.bossFights
    )) {
      const cycle = parseInt(cycleStr);
      const bossBadge = createBossFightBadge(cycle, bossResult.medal);
      updatedBadges = addBadgeIfNotExists(updatedBadges, bossBadge);
    }
  }

  // Ajouter les badges intelligents
  const intelligentBadges = createIntelligentBadges(progress);
  for (const badge of intelligentBadges) {
    updatedBadges = addBadgeIfNotExists(updatedBadges, badge);
  }

  // Mettre à jour streakFreeze si un joker a été utilisé
  const newStreakFreeze = streakUpdate.usedFreeze
    ? progress.gamification.streakFreeze + 1
    : progress.gamification.streakFreeze;

  return {
    ...progress.gamification,
    xpTotal: totalXP,
    level: calculateLevel(totalXP),
    tokens: tokensFromState,
    streak: streakUpdate.streak,
    streakFreeze: newStreakFreeze,
    lastActiveDate: new Date().toISOString().split("T")[0],
    badges: updatedBadges,
    mastery,
  };
}
