"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { validateComboSequence, calculateComboScore } from "@/lib/progression/interactions";

interface ComboAction {
  id: string;
  label: string;
}

interface ComboBuilderProps {
  actions: ComboAction[];
  correctSequence: string[]; // IDs dans l'ordre correct
  onComplete?: (score: number) => void;
}

function SortableAction({
  action,
  isCorrect,
}: {
  action: ComboAction;
  isCorrect: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: action.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-surface rounded-lg border cursor-grab active:cursor-grabbing ${
        isCorrect
          ? "border-green-500/50 bg-green-500/10"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="text-lg">↕️</div>
        <span className="text-white font-medium">{action.label}</span>
        {isCorrect && <span className="text-green-400 ml-auto">✓</span>}
      </div>
    </div>
  );
}

export function ComboBuilder({
  actions,
  correctSequence,
  onComplete,
}: ComboBuilderProps) {
  const [sequence, setSequence] = useState<string[]>(
    actions.map((a) => a.id).sort(() => Math.random() - 0.5) // Mélanger
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSequence((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    // Vérifier après le drag
    setTimeout(() => {
      const isValid = validateComboSequence(sequence, correctSequence);
      const newScore = calculateComboScore(sequence, correctSequence);

      if (isValid && !isCompleted) {
        setIsCompleted(true);
        setScore(newScore);
        if (onComplete) {
          onComplete(newScore);
        }
      } else {
        setScore(newScore);
      }
    }, 100);
  };

  const getActionById = (id: string) => {
    return actions.find((a) => a.id === id);
  };

  const getActionIndex = (id: string) => {
    return correctSequence.indexOf(id);
  };

  const isActionCorrect = (id: string, currentIndex: number) => {
    const correctIndex = getActionIndex(id);
    return correctIndex === currentIndex;
  };

  return (
    <Card variant="elevated" className="p-4">
      <h3 className="text-lg font-semibold mb-4">Combo Builder</h3>
      <p className="text-sm text-gray-400 mb-4">
        Glisse les actions dans le bon ordre
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sequence} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sequence.map((actionId, index) => {
              const action = getActionById(actionId);
              if (!action) return null;

              const isCorrect = isActionCorrect(actionId, index);

              return (
                <SortableAction
                  key={actionId}
                  action={action}
                  isCorrect={isCorrect}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-lg font-bold text-green-400 mb-1">
            COMBO COMPLETED!
          </div>
          <div className="text-sm text-gray-300">Score: {score}%</div>
        </motion.div>
      )}

      {!isCompleted && score > 0 && (
        <div className="mt-4 text-sm text-gray-400 text-center">
          Score actuel: {score}%
        </div>
      )}
    </Card>
  );
}
