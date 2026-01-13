import { useMemo } from "react";
import { useWorkouts } from "./useWorkouts";
import { startOfDay, subDays, isSameDay } from "date-fns";

export function useStreak() {
  const { workouts, loading } = useWorkouts(7);

  const streak = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      startOfDay(subDays(new Date(), 6 - i))
    );

    const activeDays = last7Days.filter((day) => {
      return workouts.some((workout) =>
        isSameDay(new Date(workout.date), day)
      );
    });

    return {
      activeDays: activeDays.length,
      totalDays: 7,
      percentage: Math.round((activeDays.length / 7) * 100),
    };
  }, [workouts]);

  return { ...streak, loading };
}
