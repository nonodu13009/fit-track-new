/**
 * Types pour les réponses de l'IA Coach
 */

export interface CoachResponse {
  message: string;
  suggestions?: string[];
  actions?: CoachAction[];
  plan?: TrainingPlan;
  meals?: MealSuggestion[];
}

export interface CoachAction {
  type: "workout" | "nutrition" | "rest" | "other";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface TrainingPlan {
  objective: string;
  duration: number; // en jours
  days: PlanDay[];
}

export interface PlanDay {
  day: number;
  type: "workout" | "rest" | "active_recovery" | "stretching";
  title: string;
  description?: string;
  duration?: number; // en minutes
}

export interface MealSuggestion {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  ingredients: Ingredient[];
  macros: Macros;
  instructions?: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Types pour le contexte envoyé à l'IA
 */
export interface CoachContext {
  userId: string;
  recentWorkouts?: any[];
  weeklyStats?: {
    workoutsCount: number;
    totalMinutes: number;
    avgRPE: number;
  };
  currentWeight?: number;
  objective?: string;
  sports?: string[];
}
