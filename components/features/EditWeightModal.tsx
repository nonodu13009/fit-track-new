"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/ui";
import {
  logWeightSchema,
  type LogWeightFormData,
} from "@/lib/validations/workout";
import { type WeighIn } from "@/types/workout";
import { updateDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";

interface EditWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  weighIn: WeighIn | null;
}

export function EditWeightModal({
  isOpen,
  onClose,
  weighIn,
}: EditWeightModalProps) {
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LogWeightFormData>({
    resolver: zodResolver(logWeightSchema),
  });

  // Remplir le formulaire avec les données existantes
  useEffect(() => {
    if (weighIn && isOpen) {
      form.reset({
        weight: weighIn.weight,
        date: new Date(weighIn.date).toISOString().split("T")[0],
      });
    }
  }, [weighIn, isOpen, form]);

  const onSubmit = async (data: LogWeightFormData) => {
    if (!weighIn) return;

    setIsLoading(true);

    try {
      await updateDocument("weighIns", weighIn.id, {
        weight: data.weight,
        date: new Date(data.date).toISOString(),
      });

      toast.success("Poids modifié !");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le poids">
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
