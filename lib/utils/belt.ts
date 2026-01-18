/**
 * Utilitaires pour les ceintures JJB
 */

export type BeltColor = "white" | "blue" | "purple" | "brown" | "black";

export interface BeltInfo {
  color: BeltColor;
  barrettes: number; // 0 = ceinture seule, 1-4 = nombre de barrettes
  name: string;
}

/**
 * Extrait les informations d'une ceinture à partir d'un grade
 */
export function parseBeltGrade(grade: string): BeltInfo | null {
  // Format: "Ceinture [Couleur] [X barrette(s)]"
  
  if (grade.includes("Blanche")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "white",
      barrettes,
      name: grade,
    };
  }
  
  if (grade.includes("Bleue")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "blue",
      barrettes,
      name: grade,
    };
  }
  
  if (grade.includes("Violette")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "purple",
      barrettes,
      name: grade,
    };
  }
  
  if (grade.includes("Marron")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "brown",
      barrettes,
      name: grade,
    };
  }
  
  if (grade.includes("Noire")) {
    return {
      color: "black",
      barrettes: 0,
      name: grade,
    };
  }
  
  return null;
}

/**
 * Couleurs CSS pour chaque ceinture
 */
export const BELT_COLORS: Record<BeltColor, string> = {
  white: "#FFFFFF",
  blue: "#0033FF",
  purple: "#8000FF",
  brown: "#8B4513",
  black: "#000000",
};

/**
 * Couleur des barrettes selon la ceinture
 */
export function getBarretteColor(color: BeltColor): string {
  if (color === "black") {
    return "#FF0000"; // Rouge pour la ceinture noire
  }
  return "#FFFFFF"; // Blanc pour toutes les autres
}