"use client";

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "purple" | "lime" | "white";
}

export function Loading({ size = "md", color = "cyan" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const colorClasses = {
    cyan: "border-accent-cyan/30 border-t-accent-cyan",
    purple: "border-accent-purple/30 border-t-accent-purple",
    lime: "border-accent-lime/30 border-t-accent-lime",
    white: "border-white/30 border-t-white",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
      aria-label="Chargement"
    >
      <span className="sr-only">Chargement...</span>
    </div>
  );
}

/**
 * Composant Loading pleine page (overlay)
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loading size="lg" color="purple" />
        <p className="text-sm text-gray-400">Chargement...</p>
      </div>
    </div>
  );
}
