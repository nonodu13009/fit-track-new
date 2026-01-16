/**
 * Système de quêtes : quotidiennes et hebdomadaires
 */

import { Quest, QuestType, QuestStatus, PasType, PasProgress } from "./types";
import { PAS } from "./pas";
import { XP_REWARDS, TOKEN_REWARDS } from "./gamification";

// ============================================================================
// Templates de quêtes
// ============================================================================

interface QuestTemplate {
  title: string;
  description: string;
  xpReward: number;
  tokenReward: number;
  type: QuestType;
  validate: (progress: any) => boolean; // Fonction de validation
}

const DAILY_QUEST_TEMPLATES: Omit<QuestTemplate, "type">[] = [
  {
    title: "Fais 20 reps propres de hip escape",
    description: "Exécute 20 répétitions propres de hip escape",
    xpReward: XP_REWARDS.QUEST_DAILY,
    tokenReward: TOKEN_REWARDS.QUEST_DAILY,
    validate: (progress) => {
      // Vérifier si un pas de type escape a été travaillé avec 20+ reps
      for (const pas of PAS) {
        if (pas.type === "escape") {
          const pasProgress = progress.pas[pas.id] as PasProgress | undefined;
          if (pasProgress && pasProgress.volumeCompleted >= 20) {
            return true;
          }
        }
      }
      return false;
    },
  },
  {
    title: "1 round positional : sortir de side 2 fois",
    description: "Exécute 1 round de positional sparring et sors de side control 2 fois",
    xpReward: XP_REWARDS.QUEST_DAILY,
    tokenReward: TOKEN_REWARDS.QUEST_DAILY,
    validate: (progress) => {
      // Vérifier si un escape side a été réussi 2 fois en positional
      for (const pas of PAS) {
        if (pas.type === "escape" && pas.title.includes("side")) {
          const pasProgress = progress.pas[pas.id] as PasProgress | undefined;
          if (
            pasProgress &&
            pasProgress.paliersState.A.positionalTest.successes >= 2
          ) {
            return true;
          }
        }
      }
      return false;
    },
  },
  {
    title: "Note 1 erreur + 1 correction",
    description: "Note une erreur commise et sa correction",
    xpReward: XP_REWARDS.QUEST_DAILY,
    tokenReward: TOKEN_REWARDS.QUEST_DAILY,
    validate: (progress) => {
      // Vérifier si une note a été ajoutée aujourd'hui
      const today = new Date().toISOString().split("T")[0];
      for (const pasProgress of Object.values(progress.pas)) {
        const pp = pasProgress as PasProgress;
        if (pp?.notes && pp.updatedAt && typeof pp.updatedAt === "string" && pp.updatedAt.startsWith(today)) {
          return true;
        }
      }
      return false;
    },
  },
  {
    title: "Valide 1 checkpoint",
    description: "Valide au moins 1 checkpoint d'un pas",
    xpReward: XP_REWARDS.QUEST_DAILY,
    tokenReward: TOKEN_REWARDS.QUEST_DAILY,
    validate: (progress) => {
      // Vérifier si un palier K ou E a été complété aujourd'hui
      const today = new Date().toISOString().split("T")[0];
      for (const pasProgress of Object.values(progress.pas)) {
        const pp = pasProgress as PasProgress;
        if (
          (pp?.paliersState.K.completedAt && typeof pp.paliersState.K.completedAt === "string" && pp.paliersState.K.completedAt.startsWith(today)) ||
          (pp?.paliersState.E.completedAt && typeof pp.paliersState.E.completedAt === "string" && pp.paliersState.E.completedAt.startsWith(today))
        ) {
          return true;
        }
      }
      return false;
    },
  },
];

const WEEKLY_QUEST_TEMPLATES: Omit<QuestTemplate, "type">[] = [
  {
    title: "Valide 1 KPI (escape rate / pass rate)",
    description: "Atteins le KPI d'un pas (taux de réussite en positional)",
    xpReward: XP_REWARDS.QUEST_WEEKLY,
    tokenReward: TOKEN_REWARDS.QUEST_WEEKLY,
    validate: (progress) => {
      // Vérifier si un palier A a été complété cette semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      for (const pasProgress of Object.values(progress.pas)) {
        const pp = pasProgress as PasProgress;
        if (
          pp?.paliersState.A.status === "completed" &&
          pp.paliersState.A.completedAt &&
          new Date(pp.paliersState.A.completedAt) >= weekAgo
        ) {
          return true;
        }
      }
      return false;
    },
  },
  {
    title: "Termine 1 pas",
    description: "Valide complètement un pas (tous les paliers)",
    xpReward: XP_REWARDS.QUEST_WEEKLY,
    tokenReward: TOKEN_REWARDS.QUEST_WEEKLY,
    validate: (progress) => {
      // Vérifier si un pas a été validé cette semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      for (const pasProgress of Object.values(progress.pas)) {
        const pp = pasProgress as PasProgress;
        if (
          pp?.validatedAt &&
          new Date(pp.validatedAt) >= weekAgo
        ) {
          return true;
        }
      }
      return false;
    },
  },
  {
    title: "Rejoue un pas ancien (retention)",
    description: "Retravaille un pas déjà validé pour améliorer la retention",
    xpReward: XP_REWARDS.QUEST_WEEKLY,
    tokenReward: TOKEN_REWARDS.QUEST_WEEKLY,
    validate: (progress) => {
      // Vérifier si un pas validé a été retravaillé cette semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      for (const pasProgress of Object.values(progress.pas)) {
        const pp = pasProgress as PasProgress;
        if (
          pp?.validatedAt &&
          pp.updatedAt &&
          new Date(pp.updatedAt) >= weekAgo &&
          new Date(pp.updatedAt) > new Date(pp.validatedAt)
        ) {
          return true;
        }
      }
      return false;
    },
  },
  {
    title: "Améliore un mastery tier",
    description: "Passe un pas de bronze à argent, ou argent à or",
    xpReward: XP_REWARDS.QUEST_WEEKLY,
    tokenReward: TOKEN_REWARDS.QUEST_WEEKLY,
    validate: (progress) => {
      // Vérifier si un mastery tier a été amélioré cette semaine
      // Cette validation nécessite de comparer avec l'état précédent
      // Pour simplifier, on vérifie si un pas a un mastery tier or cette semaine
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      for (const pasProgress of Object.values(progress.pas)) {
        const pp = pasProgress as PasProgress;
        if (
          pp?.masteryTier === "or" &&
          pp.updatedAt &&
          typeof pp.updatedAt === "string" &&
          new Date(pp.updatedAt) >= weekAgo
        ) {
          return true;
        }
      }
      return false;
    },
  },
];

// ============================================================================
// Génération de quêtes
// ============================================================================

/**
 * Génère une quête quotidienne aléatoire
 */
export function generateDailyQuest(progress: any): Quest {
  const template =
    DAILY_QUEST_TEMPLATES[
      Math.floor(Math.random() * DAILY_QUEST_TEMPLATES.length)
    ];

  const today = new Date();
  const expiresAt = new Date(today);
  expiresAt.setHours(23, 59, 59, 999);

  return {
    id: `quest-daily-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "daily",
    title: template.title,
    description: template.description,
    status: "available",
    xpReward: template.xpReward,
    tokenReward: template.tokenReward,
    createdAt: today.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Génère une quête hebdomadaire aléatoire
 */
export function generateWeeklyQuest(progress: any): Quest {
  const template =
    WEEKLY_QUEST_TEMPLATES[
      Math.floor(Math.random() * WEEKLY_QUEST_TEMPLATES.length)
    ];

  const today = new Date();
  const expiresAt = new Date(today);
  expiresAt.setDate(expiresAt.getDate() + 7);
  expiresAt.setHours(23, 59, 59, 999);

  return {
    id: `quest-weekly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "weekly",
    title: template.title,
    description: template.description,
    status: "available",
    xpReward: template.xpReward,
    tokenReward: template.tokenReward,
    createdAt: today.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Génère les quêtes du jour (1 quotidienne + 1 hebdo si nécessaire)
 */
export function generateTodayQuests(progress: any): Quest[] {
  const quests: Quest[] = [];

  // Quête quotidienne
  const dailyQuest = generateDailyQuest(progress);
  quests.push(dailyQuest);

  // Quête hebdomadaire (si pas déjà une active)
  const hasActiveWeekly = progress.quests?.some(
    (q: Quest) => q.type === "weekly" && q.status === "available"
  );
  if (!hasActiveWeekly) {
    const weeklyQuest = generateWeeklyQuest(progress);
    quests.push(weeklyQuest);
  }

  return quests;
}

// ============================================================================
// Validation de quêtes
// ============================================================================

/**
 * Valide une quête selon son template
 */
export function validateQuest(quest: Quest, progress: any): boolean {
  let template: Omit<QuestTemplate, "type"> | undefined;

  if (quest.type === "daily") {
    template = DAILY_QUEST_TEMPLATES.find((t) => t.title === quest.title);
  } else {
    template = WEEKLY_QUEST_TEMPLATES.find((t) => t.title === quest.title);
  }

  if (!template) {
    return false;
  }

  return template.validate(progress);
}

/**
 * Met à jour le statut d'une quête
 */
export function updateQuestStatus(
  quest: Quest,
  progress: any
): QuestStatus {
  // Vérifier si expirée
  if (quest.expiresAt) {
    const expires = new Date(quest.expiresAt);
    const now = new Date();
    if (now > expires && quest.status !== "completed") {
      return "expired";
    }
  }

  // Vérifier si complétée
  if (validateQuest(quest, progress)) {
    return "completed";
  }

  // Si en cours, reste en cours
  if (quest.status === "in_progress") {
    return "in_progress";
  }

  return "available";
}

/**
 * Marque une quête comme complétée
 */
export function completeQuest(quest: Quest): Quest {
  return {
    ...quest,
    status: "completed",
    completedAt: new Date().toISOString(),
  };
}

/**
 * Nettoie les quêtes expirées et génère de nouvelles si nécessaire
 */
export function refreshQuests(progress: any): Quest[] {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Filtrer les quêtes expirées
  const activeQuests = (progress.quests || []).filter((quest: Quest) => {
    if (quest.status === "completed") {
      return true; // Garder les complétées pour historique
    }

    if (quest.expiresAt) {
      const expires = new Date(quest.expiresAt);
      return now <= expires;
    }

    return true;
  });

  // Vérifier si on a besoin de nouvelles quêtes
  const hasDailyToday = activeQuests.some(
    (q: Quest) =>
      q.type === "daily" &&
      q.createdAt.startsWith(today) &&
      q.status !== "completed"
  );

  const hasWeeklyActive = activeQuests.some(
    (q: Quest) => q.type === "weekly" && q.status === "available"
  );

  const newQuests: Quest[] = [];

  // Générer quête quotidienne si nécessaire
  if (!hasDailyToday) {
    newQuests.push(generateDailyQuest(progress));
  }

  // Générer quête hebdo si nécessaire
  if (!hasWeeklyActive) {
    newQuests.push(generateWeeklyQuest(progress));
  }

  return [...activeQuests, ...newQuests];
}

/**
 * Met à jour toutes les quêtes selon l'état actuel
 */
export function updateAllQuests(progress: any): Quest[] {
  return (progress.quests || []).map((quest: Quest) => {
    if (quest.status === "completed") {
      return quest; // Ne pas modifier les complétées
    }

    const newStatus = updateQuestStatus(quest, progress);

    if (newStatus === "completed") {
      return completeQuest(quest);
    }

    return {
      ...quest,
      status: newStatus,
    };
  });
}
