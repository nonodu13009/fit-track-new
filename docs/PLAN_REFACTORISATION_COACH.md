# Plan de Refactorisation Coach API - Approche Simple Mistral

## Problème actuel

Le code utilise une boucle `while` complexe avec plusieurs itérations qui :
- Crée des problèmes de synchronisation entre tool calls et responses
- Ajoute trop de validations qui peuvent introduire des bugs
- Rend le code difficile à déboguer
- Continue à générer l'erreur 3230 malgré toutes les corrections

## Solution : Approche simple en 2 étapes

Selon la réponse de Mistral, l'approche recommandée est beaucoup plus simple :

1. **Premier appel** : Envoyer les messages à Mistral avec les tools disponibles
2. **Si tool_calls présents** : Exécuter les tools et ajouter les réponses aux messages
3. **Deuxième appel** : Renvoyer les messages mis à jour (incluant tool responses) à Mistral
4. **Retourner** la réponse finale

## Structure du nouveau code

### Étape 1 : Simplifier la fonction POST

**Fichier :** `app/api/coach/route.ts`

**Nouvelle structure :**
```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Récupérer userId et message
    // 2. Construire le contexte (garder cette partie)
    // 3. Initialiser messages avec system + user
    // 4. Premier appel à Mistral avec tools
    // 5. Si tool_calls présents :
    //    - Exécuter chaque tool
    //    - Ajouter tool responses aux messages
    //    - Deuxième appel à Mistral
    // 6. Retourner la réponse finale
  } catch (error) {
    // Gestion erreurs
  }
}
```

### Étape 2 : Supprimer la boucle while

**Supprimer :**
- La boucle `while (iteration < maxIterations)`
- Toutes les validations complexes (doublons, ordre, etc.)
- La logique d'itération multiple

**Remplacer par :**
- Un premier appel simple à Mistral
- Une vérification simple : `if (tool_calls && tool_calls.length > 0)`
- Exécution des tools et ajout des réponses
- Un deuxième appel à Mistral pour la réponse finale

### Étape 3 : Simplifier la gestion des tool calls

**Format des tool calls :**
```typescript
// Normaliser AVANT d'ajouter au message assistant
const normalizedToolCalls = toolCalls.map((tc: any) => ({
  id: tc.id,
  type: "function",
  function: {
    name: tc.function?.name,
    arguments: tc.function?.arguments || "{}",
  },
}));
```

**Format des tool responses :**
```typescript
// Pour chaque tool call, créer une réponse
{
  role: "tool",
  tool_call_id: toolCall.id, // ID exact du tool call
  name: toolCall.function.name,
  content: JSON.stringify(toolResult),
}
```

### Étape 4 : Structure des messages

**Ordre strict :**
1. `system` (contexte)
2. `user` (message initial)
3. `assistant` (avec tool_calls, content: null)
4. `tool` (réponses, une par tool call, dans le même ordre)
5. `assistant` (réponse finale)

## Modifications détaillées

### 1. Simplifier la fonction POST principale

**Lignes à modifier :** ~96-760

**Avant :** Boucle while complexe avec validations multiples

**Après :** 
```typescript
export async function POST(request: NextRequest) {
  try {
    const { userId, message, includeContext = true } = await request.json();
    
    // Validation basique
    if (!userId || !message) {
      return NextResponse.json({ error: "userId et message requis" }, { status: 400 });
    }

    // Construire contexte (garder code existant)
    let contextText = "";
    // ... code contexte existant ...

    // Initialiser messages
    let messages: any[] = [
      { role: "system", content: COACH_SYSTEM_PROMPT + (contextText ? `\n\n${contextText}` : "") },
      { role: "user", content: message },
    ];

    const mistral = getMistralClient();

    // PREMIER APPEL : avec tools disponibles
    const firstResponse = await retryWithBackoff(
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

    const assistantMessage = firstResponse.choices?.[0]?.message;
    if (!assistantMessage) {
      return NextResponse.json({ error: "Pas de réponse du modèle" }, { status: 500 });
    }

    // Vérifier si tool calls présents
    const toolCalls = assistantMessage.tool_calls || assistantMessage.toolCalls;
    
    if (toolCalls && toolCalls.length > 0) {
      // Ajouter message assistant avec tool_calls
      messages.push({
        role: "assistant",
        tool_calls: toolCalls.map((tc: any) => ({
          id: tc.id,
          type: "function",
          function: {
            name: tc.function?.name,
            arguments: tc.function?.arguments || "{}",
          },
        })),
        content: null,
      });

      // Exécuter chaque tool et ajouter réponse
      for (const toolCall of toolCalls) {
        const toolResult = await executeTool(toolCall, userId);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function?.name,
          content: JSON.stringify(toolResult),
        });
      }

      // DEUXIÈME APPEL : avec tool responses
      const finalResponse = await retryWithBackoff(
        () => mistral.chat.complete({
          model: DEFAULT_MODEL,
          messages,
          temperature: 0.7,
          maxTokens: 1000,
        }),
        3,
        1000
      );

      const finalMessage = finalResponse.choices?.[0]?.message;
      const content = finalMessage?.content;
      
      return NextResponse.json({
        response: typeof content === "string" ? content : Array.isArray(content) ? content.map(c => typeof c === "string" ? c : c.text || "").join("") : "",
      });
    } else {
      // Pas de tool calls, retourner réponse directe
      const content = assistantMessage.content;
      return NextResponse.json({
        response: typeof content === "string" ? content : Array.isArray(content) ? content.map(c => typeof c === "string" ? c : c.text || "").join("") : "",
      });
    }
  } catch (error: any) {
    // Gestion erreurs (garder code existant)
  }
}
```

### 2. Créer fonction executeTool simplifiée

**Nouvelle fonction :**
```typescript
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
```

### 3. Supprimer code obsolète

**À supprimer :**
- Toute la boucle `while (iteration < maxIterations)`
- Les validations de doublons
- Les validations d'ordre des messages
- Les vérifications de tool calls non résolus
- Le logging excessif (garder seulement l'essentiel)
- La logique de normalisation complexe des tool calls

**À garder :**
- Fonction `retryWithBackoff` (utile)
- Handlers des tools (`handleGetCalendarEvents`, etc.)
- Fonctions de validation de dates/heures
- Gestion d'erreurs basique

## Avantages de cette approche

1. **Simplicité** : Code beaucoup plus lisible et maintenable
2. **Fiabilité** : Moins de points de défaillance
3. **Conformité** : Suit exactement l'exemple de Mistral
4. **Débogage** : Plus facile à comprendre et déboguer
5. **Performance** : Moins d'appels API inutiles

## Points d'attention

- S'assurer que les IDs des tool calls sont préservés exactement
- Vérifier que `type: "function"` est présent dans chaque tool call
- S'assurer que `content: null` quand tool_calls est présent
- Garder l'ordre des tool responses identique aux tool calls

## Résultat attendu

- Code simplifié de ~800 lignes à ~300 lignes
- Erreur 3230 résolue définitivement
- Code plus maintenable et conforme aux recommandations Mistral
