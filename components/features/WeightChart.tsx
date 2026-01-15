"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useWeighIns } from "@/hooks/useWeighIns";
import { Card, Loading } from "@/components/ui";

interface WeightChartProps {
  targetWeight?: number;
}

export function WeightChart({ targetWeight }: WeightChartProps) {
  const { weighIns, loading } = useWeighIns(30);

  const chartData = useMemo(() => {
    return weighIns.map((weighIn) => ({
      date: format(new Date(weighIn.date), "dd MMM", { locale: fr }),
      weight: weighIn.weight,
      fullDate: format(new Date(weighIn.date), "dd MMMM yyyy", { locale: fr }),
    }));
  }, [weighIns]);

  const weightDiff = useMemo(() => {
    if (weighIns.length < 2) return null;
    const first = weighIns[0].weight;
    const last = weighIns[weighIns.length - 1].weight;
    const diff = last - first;
    return {
      value: Math.abs(diff),
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
    };
  }, [weighIns]);

  if (loading) {
    return (
      <Card variant="glass">
        <div className="flex h-64 items-center justify-center">
          <Loading size="lg" color="cyan" />
        </div>
      </Card>
    );
  }

  if (weighIns.length === 0) {
    return (
      <Card variant="glass">
        <div className="py-12 text-center">
          <p className="mb-2 text-lg font-medium text-gray-400">
            Aucune donnée de poids
          </p>
          <p className="text-sm text-gray-500">
            Commencez à logger votre poids pour voir l&apos;évolution
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Évolution du poids
        </h3>
        {weightDiff && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                weightDiff.trend === "up"
                  ? "text-red-400"
                  : weightDiff.trend === "down"
                    ? "text-green-400"
                    : "text-gray-400"
              }`}
            >
              {weightDiff.trend === "up" && "▲"}
              {weightDiff.trend === "down" && "▼"}
              {weightDiff.trend === "stable" && "●"}
              {" "}
              {weightDiff.value.toFixed(1)} kg
            </span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A1D23" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
            domain={
              targetWeight
                ? [
                    Math.min(
                      ...chartData.map((d) => d.weight),
                      targetWeight
                    ) - 2,
                    Math.max(
                      ...chartData.map((d) => d.weight),
                      targetWeight
                    ) + 2,
                  ]
                : ["dataMin - 2", "dataMax + 2"]
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F1115",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number | undefined) =>
              value ? [`${value} kg`, "Poids"] : ["- kg", "Poids"]
            }
            labelFormatter={(label, payload) =>
              payload[0]?.payload?.fullDate || label
            }
          />
          {targetWeight && (
            <ReferenceLine
              y={targetWeight}
              stroke="#a855f7"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Objectif: ${targetWeight} kg`,
                position: "right",
                fill: "#a855f7",
                fontSize: 12,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ fill: "#22d3ee", r: 4 }}
            activeDot={{ r: 6 }}
            name="Poids"
          />
          {targetWeight && <Legend />}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
