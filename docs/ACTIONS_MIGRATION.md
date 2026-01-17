# Actions à réaliser pour la migration complète

## 🔍 Analyse de la situation actuelle

### ✅ Ce qui existe déjà
1. **Fonction de migration basique** (`lib/progression/migration.ts`)
   - Détecte l'ancien format (`steps` vs `pas`)
   - Migre automatiquement au chargement (localStorage + Firestore)
   - Préserve XP, niveau, badges, streak

### ❌ Ce qui manque pour un déploiement en production

#### 1. **Migration incomplète des données**
**Problème actuel :**
- La migration ne mappe PAS les anciens `steps` vers les nouveaux `pas`
- Les `pasProgress` créés dans la boucle (ligne 41-71) ne sont jamais sauvegardés
- L'utilisateur perd toute sa progression de pas/techniques
- Seuls XP, niveau et badges sont préservés

**Code problématique :**
```typescript
// Ligne 41-71 : Les pasProgress sont créés mais jamais assignés à newProgress.pas
for (const [stepId, stepProgress] of Object.entries(oldProgress.steps || {})) {
  const pasProgress: PasProgress = { ... };
  // ❌ pasProgress n'est jamais ajouté à newProgress.pas !
}
```

#### 2. **Pas de script de migration en masse**
- La migration se fait uniquement au chargement (utilisateur par utilisateur)
- Pas de script pour migrer tous les utilisateurs Firestore d'un coup
- Pas de contrôle sur le processus de migration

#### 3. **Pas de backup/rollback**
- Aucun backup automatique avant migration
- Pas de possibilité de revenir en arrière
- Risque de perte de données

#### 4. **Pas de mapping intelligent**
- Les anciens steps (25 steps en 4 blocs) ne correspondent pas aux nouveaux pas (64 pas en 5 cycles)
- Besoin d'une stratégie de mapping ou de réinitialisation

---

## 📋 Actions à réaliser

### Action 1 : Améliorer la fonction de migration

**Fichier :** `lib/progression/migration.ts`

**À faire :**
1. **Décider de la stratégie de mapping :**
   - Option A : Réinitialiser complètement (perte de progression des pas)
   - Option B : Créer un mapping partiel (ex: step-01-01 → pas-01-01 si similaire)
   - Option C : Marquer les pas comme "débloqués" selon le niveau global

2. **Corriger le bug :** Sauvegarder les `pasProgress` créés dans `newProgress.pas`

3. **Améliorer la préservation des données :**
   - Préserver les notes utilisateur si possible
   - Préserver les dates de validation
   - Préserver les sessions d'entraînement

**Exemple de correction :**
```typescript
// Après la ligne 65, ajouter :
// Option: Réinitialiser mais préserver le niveau global
// OU créer un mapping si les IDs correspondent
if (stepId.startsWith('step-') && stepId.replace('step-', 'pas-') in PAS_MAP) {
  const pasId = stepId.replace('step-', 'pas-');
  newProgress.pas[pasId] = pasProgress;
}
```

---

### Action 2 : Créer un script de migration Firestore

**Nouveau fichier :** `scripts/migrate-firestore-progression.ts`

**Fonctionnalités :**
1. Lister tous les utilisateurs avec progression
2. Pour chaque utilisateur :
   - Faire un backup dans une collection `progression_backup`
   - Charger la progression
   - Migrer si nécessaire
   - Sauvegarder la nouvelle progression
3. Logger les résultats (succès/échecs)
4. Générer un rapport de migration

**Structure :**
```typescript
// scripts/migrate-firestore-progression.ts
import { getFirestore } from 'firebase-admin/firestore';
import { migrateOldProgressToNew } from '../lib/progression/migration';

async function migrateAllUsers() {
  const db = getFirestore();
  const usersRef = db.collection('progression');
  const snapshot = await usersRef.get();
  
  const results = {
    total: snapshot.size,
    migrated: 0,
    errors: 0,
    skipped: 0,
  };
  
  for (const doc of snapshot.docs) {
    try {
      const oldProgress = doc.data();
      if (isOldFormat(oldProgress)) {
        // Backup
        await db.collection('progression_backup').doc(doc.id).set(oldProgress);
        
        // Migrate
        const newProgress = migrateOldProgressToNew(oldProgress);
        await doc.ref.set(newProgress);
        
        results.migrated++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      console.error(`Erreur pour ${doc.id}:`, error);
      results.errors++;
    }
  }
  
  console.log('Résultats:', results);
}
```

---

### Action 3 : Créer un script de backup

**Nouveau fichier :** `scripts/backup-firestore-progression.ts`

**Fonctionnalités :**
1. Exporter toutes les progressions dans un fichier JSON
2. Ou créer une collection `progression_backup_YYYYMMDD`
3. Inclure les métadonnées (date, nombre d'utilisateurs)

---

### Action 4 : Créer un script de rollback

**Nouveau fichier :** `scripts/rollback-firestore-progression.ts`

**Fonctionnalités :**
1. Restaurer depuis `progression_backup`
2. Vérifier l'intégrité des données
3. Logger les restaurations

---

### Action 5 : Créer un mapping des anciens steps vers nouveaux pas

**Nouveau fichier :** `lib/progression/stepToPasMapping.ts`

**Fonctionnalités :**
1. Définir un mapping explicite si possible
2. Ou une fonction de "similarité" pour mapper automatiquement
3. Documenter les correspondances

**Exemple :**
```typescript
export const STEP_TO_PAS_MAPPING: Record<string, string> = {
  'step-01-01': 'pas-01-01', // Si similaire
  'step-01-02': 'pas-01-02',
  // ... ou null si pas de correspondance
};
```

---

### Action 6 : Tester la migration sur un utilisateur réel

**À faire :**
1. Créer un script de test avec un utilisateur réel
2. Vérifier que toutes les données sont préservées
3. Vérifier que l'UI fonctionne après migration
4. Valider avec l'utilisateur

---

### Action 7 : Documenter le processus

**À faire :**
1. Documenter la stratégie de migration choisie
2. Créer un guide pas-à-pas pour le déploiement
3. Documenter les risques et mitigations

---

## 🎯 Priorités

### Priorité 1 (Critique - avant déploiement)
- [ ] **Action 1** : Corriger le bug de migration (pasProgress non sauvegardés)
- [ ] **Action 2** : Créer le script de migration Firestore
- [ ] **Action 3** : Créer le script de backup

### Priorité 2 (Important - pour sécurité)
- [ ] **Action 4** : Créer le script de rollback
- [ ] **Action 6** : Tester sur utilisateur réel

### Priorité 3 (Amélioration)
- [ ] **Action 5** : Créer le mapping intelligent
- [ ] **Action 7** : Documentation complète

---

## 💡 Recommandation

**Stratégie recommandée :**

1. **Pour la première migration :**
   - Réinitialiser les pas (perte de progression des techniques)
   - Préserver XP, niveau, badges, streak
   - Les utilisateurs recommencent leur progression mais gardent leur niveau global

2. **Communication aux utilisateurs :**
   - Annoncer le changement de système
   - Expliquer que la progression des techniques est réinitialisée
   - Mais que le niveau global (XP, badges) est préservé
   - Nouveau système plus complet et adapté au JJB

3. **Pour les futures migrations :**
   - Si besoin, créer un mapping plus intelligent
   - Mais pour l'instant, la réinitialisation est acceptable car :
     - Le nouveau système est très différent (64 pas vs 25 steps)
     - Les utilisateurs sont probablement peu nombreux
     - Le nouveau système est meilleur

---

## 📝 Prochaines étapes immédiates

1. **Corriger le bug de migration** (Action 1)
2. **Créer les scripts** (Actions 2, 3, 4)
3. **Tester sur staging** (Action 6)
4. **Déployer en production**
