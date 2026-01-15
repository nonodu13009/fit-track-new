/**
 * Types pour l'onboarding
 */

export interface Sport {
  id: string;
  name: string;
  grade?: string;
}

export interface PhysicalData {
  weight: number; // en kg
  height: number; // en cm
  dateOfBirth: string; // format ISO
  targetWeight?: number; // en kg - objectif de poids
}

export interface Objective {
  type: "competition" | "weight_loss" | "maintenance" | "other";
  description: string;
  targetDate?: string; // pour compétition
  targetWeight?: number; // pour perte de poids
}

export interface OnboardingData {
  sports: Sport[];
  physical: PhysicalData;
  objective: Objective;
}

export const AVAILABLE_SPORTS = [
  { id: "jjb", name: "JJB (Jiu-Jitsu Brésilien)" },
  { id: "judo", name: "Judo" },
  { id: "muscu", name: "Musculation" },
  { id: "cardio", name: "Cardio" },
  { id: "yoga", name: "Yoga / Stretching" },
  { id: "mma", name: "MMA" },
  { id: "boxe", name: "Boxe" },
  { id: "autre", name: "Autre" },
] as const;

export const JJB_GRADES = [
  "Ceinture Blanche",
  "Ceinture Bleue 1 barrette",
  "Ceinture Bleue 2 barrettes",
  "Ceinture Bleue 3 barrettes",
  "Ceinture Bleue 4 barrettes",
  "Ceinture Violette 1 barrette",
  "Ceinture Violette 2 barrettes",
  "Ceinture Violette 3 barrettes",
  "Ceinture Violette 4 barrettes",
  "Ceinture Marron 1 barrette",
  "Ceinture Marron 2 barrettes",
  "Ceinture Marron 3 barrettes",
  "Ceinture Marron 4 barrettes",
  "Ceinture Noire",
] as const;

export const JUDO_GRADES = [
  "Ceinture Blanche",
  "Ceinture Jaune",
  "Ceinture Orange",
  "Ceinture Verte",
  "Ceinture Bleue",
  "Ceinture Marron",
  "Ceinture Noire 1er Dan",
  "Ceinture Noire 2ème Dan",
  "Ceinture Noire 3ème Dan",
] as const;
