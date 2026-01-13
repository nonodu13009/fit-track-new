"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/ui";
import {
  logWorkoutSchema,
  type LogWorkoutFormData,
} from "@/lib/validations/workout";
import { SPORTS } from "@/types/workout";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";

interface LogWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogWorkoutModal({ isOpen, onClose }: LogWorkoutModalProps) {
  const { user } = useAuth();
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LogWorkoutFormData>({
    resolver: zodResolver(logWorkoutSchema),
    defaultValues: {
      sport: "",
      duration: undefined,
      rpe: 5,
      notes: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: LogWorkoutFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const workoutId = `${user.uid}_${Date.now()}`;
      await createDocument("workouts", workoutId, {
        userId: user.uid,
        sport: data.sport,
        duration: data.duration,
        rpe: data.rpe,
        notes: data.notes || "",
        date: new Date(data.date).toISOString(),
      });

      toast.success("Séance enregistrée !");
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Logger une séance">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Durée */}
        <Input
          label="Durée (minutes)"
          type="number"
          placeholder="60"
          error={form.formState.errors.duration?.message}
          {...form.register("duration", { valueAsNumber: true })}
        />

        {/* RPE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">
            Intensité (RPE 1-10)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              {...form.register("rpe", { valueAsNumber: true })}
              className="flex-1"
            />
            <span className="text-2xl font-bold text-accent-purple">
              {form.watch("rpe")}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Très facile</span>
            <span>Maximal</span>
          </div>
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          error={form.formState.errors.date?.message}
          {...form.register("date")}
        />

        {/* Notes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">
            Notes (optionnel)
          </label>
          <textarea
            placeholder="Ex: Bon sparring, travail guard retention..."
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white placeholder:text-gray-600 transition-all focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
            {...form.register("notes")}
          />
        </div>

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
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
