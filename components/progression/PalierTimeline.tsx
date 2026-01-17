"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Info } from "@phosphor-icons/react";
import { Pas, PasProgress } from "@/lib/progression/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { useAlertDialog } from "@/hooks/useAlertDialog";

interface PalierTimelineProps {
  pas: Pas;
  pasProgress: PasProgress;
  onUpdate: (updatedPalier: "K" | "E" | "A" | "I", value: any) => Promise<void>;
  onResetPalier?: (palierKey: "K" | "E" | "A" | "I") => Promise<void>;
  onResetAll?: () => Promise<void>;
}

export function PalierTimeline({ pas, pasProgress, onUpdate, onResetPalier, onResetAll }: PalierTimelineProps) {
  const [selectedPalier, setSelectedPalier] = useState<"K" | "E" | "A" | "I" | null>(null);
  const { alertState, showAlert, closeAlert, confirmAlert } = useAlertDialog();
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
              onClick={() => {
                showAlert(
                  "Êtes-vous sûr de vouloir réinitialiser TOUS les paliers à zéro ? Cette action est irréversible.",
                  async () => {
                    await onResetAll();
                  },
                  {
                    title: "Reset global",
                    variant: "danger",
                  }
                );
              }}
              className="text-xs"
            >
              Reset global
            </Button>
          )}
        </div>
        
        {/* Timeline horizontale */}
        <div className="relative flex items-center justify-between gap-4 py-6 px-2">
          {/* Ligne de connexion de fond (gris) - complète et visible */}
          {/* Position au centre vertical des nœuds (56px / 2 = 28px) + padding top (24px) */}
          <div 
            className="absolute left-14 right-14 h-1.5 bg-gray-600/70 rounded-full"
            style={{ 
              top: '52px', // Centre du premier nœud (24px padding + 28px centre)
            }}
          />
          
          {/* Ligne de progression (verte) qui s'étend selon les paliers complétés */}
          {completedCount > 0 && (
            <div 
              className="absolute left-14 h-1.5 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full transition-all duration-700 ease-out"
              style={{ 
                top: '52px', // Même position que la ligne de fond
                width: `${progressionPercent}%`,
                maxWidth: 'calc(100% - 7rem)',
                boxShadow: '0 2px 12px rgba(34, 197, 94, 0.7), 0 0 16px rgba(34, 197, 94, 0.4)'
              }}
            />
          )}
          
          {paliers.map((palier, index) => {
            const previousCompleted = index === 0 || paliers[index - 1].status === "completed";
            const isCompleted = palier.status === "completed";
            const isInProgress = palier.status === "in_progress";
            
            return (
            <div key={palier.key} className="relative flex-1 flex flex-col items-center" style={{ zIndex: 10 }}>
              
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
                <div className="mb-4 p-3 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Info size={18} className="text-accent-cyan mt-0.5 flex-shrink-0" weight="fill" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">Comment valider ce palier ?</p>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Le palier <strong>Connaissance</strong> valide que tu comprends la technique. Tu dois exécuter <strong>10 répétitions propres d&apos;affilée</strong> à vitesse lente, sans erreur majeure. 
                        Les boutons (1, 5, 10) définissent directement le nombre de répétitions réussies.
                      </p>
                    </div>
                  </div>
                </div>
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
                <div className="mb-4 p-3 bg-accent-purple/10 border border-accent-purple/30 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Info size={18} className="text-accent-purple mt-0.5 flex-shrink-0" weight="fill" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">Comment valider ce palier ?</p>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        Le palier <strong>Exécution</strong> valide que tu maîtrises la technique en mouvement normal contre un partenaire coopératif.
                      </p>
                      <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                        <li><strong>Total reps</strong> : Clique sur +10 ou +50 pour additionner les répétitions effectuées (objectif : 50)</li>
                        <li><strong>Reps propres</strong> : Clique sur +10 ou +50 pour additionner les répétitions sans erreur (objectif : 10)</li>
                        <li>Les deux critères doivent être atteints pour valider</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Total reps</label>
                    {/* Boutons d'addition */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => {
                          const current = parseInt(eTotalReps) || 0;
                          setETotalReps((current + 10).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => {
                          const current = parseInt(eTotalReps) || 0;
                          setETotalReps((current + 50).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +50
                      </button>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={eTotalReps}
                      onChange={(e) => setETotalReps(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Reps propres</label>
                    {/* Boutons d'addition */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => {
                          const current = parseInt(eCleanReps) || 0;
                          setECleanReps((current + 10).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => {
                          const current = parseInt(eCleanReps) || 0;
                          setECleanReps((current + 50).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +50
                      </button>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={eCleanReps}
                      onChange={(e) => setECleanReps(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </>
            )}

            {selectedPalier === "A" && (
              <>
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Info size={18} className="text-green-400 mt-0.5 flex-shrink-0" weight="fill" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">Comment valider ce palier ?</p>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        Le palier <strong>Application</strong> valide que tu utilises la technique en <strong>positional sparring</strong> (situation d&apos;opposition contrôlée).
                      </p>
                      <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                        <li><strong>Tentatives</strong> : Nombre de fois où tu as tenté la technique (clique sur +10 ou +50)</li>
                        <li><strong>Réussites</strong> : Nombre de fois où la technique a fonctionné (clique sur +10 ou +50)</li>
                        <li>Objectif : atteindre <strong>≥ {pasProgress.paliersState.A.targetRate}% de réussite</strong></li>
                        <li>Exemple : 10 tentatives, 4 réussites = 40% ✓</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Tentatives</label>
                    {/* Boutons d'addition */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => {
                          const current = parseInt(aAttempts) || 0;
                          setAAttempts((current + 10).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => {
                          const current = parseInt(aAttempts) || 0;
                          setAAttempts((current + 50).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +50
                      </button>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={aAttempts}
                      onChange={(e) => setAAttempts(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Réussites</label>
                    {/* Boutons d'addition */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => {
                          const current = parseInt(aSuccesses) || 0;
                          const maxAttempts = parseInt(aAttempts) || 0;
                          setASuccesses(Math.min(current + 10, maxAttempts).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => {
                          const current = parseInt(aSuccesses) || 0;
                          const maxAttempts = parseInt(aAttempts) || 0;
                          setASuccesses(Math.min(current + 50, maxAttempts).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +50
                      </button>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={aSuccesses}
                      onChange={(e) => setASuccesses(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </>
            )}

            {selectedPalier === "I" && (
              <>
                <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Info size={18} className="text-indigo-400 mt-0.5 flex-shrink-0" weight="fill" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">Comment valider ce palier ?</p>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        Le palier <strong>Intégration</strong> valide que la technique est devenue naturelle en <strong>sparring libre</strong> (situation réelle).
                      </p>
                      <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                        <li><strong>Occurrences</strong> : Nombre de fois où tu as utilisé la technique avec succès en sparring libre (clique sur +10 ou +50)</li>
                        <li>Objectif : <strong>≥ {pasProgress.paliersState.I.occurrencesMin} occurrence(s)</strong> sur <strong>{pasProgress.paliersState.I.sessionsRequired} séances différentes</strong></li>
                        <li>Chaque occurrence doit être sur une séance différente pour valider</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Occurrences</label>
                    {/* Boutons d'addition */}
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => {
                          const current = parseInt(iOccurrences) || 0;
                          setIOccurrences((current + 10).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => {
                          const current = parseInt(iOccurrences) || 0;
                          setIOccurrences((current + 50).toString());
                        }}
                        className="w-12 h-12 rounded-full bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/50 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center"
                      >
                        +50
                      </button>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={iOccurrences}
                      onChange={(e) => setIOccurrences(e.target.value)}
                      placeholder="Occurrences"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {onResetPalier && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (selectedPalier) {
                      showAlert(
                        `Êtes-vous sûr de vouloir réinitialiser le palier ${selectedPalier} ?`,
                        async () => {
                          await onResetPalier(selectedPalier);
                          setSelectedPalier(null);
                        },
                        {
                          title: `Reset palier ${selectedPalier}`,
                          variant: "danger",
                        }
                      );
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

        {/* Alert Dialog */}
        <AlertDialog
          isOpen={alertState.isOpen}
          onClose={closeAlert}
          onConfirm={confirmAlert}
          title={alertState.title}
          message={alertState.message}
          variant={alertState.variant}
          confirmText="Confirmer"
          cancelText="Annuler"
        />
      </div>
  );
}
