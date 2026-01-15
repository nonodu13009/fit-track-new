import { updateDocument, deleteDocument } from "./firestore";
import { type Workout, type WeighIn } from "@/types/workout";

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

/**
 * Mettre à jour un poids
 */
export async function updateWeighIn(
  weighInId: string,
  data: Partial<WeighIn>
): Promise<void> {
  await updateDocument("weighIns", weighInId, data);
}

/**
 * Supprimer un poids
 */
export async function deleteWeighIn(weighInId: string): Promise<void> {
  await deleteDocument("weighIns", weighInId);
}
