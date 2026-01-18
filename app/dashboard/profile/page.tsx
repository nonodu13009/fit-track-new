"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, Button, Input, Badge, Loading, BeltSelect } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { getDocument, updateDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";
import {
  AVAILABLE_SPORTS,
  JJB_GRADES,
  JUDO_GRADES,
  type Sport,
} from "@/types/onboarding";
import { User, CheckCircle } from "@phosphor-icons/react";

interface ProfileData {
  sports: Sport[];
  physical: {
    weight: number;
    height: number;
    dateOfBirth: string;
    targetWeight?: number;
  };
  objective: {
    type: string;
    description: string;
    targetDate?: string;
    targetWeight?: number;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToastContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);

  const form = useForm({
    defaultValues: {
      weight: 0,
      height: 0,
      dateOfBirth: "",
      targetWeight: undefined as number | undefined,
      objectiveDescription: "",
    },
  });

  // Charger le profil
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const profile = await getDocument("userProfiles", user.uid);
        if (profile) {
          setProfileData(profile as ProfileData);
          setSelectedSports(profile.sports || []);
          form.reset({
            weight: profile.physical?.weight,
            height: profile.physical?.height,
            dateOfBirth: profile.physical?.dateOfBirth,
            targetWeight: profile.physical?.targetWeight,
            objectiveDescription: profile.objective?.description,
          });
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleSport = (sportId: string, sportName: string) => {
    const isSelected = selectedSports.some((s) => s.id === sportId);

    if (isSelected) {
      setSelectedSports(selectedSports.filter((s) => s.id !== sportId));
    } else {
      setSelectedSports([...selectedSports, { id: sportId, name: sportName }]);
    }
  };

  const updateGrade = (sportId: string, grade: string) => {
    setSelectedSports(
      selectedSports.map((s) => (s.id === sportId ? { ...s, grade } : s))
    );
  };

  const onSubmit = async (data: any) => {
    if (!user) return;

    setSaving(true);

    try {
      await updateDocument("userProfiles", user.uid, {
        sports: selectedSports,
        physical: {
          weight: Number(data.weight),
          height: Number(data.height),
          dateOfBirth: data.dateOfBirth,
          targetWeight: data.targetWeight ? Number(data.targetWeight) : undefined,
        },
        objective: {
          ...profileData?.objective,
          description: data.objectiveDescription,
        },
      });

      toast.success("Profil mis à jour !");
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading size="lg" color="purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient">Mon Profil</h1>
        <p className="mt-1 text-sm text-gray-400">{user?.email}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Sports */}
        <Card variant="glass" className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Sports pratiqués
          </h2>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {AVAILABLE_SPORTS.map((sport) => {
              const isSelected = selectedSports.some((s) => s.id === sport.id);

              return (
                <button
                  key={sport.id}
                  type="button"
                  onClick={() => toggleSport(sport.id, sport.name)}
                  className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-accent-purple bg-accent-purple/10 shadow-glow-purple"
                      : "border-white/10 bg-surface hover:border-accent-purple/50"
                  }`}
                >
                  <span className="font-medium text-white">{sport.name}</span>
                  {isSelected && (
                    <CheckCircle
                      size={20}
                      weight="bold"
                      className="text-accent-purple"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Grades */}
          {selectedSports.length > 0 && (
            <div className="space-y-4 border-t border-white/10 pt-4">
              <h3 className="text-sm font-semibold text-white">
                Niveaux / Grades
              </h3>
              {selectedSports.map((sport) => {
                const grades =
                  sport.id === "jjb"
                    ? JJB_GRADES
                    : sport.id === "judo"
                      ? JUDO_GRADES
                      : null;

                if (!grades) return null;

                return (
                  <div key={sport.id}>
                    <label className="mb-2 block text-sm font-medium text-gray-400">
                      {sport.name}
                    </label>
                    {sport.id === "jjb" ? (
                      <BeltSelect
                        value={sport.grade || ""}
                        onChange={(grade) => updateGrade(sport.id, grade)}
                        grades={grades}
                        placeholder="Sélectionnez votre grade"
                      />
                    ) : (
                      <select
                        value={sport.grade || ""}
                        onChange={(e) => updateGrade(sport.id, e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                      >
                        <option value="">Sélectionnez votre grade</option>
                        {grades.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Données physiques */}
        <Card variant="glass" className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Données physiques
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Poids actuel (kg)"
              type="number"
              step="0.1"
              placeholder="75"
              {...form.register("weight", { valueAsNumber: true })}
            />

            <Input
              label="Taille (cm)"
              type="number"
              placeholder="175"
              {...form.register("height", { valueAsNumber: true })}
            />

            <Input
              label="Date de naissance"
              type="date"
              {...form.register("dateOfBirth")}
            />

            <Input
              label="Poids cible (kg)"
              type="number"
              step="0.1"
              placeholder="70"
              {...form.register("targetWeight", { valueAsNumber: true })}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Le poids cible vous permet de suivre votre progression vers votre
            objectif
          </p>
        </Card>

        {/* Objectif */}
        <Card variant="glass" className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Objectif</h2>

          {profileData?.objective && (
            <div className="mb-4">
              <Badge variant="lime" className="mb-2">
                {profileData.objective.type === "competition"
                  ? "Compétition"
                  : profileData.objective.type === "weight_loss"
                    ? "Perte de poids"
                    : profileData.objective.type === "maintenance"
                      ? "Maintien"
                      : "Autre"}
              </Badge>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Description
            </label>
            <textarea
              placeholder="Décrivez votre objectif..."
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white placeholder:text-gray-600 transition-all focus:border-accent-lime focus:outline-none focus:ring-2 focus:ring-accent-lime/50"
              {...form.register("objectiveDescription")}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={saving}
            disabled={saving}
            icon={<CheckCircle size={20} weight="bold" />}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
}
