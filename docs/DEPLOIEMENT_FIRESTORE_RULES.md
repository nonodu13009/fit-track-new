# 🔐 Déploiement des Firestore Rules

## ⚠️ IMPORTANT
**Actuellement**, votre Firestore est en **mode test** (tout le monde peut lire/écrire).  
**Pour la production**, vous DEVEZ appliquer les rules de sécurité.

---

## 🎯 PROCÉDURE RAPIDE (2 minutes)

### **Méthode 1 : Via Console Firebase** ⭐ RECOMMANDÉE

1. **Aller sur Firebase Console** :
   https://console.firebase.google.com/project/fit-tracker-728e9/firestore/rules

2. **Copier le contenu** du fichier `docs/firestore.rules`

3. **Coller** dans l'éditeur de la console

4. **Publier** (bouton "Publier" en haut à droite)

5. ✅ **Terminé !** Les rules sont actives immédiatement

---

### **Méthode 2 : Via Firebase CLI**

```bash
# Installer Firebase CLI (si pas déjà fait)
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser (si pas déjà fait)
firebase init firestore

# Copier le fichier rules
cp docs/firestore.rules firestore.rules

# Déployer
firebase deploy --only firestore:rules
```

---

## 📋 CE QUE FONT CES RULES

### **Principe de base** :
Chaque utilisateur ne peut **lire/écrire QUE ses propres données**.

### **Collections sécurisées** (8) :

1. **`userProfiles`** :
   - Lecture/écriture : seulement son profil
   - Suppression : interdite (historique)

2. **`workouts`** :
   - CRUD complet : seulement ses séances
   - Validation : champs requis (sport, duration, rpe, date)

3. **`weighIns`** :
   - CRUD complet : seulement ses pesées
   - Validation : poids entre 0-300 kg

4. **`measurements`** :
   - CRUD complet : seulement ses mesures

5. **`workoutTemplates`** :
   - CRUD complet : seulement ses templates

6. **`calendarEvents`** :
   - CRUD complet : seulement ses événements
   - Validation : status in ['planned', 'done', 'skipped']

7. **`meals`** :
   - CRUD complet : seulement ses repas
   - Validation : mealType in ['breakfast', 'lunch', 'dinner', 'snack']

8. **`chatHistory`** (optionnel) :
   - CRUD complet : seulement son historique

### **Règle par défaut** :
- Tout le reste : **DENY** (refusé)

---

## 🔒 SÉCURITÉ

### **Ce qui est protégé** :
- ✅ Un utilisateur ne peut PAS voir les données d'un autre
- ✅ Un utilisateur ne peut PAS modifier les données d'un autre
- ✅ Un utilisateur ne peut PAS supprimer le profil
- ✅ Validation des champs requis
- ✅ Validation des valeurs (ex: poids < 300kg)

### **Ce qui est vérifié** :
- Authentification (`request.auth != null`)
- Propriété (`request.auth.uid == resource.data.userId`)
- Champs obligatoires (`.hasAll()`)
- Types de données
- Valeurs autorisées (enums)

---

## ⚠️ ATTENTION

**AVANT de publier les rules** :
- ✅ Assurez-vous que tous vos documents Firestore ont un champ `userId`
- ✅ Assurez-vous d'être connecté pour tester
- ✅ Si vous avez des données de test sans userId, elles deviendront inaccessibles

**APRÈS publication** :
- Testez immédiatement l'app
- Vérifiez que vous pouvez créer/lire/modifier vos données
- Si problème : revenez en mode test temporairement

---

## 🧪 TESTER LES RULES

### **Dans Firebase Console** :

1. Onglet **"Rules Playground"**
2. Simuler des requêtes :
   ```
   Collection: workouts
   Document: workout123
   Auth: votre-user-id
   ```
3. Vérifier que ça passe ✅ ou échoue ❌

### **Dans l'app** :
- Créer une séance → devrait marcher ✅
- Modifier une séance → devrait marcher ✅
- Voir ses séances → devrait marcher ✅
- Aucune erreur console → Rules OK ! ✅

---

## 📝 FICHIER À UTILISER

**Fichier** : `docs/firestore.rules` (178 lignes)

**Contenu** :
- 8 collections sécurisées
- Helper functions réutilisables
- Validations complètes
- Commentaires explicatifs
- Deny par défaut

---

## 🚀 DÉPLOIEMENT RECOMMANDÉ

**Méthode Console Firebase** (2 minutes) :

1. https://console.firebase.google.com/project/fit-tracker-728e9/firestore/rules
2. Copier tout `docs/firestore.rules`
3. Coller dans l'éditeur
4. Publier
5. ✅ Sécurisé !

---

## 🎯 PROCHAINE ÉTAPE

Une fois les rules déployées :
- ✅ Votre app sera **sécurisée**
- ✅ Production-ready
- ✅ RGPD compliant (données isolées par user)

**Temps estimé** : 2-5 minutes

---

**Fichier créé** : 2026-01-13  
**Projet** : JJB Tracking - fit-tracker-728e9  
**À déployer** : Avant mise en production
