import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy as firestoreOrderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { type Meal } from "@/types/nutrition";
import { useAuth } from "@/hooks/useAuth";
import { startOfDay, isToday as isTodayFn } from "date-fns";

export function useMeals(date?: Date) {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMeals([]);
      setLoading(false);
      return;
    }

    // Si date spécifiée, filtrer par jour
    const targetDate = date || new Date();
    const dayStart = startOfDay(targetDate).toISOString();
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "meals"),
      where("userId", "==", user.uid),
      where("date", ">=", dayStart),
      where("date", "<=", dayEnd.toISOString()),
      firestoreOrderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mealsData: Meal[] = [];
      snapshot.forEach((doc) => {
        mealsData.push({ id: doc.id, ...doc.data() } as Meal);
      });
      setMeals(mealsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, date]);

  // Calculer le total journalier
  const dailyTotal = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalCalories,
        protein: acc.protein + meal.macros.protein,
        carbs: acc.carbs + meal.macros.carbs,
        fat: acc.fat + meal.macros.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  return { meals, dailyTotal, loading };
}
