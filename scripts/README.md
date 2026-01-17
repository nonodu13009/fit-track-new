# Scripts de migration de progression

Ce dossier contient les scripts pour migrer, sauvegarder et restaurer les progressions Firestore.

## 📋 Scripts disponibles

### 1. `backup-firestore-progression.ts`

**Description :** Sauvegarde toutes les progressions Firestore dans un fichier JSON.

**Usage :**
```bash
npx tsx scripts/backup-firestore-progression.ts
```

**Fonctionnalités :**
- Exporte toutes les progressions dans `backups/progression-backup-TIMESTAMP.json`
- Crée le dossier `backups/` s'il n'existe pas
- Génère un rapport avec les statistiques

**Output :**
- Fichier JSON dans `backups/` avec toutes les progressions
- Statistiques (total, sauvegardés, erreurs)

---

### 2. `migrate-firestore-progression.ts`

**Description :** Migre toutes les progressions de l'ancien format vers le nouveau.

**⚠️ IMPORTANT :** Exécuter `backup-firestore-progression.ts` AVANT ce script !

**Usage :**
```bash
# Mode dry-run (test sans modification)
npx tsx scripts/migrate-firestore-progression.ts --dry-run

# Migration réelle
npx tsx scripts/migrate-firestore-progression.ts
```

**Fonctionnalités :**
- Détecte automatiquement les progressions à migrer (ancien format `steps`)
- Crée un backup automatique dans la collection `progression_backup`
- Migre les données vers le nouveau format (`pas`)
- Préserve XP, niveau, badges, streak
- Réinitialise la progression des pas (nouveau système)

**Options :**
- `--dry-run` : Test sans modifier les données

**Output :**
- Rapports de migration (migrés, déjà nouveau format, erreurs)
- Backups automatiques dans Firestore (`progression_backup`)

---

### 3. `rollback-firestore-progression.ts`

**Description :** Restaure les progressions depuis la collection backup.

**⚠️ ATTENTION :** Ce script remplace les données actuelles par les backups !

**Usage :**
```bash
# Mode dry-run (test sans modification)
npx tsx scripts/rollback-firestore-progression.ts --dry-run

# Rollback pour un utilisateur spécifique
npx tsx scripts/rollback-firestore-progression.ts --userId=USER_ID

# Rollback pour tous les utilisateurs
npx tsx scripts/rollback-firestore-progression.ts
```

**Fonctionnalités :**
- Restaure depuis la collection `progression_backup`
- Peut restaurer un utilisateur spécifique ou tous
- Avertit avant de restaurer (dry-run recommandé)

**Options :**
- `--dry-run` : Test sans modifier les données
- `--userId=USER_ID` : Restaurer uniquement un utilisateur

---

## 🚀 Processus de migration recommandé

### Étape 1 : Backup
```bash
npx tsx scripts/backup-firestore-progression.ts
```

### Étape 2 : Test de migration (dry-run)
```bash
npx tsx scripts/migrate-firestore-progression.ts --dry-run
```

### Étape 3 : Vérification
- Vérifier les statistiques du dry-run
- Valider que la migration fonctionne correctement

### Étape 4 : Migration réelle
```bash
npx tsx scripts/migrate-firestore-progression.ts
```

### Étape 5 : Vérification post-migration
- Tester avec quelques utilisateurs
- Vérifier l'UI et les interactions
- Surveiller les erreurs

### Étape 6 : Rollback (si nécessaire)
```bash
# Test de rollback
npx tsx scripts/rollback-firestore-progression.ts --dry-run

# Rollback réel (uniquement en cas de problème)
npx tsx scripts/rollback-firestore-progression.ts
```

---

## 📦 Prérequis

1. **Variables d'environnement Firebase Admin :**
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

2. **Dépendances :**
   - `tsx` pour exécuter les scripts TypeScript
   - `firebase-admin` (déjà installé)

3. **Permissions :**
   - Accès Admin Firebase configuré
   - Service account avec permissions Firestore

---

## 🔍 Vérifications

### Avant la migration
- [ ] Backup effectué et vérifié
- [ ] Variables d'environnement configurées
- [ ] Test dry-run effectué
- [ ] Résultats du dry-run validés

### Pendant la migration
- [ ] Surveiller les logs pour les erreurs
- [ ] Vérifier le nombre d'utilisateurs migrés
- [ ] S'assurer que les backups sont créés

### Après la migration
- [ ] Tester avec quelques utilisateurs réels
- [ ] Vérifier l'UI et les interactions
- [ ] Surveiller les erreurs console
- [ ] Valider que les données sont correctes

---

## ⚠️ Notes importantes

1. **La migration est définitive** : Les anciennes progressions de pas sont perdues (structure complètement différente)

2. **Les données préservées** :
   - XP total
   - Niveau
   - Badges
   - Streak
   - Notes utilisateur (si présentes)

3. **Les données réinitialisées** :
   - Progression des pas (nouveau système 64 pas vs 25 steps)
   - Paliers K-E-A-I (nouveaux)
   - Tokens, mastery, bossFights (nouveaux champs)

4. **Backup obligatoire** : Toujours faire un backup avant migration !

5. **Test en production** : Toujours tester en dry-run avant migration réelle

---

## 📝 Support

En cas de problème :
1. Vérifier les logs des scripts
2. Vérifier les variables d'environnement
3. Vérifier les permissions Firebase
4. Utiliser le rollback si nécessaire
