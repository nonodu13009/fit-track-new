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

## 🔄 Index à créer maintenant

### 4. meals (userId + date) - REQUÊTE COMPLEXE
**Status** : 🔄 À CRÉER
- Collection : `meals`
- Champs : `userId` (Ascending), `date` (Ascending/Descending)
- Utilisé pour : Page Nutrition (`/dashboard/nutrition`)
- Hook : `useMeals()`

**LIEN** :
https://console.firebase.google.com/v1/r/project/fit-tracker-728e9/firestore/indexes?create_composite=Clpwcm9qZWN0cy9maXQtdHJhY2tlci03MjhlOS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbWVhbHMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaCAoEZGF0ZRADGgwKCF9fbmFtZV9fEAI

**Action** :
1. Cliquez sur le lien
2. Click "Créer l'index"
3. Attendez 1-2 minutes

**Note** : Cette requête utilise des range queries (>=, <=) sur date. L'index sera créé automatiquement par Firebase.

---

## ⏸️ Index futurs (à créer si/quand l'erreur apparaît)

---

### 5. workoutTemplates (userId + createdAt)
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


---

## 📊 RÉSUMÉ COMPLET

**Total index requis** : **5 index**  
**Activés** : **3/5** ✅  
**À créer** : **1/5** 🔄  
**Restants** : **1/5** (apparaîtra automatiquement)

| # | Collection | Status | Trigger |
|---|------------|--------|---------|
| 1 | workouts | ✅ **Activé** | Journal / Stats |
| 2 | weighIns | ✅ **Activé** | Graphique poids |
| 3 | calendarEvents | ✅ **Activé** | Agenda |
| 4 | meals | 🔄 **À créer** | Nutrition (maintenant) |
| 5 | workoutTemplates | ⏸️ Futur | Premier template |

---

## 🎯 PLAN D'ACTION

### **✅ TERMINÉ** :
1. ✅ Index `workouts` créé
2. ✅ Index `weighIns` créé
3. ✅ Index `calendarEvents` créé

### **🔄 À CRÉER MAINTENANT** :
4. 🔄 Index `meals` → **LIEN CI-DESSUS** (ligne ~45)

### **⏸️ À FAIRE plus tard** :
5. ⏸️ Créer index `workoutTemplates` → Apparaîtra quand vous créerez votre 1er template

**Procédure** : Cliquez sur le lien → Créer l'index → Attendre 1-2 min → ✅

---

## 🎉 PRESQUE TERMINÉ !

**Avec l'index `meals`, la page Nutrition fonctionnera** :
- ✅ Journal séances
- ✅ Stats hebdomadaires
- ✅ Graphique poids
- ✅ Agenda / Calendrier
- 🔄 **Tracker Nutrition** (créez l'index meals)
- ⏸️ Templates (index auto plus tard)

**Dernier index à créer manuellement : `meals` !**

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
