/**
 * Script de rollback des progressions Firestore depuis la collection backup
 * 
 * ⚠️ ATTENTION: Ce script restaure les anciennes données et supprime les nouvelles !
 * 
 * Usage: npx tsx scripts/rollback-firestore-progression.ts [--userId=USER_ID] [--dry-run]
 */

import { getAdminFirestore } from "@/lib/firebase/admin";

const FIRESTORE_COLLECTION = "progression";
const BACKUP_COLLECTION = "progression_backup";

interface RollbackResult {
  timestamp: string;
  totalBackups: number;
  restored: number;
  errors: number;
  userIds: string[];
  errorDetails: Array<{ userId: string; error: string }>;
}

async function rollbackProgressions(
  userIdFilter?: string,
  dryRun: boolean = false
): Promise<RollbackResult> {
  const db = getAdminFirestore();
  const backupRef = db.collection(BACKUP_COLLECTION);
  
  console.log(`⏪ Démarrage du rollback${dryRun ? " (DRY RUN)" : ""}...`);
  
  const result: RollbackResult = {
    timestamp: new Date().toISOString(),
    totalBackups: 0,
    restored: 0,
    errors: 0,
    userIds: [],
    errorDetails: [],
  };
  
  try {
    // Récupérer les backups
    let snapshot;
    if (userIdFilter) {
      const doc = await backupRef.doc(userIdFilter).get();
      if (!doc.exists) {
        throw new Error(`Aucun backup trouvé pour l'utilisateur ${userIdFilter}`);
      }
      // Créer un faux snapshot avec un seul document
      snapshot = { docs: [doc], size: 1 } as any;
      console.log(`🎯 Restauration ciblée pour: ${userIdFilter}`);
    } else {
      snapshot = await backupRef.get();
      console.log(`📦 Restauration de tous les backups`);
    }
    
    result.totalBackups = snapshot.size;
    
    if (dryRun) {
      console.log("🔍 Mode DRY RUN: aucune modification ne sera effectuée\n");
    } else {
      console.log(`⚠️  ATTENTION: Les données actuelles seront remplacées !\n`);
    }
    
    // Restaurer chaque backup
    for (const doc of snapshot.docs) {
      try {
        const userId = doc.id;
        const backupData = doc.data();
        
        // Supprimer les métadonnées de backup
        const { _backupDate, ...restoredData } = backupData;
        
        console.log(`  ⏪ Restauration de ${userId}...`);
        
        // Restaurer dans la collection principale
        if (!dryRun) {
          await db.collection(FIRESTORE_COLLECTION).doc(userId).set(restoredData);
        }
        
        result.restored++;
        result.userIds.push(userId);
        
        console.log(`    ✓ ${userId} restauré`);
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
    
    console.log(`\n✅ Rollback terminé${dryRun ? " (DRY RUN)" : ""} !`);
    console.log(`   📊 Backups disponibles: ${result.totalBackups}`);
    console.log(`   ⏪ Restaurés: ${result.restored}`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  Erreurs: ${result.errors}`);
    }
    
    if (dryRun) {
      console.log("\n💡 Pour exécuter réellement, relancez sans --dry-run");
    } else {
      console.log("\n⚠️  Les données ont été restaurées. Les nouvelles progressions ont été remplacées.");
    }
    
    return result;
  } catch (error) {
    console.error("❌ Erreur fatale lors du rollback:", error);
    throw error;
  }
}

// Exécuter le script
if (require.main === module) {
  const dryRun = process.argv.includes("--dry-run");
  const userIdArg = process.argv.find((arg) => arg.startsWith("--userId="));
  const userIdFilter = userIdArg ? userIdArg.split("=")[1] : undefined;
  
  rollbackProgressions(userIdFilter, dryRun)
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

export { rollbackProgressions };
