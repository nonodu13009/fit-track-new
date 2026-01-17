# Test du Flux Coach API - Approche Simple Mistral

## Flux attendu

1. **User message** → API reçoit le message
2. **Premier appel Mistral** → Avec tools disponibles
3. **Si tool_calls présents** :
   - Normalisation avec `type: "function"`
   - Exécution de chaque tool
   - Ajout des tool responses dans l'ordre
4. **Deuxième appel Mistral** → Avec tool responses
5. **Réponse finale** → Retournée au frontend

## Scénarios de test

### Test 1 : Message simple (sans tool calls)
**Message :** "Bonjour, comment ça va ?"

**Attendu :**
- Premier appel Mistral
- Pas de tool_calls
- Réponse directe retournée

**Logs à vérifier :**
- Pas de log "tool call(s) détecté(s)"
- Réponse directe dans les logs

---

### Test 2 : Création d'événement (avec tool calls)
**Message :** "lundi prochain, 18H30 yoga"

**Attendu :**
- Premier appel Mistral
- Tool call `createEvent` détecté
- Exécution du tool
- Deuxième appel Mistral
- Réponse finale avec confirmation

**Logs à vérifier :**
```
[Coach API] 1 tool call(s) détecté(s)
[Coach API] Message assistant avec tool_calls ajouté: [...]
[Coach API] Tool response ajoutée: { tool_call_id: "...", name: "createEvent", success: true }
[Coach API] Total messages avant 2ème appel: 4
```

**Structure messages attendue :**
1. `system` (contexte)
2. `user` (message)
3. `assistant` (avec tool_calls, content: null)
4. `tool` (réponse createEvent)
5. `assistant` (réponse finale)

---

### Test 3 : Récupération d'événements (avec tool calls)
**Message :** "Quels sont mes événements cette semaine ?"

**Attendu :**
- Premier appel Mistral
- Tool call `getCalendarEvents` détecté
- Exécution du tool
- Deuxième appel Mistral
- Réponse finale avec liste des événements

**Logs à vérifier :**
- Tool call `getCalendarEvents` détecté
- Tool response avec liste d'événements
- Réponse finale formatée

---

## Points critiques à vérifier

### 1. Format des tool_calls
```json
{
  "id": "abc123",
  "type": "function",
  "function": {
    "name": "createEvent",
    "arguments": "{...}"
  }
}
```

### 2. Format des tool responses
```json
{
  "role": "tool",
  "tool_call_id": "abc123",
  "name": "createEvent",
  "content": "{...}"
}
```

### 3. Ordre des messages
- Assistant avec tool_calls
- Tool responses dans le même ordre que les tool calls
- Assistant final

### 4. IDs préservés
- `tool_call_id` dans tool response = `id` dans tool call
- Pas de modification/troncature des IDs

## Comment tester

1. **Ouvrir l'application** → Page Coach
2. **Ouvrir la console navigateur** (F12)
3. **Ouvrir les logs Vercel** (pour voir les logs serveur)
4. **Envoyer un message** qui déclenche un tool call
5. **Vérifier les logs** :
   - Console navigateur : erreurs frontend
   - Logs Vercel : flux complet du serveur

## Erreurs possibles

### Erreur 3230 : "Not the same number of function calls and responses"
**Causes possibles :**
- Tool call sans ID
- Tool response avec mauvais `tool_call_id`
- Tool call ignoré (continue sans réponse)

**Vérifications :**
- Logs montrent tous les tool calls avec leurs IDs
- Logs montrent toutes les tool responses avec leurs `tool_call_id`
- Comparer les IDs dans les logs

### Erreur 400 : Format invalide
**Causes possibles :**
- `type: "function"` manquant
- `content: null` manquant quand tool_calls présent
- Format arguments invalide

**Vérifications :**
- Log "Message assistant avec tool_calls ajouté" montre le format exact
- Vérifier que `type: "function"` est présent
- Vérifier que `content: null` est présent

## Résultat attendu

✅ **Succès :**
- Message envoyé
- Tool call détecté et exécuté
- Réponse finale reçue
- Pas d'erreur 3230

❌ **Échec :**
- Erreur 3230 dans les logs
- Erreur 400 (format invalide)
- Timeout ou erreur réseau
