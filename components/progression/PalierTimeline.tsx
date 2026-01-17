"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Pas, PasProgress } from "@/lib/progression/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface PalierTimelineProps {
  pas: Pas;
  pasProgress: PasProgress;
  onUpdate: (updatedPalier: "K" | "E" | "A" | "I", value: any) => Promise<void>;
  onResetPalier?: (palierKey: "K" | "E" | "A" | "I") => Promise<void>;
  onResetAll?: () => Promise<void>;
}

export function PalierTimeline({ pas, pasProgress, onUpdate, onResetPalier, onResetAll }: PalierTimelineProps) {
  const [selectedPalier, setSelectedPalier] = useState<"K" | "E" | "A" | "I" | null>(null);
  const [kReps, setKReps] = useState(pasProgress.paliersState.K.repsCompleted.toString());
  const [eTotalReps, setETotalReps] = useState(pasProgress.paliersState.E.totalReps.toString());
  const [eCleanReps, setECleanReps] = useState(pasProgress.paliersState.E.cleanReps.toString());
  const [aAttempts, setAAttempts] = useState(pasProgress.paliersState.A.positionalTest.attempts.toString());
  const [aSuccesses, setASuccesses] = useState(pasProgress.paliersState.A.positionalTest.successes.toString());
  const [iOccurrences, setIOccurrences] = useState(pasProgress.paliersState.I.freeSparringTest.occurrences.toString());

  // Synchroniser les valeurs quand pasProgress change
  useEffect(() => {
    setKReps(pasProgress.paliersState.K.repsCompleted.toString());
    setETotalReps(pasProgress.paliersState.E.totalReps.toString());
    setECleanReps(pasProgress.paliersState.E.cleanReps.toString());
    setAAttempts(pasProgress.paliersState.A.positionalTest.attempts.toString());
    setASuccesses(pasProgress.paliersState.A.positionalTest.successes.toString());
    setIOccurrences(pasProgress.paliersState.I.freeSparringTest.occurrences.toString());
  }, [pasProgress]);

  const paliers = [
    {
      key: "K" as const,
      label: "Connaissance",
      description: "10 répétitions propres d'affilée",
      status: pasProgress.paliersState.K.status,
      progress: pasProgress.paliersState.K.repsCompleted,
      target: 10,
    },
    {
      key: "E" as const,
      label: "Exécution",
      description: "50 reps totales + 10 reps propres",
      status: pasProgress.paliersState.E.status,
      progress: pasProgress.paliersState.E.totalReps,
      target: 50,
    },
    {
      key: "A" as const,
      label: "Application",
      description: `≥ ${pasProgress.paliersState.A.targetRate}% de réussite`,
      status: pasProgress.paliersState.A.status,
      progress: pasProgress.paliersState.A.positionalTest.successRate,
      target: pasProgress.paliersState.A.targetRate,
    },
    {
      key: "I" as const,
      label: "Intégration",
      description: `${pasProgress.paliersState.I.occurrencesMin} occurrence(s) sur ${pasProgress.paliersState.I.sessionsRequired} séances`,
      status: pasProgress.paliersState.I.status,
      progress: pasProgress.paliersState.I.freeSparringTest.occurrences,
      target: pasProgress.paliersState.I.occurrencesMin,
    },
  ];

  const getPalierColor = (status: string) => {
    if (status === "completed") return "bg-green-500";
    if (status === "in_progress") return "bg-purple-500";
    return "bg-gray-600";
  };

  const getPalierRingColor = (status: string) => {
    if (status === "completed") return "ring-green-500/50";
    if (status === "in_progress") return "ring-purple-500/50";
    return "ring-gray-600/30";
  };

  const handlePalierClick = (palierKey: "K" | "E" | "A" | "I") => {
    setSelectedPalier(palierKey);
  };

  const handleUpdatePalier = async () => {
    if (!selectedPalier) return;

    let previousStatus: string;
    let newValue: any;

    if (selectedPalier === "K") {
      previousStatus = pasProgress.paliersState.K.status;
      newValue = parseInt(kReps) || 0;
    } else if (selectedPalier === "E") {
      previousStatus = pasProgress.paliersState.E.status;
      newValue = {
        totalReps: parseInt(eTotalReps) || 0,
        cleanReps: parseInt(eCleanReps) || 0,
      };
    } else if (selectedPalier === "A") {
      previousStatus = pasProgress.paliersState.A.status;
      newValue = {
        attempts: parseInt(aAttempts) || 0,
        successes: parseInt(aSuccesses) || 0,
      };
    } else {
      previousStatus = pasProgress.paliersState.I.status;
      newValue = parseInt(iOccurrences) || 0;
    }

    await onUpdate(selectedPalier, newValue);
    
    // Vérifier si le palier vient d'être complété
    // Note: Cette logique sera gérée dans le composant parent
    setSelectedPalier(null);
  };

  // Calculer le pourcentage de progression pour la ligne de connexion
  const completedCount = paliers.filter((p) => p.status === "completed").length;
  const progressionPercent = (completedCount / paliers.length) * 100;

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Paliers de validation</h2>
          {onResetAll && (
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (confirm("Êtes-vous sûr de vouloir réinitialiser TOUS les paliers à zéro ? Cette action est irréversible.")) {
                  await onResetAll();
                }
              }}
              className="text-xs"
            >
              Reset global
            </Button>
          )}
        </div>
        
        {/* Timeline horizontale */}
        <div className="relative flex items-center justify-between gap-4 py-6 px-2">
          {/* Ligne de connexion de fond (gris) - complète */}
          <div className="absolute left-16 right-16 top-9 h-1 bg-gray-700/30 rounded-full -z-10" />
          
          {/* Ligne de progression (verte) qui s'étend selon les paliers complétés */}
          {completedCount > 0 && (
            <div 
              className="absolute left-16 top-9 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full -z-10 transition-all duration-700 ease-out shadow-lg shadow-green-500/30"
              style={{ 
                width: `calc(${progressionPercent}% - 4rem)`,
                maxWidth: 'calc(100% - 8rem)'
              }}
            />
          )}
          
          {paliers.map((palier, index) => {
            const previousCompleted = index === 0 || paliers[index - 1].status === "completed";
            const isCompleted = palier.status === "completed";
            const isInProgress = palier.status === "in_progress";
            
            return (
            <div key={palier.key} className="relative flex-1 flex flex-col items-center z-10">
              
              {/* Nœud cliquable */}
              <button
                onClick={() => handlePalierClick(palier.key)}
                className={`relative w-14 h-14 rounded-full ${getPalierColor(palier.status)} ${getPalierRingColor(palier.status)} ring-4 transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer shadow-lg`}
                title={`${palier.label}: ${palier.description}`}
              >
                {palier.status === "completed" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white text-xl font-bold"
                  >
                    ✓
                  </motion.div>
                ) : palier.status === "in_progress" ? (
                  <div className="text-white text-xs font-semibold">
                    {Math.round((palier.progress / palier.target) * 100)}%
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs font-semibold">
                    {palier.key}
                  </div>
                )}
                
                {/* Effet de brillance pour les paliers complétés */}
                {palier.status === "completed" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </button>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-gray-300">{palier.label}</div>
                {palier.status === "completed" && (
                  <Badge variant="green" size="sm" className="mt-1">
                    ✓
                  </Badge>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Modal pour éditer un palier */}
        <Modal
          isOpen={selectedPalier !== null}
          onClose={() => setSelectedPalier(null)}
          title={
            selectedPalier
              ? `Palier ${selectedPalier} - ${paliers.find((p) => p.key === selectedPalier)?.label}`
              : ""
          }
          size="sm"
        >
          <div className="space-y-4">
            {selectedPalier === "K" && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  10 répétitions propres d&apos;affilée (vitesse lente)
                </p>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={kReps}
                    onChange={(e) => setKReps(e.target.value)}
                    placeholder="0-10"
                    label="Répétitions"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {[1, 5, 10].map((value) => (
                      <Button
                        key={value}
                        variant={parseInt(kReps) === value ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setKReps(value.toString())}
                        className="flex-1 min-w-[60px]"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedPalier === "E" && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  50 reps totales + 10 reps propres à vitesse normale
                </p>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min="0"
                    value={eTotalReps}
                    onChange={(e) => setETotalReps(e.target.value)}
                    placeholder="0"
                    label="Total reps"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={eCleanReps}
                    onChange={(e) => setECleanReps(e.target.value)}
                    placeholder="0"
                    label="Reps propres"
                  />
                </div>
              </>
            )}

            {selectedPalier === "A" && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Positional sparring: ≥ {pasProgress.paliersState.A.targetRate}% de réussite
                </p>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min="0"
                    value={aAttempts}
                    onChange={(e) => setAAttempts(e.target.value)}
                    placeholder="0"
                    label="Tentatives"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={aSuccesses}
                    onChange={(e) => setASuccesses(e.target.value)}
                    placeholder="0"
                    label="Réussites"
                  />
                </div>
              </>
            )}

            {selectedPalier === "I" && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Sparring libre: ≥ {pasProgress.paliersState.I.occurrencesMin} occurrence(s) sur{" "}
                  {pasProgress.paliersState.I.sessionsRequired} séances
                </p>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min="0"
                    value={iOccurrences}
                    onChange={(e) => setIOccurrences(e.target.value)}
                    placeholder="Occurrences"
                    label="Occurrences"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {onResetPalier && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={async () => {
                    if (selectedPalier && confirm(`Êtes-vous sûr de vouloir réinitialiser le palier ${selectedPalier} ?`)) {
                      await onResetPalier(selectedPalier);
                      setSelectedPalier(null);
                    }
                  }}
                  className="flex-1"
                >
                  Reset
                </Button>
              )}
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setSelectedPalier(null)}
              >
                Annuler
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleUpdatePalier}>
                Mettre à jour
              </Button>
            </div>
          </div>
        </Modal>
      </div>
  );
}
