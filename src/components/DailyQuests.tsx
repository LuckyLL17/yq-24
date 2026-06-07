import { useGameStore } from '@/store/gameStore';
import { QUEST_RARITY_COLORS, QUEST_RARITY_BG, REFRESH_COST, COMBOS, ELEMENTS, CATEGORY_NAMES } from '@/data/gameData';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const RARITY_NAMES: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
};

const QUEST_ICONS: Record<string, string> = {
  use_combo: '⚡',
  use_combo_category: '🎯',
  win_battle: '🏆',
  total_damage: '💥',
  reach_wave: '🌊',
};

export default function DailyQuests() {
  const {
    showDailyQuests,
    toggleDailyQuests,
    dailyQuests,
    elementEssence,
    refreshDailyQuests,
    claimQuestReward,
    checkDailyRefresh,
  } = useGameStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (showDailyQuests) {
      checkDailyRefresh();
    }
  }, [showDailyQuests, checkDailyRefresh]);

  if (!showDailyQuests) return null;

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    const success = refreshDailyQuests();
    setTimeout(() => setRefreshing(false), 500);
    if (!success) {
      console.log('刷新失败：精华不足');
    }
  };

  const handleClaim = (questId: string) => {
    claimQuestReward(questId);
  };

  const getComboInfo = (comboId?: string) => {
    if (!comboId) return null;
    return COMBOS.find((c) => c.id === comboId);
  };

  const canRefresh = !dailyQuests.freeRefreshUsed || elementEssence >= REFRESH_COST;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={toggleDailyQuests}
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] mx-4 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-2xl border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden animate-rise">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-amber-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-900/20 to-purple-900/20">
          <div>
            <h2 className="text-2xl font-black text-gradient-gold" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              📜 每日任务 📜
            </h2>
            <p className="text-white/50 text-sm mt-1">完成任务获取元素精华奖励</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900/40 border border-purple-500/30">
              <span className="text-2xl">💎</span>
              <div>
                <div className="text-xs text-white/50">元素精华</div>
                <div className="text-xl font-bold text-purple-300">{elementEssence}</div>
              </div>
            </div>

            <button
              onClick={toggleDailyQuests}
              className="w-10 h-10 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/70 hover:text-white transition-all flex items-center justify-center text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative z-10 p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="space-y-4">
            {dailyQuests.quests.map((quest) => {
              const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);
              const comboInfo = getComboInfo(quest.targetComboId);

              return (
                <div
                  key={quest.id}
                  className={cn(
                    'relative p-4 rounded-xl border-2 transition-all duration-300',
                    QUEST_RARITY_BG[quest.rarity],
                    quest.claimed && 'opacity-60',
                    quest.completed && !quest.claimed && 'ring-2 ring-green-400/50 ring-offset-2 ring-offset-transparent'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0',
                        `bg-gradient-to-br ${QUEST_RARITY_COLORS[quest.rarity]}`,
                        'border border-white/20'
                      )}
                    >
                      {QUEST_ICONS[quest.type]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-white" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                          {quest.title}
                        </h4>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-xs font-bold text-white',
                            `bg-gradient-to-r ${QUEST_RARITY_COLORS[quest.rarity]}`
                          )}
                        >
                          {RARITY_NAMES[quest.rarity]}
                        </span>
                        {quest.claimed && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/30 text-green-300 border border-green-500/30">
                            已领取
                          </span>
                        )}
                        {quest.completed && !quest.claimed && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/30 text-amber-300 border border-amber-500/30 animate-pulse">
                            可领取
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-white/60 mb-3">{quest.description}</p>

                      {quest.type === 'use_combo' && comboInfo && (
                        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-white/10">
                          <span className="text-xl">{ELEMENTS[comboInfo.elements[0]].icon}</span>
                          <span className="text-amber-400 text-sm">+</span>
                          <span className="text-xl">{ELEMENTS[comboInfo.elements[1]].icon}</span>
                          <span className="text-white/80 text-sm font-medium">{comboInfo.name}</span>
                          <span className="text-xs text-white/40 ml-auto">{CATEGORY_NAMES[comboInfo.category]}</span>
                        </div>
                      )}

                      {quest.type === 'use_combo_category' && quest.targetCategory && (
                        <div className="inline-block mb-3 px-3 py-1 rounded-lg bg-slate-800/50 border border-white/10">
                          <span className="text-sm text-white/60">目标类别：</span>
                          <span className="text-sm font-bold text-amber-300">
                            {CATEGORY_NAMES[quest.targetCategory]}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-white/50 mb-1">
                            <span>进度</span>
                            <span>
                              {quest.progress} / {quest.target}
                            </span>
                          </div>
                          <div className="h-3 rounded-full bg-slate-700/60 overflow-hidden border border-white/10">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                quest.completed
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                  : `bg-gradient-to-r ${QUEST_RARITY_COLORS[quest.rarity]}`
                              )}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xl">💎</span>
                            <span className="text-lg font-bold text-amber-300">{quest.reward}</span>
                          </div>

                          {quest.completed && !quest.claimed && (
                            <button
                              onClick={() => handleClaim(quest.id)}
                              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60"
                            >
                              领取奖励
                            </button>
                          )}

                          {quest.claimed && (
                            <span className="text-xs text-green-400 font-medium">✓ 已完成</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/50">
                {dailyQuests.freeRefreshUsed ? (
                  <span>每日免费刷新已使用</span>
                ) : (
                  <span className="text-green-400">还有 1 次免费刷新机会</span>
                )}
              </div>

              <button
                onClick={handleRefresh}
                disabled={!canRefresh || refreshing}
                className={cn(
                  'px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2',
                  canRefresh && !refreshing
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60'
                    : 'bg-slate-700/60 text-slate-500 cursor-not-allowed'
                )}
              >
                <span className={cn(refreshing && 'animate-spin')}>🔄</span>
                <span>刷新任务</span>
                {dailyQuests.freeRefreshUsed && !refreshing && (
                  <span className="flex items-center gap-1 text-sm opacity-80">
                    <span>💎</span>
                    <span>{REFRESH_COST}</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-white/5">
            <h4 className="text-sm font-bold text-white/60 mb-2">📖 任务说明</h4>
            <ul className="text-xs text-white/40 space-y-1">
              <li>• 每日 0 点自动刷新 3 个随机任务</li>
              <li>• 任务分为普通、稀有、史诗三种品质，品质越高奖励越丰厚</li>
              <li>• 每天有 1 次免费刷新机会，之后每次刷新消耗 {REFRESH_COST} 元素精华</li>
              <li>• 任务进度在游戏过程中自动追踪</li>
              <li>• 完成任务后请及时领取奖励</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
