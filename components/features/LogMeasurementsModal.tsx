"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/ui";
import {
  logMeasurementsSchema,
  type LogMeasurementsFormData,
} from "@/lib/validations/workout";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";

interface LogMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogMeasurementsModal({
  isOpen,
  onClose,
}: LogMeasurementsModalProps) {
  const { user } = useAuth();
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LogMeasurementsFormData>({
    resolver: zodResolver(logMeasurementsSchema),
    defaultValues: {
      waist: undefined,
      chest: undefined,
      thigh: undefined,
      arm: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: LogMeasurementsFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const measurementId = `${user.uid}_${Date.now()}`;
      const measurements: any = {};
      if (data.waist) measurements.waist = data.waist;
      if (data.chest) measurements.chest = data.chest;
      if (data.thigh) measurements.thigh = data.thigh;
      if (data.arm) measurements.arm = data.arm;

      await createDocument("measurements", measurementId, {
        userId: user.uid,
        measurements,
        date: new Date(data.date).toISOString(),
      });

      toast.success("Mesures enregistrées !");
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
    <Modal isOpen={isOpen} onClose={onClose} title="Logger mes mesures">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-400">
          Remplissez au moins une mesure (toutes optionnelles)
        </p>

        <Input
          label="Tour de taille (cm)"
          type="number"
          step="0.1"
          placeholder="80"
          {...form.register("waist", { valueAsNumber: true })}
        />

        <Input
          label="Tour de poitrine (cm)"
          type="number"
          step="0.1"
          placeholder="100"
          {...form.register("chest", { valueAsNumber: true })}
        />

        <Input
          label="Tour de cuisse (cm)"
          type="number"
          step="0.1"
          placeholder="55"
          {...form.register("thigh", { valueAsNumber: true })}
        />

        <Input
          label="Tour de bras (cm)"
          type="number"
          step="0.1"
          placeholder="35"
          {...form.register("arm", { valueAsNumber: true })}
        />

        <Input
          label="Date"
          type="date"
          error={form.formState.errors.date?.message}
          {...form.register("date")}
        />

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
