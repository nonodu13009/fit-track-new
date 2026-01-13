/**
 * Types pour les templates et événements du calendrier
 */

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  sport: string;
  duration: number; // minutes
  exercises?: Exercise[];
  description?: string;
  createdAt: string;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // minutes
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  workoutTemplateId?: string; // référence au template (optionnel)
  title: string;
  sport?: string;
  duration?: number;
  start: string; // ISO string
  end: string; // ISO string
  isAllDay: boolean;
  status: "planned" | "done" | "skipped";
  notes?: string;
  createdAt: string;
}

export type EventStatus = CalendarEvent["status"];
