"use client";

import { useState } from "react";
import { Card, Badge, Loading, Button } from "@/components/ui";
import { WeightChart } from "@/components/features/WeightChart";
import { LogWeightModal } from "@/components/features/LogWeightModal";
import { useWeighIns } from "@/hooks/useWeighIns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Scales, Plus } from "@phosphor-icons/react";

export default function WeightPage() {
  const { weighIns, loading } = useWeighIns(50);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
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

      {/* Graphique */}
      <WeightChart />

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
            {[...weighIns].reverse().map((weighIn) => (
              <div
                key={weighIn.id}
                className="flex items-center justify-between rounded-lg bg-surface p-3 transition-colors hover:bg-elevated"
              >
                <div>
                  <p className="font-medium text-white">{weighIn.weight} kg</p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(weighIn.date), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            ))}
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
