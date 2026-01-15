"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Badge } from "@/components/ui";
import {
  physicalSchema,
  type PhysicalFormData,
} from "@/lib/validations/onboarding";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export default function OnboardingStep2Page() {
  const router = useRouter();

  const form = useForm<PhysicalFormData>({
    resolver: zodResolver(physicalSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
      dateOfBirth: "",
      targetWeight: undefined,
    },
  });

  const onSubmit = (data: PhysicalFormData) => {
    // Sauvegarder dans localStorage
    localStorage.setItem("onboarding_physical", JSON.stringify(data));
    router.push("/onboarding/objective");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-deep-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-purple/10" />

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/onboarding"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} weight="bold" />
              Retour
            </Link>
            <div className="text-center">
              <Badge variant="cyan" className="mb-4">
                Étape 2 / 3
              </Badge>
              <h1 className="mb-2 text-3xl font-bold text-white">
                Configuration physique
              </h1>
              <p className="text-gray-400">
                Ces données nous aideront à personnaliser vos plans
              </p>
            </div>
          </div>

          <Card variant="glass" className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Poids */}
              <div>
                <Input
                  label="Poids actuel (kg)"
                  type="number"
                  step="0.1"
                  placeholder="75"
                  error={form.formState.errors.weight?.message}
                  {...form.register("weight", { valueAsNumber: true })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Votre poids actuel sera le premier point de votre courbe
                </p>
              </div>

              {/* Poids cible */}
              <div>
                <Input
                  label="Poids cible (kg)"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  error={form.formState.errors.targetWeight?.message}
                  {...form.register("targetWeight", { valueAsNumber: true })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Objectif de poids à atteindre (optionnel)
                </p>
              </div>

              {/* Taille */}
              <div>
                <Input
                  label="Taille (cm)"
                  type="number"
                  placeholder="175"
                  error={form.formState.errors.height?.message}
                  {...form.register("height", { valueAsNumber: true })}
                />
              </div>

              {/* Date de naissance */}
              <div>
                <Input
                  label="Date de naissance"
                  type="date"
                  error={form.formState.errors.dateOfBirth?.message}
                  {...form.register("dateOfBirth")}
                />
              </div>

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                <Link href="/onboarding" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    Retour
                  </Button>
                </Link>
                <Button type="submit" className="flex-1">
                  Suivant
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
