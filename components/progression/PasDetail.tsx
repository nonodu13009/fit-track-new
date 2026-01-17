"use client";

import { useState } from "react";
import { Pas, PasProgress, UserProgress } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { canPasBeValidated } from "@/lib/progression/compute";
import { validatePalierK, validatePalierE, validatePalierA, validatePalierI } from "@/lib/progression/validation";
import { calculateMasteryTier } from "@/lib/progression/validation";
import { HoldToConfirm } from "./HoldToConfirm";
import { MasteryBadge } from "./MasteryBadge";
import { useToast } from "@/hooks/useToast";

interface PasDetailProps {
  pas: Pas;
  progress: UserProgress;
  onUpdate: (updatedProgress: UserProgress) => Promise<void>;
}

export function PasDetail({ pas, progress, onUpdate }: PasDetailProps) {
  const { success } = useToast();
  const pasProgress: PasProgress = progress.pas[pas.id] || {
    paliersState: {
      K: { status: "not_started", repsCompleted: 0 },
      E: { status: "not_started", totalReps: 0, cleanReps: 0 },
      A: {
        status: "not_started",
        positionalTest: { attempts: 0, successes: 0, successRate: 0, sessions: [] },
        targetRate: pas.validationCriteria.positionalTest.targetRate,
      },
      I: {
        status: "not_started",
        freeSparringTest: { rounds: 0, occurrences: 0, sessions: [] },
        occurrencesMin: pas.validationCriteria.freeSparringTest.occurrencesMin,
        sessionsRequired: pas.validationCriteria.stability.sessionsRequired,
      },
    },
    updatedAt: new Date().toISOString(),
    volumeCompleted: 0,
    sessions: [],
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const masteryTier = calculateMasteryTier(pas, pasProgress);

  // État pour les inputs des paliers
  const [kReps, setKReps] = useState(pasProgress.paliersState.K.repsCompleted.toString());
  const [eTotalReps, setETotalReps] = useState(pasProgress.paliersState.E.totalReps.toString());
  const [eCleanReps, setECleanReps] = useState(pasProgress.paliersState.E.cleanReps.toString());
  const [aAttempts, setAAttempts] = useState(pasProgress.paliersState.A.positionalTest.attempts.toString());
  const [aSuccesses, setASuccesses] = useState(pasProgress.paliersState.A.positionalTest.successes.toString());
  const [iOccurrences, setIOccurrences] = useState(pasProgress.paliersState.I.freeSparringTest.occurrences.toString());

  const handleUpdatePalierK = async () => {
    const reps = parseInt(kReps) || 0;
    if (reps < 0 || reps > 10) return;

    setIsUpdating(true);
    try {
      const updatedK = validatePalierK(pasProgress.paliersState.K, reps);
      const updatedPasProgress: PasProgress = {
        ...pasProgress,
        paliersState: {
          ...pasProgress.paliersState,
          K: updatedK,
        },
        updatedAt: new Date().toISOString(),
        volumeCompleted: pasProgress.volumeCompleted + reps,
      };

      const updatedProgress: UserProgress = {
        ...progress,
        pas: {
          ...progress.pas,
          [pas.id]: updatedPasProgress,
        },
      };

      await onUpdate(updatedProgress);
      success("Palier K mis à jour !");
      setKReps(updatedK.repsCompleted.toString());
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePalierE = async () => {
    const totalReps = parseInt(eTotalReps) || 0;
    const cleanReps = parseInt(eCleanReps) || 0;
    if (totalReps < 0 || cleanReps < 0 || cleanReps > totalReps) return;

    setIsUpdating(true);
    try {
      const updatedE = validatePalierE(pasProgress.paliersState.E, totalReps, cleanReps);
      const updatedPasProgress: PasProgress = {
        ...pasProgress,
        paliersState: {
          ...pasProgress.paliersState,
          E: updatedE,
        },
        updatedAt: new Date().toISOString(),
        volumeCompleted: pasProgress.volumeCompleted + totalReps,
      };

      const updatedProgress: UserProgress = {
        ...progress,
        pas: {
          ...progress.pas,
          [pas.id]: updatedPasProgress,
        },
      };

      await onUpdate(updatedProgress);
      success("Palier E mis à jour !");
      setETotalReps(updatedE.totalReps.toString());
      setECleanReps(updatedE.cleanReps.toString());
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePalierA = async () => {
    const attempts = parseInt(aAttempts) || 0;
    const successes = parseInt(aSuccesses) || 0;
    if (attempts < 0 || successes < 0 || successes > attempts) return;

    setIsUpdating(true);
    try {
      const sessionDate = new Date().toISOString().split("T")[0];
      const updatedA = validatePalierA(
        pasProgress.paliersState.A,
        attempts - pasProgress.paliersState.A.positionalTest.attempts,
        successes - pasProgress.paliersState.A.positionalTest.successes,
        sessionDate
      );
      const updatedPasProgress: PasProgress = {
        ...pasProgress,
        paliersState: {
          ...pasProgress.paliersState,
          A: updatedA,
        },
        updatedAt: new Date().toISOString(),
        sessions: [...new Set([...pasProgress.sessions, sessionDate])],
      };

      const updatedProgress: UserProgress = {
        ...progress,
        pas: {
          ...progress.pas,
          [pas.id]: updatedPasProgress,
        },
      };

      await onUpdate(updatedProgress);
      success("Palier A mis à jour !");
      setAAttempts(updatedA.positionalTest.attempts.toString());
      setASuccesses(updatedA.positionalTest.successes.toString());
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePalierI = async () => {
    const occurrences = parseInt(iOccurrences) || 0;
    if (occurrences < 0) return;

    setIsUpdating(true);
    try {
      const sessionDate = new Date().toISOString().split("T")[0];
      const updatedI = validatePalierI(
        pasProgress.paliersState.I,
        occurrences - pasProgress.paliersState.I.freeSparringTest.occurrences,
        sessionDate
      );
      const updatedPasProgress: PasProgress = {
        ...pasProgress,
        paliersState: {
          ...pasProgress.paliersState,
          I: updatedI,
        },
        updatedAt: new Date().toISOString(),
        sessions: [...new Set([...pasProgress.sessions, sessionDate])],
      };

      const updatedProgress: UserProgress = {
        ...progress,
        pas: {
          ...progress.pas,
          [pas.id]: updatedPasProgress,
        },
      };

      await onUpdate(updatedProgress);
      success("Palier I mis à jour !");
      setIOccurrences(updatedI.freeSparringTest.occurrences.toString());
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleValidate = async () => {
    if (!canPasBeValidated(pas, progress)) {
      return;
    }

    setIsUpdating(true);
    try {
      const updatedPasProgress: PasProgress = {
        ...pasProgress,
        validatedAt: new Date().toISOString(),
        masteryTier: masteryTier || "bronze",
        updatedAt: new Date().toISOString(),
      };

      const updatedProgress: UserProgress = {
        ...progress,
        pas: {
          ...progress.pas,
          [pas.id]: updatedPasProgress,
        },
      };

      await onUpdate(updatedProgress);
      success("Pas validé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const canValidate = canPasBeValidated(pas, progress);
  const blockedMessage = !canValidate
    ? "Tous les paliers doivent être complétés"
    : undefined;

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-gray-500">
              Cycle {pas.cycle} • Sem. {pas.week} • Pas {pas.order}
            </span>
            {masteryTier && <MasteryBadge tier={masteryTier} size="sm" />}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{pas.title}</h1>
          <div className="text-sm text-gray-400 mb-4">
            Type: <Badge variant="cyan" size="sm">{pas.type}</Badge>
          </div>
        </div>

        {/* Objectifs */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Objectifs</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {pas.objectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* Checkpoints */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Keypoints</h2>
          <p className="text-xs text-gray-500 mb-3">
            Points clés à vérifier lors de l&apos;exécution
          </p>
          <div className="space-y-2">
            {pas.checkpoints.map((checkpoint, idx) => {
              const isChecked =
                pasProgress.paliersState.K.status === "completed" ||
                pasProgress.paliersState.E.status === "completed";
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    isChecked
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-surface/50 border-white/10"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      isChecked
                        ? "bg-green-500 text-white"
                        : "bg-gray-600 border-2 border-gray-500"
                    }`}
                  >
                    {isChecked && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          isChecked ? "text-gray-200" : "text-gray-400"
                        }`}
                      >
                        {checkpoint.label}
                      </span>
                      {checkpoint.youtubeUrl && (
                        <a
                          href={checkpoint.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-red-500 hover:text-red-400 transition-colors"
                          title="Rechercher sur YouTube"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>
                      )}
                    </div>
                    {checkpoint.explanation && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        {checkpoint.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Paliers */}
        <div className="mb-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Paliers de validation</h2>

          {/* Palier K */}
          <div className="p-4 bg-surface rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">K - Connaissance</h3>
              <Badge
                variant={
                  pasProgress.paliersState.K.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.K.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.K.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.K.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              10 répétitions propres d&apos;affilée (vitesse lente)
            </p>
            <div className="text-xs text-gray-500 mb-3">
              Répétitions complétées: {pasProgress.paliersState.K.repsCompleted} / 10
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setKReps(Math.max(0, parseInt(kReps) || 0 - 1).toString())}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  −
                </Button>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={kReps}
                  onChange={(e) => setKReps(e.target.value)}
                  placeholder="0-10"
                  className="flex-1 text-center text-lg font-semibold"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setKReps(Math.min(10, (parseInt(kReps) || 0) + 1).toString())}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  +
                </Button>
              </div>
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
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdatePalierK}
                disabled={isUpdating}
                className="w-full"
              >
                Mettre à jour
              </Button>
            </div>
          </div>

          {/* Palier E */}
          <div className="p-4 bg-surface rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">E - Exécution</h3>
              <Badge
                variant={
                  pasProgress.paliersState.E.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.E.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.E.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.E.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              50 reps totales + 10 reps propres à vitesse normale
            </p>
            <div className="text-xs text-gray-500 mb-3">
              Total: {pasProgress.paliersState.E.totalReps} / 50 • Propre:{" "}
              {pasProgress.paliersState.E.cleanReps} / 10
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Total reps</label>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setETotalReps(Math.max(0, (parseInt(eTotalReps) || 0) - 5).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    −5
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    value={eTotalReps}
                    onChange={(e) => setETotalReps(e.target.value)}
                    placeholder="0"
                    className="flex-1 text-center text-lg font-semibold"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setETotalReps(((parseInt(eTotalReps) || 0) + 5).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +5
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[10, 25, 50].map((value) => (
                    <Button
                      key={value}
                      variant={parseInt(eTotalReps) === value ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setETotalReps(value.toString())}
                      className="flex-1 min-w-[70px]"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Reps propres</label>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setECleanReps(Math.max(0, (parseInt(eCleanReps) || 0) - 1).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    value={eCleanReps}
                    onChange={(e) => setECleanReps(e.target.value)}
                    placeholder="0"
                    className="flex-1 text-center text-lg font-semibold"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setECleanReps(((parseInt(eCleanReps) || 0) + 1).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[5, 10, 15].map((value) => (
                    <Button
                      key={value}
                      variant={parseInt(eCleanReps) === value ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setECleanReps(value.toString())}
                      className="flex-1 min-w-[60px]"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdatePalierE}
                disabled={isUpdating}
                className="w-full"
              >
                Mettre à jour
              </Button>
            </div>
          </div>

          {/* Palier A */}
          <div className="p-4 bg-surface rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">A - Application</h3>
              <Badge
                variant={
                  pasProgress.paliersState.A.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.A.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.A.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.A.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Positional sparring: ≥ {pasProgress.paliersState.A.targetRate}% de réussite
            </p>
            <div className="text-xs text-gray-500 mb-3">
              Taux: {pasProgress.paliersState.A.positionalTest.successRate}% (
              {pasProgress.paliersState.A.positionalTest.successes} /{" "}
              {pasProgress.paliersState.A.positionalTest.attempts})
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Tentatives</label>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setAAttempts(Math.max(0, (parseInt(aAttempts) || 0) - 1).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    value={aAttempts}
                    onChange={(e) => setAAttempts(e.target.value)}
                    placeholder="0"
                    className="flex-1 text-center text-lg font-semibold"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setAAttempts(((parseInt(aAttempts) || 0) + 1).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[5, 10, 20].map((value) => (
                    <Button
                      key={value}
                      variant={parseInt(aAttempts) === value ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setAAttempts(value.toString())}
                      className="flex-1 min-w-[60px]"
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Réussites</label>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setASuccesses(Math.max(0, (parseInt(aSuccesses) || 0) - 1).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    value={aSuccesses}
                    onChange={(e) => setASuccesses(e.target.value)}
                    placeholder="0"
                    className="flex-1 text-center text-lg font-semibold"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setASuccesses(Math.min(parseInt(aAttempts) || 0, (parseInt(aSuccesses) || 0) + 1).toString())}
                    className="w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[2, 5, 10].map((value) => (
                    <Button
                      key={value}
                      variant={parseInt(aSuccesses) === value ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setASuccesses(Math.min(parseInt(aAttempts) || 0, value).toString())}
                      className="flex-1 min-w-[60px]"
                      disabled={value > (parseInt(aAttempts) || 0)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdatePalierA}
                disabled={isUpdating}
                className="w-full"
              >
                Mettre à jour
              </Button>
            </div>
          </div>

          {/* Palier I */}
          <div className="p-4 bg-surface rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">I - Intégration</h3>
              <Badge
                variant={
                  pasProgress.paliersState.I.status === "completed"
                    ? "green"
                    : pasProgress.paliersState.I.status === "in_progress"
                      ? "purple"
                      : "gray"
                }
                size="sm"
              >
                {pasProgress.paliersState.I.status === "completed"
                  ? "Complété"
                  : pasProgress.paliersState.I.status === "in_progress"
                    ? "En cours"
                    : "Non commencé"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              Sparring libre: ≥ {pasProgress.paliersState.I.occurrencesMin} occurrence(s) sur{" "}
              {pasProgress.paliersState.I.sessionsRequired} séances
            </p>
            <div className="text-xs text-gray-500 mb-3">
              Occurrences: {pasProgress.paliersState.I.freeSparringTest.occurrences} /
              {pasProgress.paliersState.I.occurrencesMin} • Séances:{" "}
              {new Set(pasProgress.paliersState.I.freeSparringTest.sessions).size} /
              {pasProgress.paliersState.I.sessionsRequired}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIOccurrences(Math.max(0, (parseInt(iOccurrences) || 0) - 1).toString())}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  −
                </Button>
                <Input
                  type="number"
                  min="0"
                  value={iOccurrences}
                  onChange={(e) => setIOccurrences(e.target.value)}
                  placeholder="Occurrences"
                  className="flex-1 text-center text-lg font-semibold"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIOccurrences(((parseInt(iOccurrences) || 0) + 1).toString())}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  +
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3].map((value) => (
                  <Button
                    key={value}
                    variant={parseInt(iOccurrences) === value ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setIOccurrences(value.toString())}
                    className="flex-1 min-w-[60px]"
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdatePalierI}
                disabled={isUpdating}
                className="w-full"
              >
                Mettre à jour
              </Button>
            </div>
          </div>
        </div>

        {/* Validation */}
        <HoldToConfirm
          onConfirm={handleValidate}
          disabled={isUpdating || !canValidate}
          blocked={!canValidate}
          blockedMessage={blockedMessage}
        >
          <Button
            variant="primary"
            disabled={isUpdating || !canValidate}
            className="w-full"
          >
            {isUpdating ? "Validation..." : "Valider le pas"}
          </Button>
        </HoldToConfirm>
      </Card>
    </div>
  );
}
