"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/ui";
import {
  createTemplateSchema,
  type CreateTemplateFormData,
} from "@/lib/validations/template";
import { SPORTS } from "@/types/workout";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTemplateModal({
  isOpen,
  onClose,
}: CreateTemplateModalProps) {
  const { user } = useAuth();
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTemplateFormData>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      sport: "",
      duration: undefined,
      description: "",
      exercises: [],
    },
  });

  const onSubmit = async (data: CreateTemplateFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const templateId = `${user.uid}_${Date.now()}`;
      await createDocument("workoutTemplates", templateId, {
        userId: user.uid,
        name: data.name,
        sport: data.sport,
        duration: data.duration,
        description: data.description || "",
        exercises: data.exercises || [],
      });

      toast.success("Template créé !");
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un template"
      size="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nom */}
        <Input
          label="Nom du template"
          type="text"
          placeholder="Ex: Technique JJB, Cardio intense..."
          error={form.formState.errors.name?.message}
          {...form.register("name")}
        />

        {/* Sport */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">
            Sport
          </label>
          <select
            {...form.register("sport")}
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
          >
            <option value="">Sélectionnez un sport</option>
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          {form.formState.errors.sport && (
            <p className="mt-1 text-sm text-red-500">
              {form.formState.errors.sport.message}
            </p>
          )}
        </div>

        {/* Durée estimée */}
        <Input
          label="Durée estimée (minutes)"
          type="number"
          placeholder="90"
          error={form.formState.errors.duration?.message}
          {...form.register("duration", { valueAsNumber: true })}
        />

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">
            Description (optionnel)
          </label>
          <textarea
            placeholder="Ex: Échauffement 10min, technique 40min, sparring 30min..."
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white placeholder:text-gray-600 transition-all focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
            {...form.register("description")}
          />
        </div>

        {/* Note : Exercices détaillés pour V2 */}
        <p className="text-sm text-gray-500">
          💡 Les exercices détaillés seront ajoutés dans une prochaine version
        </p>

        {/* Actions */}
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
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
