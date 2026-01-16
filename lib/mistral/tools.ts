/**
 * Définitions des tools pour le coach IA
 */

export const COACH_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "getCalendarEvents",
      description:
        "Récupère les événements planifiés dans l'agenda pour une période donnée. Utilise cette fonction quand l'utilisateur demande ce qu'il a prévu, ses séances à venir, ou son planning.",
      parameters: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description:
              "Date de début au format ISO (YYYY-MM-DD). Par défaut, aujourd'hui.",
          },
          endDate: {
            type: "string",
            description:
              "Date de fin au format ISO (YYYY-MM-DD). Par défaut, 7 jours après startDate.",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "createEvent",
      description:
        "Crée un nouvel événement dans l'agenda. Utilise cette fonction quand l'utilisateur demande de planifier, programmer ou ajouter une séance.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Titre de l'événement (ex: 'Séance JJB', 'Entraînement Judo')",
          },
          sport: {
            type: "string",
            description: "Sport concerné (ex: 'JJB', 'Judo', 'Musculation')",
          },
          date: {
            type: "string",
            description:
              "Date au format ISO (YYYY-MM-DD). Si l'utilisateur dit 'demain', 'après-demain', 'lundi', etc., convertis en date réelle.",
          },
          time: {
            type: "string",
            description:
              "Heure au format HH:mm (ex: '18:00', '14:30'). Optionnel, si non fourni, événement toute la journée.",
          },
          duration: {
            type: "number",
            description: "Durée en minutes (ex: 60, 90). Par défaut 60.",
          },
          notes: {
            type: "string",
            description: "Notes optionnelles pour l'événement",
          },
        },
        required: ["title", "date"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "updateEvent",
      description:
        "Modifie un événement existant dans l'agenda. Utilise cette fonction quand l'utilisateur demande de déplacer, modifier ou changer un événement.",
      parameters: {
        type: "object",
        properties: {
          eventId: {
            type: "string",
            description:
              "ID de l'événement à modifier. Si l'utilisateur ne donne pas l'ID, utilise getCalendarEvents d'abord pour le trouver.",
          },
          title: {
            type: "string",
            description: "Nouveau titre (optionnel)",
          },
          date: {
            type: "string",
            description: "Nouvelle date au format ISO (YYYY-MM-DD) (optionnel)",
          },
          time: {
            type: "string",
            description: "Nouvelle heure au format HH:mm (optionnel)",
          },
          duration: {
            type: "number",
            description: "Nouvelle durée en minutes (optionnel)",
          },
        },
        required: ["eventId"],
      },
    },
  },
];
