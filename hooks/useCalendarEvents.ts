import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { type CalendarEvent } from "@/types/template";
import { useAuth } from "@/hooks/useAuth";

export function useCalendarEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "calendarEvents"),
      where("userId", "==", user.uid),
      orderBy("start", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData: CalendarEvent[] = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as CalendarEvent);
      });
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { events, loading };
}
