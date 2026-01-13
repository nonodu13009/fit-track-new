import { z } from "zod";

/**
 * Schéma de validation pour les sports (Step 1)
 */
export const sportsSchema = z.object({
  sports: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        grade: z.string().optional(),
      })
    )
    .min(1, "Sélectionnez au moins un sport"),
});

/**
 * Schéma de validation pour les données physiques (Step 2)
 */
export const physicalSchema = z.object({
  weight: z
    .number()
    .min(30, "Le poids doit être supérieur à 30 kg")
    .max(200, "Le poids doit être inférieur à 200 kg"),
  height: z
    .number()
    .min(100, "La taille doit être supérieure à 100 cm")
    .max(250, "La taille doit être inférieure à 250 cm"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
});

/**
 * Schéma de validation pour les objectifs (Step 3)
 */
export const objectiveSchema = z.object({
  type: z.enum(["competition", "weight_loss", "maintenance", "other"]),
  description: z.string().min(1, "La description est requise"),
  targetDate: z.string().optional(),
  targetWeight: z.number().optional(),
});

export type SportsFormData = z.infer<typeof sportsSchema>;
export type PhysicalFormData = z.infer<typeof physicalSchema>;
export type ObjectiveFormData = z.infer<typeof objectiveSchema>;
