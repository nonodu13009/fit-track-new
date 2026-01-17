/**
 * Script d'audit des progressions Firestore
 * 
 * Usage: npx tsx scripts/audit-progression.ts
 */

import { getAdminFirestore } from "@/lib/firebase/admin";
import { isOldFormat } from "@/lib/progression/migration";

const FIRESTORE_COLLECTION = "progression";

interface AuditResult {
  timestamp: string;
  totalUsers: number;
  oldFormat: number;
  newFormat: number;
  noData: number;
  userDetails: Array<{
    userId: string;
    format: "old" | "new" | "empty";
    xp?: number;
    level?: number;
    stepsCount?: number;
    pasCount?: number;
  }>;
}

async function auditProgressions(): Promise<AuditResult> {
  const db = getAdminFirestore();
  const collectionRef = db.collection(FIRESTORE_COLLECTION);
  
  console.log("🔍 Démarrage de l'audit des progressions...");
  
  const result: AuditResult = {
    timestamp: new Date().toISOString(),
    totalUsers: 0,
    oldFormat: 0,
    newFormat: 0,
    noData: 0,
    userDetails: [],
  };
  
  try {
    // Récupérer tous les documents
    const snapshot = await collectionRef.get();
    result.totalUsers = snapshot.size;
    
    console.log(`📊 ${result.totalUsers} utilisateur(s) trouvé(s)\n`);
    
    // Analyser chaque utilisateur
    for (const doc of snapshot.docs) {
      const userId = doc.id;
      const data = doc.data();
      
      const userDetail: any = { userId };
      
      // Déterminer le format
      if (!data || Object.keys(data).length === 0) {
        result.noData++;
        userDetail.format = "empty";
      } else if (isOldFormat(data)) {
        result.oldFormat++;
        userDetail.format = "old";
        userDetail.xp = data.gamification?.xpTotal || 0;
        userDetail.level = data.gamification?.level || 1;
        userDetail.stepsCount = Object.keys(data.steps || {}).length;
      } else {
        result.newFormat++;
        userDetail.format = "new";
        userDetail.xp = data.gamification?.xpTotal || 0;
        userDetail.level = data.gamification?.level || 1;
        userDetail.pasCount = Object.keys(data.pas || {}).length;
      }
      
      result.userDetails.push(userDetail);
    }
    
    // Afficher les résultats
    console.log("📋 Résultats de l'audit :\n");
    console.log(`   Total utilisateurs      : ${result.totalUsers}`);
    console.log(`   ✓ Format nouveau        : ${result.newFormat}`);
    console.log(`   🔄 Format ancien (à migrer): ${result.oldFormat}`);
    console.log(`   ⚠️  Sans données         : ${result.noData}\n`);
    
    if (result.oldFormat > 0) {
      console.log("📝 Détails des utilisateurs à migrer :");
      result.userDetails
        .filter((u) => u.format === "old")
        .slice(0, 10)
        .forEach((user) => {
          console.log(`   - ${user.userId}: XP=${user.xp}, Level=${user.level}, Steps=${user.stepsCount}`);
        });
      if (result.oldFormat > 10) {
        console.log(`   ... et ${result.oldFormat - 10} autres`);
      }
    }
    
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de l'audit:", error);
    throw error;
  }
}

// Exécuter le script
if (require.main === module) {
  auditProgressions()
    .then((result) => {
      console.log("\n✅ Audit terminé");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erreur:", error);
      process.exit(1);
    });
}

export { auditProgressions };
