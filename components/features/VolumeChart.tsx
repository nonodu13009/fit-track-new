"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useWorkouts } from "@/hooks/useWorkouts";
import { Card, Loading } from "@/components/ui";

export function VolumeChart() {
  const { workouts, loading } = useWorkouts(7);

  const chartData = useMemo(() => {
    // Créer un tableau des 7 derniers jours
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date: format(date, "EEE", { locale: fr }),
        fullDate: format(date, "dd MMMM yyyy", { locale: fr }),
        dateISO: date.toISOString(),
        minutes: 0,
      };
    });

    // Ajouter les minutes de chaque séance au bon jour
    workouts.forEach((workout) => {
      const workoutDate = startOfDay(new Date(workout.date)).toISOString();
      const day = days.find((d) => d.dateISO === workoutDate);
      if (day) {
        day.minutes += workout.duration;
      }
    });

    return days;
  }, [workouts]);

  if (loading) {
    return (
      <Card variant="glass">
        <div className="flex h-64 items-center justify-center">
          <Loading size="lg" color="purple" />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          Volume d&apos;entraînement (7j)
        </h3>
        <p className="text-sm text-gray-400">Minutes par jour</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A1D23" />
          <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: "12px" }} />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F1115",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number | undefined) =>
              value ? [`${value} min`, "Volume"] : ["0 min", "Volume"]
            }
            labelFormatter={(label, payload) =>
              payload[0]?.payload?.fullDate || label
            }
          />
          <Bar
            dataKey="minutes"
            fill="#a855f7"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
