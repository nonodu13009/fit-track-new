# Vision de l'App : Journal + Planner + Coach IA

Voilà comment je vois ton app (mobile-first, responsive) : un **journal + un planner + un coach IA**. L’idée clé : **tu saisis en 10 secondes**, et l’IA transforme ça en conseils/action (sans te noyer).

## 0) Onboarding & Profil Vivant (Le point de départ)

### Homepage & Authentification

* **Homepage d'accueil** :
  * Design épuré avec un **CTA (Call-to-Action)** principal bien visible.
  * Présentation rapide de la proposition de valeur (Journal + Planner + Coach IA).
  * Bouton principal : "Commencer" ou "Démarrer".

* **Page de Login/Inscription** :
  * **Mode unifié** : Une seule page avec toggle entre "Créer un compte" et "Se connecter".
  * **Champs standards** :
    * Email
    * Mot de passe avec **toggle "œil"** pour afficher/masquer le mot de passe.
  * **Firebase Authentication** :
    * Social Login fluide (Google, Apple, etc.).
    * Authentification par email/password.
  * **Récupération de mot de passe** :
    * Lien "Mot de passe oublié ?" bien visible.
    * Envoi d'un email de reset via Firebase Authentication.
    * Flow simple et clair pour réinitialiser le mot de passe.

### Onboarding après Authentification

* **Séquence d'accueil immersive** :
  * **Identité Sportive** : Sélection des sports pratiqués + Niveaux/Grades actuels (ex: "Ceinture Bleue 2 barrettes", "Judo : Marron").
  * **Configuration Physique** : Poids, Taille, Date de naissance.
  * **Définition des Objectifs** : Cible précise (ex: "Compétition dans 3 mois", "Perte de 5kg", "Maintien").
* **Profil "Vivant"** : Les données de l'onboarding ne sont pas figées.
  * **Physique** : Le poids saisi à l'inscription est le premier point de ta courbe.
  * **Technique** : Mise à jour simple des grades (ex: Passage de "Bleue 2 barrettes" à "3 barrettes"). L'app célèbre la progression.

## 1) Produit : les 4 “piliers” de l’app

### A) Journal (le “logbook” ultra rapide)

* **Noter une séance passée** en 3 taps : sport (JJB/Judo/Muscu/Cardio/Yoga-Stretch), durée, intensité (RPE 1–10) + note libre.
* Option : exercices/rounds (si tu veux du détail) mais **jamais obligatoire**.
* Objectif : stats fiables sans friction.

### B) Agenda & Planification IA

* **Création manuelle ou par l'IA** : Tu peux demander à l'IA de construire une séance à venir.
* **Options de positionnement** :
  1. **Ne pas planifier** : Reste en "template" ou "projet".
  2. **Planifier sans heure** : Devient un **événement journée** (All-day) en haut de l'agenda. Tu pourras le glisser sur une heure précise plus tard.
  3. **Planifier avec heure** : Se place directement à l'horaire visé.
* Vue **semaine** : Blocs colorés, drag & drop facile pour ajuster les "événements journée".

### C) Préparation (Plan Physique Complet)

* Un “plan” (ex: 6 semaines) = Objectif + Séquençage.
* **Granularité Quotidienne** : Le plan spécifie le **temps fort de CHAQUE jour** sur toute la durée.
  * Pas de jours "vides" imprévus : chaque jour a un statut (Séance, Repos complet, Massage, Stretching, etc.).
* L'IA génère ce calendrier complet que tu peux valider d'un bloc.

### D) Nutrition (Tracker + Coach Menu)

* **Tracker Fluide (façon MyFitnessPal)** :
  * Saisie rapide : Calories, protéines, glucides, lipides, eau.
  * Base de données ingrédients basiques : Poulet, riz complet, viande de grison, endives, etc.
* **Fonctions "Coach Repas" (IA)** :
  1. **Menu à la demande** : "Suggère un dîner à 600kcal riche en protéines".
  2. **Planification Journée Complète** : Ventilation idéale des macros sur la journée (ex: glucides autour de l'entraînement).
  3. **Niveau de complexité variable** :
     * *Simple* (défaut) : Assemblage efficace (ex: "Poulet + Riz + Légumes vapeur").
     * *Sophistiqué* : Recette élaborée si demandé explicitement.
* **Alertes** : Rappels hydratation ou ajustement si déficit/excédent trop important.
* ⚠️ *Disclaimer santé toujours visible.*

---

## 2) UX/UI Premium & Mobile-first (Le facteur “WOW”)

L'application ne doit pas ressembler à un simple utilitaire. Elle doit être **visuellement époustouflante**.

* **Esthétique Dark Mode Profond** :
    * Utilisation de noirs profonds (OLED friendly) et de gris ardoise.
    * **Glassmorphism** : Effets de transparence floutée pour les cartes et la navigation (look "givré" moderne).
    * **Accents Vibrants** : Couleurs néon/vives pour les actions principales (ex: un vert électrique ou un bleu cyan pour les validations) qui ressortent sur le fond sombre.
    * **Dégradés Subtils** : Pas de couleurs plates ennuyeuses. Utilisation de gradients légers pour donner de la profondeur aux boutons et aux cartes.

* **Interactions & Animations (Fluidité absolue)** :
    * **Micro-interactions** : Chaque tap doit être ressenti (visuellement et haptiquement). Boutons qui pressent, switchs qui glissent.
    * **Transitions** : Navigation fluide entre les pages (pas de rechargement brutal). Utilisation de `Framer Motion` pour des entrées/sorties soyeuses.
    * **Feedback immédiat** : Si je logue une séance, une animation de succès gratifiante apparaît.

* **Typography & Layout** :
    * **Polices Modernes** : Typographie sans-serif premium (Ex: Inter, Outfit, ou SF Pro) pour une lisibilité parfaite et un look tech.
    * **Espace** : Beaucoup de "whitespace" (resp. "darkspace"). Ne pas surcharger l'écran. Contenu aéré.
    * **Cartes "Bento"** : Présentation des infos (stats, tâches) sous forme de grilles de cartes modulaires, très tendance et lisible.

* **Navigation** :
    * **Bottom nav flottante** : `Aujourd’hui` / `Journal` / `Agenda` / `Coach` (style dock iOS/macOS).
    * **Gros bouton + (FAB) "Glow"** : Un bouton d'action central avec une légère lueur (glow effect) pour inciter au clic.
      * “Séance rapide”
      * “Repas rapide”
      * “Poids / mesures”

### Design System Specs (Extraction Prototype)

* **Palette "Deep Dark"** :
  * Fond : `#050505` (Deep Black)
  * Cartes : `#0F1115` (Surface) & `#1A1D23` (Elevated)
* **Accents Vibrants** :
  * *Cyan Électrique* : `#22d3ee` (Validation / Info)
  * *Neon Purple* : `#a855f7` (IA / Coach)
  * *Acid Lime* : `#a3e635` (Focus / Énergie)
* **Typographie** : `Inter` (Google Fonts) ou `SF Pro` (System).
* **Iconographie** : `Phosphor Icons` - Bibliothèque d'icônes moderne.
  * **Installation** : `npm install phosphor-react` (ou `@phosphor-icons/react` pour la v2)
  * **Usage** : Import simple et flexible.
  * **Variantes** : 
    * `Fill` pour les éléments actifs/sélectionnés
    * `Bold` pour les éléments au repos
    * `Duotone` pour des effets visuels avancés si nécessaire
  * **Exemples** : 
    * Navigation : `<House />`, `<Calendar />`, `<Barbell />`, `<ChatCircle />`
    * Actions : `<Plus />`, `<Check />`, `<X />`, `<Share />`
    * Toggle password : `<Eye />` / `<EyeSlash />`
  * **Personnalisation** : Props `size`, `color`, `weight` pour ajuster facilement le style
* **Effets Spécifiques (CSS)** :
  * **Glassmorphism** : `bg-[#1A1D23]/60` + `backdrop-blur-md` + `border-white/10`.
  * **Glows / Ombres Portées** :
    * *Purple Glow* : `shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]`
    * *Cyan Glow* : `shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]`
  * **Gradients** : 
    * FAB : `bg-gradient-to-r from-accent-purple to-indigo-600`.
    * Textes Titres : `bg-gradient-to-r from-white to-gray-400 bg-clip-text`.

* `Aujourd'hui` = Dashboard premium. Carte "à faire" mise en avant, graphs minimalistes et élégants pour les stats.
* **Partage Natif (Web Share)** : Tout contenu généré (Séance, Plan, Recette) est exportable instantanément.
  * Bouton "Share" utilisant les **fonctions natives du téléphone** (SMS, WhatsApp, Mail).
  * Usage : Envoyer sa séance à un coach/pote, partager une recette... en un tap.
* Chaque saisie doit être un plaisir, faisable **à une main**, en **moins de 30 secondes**.

---

## 3) Stack Technique & Dépendances

### Framework & Core

* **Next.js 14+** (App Router)
  * `npx create-next-app@latest --typescript --tailwind --app`
  * Framework React full-stack avec SSR/SSG
  * Route handlers pour les API (`app/api/*`)
  * Déploiement Vercel optimisé

* **React 18+**
  * Server Components par défaut
  * Client Components pour l'interactivité

* **TypeScript**
  * Type safety complet
  * Meilleure DX avec autocomplétion

### Styling & Design

* **Tailwind CSS**
  * `npm install -D tailwindcss postcss autoprefixer`
  * Utility-first CSS framework
  * Configuration custom pour la palette Dark Mode
  * Classes personnalisées pour glassmorphism et glows

* **Framer Motion**
  * `npm install framer-motion`
  * Animations et transitions fluides
  * Micro-interactions et gestures
  * Support des animations de layout

* **Phosphor Icons**
  * `npm install @phosphor-icons/react`
  * Bibliothèque d'icônes moderne et cohérente
  * Multiples variantes (Fill, Bold, Duotone)

### Backend & Base de données

* **Firebase**
  * `npm install firebase firebase-admin`
  * **Authentication** : Social login + Email/Password
  * **Firestore** : Base de données NoSQL temps réel
  * **Storage** : Upload d'images (profil, recettes)
  * **Cloud Functions** (optionnel pour certains triggers)

### IA & LLM

* **Mistral AI SDK**
  * `npm install @mistralai/mistralai`
  * Modèles performants et open-weight disponibles
  * Function/Tool calling natif pour les actions structurées
  * Coûts optimisés
  * API claire et bien documentée
  * Souveraineté des données (hébergement EU disponible)

### Utilities & Tooling

* **date-fns** ou **dayjs**
  * `npm install date-fns` ou `npm install dayjs`
  * Manipulation des dates (calendrier, stats)
  * Formatage et calculs de durées

* **react-hook-form**
  * `npm install react-hook-form`
  * Gestion des formulaires performante
  * Validation intégrée

* **zod**
  * `npm install zod`
  * Validation de schémas TypeScript-first
  * Sécurisation des inputs (client + serveur)

* **recharts** ou **chart.js**
  * `npm install recharts` ou `npm install chart.js react-chartjs-2`
  * Graphiques et visualisations de stats
  * Courbes de poids, progression, etc.

### Development & Quality

* **ESLint** (inclus avec Next.js)
  * Linting du code
  * Règles strictes

* **Prettier**
  * `npm install -D prettier`
  * Formatage automatique du code

* **Husky** (optionnel)
  * `npm install -D husky`
  * Git hooks pour pre-commit checks

### Commandes d'installation complète

```bash
# Création du projet Next.js
npx create-next-app@latest jjb-tracking --typescript --tailwind --app --eslint

cd jjb-tracking

# Dépendances principales
npm install firebase framer-motion @phosphor-icons/react date-fns react-hook-form zod recharts

# Dépendance IA
npm install @mistralai/mistralai

# Dépendances dev (optionnelles)
npm install -D prettier
```

---

## 4) Données (Firestore) : modèle simple et scalable

Collections typiques (toutes **scopées userId**) :

* `userProfiles/{uid}`
* `workouts/{id}` (type, date, durée, RPE, tags, notes, sport)
* `workoutTemplates/{id}`
* `calendarEvents/{id}` (start/end, workoutTemplateId?, status planned/done/skipped)
* `trainingPlans/{id}` + `planWeeks/{id}` (ou sous-collections)
* `weighIns/{id}` (date, poids)
* `measurements/{id}` (taille, cuisse, etc.)
* `meals/{id}` (date, calories, macros, items)
* `recipes/{id}` (source, macros, ingrédients)

Côté sécurité, Firestore est fait pour ça : règles basées sur `request.auth.uid` + champs `userId`. ([Firebase][1])

---

## 5) Coach IA : comment je l'architecte proprement

### Principe

L’IA ne “devine” pas ta vie : elle **lit tes données**, te pose 1–2 questions max si besoin, puis :

* propose un **plan**
* ajuste **nutrition**
* détecte tendances (fatigue, baisse de perf, poids qui stagne)
* te donne le “next best action” (ex : “ce soir : séance mobilité 20 min + 5000 pas”).

### Technique (Next.js)

* Tu exposes un endpoint serveur : `app/api/coach/route.ts`
* Le client envoie : objectif + contexte (derniers logs résumés) + demande
* Le serveur :

  1. récupère Firestore (7–30 derniers jours),
  2. envoie au modèle,
  3. renvoie une réponse **structurée** (JSON : actions, séances, menus, alertes)
     Next.js route handlers / API côté App Router : ([nextjs.org][2])
     Déploiement Next.js sur Vercel : ([Vercel][3])

### "Tool calling" (gros boost qualité)

Tu définis des fonctions type :

* `getWeeklyStats()`
* `logWorkout()`
* `createPlan()`
* `suggestMeals()`
* `updateGoal()`

Mistral supporte nativement les schémas modernes de tool/function calling. ([docs.mistral.ai][4])

---

## 6) Mistral AI : Configuration & Utilisation

### Pourquoi Mistral ?

* **Performance** : Modèles compétitifs avec un excellent rapport qualité/prix
* **Souveraineté** : Solution européenne avec hébergement EU disponible
* **Coûts optimisés** : Tarification attractive comparée aux autres LLM
* **Tool calling natif** : Support complet des function calling pour le coaching structuré
* **Open-weight** : Certains modèles disponibles en open source
* **Documentation claire** : API bien documentée et facile à intégrer

### Modèles recommandés

* **Mistral Large** : Pour le coaching avancé, raisonnement complexe
* **Mistral Small** : Bon équilibre performance/coût pour les tâches standards
* **Mistral Nemo** : Léger et rapide pour les requêtes simples

### Configuration

* Variable d'environnement : `MISTRAL_API_KEY`
* Stockage sécurisé dans Vercel (Environment Variables)
* API accessible via `@mistralai/mistralai` SDK

### Ressources

* Liste des modèles et docs API : ([docs.mistral.ai][5])
* Capacités tool calling : ([docs.mistral.ai][6])
* Documentation complète : ([docs.mistral.ai][7])

---

## 7) MVP en 3 incréments (pour repartir vite après "j'ai tout supprimé")

1. **Auth + Journal**

   * login Firebase
   * log séance passée + poids + mesures
   * stats semaine (séances / minutes / RPE moyen)
2. **Agenda + Templates**

   * créer une séance template
   * planifier dans agenda interne
   * “fait / skip”
3. **Coach IA + Nutrition**

   * chat “Coach”
   * génération plan semaine + suggestions repas
   * export “to-do” du jour

---

## 8) Le petit "plus" qui rend l'app addictive (sans gamification lourde)

* Streak **souple** : “X jours actifs / 7” (pas un streak qui culpabilise)
* Badges “techniques” (JJB/Judo) uniquement si tu veux (ex : “guard retention semaine”, “randori 3x”)
* Résumé hebdo auto : “ce qui a marché / à ajuster”.

[1]: https://firebase.google.com/docs/rules/basics?utm_source=chatgpt.com "Basic Security Rules - Firebase - Google"
[2]: https://nextjs.org/blog/building-apis-with-nextjs?utm_source=chatgpt.com "Building APIs with Next.js"
[3]: https://vercel.com/docs/frameworks/full-stack/nextjs?utm_source=chatgpt.com "Next.js on Vercel"
[4]: https://docs.mistral.ai/capabilities/function_calling?utm_source=chatgpt.com "Function Calling | Mistral Docs"
[5]: https://docs.mistral.ai/getting-started/models?utm_source=chatgpt.com "Models | Mistral AI"
[6]: https://docs.mistral.ai/capabilities/function_calling?utm_source=chatgpt.com "Function Calling | Mistral Docs"
[7]: https://docs.mistral.ai/?utm_source=chatgpt.com "Documentation - Mistral AI"
