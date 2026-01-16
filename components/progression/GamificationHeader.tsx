"use client";

import { Gamification } from "@/lib/progression/types";
import { getLevelProgress, getXPForNextLevel, getXPInCurrentLevel } from "@/lib/progression/gamification";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface GamificationHeaderProps {
  gamification: Gamification;
}

export function GamificationHeader({ gamification }: GamificationHeaderProps) {
  const levelProgress = getLevelProgress(gamification.xpTotal);
  const xpInCurrentLevel = getXPInCurrentLevel(gamification.xpTotal);
  const xpForNextLevel = getXPForNextLevel(gamification.level);

  return (
    <Card variant="elevated" className="mb-6">
      <div className="space-y-4">
        {/* Level et XP */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Niveau</div>
            <div className="text-3xl font-bold text-accent-purple">
              {gamification.level}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">XP Total</div>
            <div className="text-2xl font-bold text-white">
              {gamification.xpTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">
              {xpInCurrentLevel} / {xpForNextLevel} XP
            </span>
            <span className="text-xs text-gray-400">{levelProgress}%</span>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-purple to-indigo-600 transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Streak et badges */}
        <div className="flex items-center gap-4 pt-2 border-t border-white/10">
          {gamification.streak > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Streak:</span>
              <Badge variant="lime" size="sm">
                🔥 {gamification.streak} jours
              </Badge>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Badges:</span>
            <Badge variant="cyan" size="sm">
              {gamification.badges.length}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
