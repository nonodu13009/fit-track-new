/**
 * Tests pour le système de progression Gracie Barra
 */

import { PAS, getPasById, getPasByCycle } from "../pas";
import { createEmptyProgress } from "../progressStore";
import {
  computePasStatus,
  computePasCompletion,
  computeGlobalCompletion,
  computeCycleProgress,
  enrichPasWithProgress,
  canPasBeValidated,
} from "../compute";
import {
  validatePalierK,
  validatePalierE,
  validatePalierA,
  validatePalierI,
  calculateMasteryTier,
  canValidatePas,
} from "../validation";
import {
  calculateLevel,
  getXPForNextLevel,
  recalculateGamification,
  createPasClearBadge,
  calculateBossFightMedal,
} from "../gamification";
import { generateDailyQuest, validateQuest } from "../quests";
import type { UserProgress, PasProgress } from "../types";

describe("Système de progression Gracie Barra", () => {
  describe("Structure des pas", () => {
    test("Tous les pas sont définis", () => {
      expect(PAS.length).toBeGreaterThan(0);
    });

    test("Les pas sont organisés en 4 cycles", () => {
      const cycles = [1, 2, 3, 4];
      cycles.forEach((cycle) => {
        const cyclePas = getPasByCycle(cycle);
        expect(cyclePas.length).toBeGreaterThan(0);
        cyclePas.forEach((pas) => {
          expect(pas.cycle).toBe(cycle);
        });
      });
    });

    test("Chaque pas a tous les champs requis", () => {
      PAS.forEach((pas) => {
        expect(pas.id).toBeDefined();
        expect(pas.cycle).toBeGreaterThan(0);
        expect(pas.cycle).toBeLessThanOrEqual(4);
        expect(pas.week).toBeGreaterThan(0);
        expect(pas.week).toBeLessThanOrEqual(16);
        expect(pas.title).toBeDefined();
        expect(pas.type).toBeDefined();
        expect(pas.checkpoints.length).toBeGreaterThan(0);
        expect(pas.validationCriteria).toBeDefined();
      });
    });

    test("getPasById retourne le bon pas", () => {
      const firstPas = PAS[0];
      const found = getPasById(firstPas.id);
      expect(found).toEqual(firstPas);
    });
  });

  describe("Progression", () => {
    let progress: UserProgress;

    beforeEach(() => {
      progress = createEmptyProgress();
    });

    test("computePasStatus retourne LOCKED pour un pas avec prérequis", () => {
      const pas = PAS.find((p) => p.prerequisites && p.prerequisites.length > 0);
      if (pas) {
        const status = computePasStatus(pas, progress);
        expect(status).toBe("LOCKED");
      }
    });

    test("computePasStatus retourne AVAILABLE pour un pas sans prérequis", () => {
      const pas = PAS.find((p) => !p.prerequisites || p.prerequisites.length === 0);
      if (pas) {
        const status = computePasStatus(pas, progress);
        expect(status).toBe("AVAILABLE");
      }
    });

    test("computePasCompletion calcule correctement", () => {
      const pas = PAS[0];
      const pasProgress: PasProgress = {
        paliersState: {
          K: { status: "completed", repsCompleted: 10, completedAt: new Date().toISOString() },
          E: { status: "completed", totalReps: 50, cleanReps: 10, completedAt: new Date().toISOString() },
          A: {
            status: "not_started",
            positionalTest: { attempts: 0, successes: 0, successRate: 0, sessions: [] },
            targetRate: 40,
          },
          I: {
            status: "not_started",
            freeSparringTest: { rounds: 0, occurrences: 0, sessions: [] },
            occurrencesMin: 1,
            sessionsRequired: 2,
          },
        },
        updatedAt: new Date().toISOString(),
        volumeCompleted: 50,
        sessions: [],
      };

      const completion = computePasCompletion(pas, pasProgress);
      expect(completion).toBe(50); // 2 paliers sur 4 = 50%
    });

    test("computeCycleProgress calcule correctement", () => {
      const cycle1Progress = computeCycleProgress(1, progress);
      expect(cycle1Progress.cycle).toBe(1);
      expect(cycle1Progress.totalPas).toBeGreaterThan(0);
      expect(cycle1Progress.completedPas).toBe(0);
      expect(cycle1Progress.completionPercentage).toBe(0);
    });

    test("computeGlobalCompletion retourne 0 pour une progression vide", () => {
      const completion = computeGlobalCompletion(progress);
      expect(completion).toBe(0);
    });
  });

  describe("Validation des paliers", () => {
    test("validatePalierK valide correctement", () => {
      const palierK = { status: "not_started" as const, repsCompleted: 0 };
      const updated = validatePalierK(palierK, 10);
      expect(updated.status).toBe("completed");
      expect(updated.repsCompleted).toBe(10);
    });

    test("validatePalierE valide correctement", () => {
      const palierE = {
        status: "not_started" as const,
        totalReps: 0,
        cleanReps: 0,
      };
      const updated = validatePalierE(palierE, 50, 10);
      expect(updated.status).toBe("completed");
      expect(updated.totalReps).toBe(50);
      expect(updated.cleanReps).toBe(10);
    });

    test("validatePalierA valide correctement", () => {
      const palierA = {
        status: "not_started" as const,
        positionalTest: {
          attempts: 0,
          successes: 0,
          successRate: 0,
          sessions: [],
        },
        targetRate: 40,
      };
      const updated = validatePalierA(palierA, 10, 5, new Date().toISOString());
      expect(updated.status).toBe("completed");
      expect(updated.positionalTest.successRate).toBe(50);
    });

    test("validatePalierI valide correctement", () => {
      const palierI = {
        status: "not_started" as const,
        freeSparringTest: {
          rounds: 0,
          occurrences: 0,
          sessions: [],
        },
        occurrencesMin: 1,
        sessionsRequired: 2,
      };
      const session1 = new Date().toISOString();
      const session2 = new Date(Date.now() + 86400000).toISOString();
      let updated = validatePalierI(palierI, 1, session1);
      updated = validatePalierI(updated, 1, session2);
      expect(updated.status).toBe("completed");
      expect(updated.freeSparringTest.occurrences).toBe(2);
    });
  });

  describe("Gamification", () => {
    test("calculateLevel calcule correctement", () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(250)).toBe(2);
      expect(calculateLevel(500)).toBe(3);
    });

    test("getXPForNextLevel retourne la bonne valeur", () => {
      expect(getXPForNextLevel(1)).toBe(250);
      expect(getXPForNextLevel(2)).toBe(500);
    });

    test("createPasClearBadge crée un badge correct", () => {
      const badge = createPasClearBadge("pas-01-01", "Test Pas");
      expect(badge.id).toBe("badge-pas-pas-01-01");
      expect(badge.name).toContain("Test Pas");
      expect(badge.earnedAt).toBeDefined();
    });

    test("calculateBossFightMedal retourne la bonne médaille", () => {
      expect(calculateBossFightMedal(8, 10)).toBe("or");
      expect(calculateBossFightMedal(6, 10)).toBe("argent");
      expect(calculateBossFightMedal(4, 10)).toBe("bronze");
    });

    test("recalculateGamification met à jour correctement", () => {
      const progress = createEmptyProgress();
      const updated = recalculateGamification(progress);
      expect(updated.xpTotal).toBeDefined();
      expect(updated.level).toBeGreaterThan(0);
      expect(updated.tokens).toBeDefined();
    });
  });

  describe("Quêtes", () => {
    test("generateDailyQuest crée une quête valide", () => {
      const progress = createEmptyProgress();
      const quest = generateDailyQuest(progress);
      expect(quest.type).toBe("daily");
      expect(quest.title).toBeDefined();
      expect(quest.xpReward).toBeGreaterThan(0);
      expect(quest.tokenReward).toBeGreaterThan(0);
      expect(quest.expiresAt).toBeDefined();
    });

    test("validateQuest peut valider une quête", () => {
      const progress = createEmptyProgress();
      const quest = generateDailyQuest(progress);
      // La validation retourne false car la progression est vide
      const isValid = validateQuest(quest, progress);
      expect(typeof isValid).toBe("boolean");
    });
  });

  describe("Enrichissement des pas", () => {
    test("enrichPasWithProgress enrichit correctement", () => {
      const progress = createEmptyProgress();
      const pas = PAS[0];
      const enriched = enrichPasWithProgress(pas, progress);
      expect(enriched.status).toBeDefined();
      expect(enriched.completion).toBeDefined();
      expect(enriched.xpEarned).toBeDefined();
    });
  });

  describe("Mastery tier", () => {
    test("calculateMasteryTier retourne undefined si pas non validé", () => {
      const progress = createEmptyProgress();
      const pas = PAS[0];
      const pasProgress = progress.pas[pas.id];
      if (pasProgress) {
        const tier = calculateMasteryTier(pas, pasProgress);
        expect(tier).toBeUndefined();
      }
    });
  });
});
