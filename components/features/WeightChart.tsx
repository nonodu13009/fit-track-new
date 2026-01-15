"use client";

import { useState, useMemo } from "react";
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
import { format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useWeighIns } from "@/hooks/useWeighIns";
import { Card, Loading } from "@/components/ui";

type TimePeriod = "week" | "month" | "quarter" | "year";

interface WeightChartProps {
  targetWeight?: number;
}

function getPeriodDates(period: TimePeriod): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case "week":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "month":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "quarter":
      startDate.setDate(endDate.getDate() - 90);
      break;
    case "year":
      startDate.setDate(endDate.getDate() - 365);
      break;
  }

  return { startDate: startOfDay(startDate), endDate: startOfDay(endDate) };
}

export function WeightChart({ targetWeight }: WeightChartProps) {
  const { weighIns, loading } = useWeighIns(365); // Récupérer plus de données pour supporter toutes les périodes
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");

  // Calculer les dates de la période sélectionnée
  const { startDate, endDate } = useMemo(
    () => getPeriodDates(selectedPeriod),
    [selectedPeriod]
  );

  // Filtrer les weighIns selon la période
  const filteredWeighIns = useMemo(() => {
    return weighIns.filter((weighIn) => {
      const weighInDate = startOfDay(new Date(weighIn.date));
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      const weighInTime = weighInDate.getTime();
      return weighInTime >= startTime && weighInTime <= endTime;
    });
  }, [weighIns, startDate, endDate]);

  // Formater les dates selon la période
  const getDateFormat = (period: TimePeriod): string => {
    switch (period) {
      case "week":
      case "month":
        return "dd MMM";
      case "quarter":
        return "dd MMM";
      case "year":
        return "MMM yyyy";
      default:
        return "dd MMM";
    }
  };

  const chartData = useMemo(() => {
    return filteredWeighIns.map((weighIn) => ({
      date: format(new Date(weighIn.date), getDateFormat(selectedPeriod), {
        locale: fr,
      }),
      weight: weighIn.weight,
      fullDate: format(new Date(weighIn.date), "dd MMMM yyyy", { locale: fr }),
    }));
  }, [filteredWeighIns, selectedPeriod]);

  const weightDiff = useMemo(() => {
    if (filteredWeighIns.length < 2) return null;
    const first = filteredWeighIns[0].weight;
    const last = filteredWeighIns[filteredWeighIns.length - 1].weight;
    const diff = last - first;
    return {
      value: Math.abs(diff),
      trend: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
    };
  }, [filteredWeighIns]);

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

  if (filteredWeighIns.length === 0) {
    return (
      <Card variant="glass">
        <div className="py-12 text-center">
          <p className="mb-2 text-lg font-medium text-gray-400">
            Aucune donnée pour cette période
          </p>
          <p className="text-sm text-gray-500">
            Aucune pesée enregistrée pour la période sélectionnée
          </p>
        </div>
      </Card>
    );
  }

  const periods: Array<{ value: TimePeriod; label: string; color: string }> = [
    { value: "week", label: "Semaine", color: "cyan" },
    { value: "month", label: "Mois", color: "purple" },
    { value: "quarter", label: "Trimestre", color: "lime" },
    { value: "year", label: "Année", color: "orange" },
  ];

  return (
    <Card variant="glass">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-white">
          Évolution du poids
        </h3>
        <div className="flex items-center gap-2">
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
      </div>

      {/* Boutons de période */}
      <div className="mb-4 flex flex-wrap gap-2">
        {periods.map((period) => {
          const isActive = selectedPeriod === period.value;
          return (
            <button
              key={period.value}
              type="button"
              onClick={() => setSelectedPeriod(period.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? period.color === "cyan"
                    ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50 shadow-glow-cyan"
                    : period.color === "purple"
                      ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/50 shadow-glow-purple"
                      : period.color === "lime"
                        ? "bg-accent-lime/20 text-accent-lime border border-accent-lime/50 shadow-glow-lime"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                  : "bg-surface text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {period.label}
            </button>
          );
        })}
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
