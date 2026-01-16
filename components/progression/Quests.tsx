"use client";

import { Quest } from "@/lib/progression/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface QuestsProps {
  quests: Quest[];
}

export function Quests({ quests }: QuestsProps) {
  const dailyQuests = quests.filter((q) => q.type === "daily");
  const weeklyQuests = quests.filter((q) => q.type === "weekly");

  if (quests.length === 0) {
    return (
      <Card variant="elevated">
        <div className="text-center py-4 text-gray-400">
          <div className="text-2xl mb-2">📋</div>
          <div>Aucune quête active</div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <h3 className="text-lg font-semibold mb-4">Quêtes</h3>
      <div className="space-y-4">
        {/* Quêtes quotidiennes */}
        {dailyQuests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Quotidiennes</h4>
            <div className="space-y-2">
              {dailyQuests.map((quest) => (
                <QuestItem key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        )}

        {/* Quêtes hebdomadaires */}
        {weeklyQuests.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Hebdomadaires</h4>
            <div className="space-y-2">
              {weeklyQuests.map((quest) => (
                <QuestItem key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function QuestItem({ quest }: { quest: Quest }) {
  const statusColors = {
    available: "cyan",
    in_progress: "purple",
    completed: "green",
    expired: "gray",
  } as const;

  const statusLabels = {
    available: "Disponible",
    in_progress: "En cours",
    completed: "Complétée",
    expired: "Expirée",
  } as const;

  return (
    <div className="p-3 bg-surface rounded-lg border border-white/5">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-medium text-white mb-1">{quest.title}</div>
          <div className="text-xs text-gray-400">{quest.description}</div>
        </div>
        <Badge variant={statusColors[quest.status] as any} size="sm">
          {statusLabels[quest.status]}
        </Badge>
      </div>
      {quest.progress && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Progression</span>
            <span className="text-xs text-gray-400">
              {quest.progress.current} / {quest.progress.target}
            </span>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-purple to-indigo-600 transition-all duration-300"
              style={{
                width: `${(quest.progress.current / quest.progress.target) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>+{quest.xpReward} XP</span>
        <span>•</span>
        <span>+{quest.tokenReward} Tokens</span>
        {quest.expiresAt && (
          <>
            <span>•</span>
            <span>
              Expire: {new Date(quest.expiresAt).toLocaleDateString("fr-FR")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
