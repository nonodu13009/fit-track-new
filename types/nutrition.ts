/**
 * Types pour la nutrition
 */

export interface Meal {
  id: string;
  userId: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: MealItem[];
  totalCalories: number;
  macros: Macros;
  date: string; // ISO string
  createdAt: string;
}

export interface MealItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // en grammes
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Macros {
  calories: number;
  protein: number; // grammes
  carbs: number; // grammes
  fat: number; // grammes
}

export interface Ingredient {
  id: string;
  name: string;
  calories: number; // pour 100g
  protein: number; // pour 100g
  carbs: number; // pour 100g
  fat: number; // pour 100g
  category?: string;
}

export interface DailyNutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MEAL_TYPES = [
  { id: "breakfast", label: "Petit-déjeuner", emoji: "🥐" },
  { id: "lunch", label: "Déjeuner", emoji: "🍽️" },
  { id: "dinner", label: "Dîner", emoji: "🍝" },
  { id: "snack", label: "Snack", emoji: "🍎" },
] as const;
