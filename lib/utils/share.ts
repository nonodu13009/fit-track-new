/**
 * Utilitaires pour le partage natif (Web Share API)
 */

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

/**
 * Vérifier si le partage natif est disponible
 */
export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * Partager du contenu via Web Share API
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (!canShare()) {
    // Fallback : copier dans le clipboard
    try {
      await navigator.clipboard.writeText(data.text);
      return true;
    } catch (error) {
      console.error("Erreur copie clipboard:", error);
      return false;
    }
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error: any) {
    // User cancelled or error
    if (error.name !== "AbortError") {
      console.error("Erreur partage:", error);
    }
    return false;
  }
}

/**
 * Formater une séance pour partage
 */
export function formatWorkoutForShare(workout: {
  sport: string;
  duration: number;
  rpe: number;
  notes?: string;
  date: string;
}): ShareData {
  const date = new Date(workout.date).toLocaleDateString("fr-FR");
  
  let text = `🥋 Séance ${workout.sport}\n`;
  text += `📅 ${date}\n`;
  text += `⏱️ ${workout.duration} minutes\n`;
  text += `💪 Intensité : ${workout.rpe}/10\n`;
  if (workout.notes) {
    text += `\n📝 ${workout.notes}\n`;
  }
  text += `\n🔗 JJB Tracking - Journal + Planner + Coach IA`;

  return {
    title: `Séance ${workout.sport}`,
    text,
  };
}

/**
 * Formater un template pour partage
 */
export function formatTemplateForShare(template: {
  name: string;
  sport: string;
  duration: number;
  description?: string;
}): ShareData {
  let text = `🏋️ Template : ${template.name}\n`;
  text += `🥋 Sport : ${template.sport}\n`;
  text += `⏱️ Durée : ${template.duration} min\n`;
  if (template.description) {
    text += `\n📝 ${template.description}\n`;
  }
  text += `\n🔗 JJB Tracking`;

  return {
    title: template.name,
    text,
  };
}

/**
 * Formater un repas pour partage
 */
export function formatMealForShare(meal: {
  mealType: string;
  items: Array<{ ingredientName: string; quantity: number }>;
  totalCalories: number;
  macros: { protein: number; carbs: number; fat: number };
}): ShareData {
  const mealLabels: Record<string, string> = {
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Snack",
  };

  let text = `🍽️ ${mealLabels[meal.mealType] || meal.mealType}\n\n`;
  text += `Ingrédients :\n`;
  meal.items.forEach((item) => {
    text += `• ${item.ingredientName} (${item.quantity}g)\n`;
  });
  text += `\n📊 Macros :\n`;
  text += `• Calories : ${meal.totalCalories} kcal\n`;
  text += `• Protéines : ${meal.macros.protein.toFixed(0)}g\n`;
  text += `• Glucides : ${meal.macros.carbs.toFixed(0)}g\n`;
  text += `• Lipides : ${meal.macros.fat.toFixed(0)}g\n`;
  text += `\n🔗 JJB Tracking`;

  return {
    title: mealLabels[meal.mealType] || "Repas",
    text,
  };
}
