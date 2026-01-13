import { NextRequest, NextResponse } from "next/server";
import { getMistralClient, DEFAULT_MODEL } from "@/lib/mistral/client";
import { COACH_SYSTEM_PROMPT } from "@/lib/mistral/prompts";
import { queryDocuments, where, orderBy, limit } from "@/lib/firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, message, includeContext = true } = body;

    if (!userId || !message) {
      return NextResponse.json(
        { error: "userId et message sont requis" },
        { status: 400 }
      );
    }

    // Construire le contexte utilisateur
    let contextText = "";

    if (includeContext) {
      try {
        // Récupérer les dernières séances (7 derniers jours)
        const recentWorkouts = await queryDocuments("workouts", [
          where("userId", "==", userId),
          orderBy("date", "desc"),
          limit(10),
        ]);

        // Récupérer le profil utilisateur
        const userProfile = await queryDocuments("userProfiles", [
          where("__name__", "==", userId),
          limit(1),
        ]);

        // Récupérer les dernières pesées
        const recentWeights = await queryDocuments("weighIns", [
          where("userId", "==", userId),
          orderBy("date", "desc"),
          limit(5),
        ]);

        // Construire le contexte
        if (userProfile.length > 0) {
          const profile = userProfile[0];
          contextText += `\n## Profil utilisateur :\n`;
          contextText += `- Sports : ${profile.sports?.map((s: any) => s.name).join(", ")}\n`;
          contextText += `- Objectif : ${profile.objective?.description || "Non défini"}\n`;
        }

        if (recentWorkouts.length > 0) {
          contextText += `\n## Dernières séances (${recentWorkouts.length}) :\n`;
          recentWorkouts.forEach((w: any) => {
            contextText += `- ${w.sport} : ${w.duration}min, RPE ${w.rpe}/10\n`;
          });

          // Calculer stats
          const totalMinutes = recentWorkouts.reduce(
            (sum: number, w: any) => sum + w.duration,
            0
          );
          const avgRPE = (
            recentWorkouts.reduce((sum: number, w: any) => sum + w.rpe, 0) /
            recentWorkouts.length
          ).toFixed(1);
          contextText += `\nStats récentes : ${recentWorkouts.length} séances, ${totalMinutes}min total, RPE moyen ${avgRPE}\n`;
        } else {
          contextText += `\n## Aucune séance récente enregistrée.\n`;
        }

        if (recentWeights.length > 0) {
          const latestWeight = recentWeights[0];
          contextText += `\n## Poids actuel : ${latestWeight.weight} kg\n`;
        }
      } catch (error) {
        console.error("Erreur récupération contexte:", error);
        // Continue sans contexte si erreur
      }
    }

    // Appel Mistral
    const mistral = getMistralClient();

    const response = await mistral.chat.complete({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: COACH_SYSTEM_PROMPT + (contextText ? `\n\n${contextText}` : ""),
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    const assistantMessage =
      response.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";

    return NextResponse.json({
      message: assistantMessage,
      model: DEFAULT_MODEL,
    });
  } catch (error: any) {
    console.error("Erreur API Coach:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la communication avec le coach IA",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
