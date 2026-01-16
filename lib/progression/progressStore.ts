/**
 * Store de progression avec localStorage et Firestore fallback
 * Système Gracie Barra avec pas/cycles
 */

"use client";

import { UserProgress, Gamification } from "./types";
import { getDocument, updateDocument, createDocument } from "@/lib/firebase/firestore";
import { recalculateGamification } from "./gamification";
import { migrateIfNeeded } from "./migration";

const STORAGE_KEY = "jjb-progression";
const FIRESTORE_COLLECTION = "progression";

/**
 * Initialise une progression vide
 */
export function createEmptyProgress(): UserProgress {
  return {
    pas: {},
    gamification: {
      xpTotal: 0,
      level: 1,
      tokens: 0,
      streak: 0,
      streakFreeze: 0,
      badges: [],
      mastery: {},
      bossFights: {},
    },
    quests: [],
    log: [],
  };
}

/**
 * Charge la progression depuis localStorage
 */
export function loadProgressFromLocalStorage(): UserProgress | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    // Migrer si nécessaire
    const migrated = migrateIfNeeded(parsed);
    
    // Valider la structure basique
    if (migrated && typeof migrated === "object" && "pas" in migrated && "gamification" in migrated) {
      return migrated as UserProgress;
    }
  } catch (error) {
    console.error("Erreur lors du chargement depuis localStorage:", error);
  }

  return null;
}

/**
 * Sauvegarde la progression dans localStorage
 */
export function saveProgressToLocalStorage(progress: UserProgress): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans localStorage:", error);
  }
}

/**
 * Charge la progression depuis Firestore
 */
export async function loadProgressFromFirestore(
  userId: string
): Promise<UserProgress | null> {
  try {
    const doc = await getDocument(FIRESTORE_COLLECTION, userId);
    if (!doc) {
      return null;
    }

    // Convertir les timestamps Firestore en strings ISO si nécessaire
    const progress = doc as any;
    
    // Migrer si nécessaire
    const migrated = migrateIfNeeded(progress);
    
    // Normaliser les dates
    if (migrated.pas) {
      for (const pasId in migrated.pas) {
        const pasProgress = migrated.pas[pasId] as any;
        if (pasProgress.updatedAt && typeof pasProgress.updatedAt.toDate === "function") {
          pasProgress.updatedAt = pasProgress.updatedAt.toDate().toISOString();
        }
        if (pasProgress.validatedAt && typeof pasProgress.validatedAt.toDate === "function") {
          pasProgress.validatedAt = pasProgress.validatedAt.toDate().toISOString();
        }
        // Normaliser les dates des paliers
        if (pasProgress.paliersState) {
          ["K", "E", "A", "I"].forEach((palier) => {
            const palierData = pasProgress.paliersState[palier];
            if (palierData?.completedAt && typeof palierData.completedAt.toDate === "function") {
              palierData.completedAt = palierData.completedAt.toDate().toISOString();
            }
          });
        }
      }
    }

    if (migrated.gamification?.badges) {
      migrated.gamification.badges = migrated.gamification.badges.map((badge: any) => {
        if (badge.earnedAt && typeof badge.earnedAt.toDate === "function") {
          badge.earnedAt = badge.earnedAt.toDate().toISOString();
        }
        return badge;
      });
    }

    if (migrated.quests) {
      migrated.quests = migrated.quests.map((quest: any) => {
        ["createdAt", "expiresAt", "completedAt"].forEach((field) => {
          if (quest[field] && typeof quest[field].toDate === "function") {
            quest[field] = quest[field].toDate().toISOString();
          }
        });
        return quest;
      });
    }

    if (migrated.log) {
      migrated.log = migrated.log.map((entry: any) => {
        if (entry.ts && typeof entry.ts.toDate === "function") {
          entry.ts = entry.ts.toDate().toISOString();
        }
        return entry;
      });
    }

    return migrated as UserProgress;
  } catch (error) {
    console.error("Erreur lors du chargement depuis Firestore:", error);
    return null;
  }
}

/**
 * Sauvegarde la progression dans Firestore
 */
export async function saveProgressToFirestore(
  userId: string,
  progress: UserProgress
): Promise<void> {
  try {
    // Vérifier si le document existe
    const existing = await getDocument(FIRESTORE_COLLECTION, userId);
    
    if (existing) {
      await updateDocument(FIRESTORE_COLLECTION, userId, progress);
    } else {
      await createDocument(FIRESTORE_COLLECTION, userId, progress);
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans Firestore:", error);
    throw error;
  }
}

/**
 * Charge la progression (Firestore prioritaire, localStorage fallback)
 */
export async function loadProgress(userId?: string | null): Promise<UserProgress> {
  // Essayer Firestore si userId disponible
  if (userId) {
    const firestoreProgress = await loadProgressFromFirestore(userId);
    if (firestoreProgress) {
      // Synchroniser avec localStorage comme cache
      saveProgressToLocalStorage(firestoreProgress);
      return firestoreProgress;
    }
  }

  // Fallback localStorage
  const localProgress = loadProgressFromLocalStorage();
  if (localProgress) {
    return localProgress;
  }

  // Nouvelle progression vide
  return createEmptyProgress();
}

/**
 * Sauvegarde la progression (Firestore si userId, sinon localStorage)
 */
export async function saveProgress(
  progress: UserProgress,
  userId?: string | null
): Promise<void> {
  // Toujours sauvegarder dans localStorage comme cache
  saveProgressToLocalStorage(progress);

  // Sauvegarder dans Firestore si userId disponible
  if (userId) {
    try {
      await saveProgressToFirestore(userId, progress);
    } catch (error) {
      console.warn("Impossible de sauvegarder dans Firestore, utilisation de localStorage uniquement:", error);
    }
  }
}

/**
 * Met à jour la progression et recalcule la gamification
 */
export async function updateProgress(
  progress: UserProgress,
  userId?: string | null
): Promise<UserProgress> {
  // Recalculer la gamification
  const updatedGamification = recalculateGamification(progress);
  const updatedProgress: UserProgress = {
    ...progress,
    gamification: updatedGamification,
  };

  // Sauvegarder
  await saveProgress(updatedProgress, userId);

  return updatedProgress;
}

/**
 * Réinitialise la progression
 */
export async function resetProgress(userId?: string | null): Promise<UserProgress> {
  const emptyProgress = createEmptyProgress();
  await saveProgress(emptyProgress, userId);
  return emptyProgress;
}
