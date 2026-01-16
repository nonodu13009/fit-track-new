import { NextRequest, NextResponse } from "next/server";
import { getMistralClient, DEFAULT_MODEL } from "@/lib/mistral/client";
import { COACH_SYSTEM_PROMPT } from "@/lib/mistral/prompts";
import { COACH_TOOLS } from "@/lib/mistral/tools";
import {
  queryDocuments,
  getDocument,
  createDocument,
  updateDocument,
  where,
  orderBy,
  limit,
} from "@/lib/firebase/firestore";
import { parseISO, format, addDays, startOfDay } from "date-fns";

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
        const userProfileDoc = await getDocument("userProfiles", userId);

        // Récupérer les dernières pesées
        const recentWeights = await queryDocuments("weighIns", [
          where("userId", "==", userId),
          orderBy("date", "desc"),
          limit(5),
        ]);

        // Construire le contexte
        if (userProfileDoc) {
          contextText += `\n## Profil utilisateur :\n`;
          contextText += `- Sports : ${userProfileDoc.sports?.map((s: any) => s.name).join(", ") || "Non défini"}\n`;
          contextText += `- Objectif : ${userProfileDoc.objective?.description || "Non défini"}\n`;
          if (userProfileDoc.physical?.targetWeight) {
            contextText += `- Poids cible : ${userProfileDoc.physical.targetWeight} kg\n`;
          }
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

    // Appel Mistral avec tool calling
    const mistral = getMistralClient();
    const messages: any[] = [
      {
        role: "system",
        content: COACH_SYSTEM_PROMPT + (contextText ? `\n\n${contextText}` : ""),
      },
      {
        role: "user",
        content: message,
      },
    ];

    let finalResponse = "";
    let maxIterations = 5; // Limiter les itérations pour éviter les boucles infinies
    let iteration = 0;

    // Désactiver temporairement les tool calls pour debug
    // TODO: Réactiver une fois que le coach de base fonctionne
    const ENABLE_TOOL_CALLING = false;
    
    while (iteration < maxIterations) {
      try {
        // Vérifier si c'est la première itération et si on doit utiliser les tools
        const useTools = ENABLE_TOOL_CALLING && iteration === 0 ? COACH_TOOLS : undefined;
        
        const requestOptions: any = {
          model: DEFAULT_MODEL,
          messages,
          temperature: 0.7,
          maxTokens: 1000,
        };
        
        if (useTools) {
          requestOptions.tools = useTools;
        }
        
        const response = await mistral.chat.complete(requestOptions);

        const choice = response.choices?.[0];
        if (!choice) {
          finalResponse = "Désolé, je n'ai pas reçu de réponse du modèle.";
          break;
        }

        const assistantMessage = choice.message;

        // Si l'IA veut utiliser un tool (vérifier tool_calls avec underscore)
        const toolCalls = (assistantMessage as any).tool_calls || (assistantMessage as any).toolCalls;
        
        if (toolCalls && toolCalls.length > 0) {
          // Ajouter le message de l'assistant avec tool calls
          messages.push({
            role: "assistant",
            content: assistantMessage.content || null,
            tool_calls: toolCalls,
          });

          // Exécuter chaque tool call
          for (const toolCall of toolCalls) {
            const toolName = toolCall.function?.name || "unknown";
            const toolCallId = toolCall.id || toolCall.tool_call_id || "";
            
            try {
              if (!toolCall.function?.name) {
                console.error("Tool call sans nom:", toolCall);
                continue;
              }

              let toolArgs: any = {};
              try {
                const argsString = toolCall.function?.arguments;
                if (argsString) {
                  toolArgs = typeof argsString === "string" ? JSON.parse(argsString) : argsString;
                }
              } catch (parseError) {
                console.error("Erreur parsing arguments:", parseError, toolCall.function?.arguments);
                toolArgs = {};
              }

              let toolResult: any;

              try {
                switch (toolName) {
                  case "getCalendarEvents":
                    toolResult = await handleGetCalendarEvents(userId, toolArgs);
                    break;
                  case "createEvent":
                    toolResult = await handleCreateEvent(userId, toolArgs);
                    break;
                  case "updateEvent":
                    toolResult = await handleUpdateEvent(userId, toolArgs);
                    break;
                  default:
                    toolResult = { error: `Tool inconnu: ${toolName}` };
                }
              } catch (error: any) {
                toolResult = { error: error.message || "Erreur lors de l'exécution" };
              }

              // Ajouter le résultat du tool (utiliser tool_call_id avec underscore)
              // Le SDK Mistral attend tool_call_id (avec underscore)
              const toolMessage: any = {
                role: "tool",
                content: JSON.stringify(toolResult),
                tool_call_id: toolCallId,
              };
              // Ajouter name seulement si présent (optionnel selon SDK)
              if (toolName && toolName !== "unknown") {
                toolMessage.name = toolName;
              }
              messages.push(toolMessage);
            } catch (toolError: any) {
              console.error(`Erreur lors de l'exécution du tool ${toolName}:`, toolError);
              // Ajouter un message d'erreur pour le tool
              messages.push({
                role: "tool",
                content: JSON.stringify({
                  success: false,
                  error: toolError.message || "Erreur lors de l'exécution",
                }),
                name: toolName,
                tool_call_id: toolCallId,
              });
            }
          }

          iteration++;
          continue;
        }

        // Pas de tool call, récupérer la réponse finale
        const content = assistantMessage.content;
        finalResponse =
          typeof content === "string"
            ? content
            : Array.isArray(content)
              ? content
                  .map((chunk: any) =>
                    typeof chunk === "string" ? chunk : chunk.text || ""
                  )
                  .join("")
              : "Désolé, je n'ai pas pu générer de réponse.";
        break;
      } catch (iterationError: any) {
        console.error(`Erreur lors de l'itération ${iteration}:`, iterationError);
        console.error("Stack trace:", iterationError.stack);
        console.error("Message d'erreur:", iterationError.message);
        
        // Si c'est la première itération et que l'erreur est liée aux tools, essayer sans tools
        if (iteration === 0 && (iterationError.message?.includes("tool") || iterationError.message?.includes("function"))) {
          console.log("Tentative sans tools en fallback...");
          try {
            const fallbackResponse = await mistral.chat.complete({
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
            const fallbackContent = fallbackResponse.choices?.[0]?.message?.content;
            finalResponse =
              typeof fallbackContent === "string"
                ? fallbackContent
                : Array.isArray(fallbackContent)
                  ? fallbackContent
                      .map((chunk: any) =>
                        typeof chunk === "string" ? chunk : chunk.text || ""
                      )
                      .join("")
                  : "Désolé, je n'ai pas pu générer de réponse.";
            break;
          } catch (fallbackError: any) {
            console.error("Erreur fallback:", fallbackError);
            throw fallbackError;
          }
        } else {
          throw iterationError;
        }
      }
    }

    if (!finalResponse && iteration >= maxIterations) {
      finalResponse = "J'ai rencontré un problème lors du traitement. Pouvez-vous reformuler votre demande ?";
    }

    return NextResponse.json({
      message: finalResponse,
      model: DEFAULT_MODEL,
    });
  } catch (error: any) {
    // Logging détaillé pour debugging
    console.error("=== ERREUR API COACH ===");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Name:", error.name);
    console.error("Type:", typeof error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    console.error("========================");
    
    // Message d'erreur plus spécifique selon le type d'erreur
    let errorMessage = "Erreur lors de la communication avec le coach IA";
    
    if (error.message?.includes("MISTRAL_API_KEY")) {
      errorMessage = "Configuration manquante : la clé API Mistral n'est pas configurée";
    } else if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
      errorMessage = "Clé API Mistral invalide ou expirée";
    } else if (error.message?.includes("429") || error.message?.includes("rate limit")) {
      errorMessage = "Limite de requêtes atteinte, veuillez réessayer plus tard";
    } else if (error.message) {
      errorMessage = `Erreur : ${error.message}`;
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Handlers pour les tools

async function handleGetCalendarEvents(
  userId: string,
  args: { startDate?: string; endDate?: string }
) {
  try {
    const start = args.startDate
      ? startOfDay(parseISO(args.startDate))
      : startOfDay(new Date());
    const end = args.endDate
      ? startOfDay(parseISO(args.endDate))
      : startOfDay(addDays(new Date(), 7));

    // Récupérer tous les événements de l'utilisateur et filtrer côté serveur
    const allEvents = await queryDocuments("calendarEvents", [
      where("userId", "==", userId),
      orderBy("start", "asc"),
    ]);

    // Filtrer par date
    const events = allEvents.filter((e: any) => {
      const eventDate = parseISO(e.start);
      return eventDate >= start && eventDate <= end;
    });

    return {
      success: true,
      events: events.map((e: any) => ({
        id: e.id,
        title: e.title,
        sport: e.sport,
        date: format(parseISO(e.start), "yyyy-MM-dd"),
        time: e.isAllDay ? null : format(parseISO(e.start), "HH:mm"),
        duration: e.duration,
        status: e.status,
      })),
      count: events.length,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function handleCreateEvent(
  userId: string,
  args: {
    title: string;
    sport?: string;
    date: string;
    time?: string;
    duration?: number;
    notes?: string;
  }
) {
  try {
    const eventId = `${userId}_${Date.now()}`;
    const dateObj = parseISO(args.date);

    let startDate: string;
    let endDate: string;

    if (args.time) {
      // Événement avec heure précise
      const [hours, minutes] = args.time.split(":").map(Number);
      dateObj.setHours(hours, minutes, 0, 0);
      startDate = dateObj.toISOString();

      const duration = args.duration || 60;
      const endDateObj = new Date(dateObj);
      endDateObj.setMinutes(endDateObj.getMinutes() + duration);
      endDate = endDateObj.toISOString();
    } else {
      // Événement toute la journée
      const dayStart = startOfDay(dateObj);
      startDate = dayStart.toISOString();
      endDate = dayStart.toISOString();
    }

    const eventData = {
      userId,
      title: args.title,
      sport: args.sport || "",
      duration: args.duration || 60,
      start: startDate,
      end: endDate,
      isAllDay: !args.time,
      status: "planned" as const,
      notes: args.notes || "",
    };

    await createDocument("calendarEvents", eventId, eventData);

    return {
      success: true,
      message: `Événement "${args.title}" créé avec succès`,
      eventId,
      date: format(parseISO(startDate), "dd/MM/yyyy"),
      time: args.time || "Toute la journée",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function handleUpdateEvent(
  userId: string,
  args: {
    eventId: string;
    title?: string;
    date?: string;
    time?: string;
    duration?: number;
  }
) {
  try {
    // Vérifier que l'événement existe et appartient à l'utilisateur
    const event = await getDocument("calendarEvents", args.eventId);
    if (!event || (event as any).userId !== userId) {
      return { success: false, error: "Événement non trouvé" };
    }

    const updateData: any = {};

    if (args.title) updateData.title = args.title;
    if (args.duration) updateData.duration = args.duration;

    // Si date ou heure changent, recalculer start/end
    if (args.date || args.time) {
      const oldStart = parseISO((event as any).start);
      const newDate = args.date ? parseISO(args.date) : oldStart;

      if (args.time) {
        const [hours, minutes] = args.time.split(":").map(Number);
        newDate.setHours(hours, minutes, 0, 0);
        updateData.start = newDate.toISOString();
        updateData.isAllDay = false;

        const duration = args.duration || (event as any).duration || 60;
        const endDate = new Date(newDate);
        endDate.setMinutes(endDate.getMinutes() + duration);
        updateData.end = endDate.toISOString();
      } else if (args.date) {
        // Changement de date seulement, préserver l'heure
        const oldTime = new Date(oldStart);
        newDate.setHours(
          oldTime.getHours(),
          oldTime.getMinutes(),
          oldTime.getSeconds()
        );
        updateData.start = newDate.toISOString();

        const duration = args.duration || (event as any).duration || 60;
        const endDate = new Date(newDate);
        endDate.setMinutes(endDate.getMinutes() + duration);
        updateData.end = endDate.toISOString();
      }
    }

    await updateDocument("calendarEvents", args.eventId, updateData);

    return {
      success: true,
      message: "Événement modifié avec succès",
      eventId: args.eventId,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
