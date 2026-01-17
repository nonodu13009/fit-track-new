# TODO - Déploiement de la nouvelle progression JJB

**Objectif :** Remplacer complètement l'ancienne progression par la nouvelle progression Gracie Barra qui correspond mieux au Jiu-Jitsu Brésilien (JJB).

---

## 📋 Phase 1 : Préparation et validation

### 1.1 Audit des données existantes
- [ ] Lister tous les utilisateurs ayant une progression existante
- [ ] Quantifier le nombre d'utilisateurs concernés
- [ ] Vérifier la structure actuelle des données dans Firestore
- [ ] Documenter les différences majeures entre ancienne et nouvelle progression

### 1.2 Vérification de la migration
- [ ] Tester le script de migration sur un utilisateur test
- [ ] Vérifier que tous les `pas` sont correctement créés
- [ ] Vérifier que les checkpoints ont bien leurs explications
- [ ] Tester les liens YouTube pour chaque checkpoint
- [ ] Valider que les cycles (1-5) sont correctement structurés

### 1.3 Tests de non-régression
- [ ] Vérifier que l'UI affiche correctement la nouvelle progression
- [ ] Tester la navigation entre les pas
- [ ] Valider l'affichage des keypoints avec explications
- [ ] Tester les liens YouTube
- [ ] Vérifier les interactions (swipe, hold-to-confirm, combo builder)
- [ ] Tester la gamification (XP, tokens, mastery tiers, quests)

---

## 📦 Phase 2 : Migration des données

### 2.1 Préparation de la migration
- [ ] Créer un script de backup des données existantes
- [ ] Sauvegarder un snapshot Firestore avant migration
- [ ] Créer un script de rollback en cas de problème
- [ ] Prévoir une période de maintenance

### 2.2 Exécution de la migration
- [ ] Lancer la migration pour tous les utilisateurs existants
- [ ] Convertir les anciennes données vers le nouveau format
- [ ] Préserver les données utilisateur (XP, niveau, badges existants)
- [ ] Initialiser les nouveaux champs (mastery, tokens, bossFights, etc.)
- [ ] Mapper les anciennes validations vers les nouveaux paliers (K-E-A-I)

### 2.3 Validation post-migration
- [ ] Vérifier que tous les utilisateurs ont été migrés
- [ ] Contrôler l'intégrité des données migrées
- [ ] Tester quelques comptes utilisateurs réels
- [ ] Vérifier que les anciennes données ne sont plus utilisées

---

## 🗑️ Phase 3 : Nettoyage

### 3.1 Suppression de l'ancien code
- [ ] Supprimer les références à l'ancien système de progression
- [ ] Retirer les anciens types TypeScript non utilisés
- [ ] Nettoyer les imports obsolètes
- [ ] Supprimer les composants UI non utilisés (StepCard, StepDetail si encore présents)

### 3.2 Nettoyage des données Firestore
- [ ] Identifier les champs obsolètes dans les collections
- [ ] Créer un script pour nettoyer les champs non utilisés
- [ ] Documenter les champs supprimés
- [ ] Mettre à jour les règles Firestore si nécessaire

### 3.3 Documentation
- [ ] Mettre à jour la documentation technique
- [ ] Documenter la structure de la nouvelle progression
- [ ] Créer un guide de migration pour référence future
- [ ] Mettre à jour le README si nécessaire

---

## 🚀 Phase 4 : Déploiement

### 4.1 Pré-déploiement
- [ ] Créer une branche de déploiement
- [ ] Fusionner toutes les modifications nécessaires
- [ ] Effectuer les tests finaux sur staging/preview
- [ ] Valider avec quelques utilisateurs beta si possible

### 4.2 Communication utilisateurs
- [ ] Préparer un message d'annonce pour les utilisateurs
- [ ] Expliquer les changements majeurs (nouveaux cycles, pas, paliers)
- [ ] Informer sur la migration des données existantes
- [ ] Proposer un support pour les questions/réclamations

### 4.3 Déploiement en production
- [ ] Planifier une fenêtre de maintenance
- [ ] Exécuter le script de backup
- [ ] Lancer la migration des données
- [ ] Déployer la nouvelle version de l'application
- [ ] Vérifier le déploiement sur Vercel/environnement de production

### 4.4 Post-déploiement
- [ ] Monitorer les erreurs/erreurs console
- [ ] Surveiller les métriques utilisateurs
- [ ] Vérifier que la migration s'est bien passée
- [ ] Collecter les retours utilisateurs
- [ ] Corriger les bugs critiques rapidement

---

## ✅ Phase 5 : Validation finale

### 5.1 Tests post-déploiement
- [ ] Tester avec différents comptes utilisateurs
- [ ] Vérifier que tous les cycles et pas s'affichent correctement
- [ ] Valider que les interactions fonctionnent
- [ ] Tester sur mobile et desktop
- [ ] Vérifier les performances (chargement, interactions)

### 5.2 Clôture
- [ ] Confirmer que tous les utilisateurs ont été migrés
- [ ] Supprimer les anciens scripts de migration si obsolètes
- [ ] Archiver les anciennes données si nécessaire
- [ ] Documenter les leçons apprises
- [ ] Fermer ce TODO après validation complète

---

## 🔍 Points d'attention spécifiques

### Migration des données utilisateur
- **XP et niveau** : Préserver le niveau actuel ou recalculer selon nouvelles règles ?
- **Badges** : Conserver les badges existants ou les réinitialiser ?
- **Progression** : Comment mapper les anciennes validations vers K-E-A-I ?
- **Historique** : Garder un historique des anciennes validations ?

### Compatibilité
- S'assurer que la nouvelle structure est rétro-compatible si possible
- Prévoir un fallback pour les utilisateurs non migrés
- Gérer les cas d'erreur lors de la migration

### Performance
- La migration doit être rapide (éviter les timeouts)
- Utiliser des batch operations Firestore
- Prévoir une migration progressive si trop d'utilisateurs

---

## 📅 Timeline suggérée

1. **Semaine 1** : Phase 1 (Préparation et validation)
2. **Semaine 2** : Phase 2 (Migration des données) + Phase 3 (Nettoyage)
3. **Semaine 3** : Phase 4 (Déploiement) + Phase 5 (Validation)

---

## 📝 Notes

- Cette migration est **définitive** : il n'y aura pas de retour en arrière possible après déploiement
- Tous les utilisateurs seront affectés par cette migration
- La nouvelle progression est plus complète et correspond mieux au JJB
- Les explications et liens YouTube sont maintenant intégrés

---

**Date de création :** 2024-12-XX  
**Dernière mise à jour :** 2024-12-XX
