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

## ⏸️ Index futurs (à créer si/quand l'erreur apparaît)

### 3. calendarEvents (userId + start)
**Status** : ⏸️ EN ATTENTE
- Collection : `calendarEvents`
- Champs : `userId` (Ascending), `start` (Ascending)
- Utilisé pour : Agenda / Calendrier

**Note** : Firebase vous donnera le lien automatiquement si nécessaire.

---

### 4. workoutTemplates (userId + createdAt)
**Status** : ⏸️ EN ATTENTE
- Collection : `workoutTemplates`
- Champs : `userId` (Ascending), `createdAt` (Descending)
- Utilisé pour : Page Templates

**Note** : Firebase vous donnera le lien automatiquement si nécessaire.

---

### 5. meals (userId + date)
**Status** : ⏸️ EN ATTENTE
- Collection : `meals`
- Champs : `userId` (Ascending), `date` (Descending)
- Utilisé pour : Page Nutrition

**Note** : Firebase vous donnera le lien automatiquement si nécessaire.

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
