"use client";

import { useState } from "react";
import { Card, Badge, Loading, Button } from "@/components/ui";
import { LogMealModal } from "@/components/features/LogMealModal";
import { useMeals } from "@/hooks/useMeals";
import { MEAL_TYPES } from "@/types/nutrition";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, ForkKnife } from "@phosphor-icons/react";

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { meals, dailyTotal, loading } = useMeals(selectedDate);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Objectifs journaliers (à personnaliser plus tard)
  const goals = {
    calories: 2500,
    protein: 150,
    carbs: 250,
    fat: 80,
  };

  const getPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getMealsByType = (type: string) => {
    return meals.filter((m) => m.mealType === type);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Nutrition</h1>
          <p className="mt-1 text-sm text-gray-400">
            {format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={16} weight="bold" />}
        >
          Ajouter
        </Button>
      </div>

      {/* Total journalier */}
      <Card variant="glass" className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Résumé du jour
        </h2>

        {/* Macros Grid */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div>
            <p className="mb-1 text-xs text-gray-400">Calories</p>
            <p className="text-2xl font-bold text-accent-cyan">
              {dailyTotal.calories}
            </p>
            <p className="text-xs text-gray-500">/ {goals.calories} kcal</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Protéines</p>
            <p className="text-2xl font-bold text-accent-purple">
              {dailyTotal.protein.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">/ {goals.protein}g</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Glucides</p>
            <p className="text-2xl font-bold text-accent-lime">
              {dailyTotal.carbs.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">/ {goals.carbs}g</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Lipides</p>
            <p className="text-2xl font-bold text-yellow-400">
              {dailyTotal.fat.toFixed(0)}
            </p>
            <p className="text-xs text-gray-500">/ {goals.fat}g</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-gray-400">Calories</span>
              <span className="text-accent-cyan">
                {getPercentage(dailyTotal.calories, goals.calories).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full bg-accent-cyan transition-all"
                style={{
                  width: `${getPercentage(dailyTotal.calories, goals.calories)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-gray-400">Protéines</span>
              <span className="text-accent-purple">
                {getPercentage(dailyTotal.protein, goals.protein).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full bg-accent-purple transition-all"
                style={{
                  width: `${getPercentage(dailyTotal.protein, goals.protein)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Repas par type */}
      <div className="space-y-4">
        {MEAL_TYPES.map((mealType) => {
          const typeMeals = getMealsByType(mealType.id);
          const typeTotal = typeMeals.reduce(
            (sum, meal) => sum + meal.totalCalories,
            0
          );

          return (
            <Card key={mealType.id} variant="elevated">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mealType.emoji}</span>
                  <h3 className="text-lg font-semibold text-white">
                    {mealType.label}
                  </h3>
                  {typeMeals.length > 0 && (
                    <Badge variant="cyan" size="sm">
                      {typeTotal} kcal
                    </Badge>
                  )}
                </div>
              </div>

              {typeMeals.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">
                  Aucun repas enregistré
                </p>
              ) : (
                <div className="space-y-2">
                  {typeMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-lg bg-surface p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {meal.items.length} aliment(s)
                        </p>
                        <p className="text-sm text-gray-400">
                          {format(new Date(meal.date), "HH:mm")}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {meal.items.map((item, index) => (
                          <p key={index} className="text-xs text-gray-400">
                            • {item.ingredientName} ({item.quantity}g)
                          </p>
                        ))}
                      </div>

                      <div className="mt-2 flex gap-4 border-t border-white/10 pt-2 text-xs text-gray-400">
                        <span>P: {meal.macros.protein.toFixed(0)}g</span>
                        <span>G: {meal.macros.carbs.toFixed(0)}g</span>
                        <span>L: {meal.macros.fat.toFixed(0)}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty state global */}
      {meals.length === 0 && (
        <Card variant="glass">
          <div className="py-12 text-center">
            <ForkKnife
              size={48}
              weight="fill"
              className="mx-auto mb-4 text-gray-600"
            />
            <p className="mb-2 text-lg font-medium text-gray-400">
              Aucun repas enregistré aujourd&apos;hui
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Utilisez le bouton + pour logger vos repas
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<Plus size={20} weight="bold" />}
            >
              Logger un repas
            </Button>
          </div>
        </Card>
      )}

      {/* Disclaimer santé */}
      <Card variant="elevated" className="border-yellow-500/30 bg-yellow-500/5">
        <p className="text-xs text-yellow-400">
          ⚠️ <strong>Disclaimer</strong> : Les informations nutritionnelles sont
          indicatives. Consultez un professionnel de santé pour un suivi
          personnalisé.
        </p>
      </Card>

      {/* Modal Log Meal */}
      <LogMealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
