/**
 * Types pour la progression technique JJB (Gi) - Système Gracie Barra
 */

// ============================================================================
// Statuts et paliers
// ============================================================================

export type PasStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "DONE";

export type MasteryTier = "bronze" | "argent" | "or";

export type PalierStatus = "not_started" | "in_progress" | "completed";

// ============================================================================
// Types de pas
// ============================================================================

export type PasType = "fondamental" | "escape" | "sweep" | "passage" | "contrôle" | "soumission";

// ============================================================================
// Système de paliers (K-E-A-I)
// ============================================================================

export interface PalierK {
  status: PalierStatus;
  repsCompleted: number; // 10 répétitions propres d'affilée (vitesse lente)
  completedAt?: string; // ISO string
}

export interface PalierE {
  status: PalierStatus;
  totalReps: number; // 50 reps totales (sur 1-2 semaines)
  cleanReps: number; // 10 reps propres à vitesse normale
  completedAt?: string;
}

export interface PositionalTestResult {
  attempts: number;
  successes: number;
  successRate: number; // 0-100
  sessions: string[]; // ISO dates des séances
}

export interface FreeSparringTestResult {
  rounds: number;
  occurrences: number;
  sessions: string[]; // ISO dates des séances
}

export interface PalierA {
  status: PalierStatus;
  positionalTest: PositionalTestResult;
  targetRate: number; // ≥ 40% (ou 30% pour débutant)
  completedAt?: string;
}

export interface PalierI {
  status: PalierStatus;
  freeSparringTest: FreeSparringTestResult;
  occurrencesMin: number; // ≥ 1 occurrence utile
  sessionsRequired: number; // 2 séances différentes
  completedAt?: string;
}

export interface Paliers {
  K: PalierK; // Connaissance
  E: PalierE; // Exécution
  A: PalierA; // Application (positional sparring)
  I: PalierI; // Intégration (sparring libre)
}

// ============================================================================
// Critères de validation par type de pas
// ============================================================================

export interface Checkpoint {
  label: string;
  explanation?: string;
}

export interface ValidationCriteria {
  checkpoints: Checkpoint[]; // 3-5 items required
  volumeMin: number; // ex: 50 reps
  positionalTest: {
    attempts: number; // ex: 10
    targetRate: number; // ex: 40% (ou holdTime pour contrôles)
  };
  freeSparringTest: {
    rounds: number; // ex: 3
    occurrencesMin: number; // ex: 1
  };
  stability: {
    sessionsRequired: number; // ex: 2
  };
}

// ============================================================================
// Pas (remplace Step)
// ============================================================================

export interface Pas {
  id: string;
  cycle: number; // 1-4 (au lieu de block)
  week: number; // 1-16 dans le cycle
  order: number; // ordre dans la semaine/cycle
  title: string;
  objectives: string[];
  type: PasType;
  checkpoints: Checkpoint[]; // Remplace checklist, avec explications optionnelles
  paliers: Paliers;
  validationCriteria: ValidationCriteria;
  prerequisites?: string[]; // pasIds requis
}

// ============================================================================
// Progression d'un pas
// ============================================================================

export interface PasProgress {
  paliersState: {
    K: PalierK;
    E: PalierE;
    A: PalierA;
    I: PalierI;
  };
  masteryTier?: MasteryTier; // bronze/argent/or
  validatedAt?: string; // ISO string
  updatedAt: string; // ISO string
  notes?: string;
  volumeCompleted: number; // Volume total complété
  sessions: string[]; // Dates des séances où le pas a été travaillé
}

// ============================================================================
// Quêtes
// ============================================================================

export type QuestType = "daily" | "weekly";

export type QuestStatus = "available" | "in_progress" | "completed" | "expired";

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  status: QuestStatus;
  xpReward: number;
  tokenReward: number;
  createdAt: string; // ISO string
  expiresAt?: string; // ISO string (pour daily)
  completedAt?: string; // ISO string
  progress?: {
    current: number;
    target: number;
  };
}

// ============================================================================
// Boss fights
// ============================================================================

export type BossMedal = "bronze" | "argent" | "or";

export interface BossFightResult {
  cycle: number;
  score: number; // 0-100
  medal: BossMedal;
  attempts: number;
  successes: number;
  notes?: string;
  completedAt: string; // ISO string
}

// ============================================================================
// Gamification
// ============================================================================

export interface Gamification {
  xpTotal: number;
  level: number;
  tokens: number; // Monnaie douce pour cosmétique
  streak: number; // Jours consécutifs
  streakFreeze: number; // Jokers utilisés (2 par mois max)
  lastActiveDate?: string; // ISO string
  badges: Badge[];
  mastery: Record<string, MasteryTier>; // pasId -> tier
  bossFights: Record<number, BossFightResult>; // cycle -> résultat
}

// ============================================================================
// Badges
// ============================================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  earnedAt: string; // ISO string
}

// ============================================================================
// Log d'activité
// ============================================================================

export interface ProgressLogEntry {
  id: string;
  ts: string; // ISO string
  type: "log" | "combo" | "kpi" | "validation" | "cycle_completion" | "quest" | "boss_fight";
  pasId?: string;
  questId?: string;
  xpDelta: number;
  tokenDelta?: number;
  label: string;
}

// ============================================================================
// Progression utilisateur
// ============================================================================

export interface UserProgress {
  pas: Record<string, PasProgress>; // pasId -> PasProgress (au lieu de steps)
  gamification: Gamification;
  quests: Quest[]; // Quêtes actives
  log?: ProgressLogEntry[]; // Optionnel, limité aux 200 derniers
}

// ============================================================================
// Pas avec progression (pour affichage)
// ============================================================================

export interface PasWithProgress extends Pas {
  status: PasStatus;
  progress?: PasProgress;
  xpEarned?: number; // XP gagnée sur ce pas
  completion?: number; // Pourcentage de completion (0-100)
}

// ============================================================================
// Progression par cycle (remplace BlockProgress)
// ============================================================================

export interface CycleProgress {
  cycle: number; // 1-4
  totalPas: number;
  completedPas: number;
  completionPercentage: number;
  masteryDistribution: {
    bronze: number;
    argent: number;
    or: number;
  };
}

// ============================================================================
// Types pour les interactions UI
// ============================================================================

export interface SwipeAction {
  type: "short" | "long"; // short = log, long = test
  pasId: string;
  timestamp: string;
}

export interface ComboSequence {
  pasId: string;
  actions: string[]; // IDs des actions dans l'ordre
  correctSequence: string[]; // Séquence attendue
  completed: boolean;
}

// ============================================================================
// Types de compatibilité (pour migration)
// ============================================================================

// Garder temporairement pour la migration
export type StepStatus = PasStatus;
export type BlockProgress = CycleProgress; // Alias pour migration
