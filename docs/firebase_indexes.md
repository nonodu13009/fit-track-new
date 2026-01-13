# 🔥 Firebase - Index à créer

## ⚠️ IMPORTANT
Ces index sont nécessaires pour les requêtes Firestore qui combinent `where` + `orderBy`.
Créez-les **seulement quand Firebase vous donne le lien d'erreur**.

---

## ✅ Index déjà créés

### 1. workouts (userId + date)
**Status** : ✅ ACTIVÉ
- Collection : `workouts`
- Champs : `userId` (Ascending), `date` (Descending)
- Utilisé pour : Journal, Stats hebdomadaires

---

## 🔄 Index à créer maintenant

### 2. weighIns (userId + date)
**Status** : 🔄 À CRÉER
- Collection : `weighIns`
- Champs : `userId` (Ascending), `date` (Ascending)
- Utilisé pour : Graphique poids, Historique poids

**LIEN** :
https://console.firebase.google.com/v1/r/project/fit-tracker-728e9/firestore/indexes?create_composite=ClJwcm9qZWN0cy9maXQtdHJhY2tlci03MjhlOS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvd2VpZ2hJbnMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaCAoEZGF0ZRABGgwKCF9fbmFtZV9fEAE

**Action** :
1. Cliquez sur le lien
2. Click "Créer l'index"
3. Attendez 1-2 minutes

---

## 🔄 Index à créer maintenant

### 3. calendarEvents (userId + start)
**Status** : 🔄 À CRÉER
- Collection : `calendarEvents`
- Champs : `userId` (Ascending), `start` (Ascending)
- Utilisé pour : Agenda / Calendrier

**LIEN** :
https://console.firebase.google.com/v1/r/project/fit-tracker-728e9/firestore/indexes?create_composite=Clhwcm9qZWN0cy9maXQtdHJhY2tlci03MjhlOS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvY2FsZW5kYXJFdmVudHMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaCQoFc3RhcnQQARoMCghfX25hbWVfXxAB

**Action** :
1. Cliquez sur le lien
2. Click "Créer l'index"
3. Attendez 1-2 minutes

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

| # | Collection | Status | Trigger |
|---|------------|--------|---------|
| 1 | workouts | ✅ Activé | Journal / Stats |
| 2 | weighIns | ✅ Activé | Graphique poids |
| 3 | calendarEvents | 🔄 À créer | Agenda (maintenant) |
| 4 | workoutTemplates | ⏸️ Futur | Premier template |
| 5 | meals | ⏸️ Futur | Premier repas |

---

## 🎯 PLAN D'ACTION

### **Maintenant** :
1. ✅ Créer index `calendarEvents` (lien ligne 46)

### **Plus tard** (au fil de l'utilisation) :
2. ⏸️ Créer index `workoutTemplates` (quand erreur apparaît)
3. ⏸️ Créer index `meals` (quand erreur apparaît)

**Procédure** : Firebase vous donnera les liens exacts quand nécessaire → Cliquez dessus → Créer → Attendre 1-2 min → ✅

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
