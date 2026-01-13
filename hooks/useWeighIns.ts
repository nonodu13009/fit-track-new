import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit as firestoreLimit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { type WeighIn } from "@/types/workout";
import { useAuth } from "@/hooks/useAuth";

export function useWeighIns(limitCount = 30) {
  const { user } = useAuth();
  const [weighIns, setWeighIns] = useState<WeighIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWeighIns([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "weighIns"),
      where("userId", "==", user.uid),
      orderBy("date", "asc"),
      firestoreLimit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const weighInsData: WeighIn[] = [];
      snapshot.forEach((doc) => {
        weighInsData.push({ id: doc.id, ...doc.data() } as WeighIn);
      });
      setWeighIns(weighInsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, limitCount]);

  return { weighIns, loading };
}
