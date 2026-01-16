# Fix : Erreur `invalid_request_message_order` - Tool Calls et Tool Responses

## 🚨 Le problème

L'erreur `invalid_request_message_order` avec le message `Not the same number of function calls and responses` se produit lorsque :

- Tu envoies au modèle un historique qui contient au moins un **"tool/function call"** (appel de fonction)
- Mais tu **n'envoies pas** la/les **"tool responses"** correspondantes

### Symptômes dans la console

```
/api/coach → 500 (backend crash)
Appel LLM → 400 avec invalid_request_message_order
Message: "Not the same number of function calls and responses"
```

## 📋 Ce que ça veut dire (concrètement)

Si une réponse du modèle contient `tool_calls: [...]`, **tu dois** ajouter juste après, dans `messages`, **1 message `role: "tool"` par tool call**, avec le **bon `tool_call_id`**, avant de rappeler le modèle ou avant d'accepter un nouveau message user.

### Schéma valide des messages

```javascript
messages = [
  { role: "user", content: "Note une séance..." },

  // 1) Le modèle demande un outil
  { 
    role: "assistant", 
    tool_calls: [
      { 
        id: "call_1", 
        function: { 
          name: "add_session", 
          arguments: "{...}" 
        } 
      }
    ]
  },

  // 2) TOI tu réponds à cet outil (OBLIGATOIRE)
  { 
    role: "tool", 
    tool_call_id: "call_1", 
    content: "{\"ok\":true,\"eventId\":\"abc\"}" 
  },

  // 3) Puis seulement le modèle peut répondre "normalement"
  { role: "assistant", content: "C'est noté dans ton agenda." }
]
```

### ❌ Ce qui cause l'erreur

L'erreur arrive si, dans l'historique envoyé, tu as :

- Un `assistant` avec `tool_calls` mais **pas** les `role:"tool"` qui vont avec
- Ou pas le bon `tool_call_id`
- Ou pas le même nombre (ex: 2 tool calls mais seulement 1 tool response)

## 🔍 Causes fréquentes dans une app comme la tienne

1. **Simplification de l'historique côté front** : Tu ne stockes que `{role, content}`, mais tu ré-injectes quand même des messages `assistant` qui contenaient des `tool_calls` (depuis localStorage/DB), **sans** leurs tool responses.

2. **Nombre de tool calls ≠ nombre de tool responses** : Le modèle a fait **2 tool calls** dans une même réponse, et tu ne renvoies qu'**une** tool response.

3. **Historique mal reconstruit** : Tu reconstruis l'historique depuis une base de données qui ne stocke pas les tool responses.

## ✅ Solution recommandée : Gérer les tools 100% côté backend

**Le front ne stocke JAMAIS** de `tool_calls` / `tool` messages. Il ne voit que du texte final.

### Architecture recommandée

```
Frontend (useCoach)
  ↓ Envoie uniquement: { role: "user", content: "..." }
  ↓ Reçoit uniquement: { message: "Réponse texte finale" }

Backend (/api/coach)
  ↓ Gère TOUT le cycle tool calls/responses
  ↓ Ne renvoie que le texte final au front
```

## 💻 Exemple d'implémentation

### Backend : `app/api/coach/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getMistralClient, DEFAULT_MODEL } from "@/lib/mistral/client";
import { COACH_SYSTEM_PROMPT } from "@/lib/mistral/prompts";
import { COACH_TOOLS } from "@/lib/mistral/tools";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, message } = body;

    if (!userId || !message) {
      return NextResponse.json(
        { error: "userId et message sont requis" },
        { status: 400 }
      );
    }

    const mistral = getMistralClient();
    
    // ⚠️ IMPORTANT : Ne jamais recevoir d'historique avec tool_calls depuis le front
    // On reconstruit toujours un historique propre côté backend
    let messages: any[] = [
      {
        role: "system",
        content: COACH_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: message,
      },
    ];

    // Boucle pour gérer plusieurs rounds de tool calls
    const MAX_ITERATIONS = 6;
    
    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
      // Appel au modèle
      const response = await mistral.chat.complete({
        model: DEFAULT_MODEL,
        messages,
        tools: COACH_TOOLS,
        tool_choice: "auto",
        temperature: 0.7,
        maxTokens: 1000,
      });

      const assistantMessage = response.choices?.[0]?.message;
      if (!assistantMessage) {
        return NextResponse.json(
          { error: "Pas de réponse du modèle" },
          { status: 500 }
        );
      }

      // Ajouter le message assistant à l'historique
      messages.push(assistantMessage);

      // Vérifier si tool calls présents
      const toolCalls = assistantMessage.tool_calls || assistantMessage.toolCalls;
      
      if (!toolCalls || toolCalls.length === 0) {
        // Pas de tool calls, retourner la réponse texte finale
        const content = assistantMessage.content;
        const responseText = typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content.map((c: any) => typeof c === "string" ? c : c.text || "").join("")
            : "";

        return NextResponse.json({
          message: responseText,
          model: DEFAULT_MODEL,
        });
      }

      // ⚠️ CRITIQUE : Exécuter chaque tool et créer une réponse
      // IMPORTANT : 1 réponse tool par call, dans le même ordre
      for (const toolCall of toolCalls) {
        const toolCallId = toolCall.id;
        const toolName = toolCall.function?.name;
        
        if (!toolCallId) {
          console.error(`[Coach API] ❌ Tool call sans ID !`, toolCall);
          continue;
        }

        // Parser les arguments
        let args: any = {};
        try {
          const argsString = toolCall.function?.arguments;
          if (argsString) {
            args = typeof argsString === "string" 
              ? JSON.parse(argsString) 
              : argsString;
          }
        } catch (parseError) {
          console.error(`[Coach API] Erreur parsing arguments:`, parseError);
        }

        // Exécuter le tool
        let toolResult: any;
        try {
          toolResult = await executeTool(toolName, args, userId);
        } catch (error: any) {
          console.error(`[Coach API] Erreur exécution tool ${toolName}:`, error);
          toolResult = { 
            success: false, 
            error: error.message || "Erreur lors de l'exécution" 
          };
        }

        // ⚠️ CRITIQUE : TOUJOURS créer la réponse avec l'ID EXACT
        const toolResponse = {
          role: "tool",
          tool_call_id: toolCallId, // ID EXACT du tool call
          content: JSON.stringify(toolResult),
        };

        messages.push(toolResponse);
        console.log(`[Coach API] Tool response: ${toolName} (ID: ${toolCallId})`);
      }

      // Vérification de sécurité
      const assistantMsgs = messages.filter((m: any) => 
        m.role === "assistant" && (m.tool_calls || m.toolCalls)
      );
      const toolMsgs = messages.filter((m: any) => m.role === "tool");
      
      console.log(`[Coach API] Vérification: ${assistantMsgs.length} assistant(s) avec tool_calls, ${toolMsgs.length} tool response(s)`);
    }

    // Si on dépasse MAX_ITERATIONS, retourner une erreur
    return NextResponse.json(
      { error: "Boucle de tool calls dépassée" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("[Coach API] Erreur:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la communication avec le coach IA",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Fonction pour exécuter les tools
async function executeTool(toolName: string, args: any, userId: string): Promise<any> {
  switch (toolName) {
    case "getCalendarEvents":
      return await handleGetCalendarEvents(userId, args);
    case "createEvent":
      return await handleCreateEvent(userId, args);
    case "updateEvent":
      return await handleUpdateEvent(userId, args);
    default:
      return { success: false, error: `Tool inconnu: ${toolName}` };
  }
}

// ... handlers pour chaque tool ...
```

### Frontend : `hooks/useCoach.ts`

```typescript
import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function useCoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

      // Ajouter le message utilisateur
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/coach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            message: content.trim(),
            // ⚠️ IMPORTANT : Ne JAMAIS envoyer d'historique avec tool_calls
            // Le backend gère tout l'historique interne
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error ||
            `Erreur ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // Ajouter la réponse de l'IA (texte uniquement)
        const assistantMessage: Message = {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          content: data.message, // Toujours du texte pur
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
        console.error("Erreur useCoach:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
```

## 🔧 Points critiques à respecter

### 1. Ne jamais stocker `tool_calls` côté front

```typescript
// ❌ MAUVAIS
interface Message {
  role: "user" | "assistant";
  content: string;
  tool_calls?: any[]; // ❌ Ne jamais stocker ça
}

// ✅ BON
interface Message {
  role: "user" | "assistant";
  content: string; // Texte uniquement
}
```

### 2. Toujours créer une tool response pour chaque tool call

```typescript
// ⚠️ CRITIQUE : Pour chaque tool call, créer une réponse
for (const toolCall of toolCalls) {
  const toolResult = await executeTool(toolCall);
  
  messages.push({
    role: "tool",
    tool_call_id: toolCall.id, // ⚠️ ID EXACT du call
    content: JSON.stringify(toolResult),
  });
}
```

### 3. Vérifier l'ordre et le nombre

```typescript
// Vérification de sécurité avant l'appel suivant
const assistantMsgs = messages.filter(m => 
  m.role === "assistant" && m.tool_calls
);
const toolMsgs = messages.filter(m => m.role === "tool");

if (assistantMsgs.length > 0) {
  const totalToolCalls = assistantMsgs.reduce(
    (sum, msg) => sum + (msg.tool_calls?.length || 0),
    0
  );
  
  if (totalToolCalls !== toolMsgs.length) {
    console.error(`❌ NOMBRE DIFFÉRENT: ${totalToolCalls} calls vs ${toolMsgs.length} responses`);
    // Ne pas continuer, corriger avant
  }
}
```

### 4. Ne jamais réutiliser un historique avec tool_calls

```typescript
// ❌ MAUVAIS : Si tu reçois un historique depuis le front
let messages = body.messages; // Peut contenir des tool_calls sans responses

// ✅ BON : Toujours reconstruire un historique propre
let messages = [
  { role: "system", content: COACH_SYSTEM_PROMPT },
  { role: "user", content: body.message },
];
```

## 🐛 Guide de debug (2 minutes)

### Étape 1 : Logger le payload avant l'appel

Juste avant ton appel au modèle (dans `/api/coach`), ajoute :

```typescript
console.log("===== PAYLOAD AVANT APPEL MISTRAL =====");
console.log(JSON.stringify(messages, null, 2));
console.log("======================================");
```

### Étape 2 : Vérifier la structure

Cherche dans le log :

1. **Un objet avec `tool_calls`** : Vérifie qu'il a `role: "assistant"`
2. **Juste après** : Vérifie qu'il y a autant de `{ role: "tool" }` que de tool calls
3. **Vérifie les IDs** : Chaque `tool_call_id` doit correspondre à un `id` dans `tool_calls`

### Exemple de payload valide

```json
[
  {
    "role": "system",
    "content": "..."
  },
  {
    "role": "user",
    "content": "Note une séance"
  },
  {
    "role": "assistant",
    "tool_calls": [
      {
        "id": "call_abc123",
        "function": {
          "name": "createEvent",
          "arguments": "{...}"
        }
      }
    ]
  },
  {
    "role": "tool",
    "tool_call_id": "call_abc123",
    "content": "{\"success\":true,\"eventId\":\"evt_123\"}"
  }
]
```

### Exemple de payload invalide (cause l'erreur)

```json
[
  {
    "role": "assistant",
    "tool_calls": [
      {
        "id": "call_abc123",
        "function": { "name": "createEvent", "arguments": "{...}" }
      }
    ]
  }
  // ❌ MANQUE : Pas de tool response avec tool_call_id: "call_abc123"
]
```

## 📝 Checklist de vérification

Avant de déployer, vérifie :

- [ ] Le front ne stocke jamais `tool_calls` ou `tool` messages
- [ ] Le backend gère 100% du cycle tool calls/responses
- [ ] Pour chaque `tool_call`, il y a exactement 1 `tool` response avec le bon `tool_call_id`
- [ ] L'historique envoyé au modèle ne contient jamais de `tool_calls` sans `tool` responses
- [ ] Les logs montrent le même nombre de tool calls et tool responses
- [ ] Le front ne reçoit que du texte final (pas de tool_calls)

## 🎯 Résumé

**Règle d'or** : Si tu as un message `assistant` avec `tool_calls`, tu DOIS avoir immédiatement après autant de messages `role: "tool"` que de tool calls, avec les bons `tool_call_id`.

**Solution la plus simple** : Gérer tout le cycle tool calls/responses côté backend, et ne jamais exposer ces détails au frontend.
