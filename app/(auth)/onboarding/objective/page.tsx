"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Badge } from "@/components/ui";
import {
  objectiveSchema,
  type ObjectiveFormData,
} from "@/lib/validations/onboarding";
import { ArrowLeft, Trophy, TrendDown, Heart, Target } from "@phosphor-icons/react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";

const OBJECTIVE_TYPES = [
  {
    type: "competition" as const,
    label: "Compétition",
    icon: Trophy,
    description: "Préparer une compétition",
  },
  {
    type: "weight_loss" as const,
    label: "Perte de poids",
    icon: TrendDown,
    description: "Perdre du poids progressivement",
  },
  {
    type: "maintenance" as const,
    label: "Maintien",
    icon: Heart,
    description: "Maintenir ma forme actuelle",
  },
  {
    type: "other" as const,
    label: "Autre",
    icon: Target,
    description: "Objectif personnalisé",
  },
];

export default function OnboardingStep3Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ObjectiveFormData["type"] | null>(
    null
  );

  const form = useForm<ObjectiveFormData>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: {
      type: "maintenance",
      description: "",
    },
  });

  const onSubmit = async (data: ObjectiveFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Récupérer les données des étapes précédentes
      const sportsData = localStorage.getItem("onboarding_sports");
      const physicalData = localStorage.getItem("onboarding_physical");

      const sports = sportsData ? JSON.parse(sportsData) : [];
      const physical = physicalData ? JSON.parse(physicalData) : {};

      // Créer le profil utilisateur dans Firestore
      await createDocument("userProfiles", user.uid, {
        userId: user.uid,
        email: user.email,
        sports,
        physical,
        objective: data,
        onboardingCompleted: true,
      });

      // Créer le premier point de poids
      if (physical.weight) {
        await createDocument(`weighIns`, `${user.uid}_${Date.now()}`, {
          userId: user.uid,
          weight: physical.weight,
          date: new Date().toISOString(),
        });
      }

      // Nettoyer le localStorage
      localStorage.removeItem("onboarding_sports");
      localStorage.removeItem("onboarding_physical");

      // Rediriger vers le dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeSelect = (type: ObjectiveFormData["type"]) => {
    setSelectedType(type);
    form.setValue("type", type);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-deep-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-lime/10 via-transparent to-accent-purple/10" />

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/onboarding/physical"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} weight="bold" />
              Retour
            </Link>
            <div className="text-center">
              <Badge variant="lime" className="mb-4">
                Étape 3 / 3
              </Badge>
              <h1 className="mb-2 text-3xl font-bold text-white">
                Quel est votre objectif ?
              </h1>
              <p className="text-gray-400">
                Cela nous permettra de vous accompagner au mieux
              </p>
            </div>
          </div>

          <Card variant="glass" className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Objective Types */}
              <div className="grid gap-3 sm:grid-cols-2">
                {OBJECTIVE_TYPES.map((obj) => {
                  const Icon = obj.icon;
                  const isSelected = selectedType === obj.type;

                  return (
                    <button
                      key={obj.type}
                      type="button"
                      onClick={() => handleTypeSelect(obj.type)}
                      className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all ${
                        isSelected
                          ? "border-accent-lime bg-accent-lime/10 shadow-glow-lime"
                          : "border-white/10 bg-surface hover:border-accent-lime/50"
                      }`}
                    >
                      <Icon
                        size={24}
                        weight="fill"
                        className={isSelected ? "text-accent-lime" : "text-gray-400"}
                      />
                      <div>
                        <h3 className="font-semibold text-white">{obj.label}</h3>
                        <p className="text-sm text-gray-400">{obj.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-400">
                  Décrivez votre objectif
                </label>
                <textarea
                  placeholder="Ex: Participer au championnat en mars, perdre 5kg..."
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white placeholder:text-gray-600 transition-all focus:border-accent-lime focus:outline-none focus:ring-2 focus:ring-accent-lime/50"
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Conditional inputs */}
              {selectedType === "competition" && (
                <Input
                  label="Date de la compétition"
                  type="date"
                  {...form.register("targetDate")}
                />
              )}

              {selectedType === "weight_loss" && (
                <Input
                  label="Poids cible (kg)"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  {...form.register("targetWeight", { valueAsNumber: true })}
                />
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                <Link href="/onboarding/physical" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    Retour
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isLoading}
                  disabled={isLoading || !selectedType}
                >
                  Terminer
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
