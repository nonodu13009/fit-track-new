import { useMemo } from "react";
import { useWorkouts } from "./useWorkouts";
import { type WeeklyStats } from "@/types/workout";

export function useWeeklyStats(): WeeklyStats & { loading: boolean } {
  const { workouts, loading } = useWorkouts(7); // 7 derniers jours

  const stats = useMemo(() => {
    if (workouts.length === 0) {
      return {
        workoutsCount: 0,
        totalMinutes: 0,
        avgRPE: 0,
      };
    }

    const totalMinutes = workouts.reduce(
      (sum, workout) => sum + workout.duration,
      0
    );
    const avgRPE =
      workouts.reduce((sum, workout) => sum + workout.rpe, 0) /
      workouts.length;

    return {
      workoutsCount: workouts.length,
      totalMinutes,
      avgRPE: Math.round(avgRPE * 10) / 10, // Arrondi à 1 décimale
    };
  }, [workouts]);

  return { ...stats, loading };
}
