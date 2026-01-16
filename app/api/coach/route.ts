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
import {
  adminGetDocument,
  adminQueryDocuments,
  adminCreateDocument,
  adminUpdateDocument,
} from "@/lib/firebase/admin";
import { parseISO, format, addDays, startOfDay, isValid } from "date-fns";

// ========================================
// Fonctions utilitaires de validation
// ========================================

/**
 * Valide le format de date ISO (YYYY-MM-DD)
 */
function validateDateFormat(date: string): boolean {
  if (!date || typeof date !== "string") {
    return false;
  }
  // Format ISO YYYY-MM-DD
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) {
    return false;
  }
  // Vérifier que la date est valide
  try {
    const parsed = parseISO(date);
    return isValid(parsed);
  } catch {
    return false;
  }
}

/**
 * Valide le format d'heure HH:mm
 */
function validateTimeFormat(time: string): boolean {
  if (!time || typeof time !== "string") {
    return false;
  }
  // Format HH:mm
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

/**
 * Retry avec backoff exponentiel pour erreurs temporaires
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Vérifier si l'erreur est retryable (429 ou 500)
      const isRetryable =
        error.message?.includes("429") ||
        error.message?.includes("rate limit") ||
        error.message?.includes("500") ||
        error.response?.status === 429 ||
        error.response?.status === 500;
      
      // Si dernière tentative ou erreur non retryable, throw
      if (attempt === maxRetries || !isRetryable) {
        throw error;
      }
      
      // Calculer délai avec backoff exponentiel
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(
        `Tentative ${attempt + 1}/${maxRetries} échouée, retry dans ${delay}ms...`
      );
      
      // Attendre avant retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

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
        // ⚠️ Utiliser Admin SDK pour bypass les règles Firestore dans les routes API
        // Récupérer les dernières séances (7 derniers jours)
        const recentWorkouts = await adminQueryDocuments(
          "workouts",
          [{ field: "userId", operator: "==", value: userId }],
          "date",
          "desc",
          10
        );

        // Récupérer le profil utilisateur
        const userProfileDoc = await adminGetDocument("userProfiles", userId);

        // Récupérer les dernières pesées
        const recentWeights = await adminQueryDocuments(
          "weighIns",
          [{ field: "userId", operator: "==", value: userId }],
          "date",
          "desc",
          5
        );

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

    // Appel Mistral avec tool calling - Boucle pour gérer plusieurs rounds
    const mistral = getMistralClient();
    let messages: any[] = [
      {
        role: "system",
        content: COACH_SYSTEM_PROMPT + (contextText ? `\n\n${contextText}` : ""),
      },
      {
        role: "user",
        content: message,
      },
    ];

    // Tool calling activé : permet au coach de mettre à jour l'agenda
    const ENABLE_TOOL_CALLING = true;
    const MAX_ITERATIONS = 5; // Limite pour éviter les boucles infinies

    try {
      // Boucle pour gérer plusieurs rounds de tool calls
      for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
        console.log(`[Coach API] Itération ${iteration + 1}/${MAX_ITERATIONS} - Appel Mistral avec ${messages.length} message(s)`);
        
        const response = await retryWithBackoff(
          () => mistral.chat.complete({
            model: DEFAULT_MODEL,
            messages,
            tools: ENABLE_TOOL_CALLING ? COACH_TOOLS : undefined,
            temperature: 0.7,
            maxTokens: 1000,
          }),
          3,
          1000
        );

        const assistantMessage = response.choices?.[0]?.message;
        if (!assistantMessage) {
          return NextResponse.json({ error: "Pas de réponse du modèle" }, { status: 500 });
        }

        // ⚠️ CRITIQUE : Utiliser le message assistant EXACTEMENT comme Mistral le retourne
        // Ne RIEN modifier, utiliser tel quel
        messages.push(assistantMessage);

        // Vérifier si tool calls présents
        const toolCalls = (assistantMessage as any).tool_calls || assistantMessage.toolCalls;
        
        // Si pas de tool calls, c'est la réponse finale
        if (!toolCalls || toolCalls.length === 0) {
          console.log(`[Coach API] Réponse finale obtenue (pas de tool calls)`);
          const content = assistantMessage.content;
          const responseText = typeof content === "string"
            ? content
            : Array.isArray(content)
              ? content.map((c: any) => typeof c === "string" ? c : c.text || "").join("")
              : "";

          return NextResponse.json({
            message: responseText || "Réponse vide du modèle",
            model: DEFAULT_MODEL,
          });
        }

        // Il y a des tool calls, les exécuter
        console.log(`[Coach API] ${toolCalls.length} tool call(s) détecté(s) à l'itération ${iteration + 1}`);
        
        // Exécuter chaque tool et ajouter réponse (dans l'ordre EXACT)
        // ⚠️ CRITIQUE : TOUJOURS créer une réponse pour chaque tool call
        // ⚠️ CRITIQUE : Utiliser les IDs EXACTS de Mistral, ne rien modifier
        for (let i = 0; i < toolCalls.length; i++) {
          const toolCall = toolCalls[i];
          let toolCallId = toolCall.id;
          const toolName = toolCall.function?.name;
          
          // Si pas d'ID, utiliser l'ID du message assistant
          if (!toolCallId) {
            console.error(`[Coach API] ❌ ERREUR CRITIQUE: Tool call ${i} sans ID !`, toolCall);
            // Récupérer l'ID depuis le message assistant qu'on vient d'ajouter
            const lastAssistantMsg = messages[messages.length - 1];
            if (lastAssistantMsg && lastAssistantMsg.tool_calls && lastAssistantMsg.tool_calls[i]) {
              toolCallId = lastAssistantMsg.tool_calls[i].id;
              console.log(`[Coach API] Récupération ID depuis message assistant: ${toolCallId}`);
            } else {
              // Fallback: générer un ID (ne devrait jamais arriver)
              toolCallId = `fallback_${i}_${Date.now()}`;
              console.error(`[Coach API] ⚠️ Génération ID fallback: ${toolCallId}`);
            }
          }
          
          let toolResult: any;
          
          if (!toolName) {
            console.error(`[Coach API] ⚠️ Tool call ${i} sans nom de fonction`);
            toolResult = { success: false, error: "Nom de fonction manquant" };
          } else {
            // Exécuter le tool
            try {
              toolResult = await executeTool(toolCall, userId);
            } catch (error: any) {
              console.error(`[Coach API] Erreur exécution tool ${toolName}:`, error);
              toolResult = { success: false, error: error.message || "Erreur lors de l'exécution" };
            }
          }
          
          // TOUJOURS créer la réponse avec l'ID EXACT
          const toolResponse = {
            role: "tool",
            tool_call_id: toolCallId, // ID EXACT de Mistral ou récupéré
            name: toolName || "unknown",
            content: JSON.stringify(toolResult),
          };
          
          messages.push(toolResponse);
          console.log(`[Coach API] Tool response ${i + 1}/${toolCalls.length}: ${toolName || "unknown"} (ID: ${toolCallId})`);
        }
        
        // Vérification de sécurité
        const assistantMsgs = messages.filter((m: any) => m.role === "assistant" && (m.tool_calls || m.toolCalls));
        const toolMsgs = messages.filter((m: any) => m.role === "tool");
        console.log(`[Coach API] Vérification: ${assistantMsgs.length} assistant(s) avec tool_calls, ${toolMsgs.length} tool response(s)`);
        
        // Vérifier que chaque tool call a une réponse
        const totalToolCalls = assistantMsgs.reduce(
          (sum: number, msg: any) => sum + ((msg.tool_calls || msg.toolCalls || []).length),
          0
        );
        
        if (totalToolCalls !== toolMsgs.length) {
          console.error(`[Coach API] ❌ NOMBRE DIFFÉRENT: ${totalToolCalls} tool calls vs ${toolMsgs.length} tool responses`);
          // Continuer quand même, mais logger l'erreur
        }

        // La boucle continue avec les tool responses pour le prochain appel
        console.log(`[Coach API] Préparation pour l'itération suivante avec ${messages.length} messages`);
      }

      // Si MAX_ITERATIONS atteint, retourner une erreur
      console.error(`[Coach API] ❌ Limite de ${MAX_ITERATIONS} itérations atteinte`);
      return NextResponse.json(
        { 
          error: "Le modèle demande trop d'actions successives. Veuillez reformuler votre demande de manière plus simple." 
        },
        { status: 500 }
      );
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
  } catch (outerError: any) {
    // Erreur dans le try externe (parsing request, etc.)
    console.error("[Coach API] Erreur externe:", outerError);
    return NextResponse.json(
      {
        error: "Erreur lors du traitement de la requête",
        details: process.env.NODE_ENV === "development" ? outerError.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Fonction simplifiée pour exécuter les tools
async function executeTool(toolCall: any, userId: string): Promise<any> {
  const toolName = toolCall.function?.name;
  let toolArgs: any = {};

  try {
    const argsString = toolCall.function?.arguments;
    if (argsString) {
      toolArgs = typeof argsString === "string" ? JSON.parse(argsString) : argsString;
    }
  } catch (parseError) {
    console.error(`[Coach API] Erreur parsing arguments pour ${toolName}:`, parseError);
    return { success: false, error: "Arguments invalides" };
  }

  try {
    switch (toolName) {
      case "getCalendarEvents":
        return await handleGetCalendarEvents(userId, toolArgs);
      case "createEvent":
        return await handleCreateEvent(userId, toolArgs);
      case "updateEvent":
        return await handleUpdateEvent(userId, toolArgs);
      default:
        return { success: false, error: `Tool inconnu: ${toolName}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de l'exécution" };
  }
}

// Handlers pour les tools

async function handleGetCalendarEvents(
  userId: string,
  args: { startDate?: string; endDate?: string }
) {
  try {
    let start: Date;
    let end: Date;

    // Valider et parser startDate si fourni
    if (args.startDate) {
      if (!validateDateFormat(args.startDate)) {
        return {
          success: false,
          error: `Format de date invalide pour startDate: "${args.startDate}". Format attendu: YYYY-MM-DD`,
        };
      }
      try {
        start = startOfDay(parseISO(args.startDate));
        if (!isValid(start)) {
          return {
            success: false,
            error: `Date invalide pour startDate: "${args.startDate}"`,
          };
        }
      } catch (parseError: any) {
        return {
          success: false,
          error: `Erreur lors du parsing de startDate: ${parseError.message}`,
        };
      }
    } else {
      start = startOfDay(new Date());
    }

    // Valider et parser endDate si fourni
    if (args.endDate) {
      if (!validateDateFormat(args.endDate)) {
        return {
          success: false,
          error: `Format de date invalide pour endDate: "${args.endDate}". Format attendu: YYYY-MM-DD`,
        };
      }
      try {
        end = startOfDay(parseISO(args.endDate));
        if (!isValid(end)) {
          return {
            success: false,
            error: `Date invalide pour endDate: "${args.endDate}"`,
          };
        }
      } catch (parseError: any) {
        return {
          success: false,
          error: `Erreur lors du parsing de endDate: ${parseError.message}`,
        };
      }
    } else {
      end = startOfDay(addDays(new Date(), 7));
    }

    // Vérifier que start <= end
    if (start > end) {
      return {
        success: false,
        error: "startDate doit être antérieure ou égale à endDate",
      };
    }

    // Récupérer tous les événements de l'utilisateur et filtrer côté serveur
    // ⚠️ Utiliser Admin SDK pour bypass les règles Firestore
    const allEvents = await adminQueryDocuments(
      "calendarEvents",
      [{ field: "userId", operator: "==", value: userId }],
      "start",
      "asc"
    );

    // Filtrer par date
    const events = allEvents.filter((e: any) => {
      try {
        const eventDate = parseISO(e.start);
        return isValid(eventDate) && eventDate >= start && eventDate <= end;
      } catch {
        // Ignorer les événements avec dates invalides
        return false;
      }
    });

    return {
      success: true,
      events: events.map((e: any) => {
        try {
          return {
            id: e.id,
            title: e.title,
            sport: e.sport,
            date: format(parseISO(e.start), "yyyy-MM-dd"),
            time: e.isAllDay ? null : format(parseISO(e.start), "HH:mm"),
            duration: e.duration,
            status: e.status,
          };
        } catch {
          // Retourner un format minimal si parsing échoue
          return {
            id: e.id,
            title: e.title || "Sans titre",
            sport: e.sport || "",
            date: "Date invalide",
            time: null,
            duration: e.duration || 60,
            status: e.status || "planned",
          };
        }
      }),
      count: events.length,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur inconnue" };
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
    // Valider que title n'est pas vide
    if (!args.title || typeof args.title !== "string" || args.title.trim().length === 0) {
      return {
        success: false,
        error: "Le titre de l'événement est requis et ne peut pas être vide",
      };
    }

    // Valider le format de date
    if (!validateDateFormat(args.date)) {
      return {
        success: false,
        error: `Format de date invalide: "${args.date}". Format attendu: YYYY-MM-DD`,
      };
    }

    // Parser la date avec gestion d'erreur
    let dateObj: Date;
    try {
      dateObj = parseISO(args.date);
      if (!isValid(dateObj)) {
        return {
          success: false,
          error: `Date invalide: "${args.date}"`,
        };
      }
    } catch (parseError: any) {
      return {
        success: false,
        error: `Erreur lors du parsing de la date: ${parseError.message}`,
      };
    }

    // Valider le format d'heure si fourni
    if (args.time) {
      if (!validateTimeFormat(args.time)) {
        return {
          success: false,
          error: `Format d'heure invalide: "${args.time}". Format attendu: HH:mm (ex: 18:30)`,
        };
      }
    }

    // Valider la durée si fournie
    if (args.duration !== undefined) {
      if (typeof args.duration !== "number" || args.duration <= 0 || args.duration > 1440) {
        return {
          success: false,
          error: `Durée invalide: ${args.duration}. Doit être un nombre entre 1 et 1440 minutes`,
        };
      }
    }

    const eventId = `${userId}_${Date.now()}`;
    let startDate: string;
    let endDate: string;

    if (args.time) {
      // Événement avec heure précise
      try {
        const timeParts = args.time.split(":");
        if (timeParts.length !== 2) {
          return {
            success: false,
            error: `Format d'heure invalide: "${args.time}". Format attendu: HH:mm`,
          };
        }

        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);

        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          return {
            success: false,
            error: `Heure invalide: "${args.time}". Heures: 0-23, Minutes: 0-59`,
          };
        }

        dateObj.setHours(hours, minutes, 0, 0);
        startDate = dateObj.toISOString();

        const duration = args.duration || 60;
        const endDateObj = new Date(dateObj);
        endDateObj.setMinutes(endDateObj.getMinutes() + duration);
        endDate = endDateObj.toISOString();
      } catch (timeError: any) {
        return {
          success: false,
          error: `Erreur lors du traitement de l'heure: ${timeError.message}`,
        };
      }
    } else {
      // Événement toute la journée
      const dayStart = startOfDay(dateObj);
      startDate = dayStart.toISOString();
      endDate = dayStart.toISOString();
    }

    const eventData = {
      userId,
      title: args.title.trim(),
      sport: args.sport || "",
      duration: args.duration || 60,
      start: startDate,
      end: endDate,
      isAllDay: !args.time,
      status: "planned" as const,
      notes: args.notes || "",
    };

    // ⚠️ Utiliser Admin SDK pour bypass les règles Firestore
    await adminCreateDocument("calendarEvents", eventId, eventData);

    return {
      success: true,
      message: `Événement "${args.title}" créé avec succès`,
      eventId,
      date: format(parseISO(startDate), "dd/MM/yyyy"),
      time: args.time || "Toute la journée",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erreur lors de la création de l'événement",
    };
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
    // Valider que eventId n'est pas vide
    if (!args.eventId || typeof args.eventId !== "string" || args.eventId.trim().length === 0) {
      return {
        success: false,
        error: "L'ID de l'événement est requis",
      };
    }

    // Vérifier que l'événement existe et appartient à l'utilisateur
    // ⚠️ Utiliser Admin SDK pour bypass les règles Firestore
    const event = await adminGetDocument("calendarEvents", args.eventId);
    if (!event || (event as any).userId !== userId) {
      return { success: false, error: "Événement non trouvé" };
    }

    const updateData: any = {};

    // Valider et mettre à jour le titre si fourni
    if (args.title !== undefined) {
      if (!args.title || typeof args.title !== "string" || args.title.trim().length === 0) {
        return {
          success: false,
          error: "Le titre ne peut pas être vide",
        };
      }
      updateData.title = args.title.trim();
    }

    // Valider la durée si fournie
    if (args.duration !== undefined) {
      if (typeof args.duration !== "number" || args.duration <= 0 || args.duration > 1440) {
        return {
          success: false,
          error: `Durée invalide: ${args.duration}. Doit être un nombre entre 1 et 1440 minutes`,
        };
      }
      updateData.duration = args.duration;
    }

    // Si date ou heure changent, recalculer start/end
    if (args.date || args.time) {
      // Valider le format de date si fourni
      if (args.date && !validateDateFormat(args.date)) {
        return {
          success: false,
          error: `Format de date invalide: "${args.date}". Format attendu: YYYY-MM-DD`,
        };
      }

      // Valider le format d'heure si fourni
      if (args.time && !validateTimeFormat(args.time)) {
        return {
          success: false,
          error: `Format d'heure invalide: "${args.time}". Format attendu: HH:mm (ex: 18:30)`,
        };
      }

      // Parser l'ancienne date de début
      let oldStart: Date;
      try {
        oldStart = parseISO((event as any).start);
        if (!isValid(oldStart)) {
          return {
            success: false,
            error: "Erreur : la date de début de l'événement existant est invalide",
          };
        }
      } catch (parseError: any) {
        return {
          success: false,
          error: `Erreur lors du parsing de la date existante: ${parseError.message}`,
        };
      }

      // Parser la nouvelle date si fournie
      let newDate: Date;
      if (args.date) {
        try {
          newDate = parseISO(args.date);
          if (!isValid(newDate)) {
            return {
              success: false,
              error: `Date invalide: "${args.date}"`,
            };
          }
        } catch (parseError: any) {
          return {
            success: false,
            error: `Erreur lors du parsing de la nouvelle date: ${parseError.message}`,
          };
        }
      } else {
        newDate = oldStart;
      }

      if (args.time) {
        // Événement avec heure précise
        try {
          const timeParts = args.time.split(":");
          if (timeParts.length !== 2) {
            return {
              success: false,
              error: `Format d'heure invalide: "${args.time}". Format attendu: HH:mm`,
            };
          }

          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);

          if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return {
              success: false,
              error: `Heure invalide: "${args.time}". Heures: 0-23, Minutes: 0-59`,
            };
          }

          newDate.setHours(hours, minutes, 0, 0);
          updateData.start = newDate.toISOString();
          updateData.isAllDay = false;

          const duration = args.duration || (event as any).duration || 60;
          const endDate = new Date(newDate);
          endDate.setMinutes(endDate.getMinutes() + duration);
          updateData.end = endDate.toISOString();
        } catch (timeError: any) {
          return {
            success: false,
            error: `Erreur lors du traitement de l'heure: ${timeError.message}`,
          };
        }
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

    // ⚠️ Utiliser Admin SDK pour bypass les règles Firestore
    await adminUpdateDocument("calendarEvents", args.eventId, updateData);

    return {
      success: true,
      message: "Événement modifié avec succès",
      eventId: args.eventId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erreur lors de la modification de l'événement",
    };
  }
}
