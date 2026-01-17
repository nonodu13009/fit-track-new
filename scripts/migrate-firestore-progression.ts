/**
 * Script de migration de toutes les progressions Firestore
 * 
 * ⚠️ IMPORTANT: Exécuter backup-firestore-progression.ts AVANT ce script !
 * 
 * Usage: npx tsx scripts/migrate-firestore-progression.ts [--dry-run]
 */

import { getAdminFirestore } from "@/lib/firebase/admin";
import { migrateOldProgressToNew, isOldFormat } from "@/lib/progression/migration";
import { UserProgress } from "@/lib/progression/types";

const FIRESTORE_COLLECTION = "progression";
const BACKUP_COLLECTION = "progression_backup";

interface MigrationResult {
  timestamp: string;
  totalUsers: number;
  migrated: number;
  alreadyNew: number;
  errors: number;
  userIds: string[];
  errorDetails: Array<{ userId: string; error: string }>;
}

async function migrateAllProgressions(dryRun: boolean = false): Promise<MigrationResult> {
  const db = getAdminFirestore();
  const collectionRef = db.collection(FIRESTORE_COLLECTION);
  
  console.log(`🔄 Démarrage de la migration${dryRun ? " (DRY RUN)" : ""}...`);
  
  const result: MigrationResult = {
    timestamp: new Date().toISOString(),
    totalUsers: 0,
    migrated: 0,
    alreadyNew: 0,
    errors: 0,
    userIds: [],
    errorDetails: [],
  };
  
  try {
    // Récupérer tous les documents
    const snapshot = await collectionRef.get();
    result.totalUsers = snapshot.size;
    
    console.log(`📊 ${result.totalUsers} utilisateur(s) trouvé(s)`);
    
    if (dryRun) {
      console.log("🔍 Mode DRY RUN: aucune modification ne sera effectuée\n");
    }
    
    // Migrer chaque utilisateur
    for (const doc of snapshot.docs) {
      try {
        const userId = doc.id;
        const oldProgress = doc.data();
        
        // Vérifier si c'est l'ancien format
        if (isOldFormat(oldProgress)) {
          console.log(`  🔄 Migration de ${userId}...`);
          
          // Faire un backup dans la collection backup
          if (!dryRun) {
            await db.collection(BACKUP_COLLECTION).doc(userId).set({
              ...oldProgress,
              _backupDate: new Date().toISOString(),
            });
          }
          
          // Migrer les données
          const newProgress: UserProgress = migrateOldProgressToNew(oldProgress);
          
          // Sauvegarder la nouvelle progression
          if (!dryRun) {
            await doc.ref.set(newProgress);
          }
          
          result.migrated++;
          result.userIds.push(userId);
          
          console.log(`    ✓ ${userId} migré`);
        } else {
          result.alreadyNew++;
          if (result.alreadyNew <= 5) {
            console.log(`  ⏭️  ${userId} déjà au nouveau format (ignoré)`);
          }
        }
      } catch (error) {
        result.errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errorDetails.push({
          userId: doc.id,
          error: errorMsg,
        });
        console.error(`  ❌ Erreur pour ${doc.id}:`, errorMsg);
      }
    }
    
    console.log(`\n✅ Migration terminée${dryRun ? " (DRY RUN)" : ""} !`);
    console.log(`   📊 Total: ${result.totalUsers}`);
    console.log(`   🔄 Migrés: ${result.migrated}`);
    console.log(`   ✓ Déjà nouveau format: ${result.alreadyNew}`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  Erreurs: ${result.errors}`);
    }
    
    if (dryRun) {
      console.log("\n💡 Pour exécuter réellement, relancez sans --dry-run");
    } else {
      console.log(`\n💾 Backups disponibles dans la collection: ${BACKUP_COLLECTION}`);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Erreur fatale lors de la migration:", error);
    throw error;
  }
}

// Exécuter le script
if (require.main === module) {
  const dryRun = process.argv.includes("--dry-run");
  
  migrateAllProgressions(dryRun)
    .then((result) => {
      console.log("\n📋 Résumé:");
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erreur:", error);
      process.exit(1);
    });
}

export { migrateAllProgressions };
