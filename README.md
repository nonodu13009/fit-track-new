# 🥋 JJB Tracking

**Application mobile-first de tracking sportif, nutrition et coaching IA**

> Journal + Planner + Coach IA pour les pratiquants de JJB, Judo et sports de combat.

---

## 📚 Documentation

- **[Vision complète](./docs/app_vision.md)** : Concept, features, design system
- **[TODO](./docs/TODO.md)** : Liste des tâches et progression

---

## 🚀 Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icônes** : Phosphor Icons
- **Backend** : Firebase (Auth + Firestore + Storage)
- **IA** : Mistral AI (mistral-small-latest)
- **Forms** : react-hook-form + zod
- **Charts** : recharts
- **Dates** : date-fns

---

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Copier .env.local.example vers .env.local et remplir les clés

# Lancer en développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Linter
npm run lint

# Formatter le code
npm run format

# Vérifier le formatage
npm run format:check
```

---

## 📁 Structure du projet

```
/app                    # Next.js App Router
  /api                  # API Routes (serveur)
  /auth                 # Routes d'authentification
  /dashboard            # Routes protégées
  layout.tsx            # Layout racine
  page.tsx              # Page d'accueil
  globals.css           # Styles globaux

/components             # Composants React
  /ui                   # Composants UI de base (Button, Card, etc.)
  /layout               # Layout components (Nav, Header, etc.)
  /features             # Composants métier
  /providers            # Context providers

/lib                    # Logique métier & utils
  /firebase             # Configuration Firebase
  /mistral              # Configuration Mistral AI
  /data                 # Base de données (44 ingrédients)
  /utils                # Fonctions utilitaires
  /validations          # Schémas Zod

/types                  # Types TypeScript globaux
/hooks                  # Hooks React personnalisés
/constants              # Constantes (couleurs, config, etc.)
/public                 # Assets statiques
/docs                   # Documentation

# Fichiers Firebase (racine)
firestore.rules         # Règles de sécurité Firestore
firestore.indexes.json  # Configuration des index
firebase.json           # Configuration Firebase CLI
```

---

## 🎨 Design System

### Palette "Deep Dark"
- **Fond** : `#050505` (Deep Black)
- **Surface** : `#0F1115`
- **Elevated** : `#1A1D23`

### Accents Vibrants
- **Cyan Électrique** : `#22d3ee` (Validation / Info)
- **Neon Purple** : `#a855f7` (IA / Coach)
- **Acid Lime** : `#a3e635` (Focus / Énergie)

### Typographie
- **Police** : Inter (Google Fonts)
- **Style** : Sans-serif premium, lisibilité optimale

---

## 🔐 Variables d'environnement

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Mistral AI
MISTRAL_API_KEY=
MISTRAL_MODEL=mistral-small-latest
```

---

## 📊 Progression

**Phase actuelle** : Phase 0 - Setup Initial (26%)

- ✅ Infrastructure & configuration
- 🔄 Design System Tailwind
- ⏸️ Composants UI de base
- ⏸️ Layout & Navigation

Voir [TODO.md](./docs/TODO.md) pour le détail complet.

---

## 🤝 Contribution

Ce projet suit les principes **Clean Code** :
- Nommage clair et explicite
- Fonctions courtes et cohérentes
- DRY (Don't Repeat Yourself)
- Code sécurisé et robuste
- Style uniforme (Prettier)

---

## 📝 Licence

Privé - Jean-Michel Nogaro © 2026
