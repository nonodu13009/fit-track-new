"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/ui";
import {
  logWeightSchema,
  type LogWeightFormData,
} from "@/lib/validations/workout";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogWeightModal({ isOpen, onClose }: LogWeightModalProps) {
  const { user } = useAuth();
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LogWeightFormData>({
    resolver: zodResolver(logWeightSchema),
    defaultValues: {
      weight: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: LogWeightFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const weighInId = `${user.uid}_${Date.now()}`;
      await createDocument("weighIns", weighInId, {
        userId: user.uid,
        weight: data.weight,
        date: new Date(data.date).toISOString(),
      });

      toast.success("Poids enregistré !");
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
    <Modal isOpen={isOpen} onClose={onClose} title="Logger mon poids">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Poids (kg)"
          type="number"
          step="0.1"
          placeholder="75.5"
          error={form.formState.errors.weight?.message}
          {...form.register("weight", { valueAsNumber: true })}
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
