/**
 * Script pour mettre à jour pas.ts avec les explications et URLs YouTube
 * à partir de CHECKPOINTS_EXPLANATIONS.md
 * 
 * Usage: npx tsx scripts/update-pas-with-explanations.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const MARKDOWN_FILE = join(process.cwd(), "docs/CHECKPOINTS_EXPLANATIONS.md");
const PAS_FILE = join(process.cwd(), "lib/progression/pas.ts");

interface CheckpointData {
  label: string;
  explanation?: string;
  youtubeUrl?: string;
}

interface PasData {
  pasId: string;
  checkpoints: CheckpointData[];
}

/**
 * Parse le markdown pour extraire les explications et URLs YouTube
 */
function parseMarkdown(markdownContent: string): Map<string, PasData> {
  const result = new Map<string, PasData>();
  
  // Regex pour trouver les sections de pas : ### pas-XX-XX - Titre
  const pasSectionRegex = /### (pas-\d+-\d+)\s*-\s*(.+?)\n\n([\s\S]*?)(?=### |$)/g;
  
  let match;
  while ((match = pasSectionRegex.exec(markdownContent)) !== null) {
    const pasId = match[1];
    const title = match[2].trim();
    const content = match[3];
    
    const checkpoints: CheckpointData[] = [];
    
    // Regex pour trouver chaque checkpoint : - **Checkpoint N**: "label"
    const checkpointRegex = /- \*\*Checkpoint \d+\*\*:\s*"([^"]+)"\s*\n\s*- \*Explication\*:\s*([^\n]+(?:\n(?!\s*- \*\*|###)[^\n]+)*)\s*\n\s*- \[▶️ YouTube\]\(([^)]+)\)/g;
    
    let checkpointMatch;
    while ((checkpointMatch = checkpointRegex.exec(content)) !== null) {
      const label = checkpointMatch[1];
      const explanation = checkpointMatch[2].trim().replace(/\n\s*/g, " ");
      const youtubeUrl = checkpointMatch[3];
      
      checkpoints.push({
        label,
        explanation,
        youtubeUrl,
      });
    }
    
    if (checkpoints.length > 0) {
      result.set(pasId, {
        pasId,
        checkpoints,
      });
    }
  }
  
  return result;
}

/**
 * Échapper les guillemets et retours à la ligne dans une chaîne pour TypeScript
 */
function escapeForTypeScript(str: string): string {
  return str
    .replace(/\\/g, "\\\\")  // Échapper les backslashes
    .replace(/"/g, '\\"')    // Échapper les guillemets doubles
    .replace(/\n/g, "\\n");  // Échapper les retours à la ligne
}

/**
 * Génère le code TypeScript pour un checkpoint
 */
function generateCheckpointCode(checkpoint: CheckpointData): string {
  const label = escapeForTypeScript(checkpoint.label);
  
  if (checkpoint.explanation && checkpoint.youtubeUrl) {
    const explanation = escapeForTypeScript(checkpoint.explanation);
    const youtubeUrl = checkpoint.youtubeUrl;
    return `      createCheckpoint(\n        "${label}",\n        "${explanation}",\n        "${youtubeUrl}"\n      )`;
  } else if (checkpoint.explanation) {
    const explanation = escapeForTypeScript(checkpoint.explanation);
    return `      createCheckpoint(\n        "${label}",\n        "${explanation}"\n      )`;
  } else {
    return `      createCheckpoint("${label}")`;
  }
}

/**
 * Met à jour le fichier pas.ts
 */
function updatePasFile(pasDataMap: Map<string, PasData>): void {
  let content = readFileSync(PAS_FILE, "utf-8");
  let updatedCount = 0;
  let totalCheckpoints = 0;
  
  // Pour chaque pas trouvé dans le markdown
  for (const [pasId, pasData] of pasDataMap.entries()) {
    // Trouver le bloc createPas correspondant
    // Structure: createPas("pas-XX-XX", ..., "type", [checkpoints], ...)
    // On cherche le tableau de checkpoints entre le type et createValidationCriteria
    const pasRegex = new RegExp(
      `(createPas\\(\\s*"${pasId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",[\\s\\S]*?"(?:fondamental|escape|sweep|passage|contrôle|soumission)",\\s*\\[)([\\s\\S]*?)(\\],\\s*createValidationCriteria)`,
      "m"
    );
    
    const match = content.match(pasRegex);
    if (match) {
      const before = match[1];
      const checkpointsOld = match[2];
      const after = match[3];
      
      // Générer le nouveau code des checkpoints
      const checkpointsNew = pasData.checkpoints
        .map((cp) => generateCheckpointCode(cp))
        .join(",\n");
      
      const newCheckpointsBlock = `\n${checkpointsNew}\n    `;
      
      // Remplacer dans le contenu
      content = content.replace(pasRegex, `${before}${newCheckpointsBlock}${after}`);
      
      updatedCount++;
      totalCheckpoints += pasData.checkpoints.length;
      
      console.log(`✓ ${pasId}: ${pasData.checkpoints.length} checkpoints mis à jour`);
    } else {
      console.warn(`⚠ ${pasId}: Pas trouvé dans le markdown mais non trouvé dans pas.ts`);
    }
  }
  
  // Sauvegarder le fichier
  writeFileSync(PAS_FILE, content, "utf-8");
  
  console.log(`\n✅ Mise à jour terminée:`);
  console.log(`   • ${updatedCount} pas mis à jour`);
  console.log(`   • ${totalCheckpoints} checkpoints avec explications + YouTube`);
  console.log(`   • Fichier sauvegardé: ${PAS_FILE}`);
}

/**
 * Fonction principale
 */
function main() {
  console.log("🔍 Lecture du fichier markdown...");
  const markdownContent = readFileSync(MARKDOWN_FILE, "utf-8");
  
  console.log("📝 Parsing des explications et URLs YouTube...");
  const pasDataMap = parseMarkdown(markdownContent);
  
  console.log(`✓ ${pasDataMap.size} pas trouvés dans le markdown\n`);
  
  console.log("🔄 Mise à jour de pas.ts...");
  updatePasFile(pasDataMap);
  
  console.log("\n✨ Terminé !");
}

// Exécuter le script
if (require.main === module) {
  main();
}

export { parseMarkdown, updatePasFile };
