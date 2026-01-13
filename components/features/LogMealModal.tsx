"use client";

import { useState } from "react";
import { Modal, Button, Badge } from "@/components/ui";
import { MEAL_TYPES, type MealItem } from "@/types/nutrition";
import { INGREDIENTS_DATABASE, calculateMacros } from "@/lib/data/ingredients";
import { useAuth } from "@/hooks/useAuth";
import { createDocument } from "@/lib/firebase/firestore";
import { useToastContext } from "@/components/providers/ToastProvider";
import { Plus, Trash } from "@phosphor-icons/react";

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogMealModal({ isOpen, onClose }: LogMealModalProps) {
  const { user } = useAuth();
  const toast = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [items, setItems] = useState<MealItem[]>([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [quantity, setQuantity] = useState<number>(100);

  const addItem = () => {
    if (!selectedIngredientId) return;

    const ingredient = INGREDIENTS_DATABASE.find(
      (i) => i.id === selectedIngredientId
    );
    if (!ingredient) return;

    const macros = calculateMacros(ingredient, quantity);

    const newItem: MealItem = {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      quantity,
      calories: macros.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
    };

    setItems([...items, newItem]);
    setSelectedIngredientId("");
    setQuantity(100);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalMacros = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const onSubmit = async () => {
    if (!user || items.length === 0) return;

    setIsLoading(true);

    try {
      const mealId = `${user.uid}_${Date.now()}`;
      await createDocument("meals", mealId, {
        userId: user.uid,
        mealType,
        items,
        totalCalories: totalMacros.calories,
        macros: totalMacros,
        date: new Date().toISOString(),
      });

      toast.success("Repas enregistré !");
      setItems([]);
      setMealType("lunch");
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Logger un repas"
      size="lg"
    >
      <div className="space-y-4">
        {/* Type de repas */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">
            Type de repas
          </label>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setMealType(type.id)}
                className={`rounded-lg border p-3 text-center transition-all ${
                  mealType === type.id
                    ? "border-accent-cyan bg-accent-cyan/10 shadow-glow-cyan"
                    : "border-white/10 bg-surface hover:border-accent-cyan/50"
                }`}
              >
                <div className="mb-1 text-2xl">{type.emoji}</div>
                <div className="text-xs text-white">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ajouter un aliment */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-400">
            Ajouter un aliment
          </label>
          <div className="flex gap-2">
            <select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            >
              <option value="">Sélectionnez un aliment</option>
              {INGREDIENTS_DATABASE.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="100"
              className="w-24 rounded-lg border border-white/10 bg-surface px-4 py-2 text-white transition-colors focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            />

            <Button
              onClick={addItem}
              disabled={!selectedIngredientId}
              icon={<Plus size={16} weight="bold" />}
              size="sm"
            >
              Ajouter
            </Button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Quantité en grammes</p>
        </div>

        {/* Liste des items */}
        {items.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Aliments du repas
            </label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-surface p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {item.ingredientName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.quantity}g - {item.calories} kcal - P:{" "}
                      {item.protein}g C: {item.carbs}g L: {item.fat}g
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        {items.length > 0 && (
          <div className="rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 p-4">
            <h4 className="mb-2 text-sm font-semibold text-white">
              Total du repas
            </h4>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-gray-400">Calories</p>
                <p className="text-lg font-bold text-accent-cyan">
                  {totalMacros.calories}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Protéines</p>
                <p className="text-lg font-bold text-accent-purple">
                  {totalMacros.protein.toFixed(1)}g
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Glucides</p>
                <p className="text-lg font-bold text-accent-lime">
                  {totalMacros.carbs.toFixed(1)}g
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Lipides</p>
                <p className="text-lg font-bold text-yellow-400">
                  {totalMacros.fat.toFixed(1)}g
                </p>
              </div>
            </div>
          </div>
        )}

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
            onClick={onSubmit}
            className="flex-1"
            isLoading={isLoading}
            disabled={isLoading || items.length === 0}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
