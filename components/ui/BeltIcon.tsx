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
  const beltInfo = parseBeltGrade(grade);
  
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
        fill={beltColor}
        stroke="#000000"
        strokeWidth="1.5"
      />
      
      {/* Barrettes */}
      {beltInfo.barrettes > 0 && (
        <>
          {Array.from({ length: beltInfo.barrettes }).map((_, index) => (
            <rect
              key={index}
              x={width * 0.1 + index * barretteSpacing}
              y={height * 0.35}
              width={barretteWidth}
              height={barretteHeight}
              fill={barretteColor}
              stroke="#000000"
              strokeWidth="0.5"
            />
          ))}
        </>
      )}
    </svg>
  );
}