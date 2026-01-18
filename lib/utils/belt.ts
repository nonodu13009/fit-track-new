/**
 * Utilitaires pour les ceintures JJB et Judo
 */

export type BeltColor = "white" | "blue" | "purple" | "brown" | "black" | "yellow" | "orange" | "green";
export type BeltType = "jjb" | "judo";

export interface BeltInfo {
  color: BeltColor;
  barrettes: number; // 0 = ceinture seule, 1-4 = nombre de barrettes (JJB uniquement)
  dan?: number; // 1-10 = dan pour ceinture noire (Judo uniquement)
  name: string;
  type: BeltType;
}

/**
 * Extrait les informations d'une ceinture JJB à partir d'un grade
 */
export function parseJjbBeltGrade(grade: string): BeltInfo | null {
  // Format: "Ceinture [Couleur] [X barrette(s)]"
  
  if (grade.includes("Blanche")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "white",
      barrettes,
      name: grade,
      type: "jjb",
    };
  }
  
  if (grade.includes("Bleue")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "blue",
      barrettes,
      name: grade,
      type: "jjb",
    };
  }
  
  if (grade.includes("Violette")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "purple",
      barrettes,
      name: grade,
      type: "jjb",
    };
  }
  
  if (grade.includes("Marron")) {
    const match = grade.match(/(\d+)\s+barrette/);
    const barrettes = match ? parseInt(match[1], 10) : 0;
    return {
      color: "brown",
      barrettes,
      name: grade,
      type: "jjb",
    };
  }
  
  if (grade.includes("Noire")) {
    return {
      color: "black",
      barrettes: 0,
      name: grade,
      type: "jjb",
    };
  }
  
  return null;
}

/**
 * Extrait les informations d'une ceinture Judo à partir d'un grade
 */
export function parseJudoBeltGrade(grade: string): BeltInfo | null {
  // Format: "Ceinture [Couleur]" ou "Ceinture Noire Xème Dan"
  
  if (grade.includes("Blanche")) {
    return {
      color: "white",
      barrettes: 0,
      name: grade,
      type: "judo",
    };
  }
  
  if (grade.includes("Jaune")) {
    return {
      color: "yellow",
      barrettes: 0,
      name: grade,
      type: "judo",
    };
  }
  
  if (grade.includes("Orange")) {
    return {
      color: "orange",
      barrettes: 0,
      name: grade,
      type: "judo",
    };
  }
  
  if (grade.includes("Verte")) {
    return {
      color: "green",
      barrettes: 0,
      name: grade,
      type: "judo",
    };
  }
  
  if (grade.includes("Bleue")) {
    return {
      color: "blue",
      barrettes: 0,
      name: grade,
      type: "judo",
    };
  }
  
  if (grade.includes("Marron")) {
    return {
      color: "brown",
      barrettes: 0,
      name: grade,
      type: "judo",
    };
  }
  
  if (grade.includes("Noire")) {
    // Extraire le dan si présent
    const danMatch = grade.match(/(\d+)(?:ème|er)/);
    const dan = danMatch ? parseInt(danMatch[1], 10) : undefined;
    return {
      color: "black",
      barrettes: 0,
      dan,
      name: grade,
      type: "judo",
    };
  }
  
  return null;
}

/**
 * Extrait les informations d'une ceinture (JJB ou Judo) à partir d'un grade
 */
export function parseBeltGrade(grade: string, type?: BeltType): BeltInfo | null {
  // Essaie d'abord JJB si type non spécifié ou si type = "jjb"
  if (!type || type === "jjb") {
    const jjbResult = parseJjbBeltGrade(grade);
    if (jjbResult) return jjbResult;
  }
  
  // Essaie ensuite Judo si type non spécifié ou si type = "judo"
  if (!type || type === "judo") {
    const judoResult = parseJudoBeltGrade(grade);
    if (judoResult) return judoResult;
  }
  
  return null;
}

/**
 * Couleurs CSS pour chaque ceinture (JJB et Judo)
 */
export const BELT_COLORS: Record<BeltColor, string> = {
  white: "#FFFFFF",
  yellow: "#FFD700",
  orange: "#FF8C00",
  green: "#00AA00",
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