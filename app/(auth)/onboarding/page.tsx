"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button, Card, Badge, BeltSelect } from "@/components/ui";
import {
  AVAILABLE_SPORTS,
  JJB_GRADES,
  JUDO_GRADES,
  type Sport,
} from "@/types/onboarding";
import { Check } from "@phosphor-icons/react";

export default function OnboardingStep1Page() {
  const router = useRouter();
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);

  const toggleSport = (sportId: string, sportName: string) => {
    const isSelected = selectedSports.some((s) => s.id === sportId);

    if (isSelected) {
      setSelectedSports(selectedSports.filter((s) => s.id !== sportId));
    } else {
      setSelectedSports([...selectedSports, { id: sportId, name: sportName }]);
    }
  };

  const updateGrade = (sportId: string, grade: string) => {
    setSelectedSports(
      selectedSports.map((s) =>
        s.id === sportId ? { ...s, grade } : s
      )
    );
  };

  const handleNext = () => {
    if (selectedSports.length > 0) {
      // Sauvegarder dans localStorage pour la suite
      localStorage.setItem("onboarding_sports", JSON.stringify(selectedSports));
      router.push("/onboarding/physical");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-deep-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-cyan/10" />

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <Badge variant="purple" className="mb-4">
              Étape 1 / 3
            </Badge>
            <h1 className="mb-2 text-3xl font-bold text-white">
              Quels sports pratiquez-vous ?
            </h1>
            <p className="text-gray-400">
              Sélectionnez un ou plusieurs sports et précisez votre niveau
            </p>
          </div>

          <Card variant="glass" className="p-6">
            {/* Sports Grid */}
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              {AVAILABLE_SPORTS.map((sport) => {
                const isSelected = selectedSports.some((s) => s.id === sport.id);

                return (
                  <button
                    key={sport.id}
                    onClick={() => toggleSport(sport.id, sport.name)}
                    className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? "border-accent-purple bg-accent-purple/10 shadow-glow-purple"
                        : "border-white/10 bg-surface hover:border-accent-purple/50"
                    }`}
                  >
                    <span className="font-medium text-white">{sport.name}</span>
                    {isSelected && (
                      <Check size={20} weight="bold" className="text-accent-purple" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grades Selection */}
            {selectedSports.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div className="h-px bg-white/10" />

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Précisez votre niveau
                  </h3>

                  {selectedSports.map((sport) => {
                    const grades =
                      sport.id === "jjb"
                        ? JJB_GRADES
                        : sport.id === "judo"
                          ? JUDO_GRADES
                          : null;

                    if (!grades) return null;

                    return (
                      <div key={sport.id} className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-400">
                          {sport.name}
                        </label>
                        {sport.id === "jjb" ? (
                          <BeltSelect
                            value={sport.grade || ""}
                            onChange={(grade) => updateGrade(sport.id, grade)}
                            grades={grades}
                            placeholder="Sélectionnez votre grade"
                          />
                        ) : (
                          <select
                            value={sport.grade || ""}
                            onChange={(e) => updateGrade(sport.id, e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                          >
                            <option value="">Sélectionnez votre grade</option>
                            {grades.map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="mt-6">
              <Button
                onClick={handleNext}
                className="w-full"
                disabled={selectedSports.length === 0}
              >
                Suivant
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
