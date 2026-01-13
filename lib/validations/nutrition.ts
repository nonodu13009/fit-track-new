import { z } from "zod";

/**
 * Schéma pour un item de repas
 */
export const mealItemSchema = z.object({
  ingredientId: z.string().min(1),
  ingredientName: z.string().min(1),
  quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
});

/**
 * Schéma de validation pour logger un repas
 */
export const logMealSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  items: z.array(mealItemSchema).min(1, "Ajoutez au moins un aliment"),
  date: z.string().min(1, "La date est requise"),
});

export type LogMealFormData = z.infer<typeof logMealSchema>;
export type MealItemFormData = z.infer<typeof mealItemSchema>;
