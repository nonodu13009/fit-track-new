"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/ui";
import {
  createEventSchema,
  type CreateEventFormData,
} from "@/lib/validations/template";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useTemplates } from "@/hooks/useTemplates";
import { SPORTS } from "@/types/workout";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
}

export function CreateEventModal({
  isOpen,
  onClose,
  defaultDate,
  defaultTime,
}: CreateEventModalProps) {
  const { user } = useAuth();
  const toast = useToastContext();
  const { templates } = useTemplates();
  const [isLoading, setIsLoading] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      sport: "",
      duration: 60,
      start: defaultDate || new Date().toISOString().split("T")[0],
      end: defaultDate || new Date().toISOString().split("T")[0],
      isAllDay: false,
      notes: "",
    },
  });

  // Mettre à jour le formulaire quand defaultDate change
  useEffect(() => {
    if (defaultDate && isOpen) {
      form.setValue("start", defaultDate);
      form.setValue("end", defaultDate);
    }
  }, [defaultDate, isOpen, form]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      form.setValue("title", template.name);
      form.setValue("sport", template.sport);
      form.setValue("duration", template.duration);
      if (template.description) {
        form.setValue("notes", template.description);
      }
    }
  };

  const onSubmit = async (data: CreateEventFormData) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const eventId = `${user.uid}_${Date.now()}`;

      // Construire les dates start/end
      let startDate = data.start;
      let endDate = data.end;

      if (!isAllDay && defaultTime) {
        startDate = `${data.start}T${defaultTime}:00`;
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(
          startDateTime.getTime() + (data.duration || 60) * 60000
        );
        endDate = endDateTime.toISOString();
      } else {
        startDate = new Date(data.start).toISOString();
        endDate = new Date(data.end).toISOString();
      }

      // Construire les données de l'événement
      const eventData: Record<string, any> = {
        userId: user.uid,
        title: data.title,
        sport: data.sport || "",
        duration: data.duration || 60,
        start: startDate,
        end: endDate,
        isAllDay,
        status: "planned",
        notes: data.notes || "",
      };

      // Ajouter workoutTemplateId seulement si un template est utilisé
      if (useTemplate && selectedTemplateId) {
        eventData.workoutTemplateId = selectedTemplateId;
      }

      await createDocument("calendarEvents", eventId, eventData);

      toast.success("Événement planifié !");
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la planification:", error);
      toast.error("Erreur lors de la planification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Planifier une séance"
      size="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Utiliser un template ? */}
        <div>
          <label className="mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-surface accent-accent-purple"
            />
            <span className="text-sm font-medium text-gray-400">
              Utiliser un template existant
            </span>
          </label>

          {useTemplate && (
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                handleTemplateSelect(e.target.value);
              }}
              className="mt-2 w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            >
              <option value="">Sélectionnez un template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.sport} - {template.duration}min)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Titre */}
        <Input
          label="Titre"
          type="text"
          placeholder="Ex: Entraînement JJB"
          error={form.formState.errors.title?.message}
          {...form.register("title")}
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
        </div>

        {/* Durée */}
        <Input
          label="Durée (minutes)"
          type="number"
          placeholder="60"
          {...form.register("duration", { valueAsNumber: true })}
        />

        {/* All-day */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => {
                setIsAllDay(e.target.checked);
                form.setValue("isAllDay", e.target.checked);
              }}
              className="h-4 w-4 rounded border-white/10 bg-surface accent-accent-cyan"
            />
            <span className="text-sm font-medium text-gray-400">
              Événement sans heure précise (toute la journée)
            </span>
          </label>
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          error={form.formState.errors.start?.message}
          {...form.register("start")}
        />

        {/* Heure (si pas all-day) */}
        {!isAllDay && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Heure
            </label>
            <input
              type="time"
              defaultValue={defaultTime || "18:00"}
              className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">
            Notes (optionnel)
          </label>
          <textarea
            placeholder="Ex: Ne pas oublier le Gi..."
            rows={2}
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
            Planifier
          </Button>
        </div>
      </form>
    </Modal>
  );
}
