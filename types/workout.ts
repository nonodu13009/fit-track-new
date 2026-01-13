/**
 * Types pour les séances d'entraînement
 */

export interface Workout {
  id: string;
  userId: string;
  sport: string;
  duration: number; // en minutes
  rpe: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
  exercises?: string[]; // optionnel
  date: string; // ISO string
  createdAt: string;
}

export interface WeighIn {
  id: string;
  userId: string;
  weight: number; // kg
  date: string; // ISO string
  createdAt: string;
}

export interface Measurement {
  id: string;
  userId: string;
  measurements: {
    waist?: number; // cm
    chest?: number;
    thigh?: number;
    arm?: number;
  };
  date: string;
  createdAt: string;
}

export interface WeeklyStats {
  workoutsCount: number;
  totalMinutes: number;
  avgRPE: number;
}

export const SPORTS = [
  "JJB",
  "Judo",
  "Musculation",
  "Cardio",
  "Yoga / Stretching",
  "MMA",
  "Boxe",
  "Autre",
] as const;
