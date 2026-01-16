# Spécifications : Timeline de progression technique JJB (Gi)

## 🎯 Contexte

**TU ES UN DEV SENIOR NEXT.JS 14 + TYPESCRIPT + TAILWIND.**

**OBJECTIF :** Construire une UI "Timeline de progression technique JJB (Gi)" avec validation utilisateur étape par étape, responsive (vertical mobile / horizontal desktop), design moderne (gaming clean), stockage persistant (Firestore si dispo, sinon localStorage fallback).

---

## 📋 BASE (RAPPELS)

- **AUCUNE référence au grade.**
- **User = débutant** (démarre de 0).
- **GI uniquement.** Progression loisir + perf "type IBJJF" (marquer, stabiliser, contrôler), sans jargon niveau.

---

## 🗓️ CONTEXTE PRODUIT

**Progression 16 semaines, 4 blocs de 4 semaines :**

- **BLOC 1 :** fondamentaux survie + mouvements + posture
- **BLOC 2 :** garde + sweeps simples + maintien
- **BLOC 3 :** passages + contrôles + transitions
- **BLOC 4 :** dos + finitions Gi + stratégie match

---

## 🎨 PRINCIPE UX (IMPORTANT)

### Timeline RESPONSIVE

- **MOBILE (sm-) :** VERTICALE (scroll vertical)
- **DESKTOP (md+) :** HORIZONTALE (scroll horizontal)

### Auto-scroll & Centrage

Par défaut, à l'ouverture de `/progression`, on doit afficher la timeline "centrée" sur :

1. L'étape la plus récemment mise à jour (`updatedAt` le plus récent) si existe
2. Sinon l'étape en cours (`IN_PROGRESS`)
3. Sinon la première `AVAILABLE`

**Implémenter :**
- Auto-scroll / scroll-into-view sur le `StepNode` cible (smooth)
- Bouton "Aller à l'étape active"

---

## ✅ VALIDATION

- Chaque step a **prérequis (locked)** + **checklist** + **KPI**
- Bouton "Valider l'étape" grisé tant que conditions non remplies
- Annuler validation => revient `IN_PROGRESS`

---

## 🎮 GAMIFICATION (À INTÉGRER)

### Système de points (XP) + niveaux + badges

#### XP gagnée

- **Cocher item REQUIRED :** +5 XP
- **Cocher item OPTIONAL :** +2 XP
- **KPI atteint :** +10 XP (par KPI required)
- **Validation de l'étape (DONE) :** +50 XP + badge "Step Clear"
- **Complétion d'un bloc** (toutes les steps d'un bloc DONE) : +200 XP + badge "Bloc Clear"

#### Niveau

- `level = floor(xp / 250) + 1`

#### Streak (optionnel)

- Bonus si l'utilisateur valide au moins 1 item 2 jours d'affilée
- `streakDay++` si action un jour différent
- +20 XP par jour de streak (cap 7 jours)

### Affichage

- **XP total** + **Level** + **Progress bar** vers niveau suivant
- **Badges obtenus** (grid)
- **"Dernière activité"** (date + step)

### Historisation

- `progressLog[] : { id, ts, type, stepId?, xpDelta, label }`
- Permettre "Undo" du dernier gain lié à une action (optionnel) OU recalculer XP à partir de l'état (plus robuste)

---

## 💾 STOCKAGE (MODEL)

### Progress user contient

```typescript
{
  steps: map stepId -> {
    checklistState,
    kpisState,
    validatedAt?,
    updatedAt,
    notes?
  },
  gamification: {
    xpTotal,
    level,
    streak,
    lastActiveDate,
    badges[]
  },
  log: progressLog[] // optionnel, peut être limité aux 200 derniers
}
```

### IMPORTANT : Approche robuste

- Soit recalculer XP à partir de l'état (déterministe)
- Soit maintenir `xpTotal` + `log`, mais garantir cohérence (migration/simple repair)

---

## 📦 LIVRABLES UI

### 1) `/progression` page

- Timeline responsive + auto-scroll sur dernier point mis à jour
- **Header stats :** Level, XP, progress bar, streak (si activé)
- **Global completion %** + **% par bloc**
- **Filters** + **search** + **CTA "Reprendre"** + **"Aller à l'étape active"**
- **Toggle Timeline/Liste**

### 2) `/progression/[stepId]` StepDetail

- Objectifs
- **Checklist** (required/optional) avec indication XP gain on check
- **KPIs** (inputs) avec indication XP gain on reach target
- **Bouton "Valider"** (si OK)
- **Micro-feedback "+XP"** (toast) quand action
- Notes
- **Historique de l'étape** (dernières actions liées à ce step)

### 3) Timeline nodes

- Afficher un mini "XP earned" ou "Done check" sur steps terminées
- **Glow sur step active** + badge "Active"
- Sur desktop : `scroll-snap-x` (optionnel) pour confort
- Sur mobile : scroll vers node actif en haut de liste

---

## 📚 CATALOGUE STEPS (V1 DÉBUTANT, ~25 steps)

### BLOC 1 : Fondamentaux survie + mouvements + posture

#### Step 01 : Posture de base (Seiza, Shizentai)
- **Objectifs :** Comprendre les positions de base debout et à genoux
- **Checklist :**
  - [REQUIRED] Seiza correcte (genoux au sol, dos droit)
  - [REQUIRED] Shizentai naturelle (pieds écartés, poids réparti)
  - [OPTIONAL] Transition fluide Seiza ↔ Shizentai
- **KPIs :**
  - [REQUIRED] Maintenir Seiza 30s sans bouger
  - [OPTIONAL] Maintenir Shizentai 1min sans bouger

#### Step 02 : Chute avant (Mae Ukemi)
- **Objectifs :** Apprendre à chuter en sécurité
- **Checklist :**
  - [REQUIRED] Roulade avant correcte (bras, épaule, dos)
  - [REQUIRED] Protection de la tête
  - [OPTIONAL] Chute depuis position debout
- **KPIs :**
  - [REQUIRED] 5 chutes consécutives sans douleur
  - [OPTIONAL] 10 chutes consécutives

#### Step 03 : Chute arrière (Ushiro Ukemi)
- **Objectifs :** Chuter en arrière en sécurité
- **Checklist :**
  - [REQUIRED] Roulade arrière correcte
  - [REQUIRED] Protection de la tête et du cou
  - [OPTIONAL] Chute depuis position debout
- **KPIs :**
  - [REQUIRED] 5 chutes consécutives sans douleur
  - [OPTIONAL] 10 chutes consécutives

#### Step 04 : Déplacement au sol (Shrimping)
- **Objectifs :** Se déplacer efficacement au sol
- **Checklist :**
  - [REQUIRED] Shrimping de base (hanches relevées, jambe poussée)
  - [REQUIRED] Shrimping des deux côtés
  - [OPTIONAL] Shrimping avec résistance partenaire
- **KPIs :**
  - [REQUIRED] 10 shrimps consécutifs chaque côté
  - [OPTIONAL] 20 shrimps consécutifs chaque côté

#### Step 05 : Bridge (Pont)
- **Objectifs :** Renforcer et utiliser le pont
- **Checklist :**
  - [REQUIRED] Bridge de base (appui sur tête/épaules)
  - [REQUIRED] Bridge latéral (rondade)
  - [OPTIONAL] Bridge avec rotation
- **KPIs :**
  - [REQUIRED] Maintenir bridge 10s
  - [OPTIONAL] Maintenir bridge 30s

### BLOC 2 : Garde + sweeps simples + maintien

#### Step 06 : Garde fermée (Closed Guard)
- **Objectifs :** Comprendre et utiliser la garde fermée
- **Checklist :**
  - [REQUIRED] Position de base (jambes croisées, contrôle)
  - [REQUIRED] Contrôle des manches
  - [OPTIONAL] Transition garde fermée → ouverte
- **KPIs :**
  - [REQUIRED] Maintenir garde fermée 30s avec partenaire résistant
  - [OPTIONAL] Maintenir garde fermée 1min

#### Step 07 : Garde ouverte (Open Guard)
- **Objectifs :** Utiliser la garde ouverte
- **Checklist :**
  - [REQUIRED] Position de base (pieds sur hanches/épaules)
  - [REQUIRED] Contrôle distance avec jambes
  - [OPTIONAL] Transitions entre variantes garde ouverte
- **KPIs :**
  - [REQUIRED] Maintenir garde ouverte 20s avec partenaire résistant
  - [OPTIONAL] Maintenir garde ouverte 45s

#### Step 08 : Scissor Sweep (Balayage ciseaux)
- **Objectifs :** Exécuter le balayage ciseaux
- **Checklist :**
  - [REQUIRED] Setup correct (manche + genou)
  - [REQUIRED] Exécution du sweep (ciseaux + rotation)
  - [OPTIONAL] Sweep depuis garde fermée
- **KPIs :**
  - [REQUIRED] 3 sweeps réussis en sparring léger
  - [OPTIONAL] 5 sweeps réussis

#### Step 09 : Hip Bump Sweep
- **Objectifs :** Exécuter le hip bump sweep
- **Checklist :**
  - [REQUIRED] Setup correct (manche + hanche)
  - [REQUIRED] Exécution (bump + rotation)
  - [OPTIONAL] Sweep depuis garde ouverte
- **KPIs :**
  - [REQUIRED] 3 sweeps réussis en sparring léger
  - [OPTIONAL] 5 sweeps réussis

#### Step 10 : Maintien latéral (Side Control)
- **Objectifs :** Maintenir la position latérale
- **Checklist :**
  - [REQUIRED] Position de base (poids, contrôle)
  - [REQUIRED] Contrôle des hanches et épaules
  - [OPTIONAL] Transitions entre variantes side control
- **KPIs :**
  - [REQUIRED] Maintenir side control 30s avec partenaire résistant
  - [OPTIONAL] Maintenir side control 1min

### BLOC 3 : Passages + contrôles + transitions

#### Step 11 : Knee on Belly
- **Objectifs :** Contrôler avec genou sur ventre
- **Checklist :**
  - [REQUIRED] Position de base (genou, équilibre)
  - [REQUIRED] Contrôle des bras adversaire
  - [OPTIONAL] Transitions knee on belly → side control
- **KPIs :**
  - [REQUIRED] Maintenir knee on belly 20s avec partenaire résistant
  - [OPTIONAL] Maintenir knee on belly 45s

#### Step 12 : Mount (Montée)
- **Objectifs :** Contrôler la montée
- **Checklist :**
  - [REQUIRED] Position de base (genoux, équilibre)
  - [REQUIRED] Contrôle des bras adversaire
  - [OPTIONAL] Transitions mount → side control
- **KPIs :**
  - [REQUIRED] Maintenir mount 20s avec partenaire résistant
  - [OPTIONAL] Maintenir mount 45s

#### Step 13 : Pass garde fermée (Knee Cut)
- **Objectifs :** Passer la garde fermée
- **Checklist :**
  - [REQUIRED] Setup correct (manche + genou)
  - [REQUIRED] Exécution du pass (coupe genou)
  - [OPTIONAL] Pass depuis garde ouverte
- **KPIs :**
  - [REQUIRED] 3 passes réussis en sparring léger
  - [OPTIONAL] 5 passes réussis

#### Step 14 : Pass garde ouverte (Torreando)
- **Objectifs :** Passer la garde ouverte
- **Checklist :**
  - [REQUIRED] Setup correct (manches + contrôle jambes)
  - [REQUIRED] Exécution du pass (torreando)
  - [OPTIONAL] Pass depuis garde fermée
- **KPIs :**
  - [REQUIRED] 3 passes réussis en sparring léger
  - [OPTIONAL] 5 passes réussis

#### Step 15 : Transition Side Control → Mount
- **Objectifs :** Transitions fluides entre positions
- **Checklist :**
  - [REQUIRED] Transition side control → mount
  - [REQUIRED] Transition mount → side control
  - [OPTIONAL] Transition avec contrôle continu
- **KPIs :**
  - [REQUIRED] 5 transitions réussis en sparring léger
  - [OPTIONAL] 10 transitions réussis

### BLOC 4 : Dos + finitions Gi + stratégie match

#### Step 16 : Back Control (Contrôle du dos)
- **Objectifs :** Contrôler le dos
- **Checklist :**
  - [REQUIRED] Position de base (crochets, contrôle)
  - [REQUIRED] Contrôle des bras adversaire
  - [OPTIONAL] Transitions back control → mount
- **KPIs :**
  - [REQUIRED] Maintenir back control 20s avec partenaire résistant
  - [OPTIONAL] Maintenir back control 45s

#### Step 17 : Rear Naked Choke (RNC)
- **Objectifs :** Exécuter l'étranglement arrière
- **Checklist :**
  - [REQUIRED] Setup correct (bras, position)
  - [REQUIRED] Exécution du choke (technique propre)
  - [OPTIONAL] RNC depuis différentes positions
- **KPIs :**
  - [REQUIRED] 3 RNC réussis en sparring léger
  - [OPTIONAL] 5 RNC réussis

#### Step 18 : Cross Collar Choke (Gi)
- **Objectifs :** Exécuter l'étranglement croisé avec Gi
- **Checklist :**
  - [REQUIRED] Setup correct (collets croisés)
  - [REQUIRED] Exécution du choke (technique propre)
  - [OPTIONAL] Cross collar depuis garde fermée
- **KPIs :**
  - [REQUIRED] 3 cross collar réussis en sparring léger
  - [OPTIONAL] 5 cross collar réussis

#### Step 19 : Bow and Arrow Choke (Gi)
- **Objectifs :** Exécuter le bow and arrow choke
- **Checklist :**
  - [REQUIRED] Setup correct (collet + jambe)
  - [REQUIRED] Exécution du choke (technique propre)
  - [OPTIONAL] Bow and arrow depuis back control
- **KPIs :**
  - [REQUIRED] 3 bow and arrow réussis en sparring léger
  - [OPTIONAL] 5 bow and arrow réussis

#### Step 20 : Americana (Kimura)
- **Objectifs :** Exécuter les clés d'épaule
- **Checklist :**
  - [REQUIRED] Setup correct (bras, position)
  - [REQUIRED] Exécution Americana (technique propre)
  - [OPTIONAL] Exécution Kimura
- **KPIs :**
  - [REQUIRED] 3 Americana réussis en sparring léger
  - [OPTIONAL] 3 Kimura réussis

#### Step 21 : Armbar (Clé de bras)
- **Objectifs :** Exécuter la clé de bras
- **Checklist :**
  - [REQUIRED] Setup correct (bras, position)
  - [REQUIRED] Exécution armbar (technique propre)
  - [OPTIONAL] Armbar depuis garde fermée
- **KPIs :**
  - [REQUIRED] 3 armbar réussis en sparring léger
  - [OPTIONAL] 5 armbar réussis

#### Step 22 : Escape garde fermée
- **Objectifs :** Échapper de la garde fermée
- **Checklist :**
  - [REQUIRED] Posture correcte (debout, genoux)
  - [REQUIRED] Ouverture de la garde (technique)
  - [OPTIONAL] Escape avec contrôle
- **KPIs :**
  - [REQUIRED] 3 escapes réussis en sparring léger
  - [OPTIONAL] 5 escapes réussis

#### Step 23 : Escape side control
- **Objectifs :** Échapper du side control
- **Checklist :**
  - [REQUIRED] Shrimping correct (hanches, espace)
  - [REQUIRED] Récupération garde (technique)
  - [OPTIONAL] Escape avec contrôle
- **KPIs :**
  - [REQUIRED] 3 escapes réussis en sparring léger
  - [OPTIONAL] 5 escapes réussis

#### Step 24 : Escape mount
- **Objectifs :** Échapper de la montée
- **Checklist :**
  - [REQUIRED] Bridge correct (hanches, espace)
  - [REQUIRED] Récupération garde (technique)
  - [OPTIONAL] Escape avec contrôle
- **KPIs :**
  - [REQUIRED] 3 escapes réussis en sparring léger
  - [OPTIONAL] 5 escapes réussis

#### Step 25 : Stratégie match (Flow)
- **Objectifs :** Enchaîner techniques en situation
- **Checklist :**
  - [REQUIRED] Flow garde → sweep → contrôle
  - [REQUIRED] Flow contrôle → passage → finition
  - [OPTIONAL] Flow complet (garde → finition)
- **KPIs :**
  - [REQUIRED] 3 flows réussis en sparring léger
  - [OPTIONAL] 5 flows réussis

---

## 🔒 RÈGLES DE VALIDATION

- `checklist.required` cochés + `kpis.required >= target` => `DONE`

---

## ⚙️ CONTRAINTES TECH

- **TS strict**
- **Pas de dépendances lourdes**
- **Fonctionne sans Firebase** (localStorage fallback)
- **Accessibilité** + **mobile-first**

---

## 📁 STRUCTURE FICHIERS

```
/app/progression/page.tsx
/app/progression/[stepId]/page.tsx
/components/progression/Timeline.tsx (responsive + autoscroll)
/components/progression/StepCard.tsx
/components/progression/StepDetail.tsx
/components/progression/GamificationHeader.tsx (Level/XP/Streak)
/components/progression/BadgesGrid.tsx
/lib/progression/steps.ts
/lib/progression/types.ts
/lib/progression/progressStore.ts
/lib/progression/compute.ts (status/completion)
/lib/progression/gamification.ts (xp rules, level, badges, streak)
/lib/progression/scroll.ts (helpers scrollIntoView target step)
```

---

## 🚀 PLAN D'IMPLÉMENTATION

### Ordre de développement

1. **A) `types.ts`** (inclure gamification + log)
2. **B) `steps.ts`** (catalog)
3. **C) `compute.ts`** (status/completion/currentStepId + lastUpdatedStepId)
4. **D) `gamification.ts`** (calcXPFromState + award functions)
5. **E) `progressStore.ts`** (localStorage, Firestore optionnel)
6. **F) UI pages + composants**

---

## ✅ RENDRE LE CODE COMPLET, FICHIER PAR FICHIER

**Objectif final :** Code production-ready, complet, testé, avec toutes les fonctionnalités décrites ci-dessus.
