"use client";

import { useState, useMemo } from "react";
import { Card, Badge, Loading, Button } from "@/components/ui";
import { WeightChart } from "@/components/features/WeightChart";
import { LogWeightModal } from "@/components/features/LogWeightModal";
import { useWeighIns } from "@/hooks/useWeighIns";
import { useUserProfile } from "@/hooks/useUserProfile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Scales, Plus, Target } from "@phosphor-icons/react";

export default function WeightPage() {
  const { weighIns, loading: weighInsLoading } = useWeighIns(50);
  const { profile, loading: profileLoading } = useUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targetWeight = profile?.physical?.targetWeight;
  const currentWeight = weighIns.length > 0 ? weighIns[weighIns.length - 1].weight : null;

  // Calculer la progression vers l'objectif
  const progression = useMemo(() => {
    if (!targetWeight || !currentWeight) return null;

    const diff = currentWeight - targetWeight;
    const absDiff = Math.abs(diff);

    // Si la différence est inférieure à 0.5 kg, considérer comme atteint
    if (absDiff < 0.5) {
      return { type: "achieved", message: "Objectif atteint ! 🎉", diff: 0 };
    }

    if (diff > 0) {
      return {
        type: "above",
        message: `${absDiff.toFixed(1)} kg au-dessus de l'objectif`,
        diff: absDiff,
      };
    } else {
      return {
        type: "below",
        message: `${absDiff.toFixed(1)} kg restants`,
        diff: absDiff,
      };
    }
  }, [targetWeight, currentWeight]);

  if (weighInsLoading || profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading size="lg" color="cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Poids</h1>
        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={16} weight="bold" />}
        >
          Ajouter
        </Button>
      </div>

      {/* Objectif de poids */}
      {targetWeight && (
        <Card variant="elevated">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-purple/20 p-3">
              <Target size={24} weight="fill" className="text-accent-purple" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-400">Objectif</h3>
              <p className="text-xl font-bold text-white">
                {targetWeight.toFixed(1)} kg
              </p>
              {progression && (
                <p
                  className={`text-sm ${
                    progression.type === "achieved"
                      ? "text-green-400"
                      : progression.type === "above"
                        ? "text-orange-400"
                        : "text-cyan-400"
                  }`}
                >
                  {progression.message}
                </p>
              )}
            </div>
            {currentWeight && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Actuel</p>
                <p className="text-lg font-semibold text-white">
                  {currentWeight.toFixed(1)} kg
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Graphique */}
      <WeightChart targetWeight={targetWeight} />

      {/* Historique */}
      <Card variant="elevated">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Historique</h2>
          <Badge variant="cyan">{weighIns.length} pesées</Badge>
        </div>

        {weighIns.length === 0 ? (
          <div className="py-8 text-center">
            <Scales
              size={48}
              weight="fill"
              className="mx-auto mb-4 text-gray-600"
            />
            <p className="mb-2 text-gray-400">Aucune pesée enregistrée</p>
            <p className="text-sm text-gray-500">
              Ajoutez votre première pesée pour commencer à suivre votre
              évolution
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...weighIns].reverse().map((weighIn) => {
              // Calculer la progression pour cette pesée
              const weighInProgression = targetWeight
                ? (() => {
                    const diff = weighIn.weight - targetWeight;
                    const absDiff = Math.abs(diff);

                    if (absDiff < 0.5) {
                      return {
                        type: "achieved",
                        message: "Objectif atteint",
                        diff: 0,
                      };
                    }

                    if (diff > 0) {
                      return {
                        type: "above",
                        message: `${absDiff.toFixed(1)} kg au-dessus`,
                        diff: absDiff,
                      };
                    } else {
                      return {
                        type: "below",
                        message: `${absDiff.toFixed(1)} kg restants`,
                        diff: absDiff,
                      };
                    }
                  })()
                : null;

              return (
                <div
                  key={weighIn.id}
                  className="flex items-center justify-between rounded-lg bg-surface p-3 transition-colors hover:bg-elevated"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">
                        {weighIn.weight} kg
                      </p>
                      {weighInProgression && (
                        <Badge
                          variant={
                            weighInProgression.type === "achieved"
                              ? "green"
                              : weighInProgression.type === "above"
                                ? "red"
                                : "cyan"
                          }
                          size="sm"
                        >
                          {weighInProgression.message}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {format(new Date(weighIn.date), "dd MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal */}
      <LogWeightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
