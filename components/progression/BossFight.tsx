"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Particles from "react-tsparticles";
import { loadConfettiPreset } from "tsparticles-preset-confetti";
import type { Engine } from "tsparticles-engine";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  initBossFight,
  recordBossAttempt,
  isBossFightComplete,
  calculateBossFightScore,
  type BossFightState,
} from "@/lib/progression/interactions";
import {
  calculateBossFightMedal,
  createBossFightResult,
  XP_REWARDS,
  TOKEN_REWARDS,
} from "@/lib/progression/gamification";
import type { BossMedal } from "@/lib/progression/types";

interface BossFightProps {
  cycle: number;
  onComplete: (result: {
    cycle: number;
    score: number;
    medal: BossMedal;
    attempts: number;
    successes: number;
  }) => void;
}

export function BossFight({ cycle, onComplete }: BossFightProps) {
  const [state, setState] = useState<BossFightState>(initBossFight());
  const [showConfetti, setShowConfetti] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadConfettiPreset(engine);
  }, []);

  const handleAttempt = (success: boolean) => {
    if (isComplete) {
      return;
    }

    const newState = recordBossAttempt(state, success);
    setState(newState);

    if (isBossFightComplete(newState)) {
      setIsComplete(true);
      const score = calculateBossFightScore(newState);
      const medal = calculateBossFightMedal(newState.successes, newState.attempts);

      setShowConfetti(true);
      setTimeout(() => {
        onComplete({
          cycle,
          score,
          medal,
          attempts: newState.attempts,
          successes: newState.successes,
        });
      }, 2000);
    }
  };

  const medalColors = {
    bronze: "text-amber-600",
    argent: "text-gray-300",
    or: "text-yellow-400",
  };

  const medalIcons = {
    bronze: "🥉",
    argent: "🥈",
    or: "🥇",
  };

  const currentMedal =
    state.attempts > 0
      ? calculateBossFightMedal(state.successes, state.attempts)
      : null;

  return (
    <div className="relative">
      <Card variant="elevated" className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Boss Fight - Cycle {cycle}</h2>
          <p className="text-gray-400">
            {10 - state.attempts} tentatives restantes
          </p>
        </div>

        {/* Barre HP du boss */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">HP du Boss</span>
            <span className="text-sm text-gray-400">{Math.round(state.currentHP)}%</span>
          </div>
          <div className="w-full h-4 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 to-red-400"
              initial={{ width: "100%" }}
              animate={{ width: `${state.currentHP}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{state.attempts}</div>
            <div className="text-xs text-gray-400">Tentatives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{state.successes}</div>
            <div className="text-xs text-gray-400">Réussites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{state.failures}</div>
            <div className="text-xs text-gray-400">Échecs</div>
          </div>
        </div>

        {/* Médaille actuelle */}
        {currentMedal && (
          <div className="mb-6 text-center">
            <div className="text-4xl mb-2">{medalIcons[currentMedal]}</div>
            <div className={`text-lg font-bold ${medalColors[currentMedal]}`}>
              Médaille {currentMedal === "or" ? "Or" : currentMedal === "argent" ? "Argent" : "Bronze"}
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        {!isComplete && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="secondary"
              onClick={() => handleAttempt(false)}
              className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
            >
              ❌ Échec
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAttempt(true)}
              className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
            >
              ✅ Réussite
            </Button>
          </div>
        )}

        {/* Résultat final */}
        {isComplete && currentMedal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-6"
          >
            <div className="text-6xl mb-4">{medalIcons[currentMedal]}</div>
            <div className={`text-3xl font-bold mb-2 ${medalColors[currentMedal]}`}>
              Médaille {currentMedal === "or" ? "Or" : currentMedal === "argent" ? "Argent" : "Bronze"}
            </div>
            <div className="text-lg text-gray-300 mb-4">
              Score: {calculateBossFightScore(state)}%
            </div>
            <div className="text-sm text-gray-400">
              +{XP_REWARDS[`BOSS_FIGHT_${currentMedal.toUpperCase() as "BRONZE" | "ARGENT" | "OR"}`]} XP
              {" • "}
              +{TOKEN_REWARDS[`BOSS_FIGHT_${currentMedal.toUpperCase() as "BRONZE" | "ARGENT" | "OR"}`]} Tokens
            </div>
          </motion.div>
        )}
      </Card>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            <Particles
              id="confetti"
              init={particlesInit}
              options={{
                preset: "confetti",
                particles: {
                  number: {
                    value: 100,
                  },
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
