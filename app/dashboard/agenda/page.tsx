"use client";

import { useState } from "react";
import { Card, Badge, Loading, Button, AlertDialog } from "@/components/ui";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { CreateEventModal } from "@/components/features/CreateEventModal";
import { LogWorkoutModal } from "@/components/features/LogWorkoutModal";
import { EditWorkoutModal } from "@/components/features/EditWorkoutModal";
import { EditWeightModal } from "@/components/features/EditWeightModal";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useWeighIns } from "@/hooks/useWeighIns";
import { updateDocument, deleteDocument } from "@/lib/firebase/firestore";
import { type Workout, type WeighIn } from "@/types/workout";
import { useToastContext } from "@/components/providers/ToastProvider";
import {
  startOfWeek,
  startOfDay,
  addDays,
  subDays,
  format,
  isSameDay,
  isToday,
  isPast,
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
  CheckCircle,
  Scales,
  Pencil,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

// Type unifié pour afficher les événements, séances et poids
type AgendaItem = {
  id: string;
  type: "event" | "workout" | "weight";
  title: string;
  sport?: string;
  duration?: number;
  date: Date;
  isAllDay?: boolean;
  status?: "planned" | "done" | "skipped";
  rpe?: number;
  notes?: string;
  weight?: number; // Pour les weighIns
  eventId?: string; // Pour les événements
  workoutId?: string; // Pour les workouts
  weighInId?: string; // Pour les weighIns
  originalWeighIns?: WeighIn[]; // Tous les weighIns du jour (pour afficher si plusieurs)
};

export default function AgendaPage() {
  const { events, loading: eventsLoading } = useCalendarEvents();
  const { workouts, loading: workoutsLoading } = useWorkouts();
  const { weighIns, loading: weighInsLoading } = useWeighIns();
  const toast = useToastContext();
  const { alertState, showAlert, closeAlert, confirmAlert } = useAlertDialog();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [editingWeighIn, setEditingWeighIn] = useState<WeighIn | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);
  const [dragOverDay, setDragOverDay] = useState<Date | null>(null);

  const loading = eventsLoading || workoutsLoading || weighInsLoading;

  const handleMarkDone = async (eventId: string) => {
    try {
      await updateDocument("calendarEvents", eventId, { status: "done" });
      toast.success("Séance marquée comme effectuée");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };


  const handleDelete = (eventId: string) => {
    showAlert(
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
      async () => {
        try {
          await deleteDocument("calendarEvents", eventId);
          toast.success("Événement supprimé");
        } catch (error) {
          console.error("Erreur:", error);
          toast.error("Erreur lors de la suppression");
        }
      },
      {
        title: "Supprimer l'événement",
        variant: "danger",
      }
    );
  };

  // Gérer le drag and drop
  const handleDragStart = (e: React.DragEvent, item: AgendaItem) => {
    // Ne permettre le drag que pour les événements planifiés
    if (item.type === "event" && item.status === "planned" && item.eventId) {
      setDraggedItem(item);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", ""); // Nécessaire pour Firefox
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e: React.DragEvent, day: Date) => {
    if (draggedItem && draggedItem.type === "event" && draggedItem.status === "planned") {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverDay(day);
    }
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDay: Date) => {
    e.preventDefault();
    setDragOverDay(null);

    if (!draggedItem || draggedItem.type !== "event" || !draggedItem.eventId) {
      return;
    }

    // Trouver l'événement original
    const event = events.find((ev) => ev.id === draggedItem.eventId);
    if (!event) return;

    // Calculer la nouvelle date
    const oldDate = parseISO(event.start);
    const newDate = startOfDay(targetDay);

    // Si l'événement a une heure, préserver l'heure
    let newStart: string;
    let newEnd: string;

    if (event.isAllDay) {
      // Pour les événements all-day, juste changer la date
      newStart = newDate.toISOString();
      newEnd = newDate.toISOString();
    } else {
      // Préserver l'heure mais changer la date
      const oldDateTime = new Date(oldDate);
      newDate.setHours(oldDateTime.getHours());
      newDate.setMinutes(oldDateTime.getMinutes());
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      newStart = newDate.toISOString();

      // Calculer la nouvelle date de fin en préservant la durée
      const duration = event.duration || 60;
      const endDate = new Date(newDate);
      endDate.setMinutes(endDate.getMinutes() + duration);
      newEnd = endDate.toISOString();
    }

    try {
      await updateDocument("calendarEvents", draggedItem.eventId, {
        start: newStart,
        end: newEnd,
      });
      toast.success("Séance déplacée");
      setDraggedItem(null);
    } catch (error) {
      console.error("Erreur lors du déplacement:", error);
      toast.error("Erreur lors du déplacement");
      setDraggedItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverDay(null);
  };

  // Générer les 7 jours de la semaine
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  // Combiner les événements, séances et poids
  const getAllAgendaItems = (): AgendaItem[] => {
    const items: AgendaItem[] = [];

    // Ajouter les événements planifiés
    events.forEach((event) => {
      items.push({
        id: event.id,
        type: "event",
        title: event.title,
        sport: event.sport,
        duration: event.duration,
        date: parseISO(event.start),
        isAllDay: event.isAllDay,
        status: event.status,
        notes: event.notes,
        eventId: event.id,
      });
    });

    // Ajouter les séances enregistrées (workouts)
    workouts.forEach((workout) => {
      items.push({
        id: workout.id,
        type: "workout",
        title: `Séance ${workout.sport}`,
        sport: workout.sport,
        duration: workout.duration,
        date: parseISO(workout.date),
        status: "done", // Les workouts sont toujours "fait"
        rpe: workout.rpe,
        notes: workout.notes,
        workoutId: workout.id,
      });
    });

    // Grouper les weighIns par jour et sélectionner le poids le plus bas
    const weighInsByDay = new Map<string, WeighIn[]>();
    weighIns.forEach((weighIn) => {
      const dayKey = format(parseISO(weighIn.date), "yyyy-MM-dd");
      if (!weighInsByDay.has(dayKey)) {
        weighInsByDay.set(dayKey, []);
      }
      weighInsByDay.get(dayKey)!.push(weighIn);
    });

    // Pour chaque jour, créer un AgendaItem avec le poids le plus bas
    weighInsByDay.forEach((dayWeighIns, dayKey) => {
      // Trouver le poids le plus bas
      const lowestWeighIn = dayWeighIns.reduce((lowest, current) =>
        current.weight < lowest.weight ? current : lowest
      );

      items.push({
        id: lowestWeighIn.id,
        type: "weight",
        title: `Poids : ${lowestWeighIn.weight.toFixed(1)} kg`,
        date: parseISO(lowestWeighIn.date),
        weight: lowestWeighIn.weight,
        weighInId: lowestWeighIn.id,
        originalWeighIns:
          dayWeighIns.length > 1 ? dayWeighIns : undefined, // Garder tous si plusieurs
      });
    });

    return items;
  };

  // Filtrer les items par jour
  const getEventsForDay = (date: Date) => {
    return getAllAgendaItems().filter((item) => isSameDay(item.date, date));
  };

  const statusColors = {
    planned: "border-accent-cyan bg-accent-cyan/10",
    done: "border-green-500 bg-green-500/10",
    skipped: "border-gray-600 bg-gray-800/50",
  };

  const getItemColor = (item: AgendaItem) => {
    if (item.type === "workout") {
      return "border-green-500 bg-green-500/10";
    }
    if (item.type === "weight") {
      return "border-blue-500 bg-blue-500/10";
    }
    return statusColors[item.status || "planned"];
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
            setIsEventModalOpen(true);
          }}
          icon={<Plus size={16} weight="bold" />}
        >
          Planifier
        </Button>
      </div>

      {/* Vue Semaine */}
      <Card variant="glass" className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentWeekStart(subDays(currentWeekStart, 7))}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-surface hover:text-white"
            aria-label="Semaine précédente"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-lg font-semibold text-white">
              {format(currentWeekStart, "MMMM yyyy", { locale: fr })}
            </h2>
            {!isSameDay(
              currentWeekStart,
              startOfWeek(new Date(), { weekStartsOn: 1 })
            ) && (
              <button
                onClick={() =>
                  setCurrentWeekStart(
                    startOfWeek(new Date(), { weekStartsOn: 1 })
                  )
                }
                className="text-xs text-accent-cyan hover:underline"
              >
                Aujourd&apos;hui
              </button>
            )}
          </div>
          <button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-surface hover:text-white"
            aria-label="Semaine suivante"
          >
            <CaretRight size={20} weight="bold" />
          </button>
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
                    : dragOverDay && isSameDay(dragOverDay, day)
                      ? "border-accent-cyan bg-accent-cyan/10"
                      : "border-white/10 bg-surface/50"
                }`}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
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
                        const dateStr = format(day, "yyyy-MM-dd");
                        setSelectedDate(dateStr);
                        // Si la date est dans le passé (hors aujourd'hui) : tracking (LogWorkoutModal)
                        // Si la date est aujourd'hui ou dans le futur : planification (CreateEventModal)
                        const dayStart = startOfDay(day);
                        const todayStart = startOfDay(new Date());
                        if (isPast(dayStart) && !isSameDay(dayStart, todayStart)) {
                          setIsWorkoutModalOpen(true);
                        } else {
                          setIsEventModalOpen(true);
                        }
                      }}
                      className="w-full rounded-lg border border-dashed border-white/10 p-2 text-xs text-gray-500 transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                    >
                      + Ajouter
                    </button>
                  ) : (
                    dayEvents.map((item) => {
                      const isDraggable = Boolean(
                        item.type === "event" &&
                          item.status === "planned" &&
                          item.eventId
                      );
                      const isDragging = draggedItem?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`group relative rounded-lg border p-2 transition-opacity ${
                            getItemColor(item)
                          } ${isDragging ? "opacity-50" : ""} ${
                            isDraggable ? "cursor-move" : ""
                          }`}
                          draggable={isDraggable}
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragEnd={handleDragEnd}
                        >
                        <div className="flex items-start gap-2">
                          {/* Icônes selon le type */}
                          {item.type === "workout" && (
                            <CheckCircle
                              size={16}
                              weight="fill"
                              className="mt-0.5 flex-shrink-0 text-green-400"
                            />
                          )}
                          {item.type === "weight" && (
                            <Scales
                              size={16}
                              weight="fill"
                              className="mt-0.5 flex-shrink-0 text-blue-400"
                            />
                          )}
                          {item.type === "event" && item.status === "planned" && (
                            <Calendar
                              size={16}
                              weight="fill"
                              className="mt-0.5 flex-shrink-0 text-cyan-400"
                            />
                          )}
                          {item.type === "event" && item.status === "done" && (
                            <CheckCircle
                              size={16}
                              weight="fill"
                              className="mt-0.5 flex-shrink-0 text-green-400"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="mb-1 text-xs font-semibold text-white">
                              {item.title}
                            </p>
                            {item.sport && (
                              <Badge variant="purple" size="sm" className="mb-1">
                                {item.sport}
                              </Badge>
                            )}
                            {item.originalWeighIns &&
                              item.originalWeighIns.length > 1 && (
                                <Badge variant="cyan" size="sm" className="mb-1">
                                  {item.originalWeighIns.length} mesures
                                </Badge>
                              )}
                            <p className="text-xs text-gray-400">
                              {item.isAllDay
                                ? "Toute la journée"
                                : item.type === "workout"
                                  ? `${item.duration}min${item.rpe ? ` • RPE ${item.rpe}` : ""}`
                                  : item.type === "weight"
                                    ? `Poids le plus bas du jour`
                                    : `${format(item.date, "HH:mm")} - ${item.duration}min`}
                            </p>
                          </div>
                        </div>

                        {/* Actions (visibles au hover) */}
                        <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {/* Actions pour événements planifiés : Valider ou Supprimer */}
                          {item.type === "event" &&
                            item.status === "planned" &&
                            item.eventId && (
                              <>
                                <button
                                  onClick={() => handleMarkDone(item.eventId!)}
                                  className="flex-1 rounded bg-green-500/20 p-1 text-xs text-green-400 hover:bg-green-500/30"
                                  title="Valider"
                                >
                                  <Check size={14} weight="bold" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.eventId!)}
                                  className="rounded bg-red-500/20 p-1 text-xs text-red-400 hover:bg-red-500/30"
                                  title="Supprimer"
                                >
                                  <Trash size={14} weight="bold" />
                                </button>
                              </>
                            )}

                          {/* Actions pour workouts : Modifier */}
                          {item.type === "workout" && item.workoutId && (
                            <button
                              onClick={() => {
                                const workout = workouts.find(
                                  (w) => w.id === item.workoutId
                                );
                                if (workout) {
                                  setEditingWorkout(workout);
                                }
                              }}
                              className="flex-1 rounded bg-blue-500/20 p-1 text-xs text-blue-400 hover:bg-blue-500/30"
                              title="Modifier"
                            >
                              <Pencil size={14} weight="bold" />
                            </button>
                          )}

                          {/* Actions pour poids : Modifier */}
                          {item.type === "weight" && item.weighInId && (
                            <button
                              onClick={() => {
                                const weighIn = weighIns.find(
                                  (w) => w.id === item.weighInId
                                );
                                if (weighIn) {
                                  setEditingWeighIn(weighIn);
                                }
                              }}
                              className="flex-1 rounded bg-blue-500/20 p-1 text-xs text-blue-400 hover:bg-blue-500/30"
                              title="Modifier"
                            >
                              <Pencil size={14} weight="bold" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Liste événements all-day */}
      {getAllAgendaItems().filter(
        (item) => item.isAllDay && item.status === "planned"
      ).length > 0 && (
        <Card variant="elevated">
          <h3 className="mb-3 text-lg font-semibold text-white">
            Événements sans heure précise
          </h3>
          <div className="space-y-2">
            {getAllAgendaItems()
              .filter((item) => item.isAllDay && item.status === "planned")
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-surface p-3"
                >
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">
                      {format(item.date, "dd MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  {item.type === "event" && item.eventId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkDone(item.eventId!)}
                        className="rounded-lg p-2 text-green-400 hover:bg-green-500/10"
                      >
                        <Check size={18} weight="bold" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.eventId!)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash size={18} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Modals */}
      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedDate("");
        }}
        defaultDate={selectedDate}
      />

      <LogWorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => {
          setIsWorkoutModalOpen(false);
          setSelectedDate("");
        }}
        defaultDate={selectedDate}
      />

      <EditWorkoutModal
        isOpen={editingWorkout !== null}
        onClose={() => setEditingWorkout(null)}
        workout={editingWorkout}
      />

      <EditWeightModal
        isOpen={editingWeighIn !== null}
        onClose={() => setEditingWeighIn(null)}
        weighIn={editingWeighIn}
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        onConfirm={confirmAlert}
        title={alertState.title}
        message={alertState.message}
        variant={alertState.variant}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
