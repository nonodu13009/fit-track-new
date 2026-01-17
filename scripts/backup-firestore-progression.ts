/**
 * Script de backup de toutes les progressions Firestore
 * 
 * Usage: npx tsx scripts/backup-firestore-progression.ts
 */

import { getAdminFirestore } from "@/lib/firebase/admin";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const FIRESTORE_COLLECTION = "progression";
const BACKUP_DIR = "backups";

interface BackupResult {
  timestamp: string;
  totalUsers: number;
  backedUp: number;
  errors: number;
  userIds: string[];
  errorDetails: Array<{ userId: string; error: string }>;
}

async function backupAllProgressions(): Promise<BackupResult> {
  const db = getAdminFirestore();
  const collectionRef = db.collection(FIRESTORE_COLLECTION);
  
  console.log("📦 Démarrage du backup des progressions...");
  
  const result: BackupResult = {
    timestamp: new Date().toISOString(),
    totalUsers: 0,
    backedUp: 0,
    errors: 0,
    userIds: [],
    errorDetails: [],
  };
  
  try {
    // Récupérer tous les documents
    const snapshot = await collectionRef.get();
    result.totalUsers = snapshot.size;
    
    console.log(`📊 ${result.totalUsers} utilisateur(s) trouvé(s)`);
    
    // Créer le dossier de backup
    await mkdir(BACKUP_DIR, { recursive: true });
    
    // Backup de chaque utilisateur
    const backupData: Record<string, any> = {};
    
    for (const doc of snapshot.docs) {
      try {
        const userId = doc.id;
        const data = doc.data();
        
        backupData[userId] = {
          ...data,
          _backupDate: new Date().toISOString(),
        };
        
        result.backedUp++;
        result.userIds.push(userId);
        
        if (result.backedUp % 10 === 0) {
          console.log(`  ✓ ${result.backedUp}/${result.totalUsers} sauvegardé(s)...`);
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
    
    // Sauvegarder dans un fichier JSON
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `progression-backup-${timestamp}.json`;
    const filepath = join(BACKUP_DIR, filename);
    
    const backupFile = {
      metadata: {
        timestamp: result.timestamp,
        totalUsers: result.totalUsers,
        backedUp: result.backedUp,
        errors: result.errors,
      },
      data: backupData,
      errors: result.errorDetails,
    };
    
    await writeFile(filepath, JSON.stringify(backupFile, null, 2), "utf-8");
    
    console.log(`\n✅ Backup terminé !`);
    console.log(`   📁 Fichier: ${filepath}`);
    console.log(`   ✓ ${result.backedUp} utilisateur(s) sauvegardé(s)`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  ${result.errors} erreur(s)`);
    }
    
    return result;
  } catch (error) {
    console.error("❌ Erreur fatale lors du backup:", error);
    throw error;
  }
}

// Exécuter le script
if (require.main === module) {
  backupAllProgressions()
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

export { backupAllProgressions };
