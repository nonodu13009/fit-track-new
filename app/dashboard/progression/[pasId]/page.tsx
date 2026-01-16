"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserProgress } from "@/lib/progression/types";
import {
  loadProgress,
  updateProgress,
} from "@/lib/progression/progressStore";
import { getPasById } from "@/lib/progression/pas";
import { enrichPasWithProgress } from "@/lib/progression/compute";
import { PasDetail } from "@/components/progression/PasDetail";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Badge } from "@/components/ui/Badge";

export default function PasDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const pasId = params.pasId as string;

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const loadedProgress = await loadProgress(user?.uid || null);
        setProgress(loadedProgress);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const handleUpdate = async (updatedProgress: UserProgress) => {
    const finalProgress = await updateProgress(updatedProgress, user?.uid || null);
    setProgress(finalProgress);
  };

  if (loading || !progress) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <div className="flex justify-center py-12">
          <Loading size="lg" color="purple" />
        </div>
      </div>
    );
  }

  const pas = getPasById(pasId);
  if (!pas) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        <Card variant="elevated">
          <div className="text-center py-8">
            <p className="text-lg text-gray-400 mb-4">Pas introuvable</p>
            <Button variant="primary" onClick={() => router.push("/dashboard/progression")}>
              Retour à la progression
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const enrichedPas = enrichPasWithProgress(pas, progress);

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Header du pas */}
      <Card variant="elevated">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-400">
                Cycle {pas.cycle} • Sem. {pas.week} • Pas {pas.order}
              </span>
              <Badge
                variant={
                  enrichedPas.status === "DONE"
                    ? "green"
                    : enrichedPas.status === "IN_PROGRESS"
                      ? "purple"
                      : enrichedPas.status === "AVAILABLE"
                        ? "cyan"
                        : "gray"
                }
                size="sm"
              >
                {enrichedPas.status === "DONE"
                  ? "Terminé"
                  : enrichedPas.status === "IN_PROGRESS"
                    ? "En cours"
                    : enrichedPas.status === "AVAILABLE"
                      ? "Disponible"
                      : "Verrouillé"}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{pas.title}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/progression")}
          >
            ← Retour
          </Button>
        </div>
      </Card>

      {/* Détails du pas */}
      <PasDetail pas={pas} progress={progress} onUpdate={handleUpdate} />
    </div>
  );
}
