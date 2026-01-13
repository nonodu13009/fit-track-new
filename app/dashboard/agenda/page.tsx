"use client";

import { useState } from "react";
import { Card, Badge, Loading, Button } from "@/components/ui";
import { CreateEventModal } from "@/components/features/CreateEventModal";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { updateDocument, deleteDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  Calendar,
  Check,
  X,
  Trash,
  CalendarBlank,
} from "@phosphor-icons/react";

export default function AgendaPage() {
  const { events, loading } = useCalendarEvents();
  const toast = useToastContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const handleMarkDone = async (eventId: string) => {
    try {
      await updateDocument("calendarEvents", eventId, { status: "done" });
      toast.success("Séance marquée comme effectuée");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleMarkSkipped = async (eventId: string) => {
    try {
      await updateDocument("calendarEvents", eventId, { status: "skipped" });
      toast.success("Séance marquée comme sautée");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Supprimer cet événement ?")) return;

    try {
      await deleteDocument("calendarEvents", eventId);
      toast.success("Événement supprimé");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Générer les 7 jours de la semaine
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  // Filtrer les événements par jour
  const getEventsForDay = (date: Date) => {
    return events.filter((event) =>
      isSameDay(parseISO(event.start), date)
    );
  };

  const statusColors = {
    planned: "border-accent-cyan bg-accent-cyan/10",
    done: "border-green-500 bg-green-500/10",
    skipped: "border-gray-600 bg-gray-800/50",
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading size="lg" color="cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Agenda</h1>
        <Button
          size="sm"
          onClick={() => {
            setSelectedDate("");
            setIsModalOpen(true);
          }}
          icon={<Plus size={16} weight="bold" />}
        >
          Planifier
        </Button>
      </div>

      {/* Vue Semaine */}
      <Card variant="glass" className="p-4">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-semibold text-white">
            {format(currentWeekStart, "MMMM yyyy", { locale: fr })}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-7">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`rounded-lg border p-3 transition-colors ${
                  isCurrentDay
                    ? "border-accent-purple bg-accent-purple/5"
                    : "border-white/10 bg-surface/50"
                }`}
              >
                {/* Header jour */}
                <div className="mb-2 text-center">
                  <p className="text-xs font-medium text-gray-400">
                    {format(day, "EEE", { locale: fr })}
                  </p>
                  <p
                    className={`text-lg font-bold ${
                      isCurrentDay ? "text-accent-purple" : "text-white"
                    }`}
                  >
                    {format(day, "d")}
                  </p>
                </div>

                {/* Événements */}
                <div className="space-y-2">
                  {dayEvents.length === 0 ? (
                    <button
                      onClick={() => {
                        setSelectedDate(format(day, "yyyy-MM-dd"));
                        setIsModalOpen(true);
                      }}
                      className="w-full rounded-lg border border-dashed border-white/10 p-2 text-xs text-gray-500 transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                    >
                      + Ajouter
                    </button>
                  ) : (
                    dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`group relative rounded-lg border p-2 ${statusColors[event.status]}`}
                      >
                        <p className="mb-1 text-xs font-semibold text-white">
                          {event.title}
                        </p>
                        {event.sport && (
                          <Badge variant="purple" size="sm" className="mb-1">
                            {event.sport}
                          </Badge>
                        )}
                        <p className="text-xs text-gray-400">
                          {event.isAllDay
                            ? "Toute la journée"
                            : `${format(parseISO(event.start), "HH:mm")} - ${event.duration}min`}
                        </p>

                        {/* Actions (visibles au hover) */}
                        {event.status === "planned" && (
                          <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => handleMarkDone(event.id)}
                              className="flex-1 rounded bg-green-500/20 p-1 text-xs text-green-400 hover:bg-green-500/30"
                              title="Marquer fait"
                            >
                              <Check size={14} weight="bold" />
                            </button>
                            <button
                              onClick={() => handleMarkSkipped(event.id)}
                              className="flex-1 rounded bg-gray-700/50 p-1 text-xs text-gray-400 hover:bg-gray-700"
                              title="Marquer sauté"
                            >
                              <X size={14} weight="bold" />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="rounded bg-red-500/20 p-1 text-xs text-red-400 hover:bg-red-500/30"
                              title="Supprimer"
                            >
                              <Trash size={14} weight="bold" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Liste événements all-day */}
      {events.filter((e) => e.isAllDay && e.status === "planned").length > 0 && (
        <Card variant="elevated">
          <h3 className="mb-3 text-lg font-semibold text-white">
            Événements sans heure précise
          </h3>
          <div className="space-y-2">
            {events
              .filter((e) => e.isAllDay && e.status === "planned")
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg bg-surface p-3"
                >
                  <div>
                    <p className="font-medium text-white">{event.title}</p>
                    <p className="text-sm text-gray-400">
                      {format(parseISO(event.start), "dd MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkDone(event.id)}
                      className="rounded-lg p-2 text-green-400 hover:bg-green-500/10"
                    >
                      <Check size={18} weight="bold" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Modal Planification */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDate={selectedDate}
      />
    </div>
  );
}
