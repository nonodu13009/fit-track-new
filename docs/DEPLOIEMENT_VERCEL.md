# 🚀 Guide de Déploiement Vercel

Ce guide explique comment configurer et déployer l'application JJB Tracking sur Vercel.

---

## 📋 Prérequis

- Compte Vercel créé et connecté
- Projet Firebase configuré avec toutes les clés API
- Repository GitHub connecté à Vercel

---

## 🔐 Configuration des Variables d'Environnement

**⚠️ IMPORTANT :** Les variables d'environnement doivent être configurées dans Vercel pour que l'application fonctionne correctement.

### Étape 1 : Accéder aux paramètres du projet Vercel

1. Connectez-vous à [Vercel](https://vercel.com)
2. Sélectionnez votre projet `jjb-tracking` (ou le nom de votre projet)
3. Allez dans **Settings** > **Environment Variables**

### Étape 2 : Ajouter les variables Firebase

Ajoutez les **6 variables d'environnement Firebase** suivantes :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Clé API Firebase | `AIzaSyC...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domaine d'authentification | `fit-tracker-728e9.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID du projet Firebase | `fit-tracker-728e9` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de stockage | `fit-tracker-728e9.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ID de l'expéditeur | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ID de l'application | `1:123456789012:web:abc123...` |

**Où trouver ces valeurs :**

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet
3. Allez dans **Project Settings** (⚙️) > **General**
4. Faites défiler jusqu'à **Your apps** et sélectionnez votre app web
5. Copiez les valeurs de la section **Firebase SDK snippet** > **Config**

### Étape 3 : Ajouter les variables Mistral AI (optionnel)

Si vous utilisez le coach IA, ajoutez également :

| Variable | Description |
|----------|-------------|
| `MISTRAL_API_KEY` | Clé API Mistral AI |
| `MISTRAL_MODEL` | Modèle à utiliser (défaut: `mistral-small-latest`) |

### Étape 4 : Configurer les environnements

Pour chaque variable, sélectionnez les environnements où elle doit être disponible :
- ✅ **Production**
- ✅ **Preview** (recommandé pour tester)
- ✅ **Development** (si vous utilisez Vercel CLI en local)

### Étape 5 : Redéployer

Après avoir ajouté toutes les variables :

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Ou poussez un nouveau commit sur la branche `main`

---

## 🔄 Déploiement Automatique via GitHub Actions

Le projet est configuré pour se déployer automatiquement via GitHub Actions lorsqu'un commit est poussé sur la branche `main`.

### Configuration du Webhook Vercel

1. Dans Vercel, allez dans **Settings** > **Git**
2. Créez un **Deploy Hook** (si ce n'est pas déjà fait)
3. Copiez l'URL du webhook
4. Dans GitHub, allez dans **Settings** > **Secrets and variables** > **Actions**
5. Ajoutez un secret nommé `VERCEL_DEPLOY_HOOK` avec l'URL du webhook

Le workflow `.github/workflows/deploy.yml` déclenchera automatiquement un déploiement à chaque push sur `main`.

---

## ✅ Vérification du Déploiement

Après le déploiement, vérifiez que :

1. ✅ L'application se charge sans erreur
2. ✅ La console du navigateur ne montre pas d'erreur Firebase
3. ✅ L'authentification fonctionne (connexion/inscription)
4. ✅ Les données se chargent depuis Firestore

### Erreurs courantes

#### ❌ `Firebase: Error (auth/api-key-not-valid)`

**Cause :** Les variables d'environnement Firebase ne sont pas configurées dans Vercel.

**Solution :** Suivez l'étape 2 ci-dessus pour ajouter toutes les variables Firebase dans Vercel.

#### ❌ `Failed to load resource: 404` pour les icônes

**Cause :** Les fichiers d'icônes ne sont pas présents dans le dossier `public/`.

**Solution :** Vérifiez que les fichiers `icon-192.png`, `icon-512.png`, etc. existent dans le dossier `public/`.

---

## 📝 Notes Importantes

- Les variables `NEXT_PUBLIC_*` sont exposées côté client (elles sont visibles dans le code source du navigateur)
- Ne jamais commiter le fichier `.env.local` dans Git
- Toujours redéployer après avoir modifié les variables d'environnement
- Les variables sont mises en cache lors du build, un redéploiement complet est nécessaire pour les prendre en compte

---

## 🔗 Liens Utiles

- [Documentation Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Documentation Firebase - Configuration](https://firebase.google.com/docs/web/setup)
- [Documentation Next.js - Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
