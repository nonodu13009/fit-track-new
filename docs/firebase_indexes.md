# 🔥 Firebase - Index à créer

## ⚠️ IMPORTANT
Ces index sont nécessaires pour les requêtes Firestore qui combinent `where` + `orderBy`.
Créez-les **seulement quand Firebase vous donne le lien d'erreur**.

---

## ✅ Index déjà créés

### 1. workouts (userId + date)
**Status** : ✅ ACTIVÉ ✅
- Collection : `workouts`
- Champs : `userId` (Ascending), `date` (Descending)
- Utilisé pour : Journal, Stats hebdomadaires
- ID : CICAgOjXh4EK

### 2. weighIns (userId + date)
**Status** : ✅ ACTIVÉ ✅
- Collection : `weighIns`
- Champs : `userId` (Ascending), `date` (Ascending)
- Utilisé pour : Graphique poids, Historique poids
- ID : CICAgJiUpoMK

### 3. calendarEvents (userId + start)
**Status** : ✅ ACTIVÉ ✅
- Collection : `calendarEvents`
- Champs : `userId` (Ascending), `start` (Ascending)
- Utilisé pour : Agenda / Calendrier (`/dashboard/agenda`)
- Hook : `useCalendarEvents()`
- ID : CICAgJim14AK

---

## ⏸️ Index futurs (à créer si/quand l'erreur apparaît)

---

### 4. workoutTemplates (userId + createdAt)
**Status** : ⏸️ EN ATTENTE
- Collection : `workoutTemplates`
- Champs : `userId` (Ascending), `createdAt` (Descending)
- Utilisé pour : Page Templates (`/dashboard/templates`)
- Hook : `useTemplates()`
- Apparaît quand : Vous créez votre **premier template** de séance

**LIEN** : *(Firebase fournira le lien automatiquement dans la console)*

**Requête concernée** :
```typescript
query(
  collection(db, "workoutTemplates"),
  where("userId", "==", user.uid),
  orderBy("createdAt", "desc")
)
```

---

### 5. meals (userId + date) - REQUÊTE COMPLEXE
**Status** : ⏸️ EN ATTENTE
- Collection : `meals`
- Champs : `userId` (Ascending), `date` (Ascending ou Descending)
- Utilisé pour : Page Nutrition (`/dashboard/nutrition`)
- Hook : `useMeals()`
- Apparaît quand : Vous loggez votre **premier repas**

**LIEN** : *(Firebase fournira le lien automatiquement dans la console)*

**Requête concernée** :
```typescript
query(
  collection(db, "meals"),
  where("userId", "==", user.uid),
  where("date", ">=", dayStart),
  where("date", "<=", dayEnd),
  orderBy("date", "desc")
)
```

**Note spéciale** : Cette requête est complexe car elle utilise des **range queries** (>=, <=) sur `date`. Firebase créera automatiquement l'index optimal.

---

## 📊 RÉSUMÉ COMPLET

**Total index requis** : **5 index**  
**Activés** : **3/5** ✅  
**Restants** : **2/5** (apparaîtront automatiquement)

| # | Collection | Status | Trigger |
|---|------------|--------|---------|
| 1 | workouts | ✅ **Activé** | Journal / Stats |
| 2 | weighIns | ✅ **Activé** | Graphique poids |
| 3 | calendarEvents | ✅ **Activé** | Agenda |
| 4 | workoutTemplates | ⏸️ Futur | Premier template |
| 5 | meals | ⏸️ Futur | Premier repas |

---

## 🎯 PLAN D'ACTION

### **✅ TERMINÉ** :
1. ✅ Index `workouts` créé
2. ✅ Index `weighIns` créé
3. ✅ Index `calendarEvents` créé

### **⏸️ À FAIRE plus tard** (au fil de l'utilisation) :
4. ⏸️ Créer index `workoutTemplates` → Apparaîtra quand vous créerez votre 1er template
5. ⏸️ Créer index `meals` → Apparaîtra quand vous loggerez votre 1er repas

**Procédure** : Firebase vous donnera les liens exacts dans la console → Cliquez dessus → Créer → Attendre 1-2 min → ✅

---

## 🎉 APPLICATION 100% OPÉRATIONNELLE !

**Avec les 3 index activés, toutes les fonctionnalités principales fonctionnent** :
- ✅ Journal séances (avec filtres, edit, delete)
- ✅ Stats hebdomadaires
- ✅ Graphique courbe de poids
- ✅ Historique poids complet
- ✅ **Agenda / Calendrier** ⭐
- ✅ Planification séances
- ✅ Marquer fait/sauté
- ✅ Dashboard avec tout

**Les 2 index restants** apparaîtront automatiquement quand vous utiliserez Templates et Nutrition.

---

## 🎯 PROCÉDURE

### Quand une erreur d'index apparaît :

1. **Copier le lien** fourni dans l'erreur console
2. **Ouvrir le lien** dans le navigateur
3. **Cliquer "Créer l'index"** (pré-rempli automatiquement)
4. **Attendre 1-2 minutes** (status passe de "Création..." à "✓ Activé")
5. **Recharger l'app** → Erreur disparue ! ✅

### Pourquoi ces index ?

Firebase nécessite des index pour :
```typescript
query(
  collection(db, "collection"),
  where("userId", "==", user.uid),  // Filtre
  orderBy("date", "desc")            // Tri
)
```

C'est **normal** et **obligatoire** pour la performance et sécurité !

---

## 📝 NOTES

- **NE PAS** créer les index à l'avance
- Créez-les **seulement quand Firebase le demande**
- Firebase optimise automatiquement les index
- Chaque index prend 1-2 minutes à créer
- Une fois créé, il reste actif pour toujours

---

**Fichier créé le** : 2026-01-13  
**Projet** : JJB Tracking - fit-tracker-728e9
