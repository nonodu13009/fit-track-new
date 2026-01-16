# Corrections et déploiement - Coach IA

## ✅ Corrections apportées

### 1. Règles Firestore (CRITIQUE)
Les règles Firestore ont été corrigées pour permettre les requêtes avec `where` et `orderBy` sur :
- `workouts`
- `weighIns`
- `calendarEvents`

**Changement** : Ajout de règles `list` séparées des règles `get` pour permettre les requêtes de collection.

## 🚨 Action requise : Déployer les règles Firestore

Les règles Firestore **ne sont pas déployées automatiquement** avec Vercel. Vous devez les déployer manuellement :

### Option 1 : Via Firebase CLI (recommandé)

```bash
# Se reconnecter à Firebase si nécessaire
firebase login --reauth

# Sélectionner le projet
firebase use fit-tracker-728e9

# Déployer uniquement les règles
firebase deploy --only firestore:rules
```

### Option 2 : Via Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet `fit-tracker-728e9`
3. Allez dans **Firestore Database** → **Rules**
4. Copiez le contenu de `firestore.rules` dans l'éditeur
5. Cliquez sur **"Publier"**

## ⚠️ Problèmes mineurs (non bloquants)

### 1. Icônes manquantes
Les fichiers `icon-192.png` et `icon-512.png` sont référencés dans `manifest.json` mais n'existent pas dans `/public`.

**Impact** : Avertissement dans la console, pas d'impact fonctionnel.

**Solution** : Créer les icônes ou supprimer les références du manifest.

### 2. OAuth Firebase
Le domaine `fit-track-new-sigma.vercel.app` n'est pas autorisé pour OAuth.

**Impact** : Les opérations OAuth (connexion avec Google, etc.) ne fonctionneront pas sur ce domaine.

**Solution** :
1. Allez dans [Firebase Console](https://console.firebase.google.com)
2. **Authentication** → **Settings** → **Authorized domains**
3. Ajoutez `fit-track-new-sigma.vercel.app`

## 📝 Notes

- Le tool calling est temporairement désactivé (`ENABLE_TOOL_CALLING = false`) pour le débogage
- Une fois les règles Firestore déployées, l'erreur 500 devrait être résolue
- Les requêtes Firestore dans l'API coach nécessitent que les règles `list` soient actives
