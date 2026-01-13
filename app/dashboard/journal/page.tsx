"use client";

import { useState } from "react";
import { Card, Badge, Loading, Button } from "@/components/ui";
import { EditWorkoutModal } from "@/components/features/EditWorkoutModal";
import { useWorkouts } from "@/hooks/useWorkouts";
import { deleteWorkout } from "@/lib/firebase/workouts";
import { useToastContext } from "@/components/providers/ToastProvider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Barbell, Clock, Fire, PencilSimple, Trash, Share } from "@phosphor-icons/react";
import { type Workout } from "@/types/workout";
import { shareContent, formatWorkoutForShare } from "@/lib/utils/share";

export default function JournalPage() {
  const { workouts, loading } = useWorkouts();
  const toast = useToastContext();
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterSport, setFilterSport] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");

  const handleDelete = async (workoutId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) {
      return;
    }

    setDeletingId(workoutId);
    try {
      await deleteWorkout(workoutId);
      toast.success("Séance supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShare = async (workout: Workout) => {
    const success = await shareContent(formatWorkoutForShare(workout));
    if (success) {
      toast.success("Séance partagée !");
    } else {
      toast.info("Texte copié dans le presse-papier");
    }
  };

  // Filtrer les séances
  const filteredWorkouts = workouts.filter((workout) => {
    // Filtre par sport
    if (filterSport !== "all" && workout.sport !== filterSport) {
      return false;
    }

    // Filtre par date
    if (filterDate !== "all") {
      const workoutDate = new Date(workout.date);
      const today = new Date();
      const daysDiff = Math.floor(
        (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (filterDate === "today" && daysDiff !== 0) return false;
      if (filterDate === "week" && daysDiff > 7) return false;
      if (filterDate === "month" && daysDiff > 30) return false;
    }

    return true;
  });

  // Liste des sports uniques pour le filtre
  const uniqueSports = Array.from(new Set(workouts.map((w) => w.sport)));

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading size="lg" color="purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Journal</h1>
        <Badge variant="purple">{workouts.length} séances</Badge>
      </div>

      {/* Filtres */}
      {workouts.length > 0 && (
        <Card variant="glass" className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Filtre Sport */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Sport
              </label>
              <select
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
              >
                <option value="all">Tous les sports</option>
                {uniqueSports.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Date */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Période
              </label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd&apos;hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>

            {/* Reset filtres */}
            {(filterSport !== "all" || filterDate !== "all") && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterSport("all");
                    setFilterDate("all");
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>

          {/* Résultat filtrage */}
          {filteredWorkouts.length !== workouts.length && (
            <p className="mt-3 text-sm text-gray-500">
              {filteredWorkouts.length} séance(s) sur {workouts.length}
            </p>
          )}
        </Card>
      )}

      {workouts.length === 0 ? (
        <Card variant="glass">
          <div className="py-12 text-center">
            <Barbell size={48} weight="fill" className="mx-auto mb-4 text-gray-600" />
            <p className="mb-2 text-lg font-medium text-gray-400">
              Aucune séance enregistrée
            </p>
            <p className="text-sm text-gray-500">
              Utilisez le bouton + en bas à droite pour logger votre première
              séance !
            </p>
          </div>
        </Card>
      ) : filteredWorkouts.length === 0 ? (
        <Card variant="glass">
          <div className="py-12 text-center">
            <Barbell
              size={48}
              weight="fill"
              className="mx-auto mb-4 text-gray-600"
            />
            <p className="mb-2 text-lg font-medium text-gray-400">
              Aucune séance trouvée
            </p>
            <p className="text-sm text-gray-500">
              Essayez de modifier vos filtres
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <Card key={workout.id} variant="elevated" className="transition-colors hover:border-accent-purple/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {workout.sport}
                    </h3>
                    <Badge variant="purple" size="sm">
                      RPE {workout.rpe}/10
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock size={16} weight="bold" />
                      <span>{workout.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fire size={16} weight="fill" />
                      <span>
                        {format(new Date(workout.date), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>

                  {workout.notes && (
                    <p className="mt-3 text-sm text-gray-300">
                      {workout.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleShare(workout)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-accent-cyan/10 hover:text-accent-cyan"
                    aria-label="Partager"
                  >
                    <Share size={20} weight="bold" />
                  </button>
                  <button
                    onClick={() => setEditingWorkout(workout)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-accent-purple/10 hover:text-accent-purple"
                    aria-label="Modifier"
                  >
                    <PencilSimple size={20} weight="bold" />
                  </button>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    disabled={deletingId === workout.id}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    aria-label="Supprimer"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Edition */}
      <EditWorkoutModal
        isOpen={!!editingWorkout}
        onClose={() => setEditingWorkout(null)}
        workout={editingWorkout}
      />
    </div>
  );
}
