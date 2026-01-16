# Configuration Firebase Admin SDK

## Pourquoi Firebase Admin SDK ?

Les routes API Next.js s'exécutent côté serveur et n'ont pas de contexte d'authentification Firebase client. Les règles Firestore vérifient `request.auth.uid`, qui n'existe pas dans les routes API.

**Solution :** Utiliser Firebase Admin SDK qui bypass les règles Firestore et permet d'accéder aux données depuis les routes API.

## Configuration dans Vercel

### 1. Obtenir les credentials Firebase Admin

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionner votre projet
3. Aller dans **Paramètres du projet** (icône ⚙️)
4. Onglet **Comptes de service**
5. Cliquer sur **Générer une nouvelle clé privée**
6. Télécharger le fichier JSON

### 2. Extraire les valeurs nécessaires

Ouvrir le fichier JSON téléchargé et extraire :

```json
{
  "project_id": "votre-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@votre-project.iam.gserviceaccount.com"
}
```

### 3. Ajouter les variables dans Vercel

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionner votre projet
3. Aller dans **Settings** > **Environment Variables**
4. Ajouter les variables suivantes :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `FIREBASE_PRIVATE_KEY` | La valeur de `private_key` du JSON (avec les `\n` intacts) | Production, Preview, Development |
| `FIREBASE_CLIENT_EMAIL` | La valeur de `client_email` du JSON | Production, Preview, Development |

**⚠️ IMPORTANT :**
- `FIREBASE_PRIVATE_KEY` doit contenir les `\n` littéraux (pas de retours à la ligne réels)
- Copier-coller exactement depuis le JSON
- Ne pas modifier ou formater la clé

### 4. Redéployer

Après avoir ajouté les variables, redéployer l'application :
- Vercel redéploiera automatiquement si vous avez activé "Auto-deploy"
- Sinon, faire un commit/push pour déclencher un nouveau déploiement

## Vérification

Une fois configuré, les routes API devraient pouvoir accéder à Firestore sans erreur de permissions.

Les logs Vercel ne devraient plus afficher :
```
Missing or insufficient permissions
```

## Sécurité

⚠️ **IMPORTANT :**
- Les credentials Admin SDK donnent un accès complet à Firestore
- Ne jamais commiter ces valeurs dans le code
- Ne jamais les exposer côté client
- Utiliser uniquement dans les routes API serveur

## Variables déjà configurées

Les variables suivantes sont déjà utilisées (client SDK) :
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Les nouvelles variables (Admin SDK) :
- `FIREBASE_PRIVATE_KEY` ⚠️ **À AJOUTER**
- `FIREBASE_CLIENT_EMAIL` ⚠️ **À AJOUTER**
