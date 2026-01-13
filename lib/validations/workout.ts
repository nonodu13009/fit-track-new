import { z } from "zod";

/**
 * Schéma de validation pour logger une séance
 */
export const logWorkoutSchema = z.object({
  sport: z.string().min(1, "Le sport est requis"),
  duration: z
    .number()
    .min(1, "La durée doit être supérieure à 0")
    .max(600, "La durée ne peut pas dépasser 10h"),
  rpe: z.number().min(1).max(10),
  notes: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
});

/**
 * Schéma de validation pour logger le poids
 */
export const logWeightSchema = z.object({
  weight: z
    .number()
    .min(30, "Le poids doit être supérieur à 30 kg")
    .max(200, "Le poids doit être inférieur à 200 kg"),
  date: z.string().min(1, "La date est requise"),
});

/**
 * Schéma de validation pour logger les mesures
 */
export const logMeasurementsSchema = z.object({
  waist: z.number().optional(),
  chest: z.number().optional(),
  thigh: z.number().optional(),
  arm: z.number().optional(),
  date: z.string().min(1, "La date est requise"),
});

export type LogWorkoutFormData = z.infer<typeof logWorkoutSchema>;
export type LogWeightFormData = z.infer<typeof logWeightSchema>;
export type LogMeasurementsFormData = z.infer<typeof logMeasurementsSchema>;
