import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { type WorkoutTemplate } from "@/types/template";
import { useAuth } from "@/hooks/useAuth";

export function useTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "workoutTemplates"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templatesData: WorkoutTemplate[] = [];
      snapshot.forEach((doc) => {
        templatesData.push({ id: doc.id, ...doc.data() } as WorkoutTemplate);
      });
      setTemplates(templatesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { templates, loading };
}
