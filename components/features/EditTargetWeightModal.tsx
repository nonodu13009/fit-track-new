"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Button, Input } from "@/components/ui";
import { updateDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useAuth } from "@/hooks/useAuth";

const targetWeightSchema = z.object({
  targetWeight: z.union([
    z
      .number()
      .min(30, "Le poids cible doit être supérieur à 30 kg")
      .max(200, "Le poids cible doit être inférieur à 200 kg"),
    z.literal(""),
    z.undefined(),
  ]),
});

type TargetWeightFormData = z.infer<typeof targetWeightSchema>;

interface EditTargetWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTargetWeight?: number;
  onUpdate?: () => void;
}

export function EditTargetWeightModal({
  isOpen,
  onClose,
  currentTargetWeight,
  onUpdate,
}: EditTargetWeightModalProps) {
  const { user } = useAuth();
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TargetWeightFormData>({
    resolver: zodResolver(targetWeightSchema),
    defaultValues: {
      targetWeight: currentTargetWeight,
    },
  });

  // Mettre à jour le formulaire quand currentTargetWeight change
  useEffect(() => {
    if (isOpen) {
      form.reset({
        targetWeight: currentTargetWeight,
      });
    }
  }, [currentTargetWeight, isOpen, form]);

  const onSubmit = async (data: TargetWeightFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Récupérer le profil actuel
      const { getDocument } = await import("@/lib/firebase/firestore");
      const profile = await getDocument("userProfiles", user.uid);

      if (!profile) {
        toast.error("Profil non trouvé");
        return;
      }

      // Mettre à jour le targetWeight dans physical
      await updateDocument("userProfiles", user.uid, {
        physical: {
          ...profile.physical,
          targetWeight:
            data.targetWeight === "" || data.targetWeight === undefined
              ? undefined
              : Number(data.targetWeight),
        },
      });

      toast.success("Objectif de poids mis à jour !");
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'objectif de poids">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Poids cible (kg)"
          type="number"
          step="0.1"
          placeholder="70"
          error={form.formState.errors.targetWeight?.message}
          {...form.register("targetWeight", {
            valueAsNumber: true,
            setValueAs: (value) => {
              if (value === "" || value === null || value === undefined) {
                return undefined;
              }
              return Number(value);
            },
          })}
        />
        <p className="text-xs text-gray-500">
          Laissez vide pour supprimer l&apos;objectif
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
