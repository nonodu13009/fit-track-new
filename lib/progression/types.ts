/**
 * Types pour la progression technique JJB (Gi)
 */

export type StepStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "DONE";

export type ChecklistItemType = "REQUIRED" | "OPTIONAL";

export interface ChecklistItem {
  id: string;
  label: string;
  type: ChecklistItemType;
  checked: boolean;
}

export interface KPI {
  id: string;
  label: string;
  type: ChecklistItemType;
  target: number;
  current: number;
  unit?: string;
}

export interface Step {
  id: string;
  block: number; // 1-4
  order: number; // ordre dans le bloc
  title: string;
  objectives: string[];
  checklist: ChecklistItem[];
  kpis: KPI[];
  prerequisites?: string[]; // stepIds requis
}

export interface StepProgress {
  checklistState: Record<string, boolean>; // itemId -> checked
  kpisState: Record<string, number>; // kpiId -> current value
  validatedAt?: string; // ISO string
  updatedAt: string; // ISO string
  notes?: string;
}

export interface ProgressLogEntry {
  id: string;
  ts: string; // ISO string
  type: "checklist" | "kpi" | "validation" | "block_completion";
  stepId?: string;
  xpDelta: number;
  label: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  earnedAt: string; // ISO string
}

export interface Gamification {
  xpTotal: number;
  level: number;
  streak: number; // jours consécutifs
  lastActiveDate?: string; // ISO string
  badges: Badge[];
}

export interface UserProgress {
  steps: Record<string, StepProgress>; // stepId -> StepProgress
  gamification: Gamification;
  log?: ProgressLogEntry[]; // optionnel, limité aux 200 derniers
}

export interface StepWithProgress extends Step {
  status: StepStatus;
  progress?: StepProgress;
  xpEarned?: number; // XP gagnée sur cette step
  completion?: number; // Pourcentage de completion (0-100)
}

export interface BlockProgress {
  block: number;
  totalSteps: number;
  completedSteps: number;
  completionPercentage: number;
}
