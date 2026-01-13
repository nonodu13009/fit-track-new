import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { type Workout } from "@/types/workout";
import { useAuth } from "@/hooks/useAuth";

export function useWorkouts(limitDays?: number) {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    const constraints: QueryConstraint[] = [
      where("userId", "==", user.uid),
      orderBy("date", "desc"),
    ];

    // Optionnel : limiter aux X derniers jours
    if (limitDays) {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - limitDays);
      constraints.push(where("date", ">=", limitDate.toISOString()));
    }

    const q = query(collection(db, "workouts"), ...constraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutsData: Workout[] = [];
      snapshot.forEach((doc) => {
        workoutsData.push({ id: doc.id, ...doc.data() } as Workout);
      });
      setWorkouts(workoutsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, limitDays]);

  return { workouts, loading };
}
