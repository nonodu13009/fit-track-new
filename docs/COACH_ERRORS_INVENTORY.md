# Inventaire complet des erreurs du Coach IA

Ce document liste toutes les erreurs possibles du Coach IA, leurs causes et leurs solutions.

## 🔴 Erreurs Mistral API

### 1. **Erreur 3230 : "Not the same number of function calls and responses"**
**Type :** `invalid_request_message_order`  
**Code HTTP :** 400  
**Cause :** Le nombre de tool calls dans le message assistant ne correspond pas au nombre de tool responses envoyés.

**Scénarios possibles :**
- L'IA fait 2 tool calls mais on n'envoie qu'1 réponse
- Un tool call échoue silencieusement et on ne renvoie pas de réponse
- Un tool call est ignoré (continue dans la boucle) sans réponse
- Mauvais `tool_call_id` utilisé dans la réponse

**Solution :**
```typescript
// S'assurer que chaque tool call reçoit une réponse
for (const toolCall of toolCalls) {
  const toolCallId = toolCall.id || toolCall.tool_call_id || "";
  // TOUJOURS envoyer une réponse, même en cas d'erreur
  messages.push({
    role: "tool",
    content: JSON.stringify(toolResult),
    tool_call_id: toolCallId, // Doit correspondre exactement
    name: toolName,
  });
}
```

**Correction à apporter :**
- Vérifier que tous les tool calls reçoivent une réponse
- Ne pas utiliser `continue` sans envoyer de réponse
- S'assurer que `tool_call_id` correspond exactement

---

### 2. **Erreur 401 : "Unauthorized"**
**Type :** Authentification  
**Code HTTP :** 401  
**Cause :** Clé API Mistral invalide, absente ou expirée.

**Vérifications :**
- Variable d'environnement `MISTRAL_API_KEY` définie
- Clé API valide dans Vercel
- Clé API non expirée

**Solution :**
- Vérifier `process.env.MISTRAL_API_KEY` dans Vercel
- Régénérer la clé API si nécessaire

---

### 3. **Erreur 429 : "Rate limit exceeded"**
**Type :** Limite de requêtes  
**Code HTTP :** 429  
**Cause :** Trop de requêtes envoyées à l'API Mistral dans un court laps de temps.

**Solution :**
- Implémenter un système de retry avec backoff exponentiel
- Limiter le nombre de requêtes par utilisateur
- Afficher un message à l'utilisateur pour réessayer plus tard

---

### 4. **Erreur 400 : "Invalid request"**
**Type :** Requête invalide  
**Code HTTP :** 400  
**Causes possibles :**
- Format des messages incorrect
- Tool calls mal formatés
- Paramètres manquants ou invalides
- `tool_call_id` manquant ou invalide

**Vérifications :**
- Structure des messages conforme à l'API Mistral
- Tool calls avec `id` ou `tool_call_id` valide
- Réponses avec `tool_call_id` correspondant

---

### 5. **Erreur 500 : "Internal server error" (Mistral)**
**Type :** Erreur serveur Mistral  
**Code HTTP :** 500  
**Cause :** Erreur côté serveur Mistral (temporaire généralement).

**Solution :**
- Implémenter un retry automatique
- Fallback sans tools si erreur persistante

---

## 🔴 Erreurs Firestore

### 6. **"Missing or insufficient permissions"**
**Type :** Permissions Firestore  
**Code :** `permission-denied`  
**Cause :** Les règles Firestore ne permettent pas l'opération.

**Scénarios :**
- Règles `list` non déployées pour les requêtes avec `where`/`orderBy`
- `userId` ne correspond pas à `request.auth.uid`
- Règles Firestore non à jour

**Solution :**
- Vérifier que les règles `list` sont déployées
- S'assurer que `userId` correspond à l'utilisateur authentifié
- Déployer les règles Firestore : `firebase deploy --only firestore:rules`

---

### 7. **"The query requires an index"**
**Type :** Index Firestore manquant  
**Code :** `failed-precondition`  
**Cause :** Requête nécessite un index composite qui n'existe pas.

**Solution :**
- Créer l'index dans Firebase Console
- Ajouter l'index à `firestore.indexes.json`
- Déployer : `firebase deploy --only firestore:indexes`

---

### 8. **"Document not found"**
**Type :** Document inexistant  
**Cause :** Tentative d'accès à un document qui n'existe pas.

**Scénarios :**
- `eventId` invalide dans `updateEvent`
- Document supprimé entre-temps

**Solution :**
- Vérifier l'existence du document avant modification
- Gérer le cas où le document n'existe pas

---

## 🔴 Erreurs de validation

### 9. **Arguments de tool invalides**
**Type :** Validation  
**Cause :** Les arguments passés au tool ne respectent pas le schéma.

**Scénarios :**
- Date au mauvais format (pas ISO)
- Heure au mauvais format (pas HH:mm)
- Paramètres requis manquants

**Solution :**
- Valider les arguments avant exécution
- Convertir les formats si nécessaire
- Retourner une erreur claire si invalide

---

### 10. **Parsing JSON des arguments échoue**
**Type :** Parsing  
**Cause :** Les arguments du tool call ne sont pas du JSON valide.

**Solution :**
- Gérer les erreurs de parsing
- Utiliser des valeurs par défaut si parsing échoue
- Logger l'erreur pour debugging

---

## 🔴 Erreurs de logique applicative

### 11. **Boucle infinie de tool calls**
**Type :** Logique  
**Cause :** L'IA continue d'appeler des tools sans jamais répondre.

**Solution actuelle :**
- Limite de `maxIterations = 5`
- Message d'erreur si limite atteinte

**Amélioration possible :**
- Détecter les boucles (mêmes tool calls répétés)
- Arrêter plus tôt si détection de boucle

---

### 12. **Tool call sans nom**
**Type :** Logique  
**Cause :** Le tool call n'a pas de `function.name`.

**Solution actuelle :**
- `continue` pour ignorer le tool call
- ⚠️ **PROBLÈME** : Pas de réponse envoyée à Mistral, cause l'erreur 3230

**Correction nécessaire :**
- Toujours envoyer une réponse, même pour un tool call invalide
- Utiliser un `tool_call_id` par défaut si manquant

---

### 13. **Tool inconnu**
**Type :** Logique  
**Cause :** L'IA appelle un tool qui n'existe pas.

**Solution actuelle :**
- Retourne `{ error: "Tool inconnu: ${toolName}" }`
- ✅ Fonctionne correctement

---

### 14. **Événement n'appartient pas à l'utilisateur**
**Type :** Sécurité  
**Cause :** Tentative de modifier un événement d'un autre utilisateur.

**Solution actuelle :**
- Vérification dans `handleUpdateEvent`
- ✅ Fonctionne correctement

---

## 🔴 Erreurs de format de réponse

### 15. **Content n'est ni string ni array**
**Type :** Format  
**Cause :** Le contenu de la réponse Mistral a un format inattendu.

**Solution actuelle :**
- Gestion avec fallback
- ✅ Fonctionne correctement

---

### 16. **Choice manquant dans la réponse**
**Type :** Format  
**Cause :** La réponse Mistral ne contient pas de `choices[0]`.

**Solution actuelle :**
- Message d'erreur générique
- ✅ Fonctionne correctement

---

## 🔴 Erreurs réseau/timeout

### 17. **Timeout de requête**
**Type :** Réseau  
**Cause :** La requête vers Mistral prend trop de temps.

**Solution :**
- Augmenter le timeout Vercel si nécessaire
- Implémenter un timeout côté code
- Message d'erreur clair à l'utilisateur

---

### 18. **Erreur réseau**
**Type :** Réseau  
**Cause :** Problème de connexion réseau.

**Solution :**
- Retry automatique
- Message d'erreur clair

---

## 🔴 Erreurs de contexte

### 19. **Erreur lors de la récupération du contexte**
**Type :** Contexte  
**Cause :** Erreur lors de la récupération des données utilisateur (workouts, profile, weighIns).

**Solution actuelle :**
- Try/catch qui continue sans contexte
- ✅ Fonctionne correctement (non bloquant)

---

## 📋 Corrections prioritaires à apporter

### 🔥 Critique : Erreur 3230 (Tool calls/responses mismatch)

**Problème identifié dans le code actuel :**
```typescript
// Ligne 153-156 : Si tool call sans nom, on continue sans réponse
if (!toolCall.function?.name) {
  console.error("Tool call sans nom:", toolCall);
  continue; // ❌ Pas de réponse envoyée à Mistral !
}
```

**Correction nécessaire :**
```typescript
if (!toolCall.function?.name) {
  console.error("Tool call sans nom:", toolCall);
  const toolCallId = toolCall.id || toolCall.tool_call_id || `unknown_${Date.now()}`;
  // ✅ TOUJOURS envoyer une réponse
  messages.push({
    role: "tool",
    content: JSON.stringify({
      success: false,
      error: "Tool call invalide : nom manquant",
    }),
    tool_call_id: toolCallId,
    name: "unknown",
  });
  continue;
}
```

**Autre problème potentiel :**
- Si un tool call échoue dans le try/catch (ligne 201), on envoie bien une réponse ✅
- Mais si `toolCallId` est vide, Mistral pourrait rejeter la réponse

**Correction :**
```typescript
const toolCallId = toolCall.id || toolCall.tool_call_id || `fallback_${Date.now()}`;
if (!toolCallId) {
  console.error("Tool call sans ID:", toolCall);
  // Générer un ID de fallback
  toolCallId = `fallback_${Date.now()}_${Math.random()}`;
}
```

---

## 🛠️ Améliorations recommandées

1. **Validation stricte des tool calls**
   - Vérifier que chaque tool call a un `id` valide
   - Vérifier que chaque tool call a un `function.name` valide
   - Toujours envoyer une réponse, même pour les tool calls invalides

2. **Logging amélioré**
   - Logger tous les tool calls reçus
   - Logger toutes les réponses envoyées
   - Comparer les compteurs pour détecter les mismatches

3. **Retry avec backoff**
   - Pour les erreurs 429, 500
   - Limiter le nombre de retries

4. **Validation des arguments**
   - Valider les dates (format ISO)
   - Valider les heures (format HH:mm)
   - Valider les IDs d'événements

5. **Gestion des timeouts**
   - Timeout explicite pour les appels Mistral
   - Timeout pour les opérations Firestore

---

## 📝 Checklist de debugging

Quand une erreur survient, vérifier :

- [ ] Les logs Vercel pour l'erreur exacte
- [ ] Le nombre de tool calls vs tool responses
- [ ] Les `tool_call_id` correspondent
- [ ] Les règles Firestore sont déployées
- [ ] La clé API Mistral est valide
- [ ] Les arguments des tools sont valides
- [ ] Le format des messages est correct

---

## 🔗 Références

- [Documentation Mistral API](https://docs.mistral.ai/api/)
- [Erreurs Mistral API](https://docs.mistral.ai/api/#errors)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
