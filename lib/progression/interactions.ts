/**
 * Helpers pour les interactions "zéro bureautique"
 * Swipe, hold-to-confirm, combo builder, boss fight
 */

import { SwipeAction } from "./types";

// ============================================================================
// Swipe gestures
// ============================================================================

export interface SwipeResult {
  direction: "left" | "right" | "up" | "down" | null;
  distance: number;
  velocity: number;
}

/**
 * Détecte un swipe depuis les coordonnées de début et fin
 */
export function detectSwipe(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  minDistance: number = 50
): SwipeResult | null {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance < minDistance) {
    return null;
  }

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX > absY) {
    // Swipe horizontal
    return {
      direction: deltaX > 0 ? "right" : "left",
      distance: absX,
      velocity: absX / 100, // Approximation
    };
  } else {
    // Swipe vertical
    return {
      direction: deltaY > 0 ? "down" : "up",
      distance: absY,
      velocity: absY / 100, // Approximation
    };
  }
}

/**
 * Détermine si un swipe est "court" ou "long"
 * Court = log activité, Long = test terminé
 */
export function getSwipeType(swipe: SwipeResult): "short" | "long" {
  const SHORT_THRESHOLD = 100;
  return swipe.distance < SHORT_THRESHOLD ? "short" : "long";
}

// ============================================================================
// Hold to confirm
// ============================================================================

export interface HoldToConfirmState {
  isHolding: boolean;
  progress: number; // 0-100
  startTime: number | null;
}

const HOLD_DURATION_MS = 1200; // 1.2 secondes

/**
 * Initialise l'état de hold-to-confirm
 */
export function initHoldToConfirm(): HoldToConfirmState {
  return {
    isHolding: false,
    progress: 0,
    startTime: null,
  };
}

/**
 * Démarre le hold
 */
export function startHold(): HoldToConfirmState {
  return {
    isHolding: true,
    progress: 0,
    startTime: Date.now(),
  };
}

/**
 * Met à jour le progress du hold
 */
export function updateHoldProgress(
  state: HoldToConfirmState
): HoldToConfirmState {
  if (!state.isHolding || !state.startTime) {
    return state;
  }

  const elapsed = Date.now() - state.startTime;
  const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);

  return {
    ...state,
    progress,
  };
}

/**
 * Vérifie si le hold est complété
 */
export function isHoldCompleted(state: HoldToConfirmState): boolean {
  return state.progress >= 100;
}

/**
 * Arrête le hold
 */
export function stopHold(): HoldToConfirmState {
  return initHoldToConfirm();
}

// ============================================================================
// Combo builder
// ============================================================================

export interface ComboAction {
  id: string;
  label: string;
  order: number; // Ordre attendu dans la séquence
}

/**
 * Valide une séquence de combo
 */
export function validateComboSequence(
  sequence: string[],
  correctSequence: string[]
): boolean {
  if (sequence.length !== correctSequence.length) {
    return false;
  }

  return sequence.every((actionId, index) => actionId === correctSequence[index]);
}

/**
 * Calcule le score d'un combo (pourcentage de bonnes actions)
 */
export function calculateComboScore(
  sequence: string[],
  correctSequence: string[]
): number {
  if (sequence.length === 0) {
    return 0;
  }

  let correct = 0;
  const minLength = Math.min(sequence.length, correctSequence.length);

  for (let i = 0; i < minLength; i++) {
    if (sequence[i] === correctSequence[i]) {
      correct++;
    }
  }

  return Math.round((correct / correctSequence.length) * 100);
}

// ============================================================================
// Boss fight helpers
// ============================================================================

export interface BossFightState {
  attempts: number;
  successes: number;
  failures: number;
  currentHP: number; // HP du boss (100 = full, 0 = defeated)
}

const BOSS_MAX_HP = 100;
const BOSS_ATTEMPTS = 10;

/**
 * Initialise l'état d'un boss fight
 */
export function initBossFight(): BossFightState {
  return {
    attempts: 0,
    successes: 0,
    failures: 0,
    currentHP: BOSS_MAX_HP,
  };
}

/**
 * Enregistre une tentative de boss fight
 */
export function recordBossAttempt(
  state: BossFightState,
  success: boolean
): BossFightState {
  const newAttempts = state.attempts + 1;
  const newSuccesses = success ? state.successes + 1 : state.successes;
  const newFailures = success ? state.failures : state.failures + 1;

  // Calculer le HP restant (chaque succès réduit de 10 HP)
  const hpPerSuccess = BOSS_MAX_HP / BOSS_ATTEMPTS;
  const newHP = Math.max(0, BOSS_MAX_HP - newSuccesses * hpPerSuccess);

  return {
    attempts: newAttempts,
    successes: newSuccesses,
    failures: newFailures,
    currentHP: newHP,
  };
}

/**
 * Vérifie si le boss fight est terminé
 */
export function isBossFightComplete(state: BossFightState): boolean {
  return state.attempts >= BOSS_ATTEMPTS || state.currentHP <= 0;
}

/**
 * Calcule le score final du boss fight
 */
export function calculateBossFightScore(state: BossFightState): number {
  if (state.attempts === 0) {
    return 0;
  }
  return Math.round((state.successes / state.attempts) * 100);
}

// ============================================================================
// Helpers pour animations
// ============================================================================

/**
 * Calcule la position d'un élément pour animation "XP qui vole"
 */
export function calculateXPFlightPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  progress: number // 0-1
): { x: number; y: number } {
  // Courbe de Bézier simple pour un vol fluide
  const controlX = (startX + endX) / 2;
  const controlY = startY - 50; // Arc vers le haut

  const t = progress;
  const x =
    (1 - t) * (1 - t) * startX +
    2 * (1 - t) * t * controlX +
    t * t * endX;
  const y =
    (1 - t) * (1 - t) * startY +
    2 * (1 - t) * t * controlY +
    t * t * endY;

  return { x, y };
}

/**
 * Génère une couleur aléatoire pour les particules
 */
export function getRandomParticleColor(): string {
  const colors = [
    "#a855f7", // purple
    "#22d3ee", // cyan
    "#a3e635", // lime
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
