/**
 * Composant pour afficher une icône de ceinture JJB avec barrettes
 */

import { parseBeltGrade, BELT_COLORS, getBarretteColor } from "@/lib/utils/belt";

interface BeltIconProps {
  grade: string;
  size?: number;
  className?: string;
}

export function BeltIcon({ grade, size = 32, className = "" }: BeltIconProps) {
  // Essaie de détecter le type (JJB ou Judo) en analysant le grade
  const isJudo = grade.includes("Jaune") || grade.includes("Orange") || grade.includes("Verte") || 
                 (grade.includes("Noire") && (grade.includes("Dan") || grade.includes("dan")));
  const beltInfo = parseBeltGrade(grade, isJudo ? "judo" : "jjb");
  
  if (!beltInfo) {
    return null;
  }

  const beltColor = BELT_COLORS[beltInfo.color];
  const barretteColor = getBarretteColor(beltInfo.color);
  
  // Dimensions de la ceinture
  const width = size * 2.5;
  const height = size * 0.6;
  const barretteWidth = size * 0.3;
  const barretteHeight = size * 0.15;
  const barretteSpacing = size * 0.2;

  // Pour la ceinture noire sur fond sombre, on utilise un gris très foncé avec une bordure claire
  const isBlackBelt = beltInfo.color === "black";
  const effectiveBeltColor = isBlackBelt ? "#1a1a1a" : beltColor; // Gris très foncé au lieu de noir pur
  const effectiveStrokeColor = isBlackBelt ? "#FFFFFF" : "#000000"; // Bordure blanche pour ceinture noire
  const effectiveStrokeWidth = isBlackBelt ? 2.5 : 1.5; // Bordure plus épaisse pour ceinture noire

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* Ceinture principale */}
      <rect
        x="0"
        y={height * 0.3}
        width={width}
        height={height * 0.4}
        fill={effectiveBeltColor}
        stroke={effectiveStrokeColor}
        strokeWidth={effectiveStrokeWidth}
      />
      
      {/* Barrettes (JJB uniquement) */}
      {beltInfo.type === "jjb" && beltInfo.barrettes > 0 && (
        <>
          {Array.from({ length: beltInfo.barrettes }).map((_, index) => (
            <rect
              key={index}
              x={width * 0.1 + index * barretteSpacing}
              y={height * 0.35}
              width={barretteWidth}
              height={barretteHeight}
              fill={barretteColor}
              stroke={isBlackBelt ? "#FFFFFF" : "#000000"}
              strokeWidth={isBlackBelt ? 1 : 0.5}
            />
          ))}
        </>
      )}
    </svg>
  );
}