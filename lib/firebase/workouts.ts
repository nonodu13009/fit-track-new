import { updateDocument, deleteDocument } from "./firestore";
import { type Workout } from "@/types/workout";

/**
 * Mettre à jour une séance
 */
export async function updateWorkout(
  workoutId: string,
  data: Partial<Workout>
): Promise<void> {
  await updateDocument("workouts", workoutId, data);
}

/**
 * Supprimer une séance
 */
export async function deleteWorkout(workoutId: string): Promise<void> {
  await deleteDocument("workouts", workoutId);
}
