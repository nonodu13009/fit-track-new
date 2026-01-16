"use client";

import { Badge as BadgeType } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface BadgesGridProps {
  badges: BadgeType[];
}

export function BadgesGrid({ badges }: BadgesGridProps) {
  if (badges.length === 0) {
    return (
      <Card variant="elevated">
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🏆</div>
          <div>Aucun badge obtenu pour le moment</div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <h3 className="text-lg font-semibold mb-4">Badges obtenus</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-white/5"
          >
            <div className="text-2xl">{badge.icon || "🏅"}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white truncate">{badge.name}</div>
              <div className="text-xs text-gray-400 truncate">{badge.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(badge.earnedAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
