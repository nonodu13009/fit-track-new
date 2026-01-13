import { z } from "zod";

/**
 * Schéma pour un exercice
 */
export const exerciseSchema = z.object({
  name: z.string().min(1, "Le nom de l'exercice est requis"),
  sets: z.number().optional(),
  reps: z.number().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

/**
 * Schéma de validation pour créer un template
 */
export const createTemplateSchema = z.object({
  name: z.string().min(1, "Le nom du template est requis"),
  sport: z.string().min(1, "Le sport est requis"),
  duration: z
    .number()
    .min(1, "La durée doit être supérieure à 0")
    .max(600, "La durée ne peut pas dépasser 10h"),
  exercises: z.array(exerciseSchema).optional(),
  description: z.string().optional(),
});

/**
 * Schéma de validation pour créer un événement
 */
export const createEventSchema = z.object({
  workoutTemplateId: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  sport: z.string().optional(),
  duration: z.number().optional(),
  start: z.string().min(1, "La date de début est requise"),
  end: z.string().min(1, "La date de fin est requise"),
  isAllDay: z.boolean(),
  notes: z.string().optional(),
});

export type CreateTemplateFormData = z.infer<typeof createTemplateSchema>;
export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type ExerciseFormData = z.infer<typeof exerciseSchema>;
