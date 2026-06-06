import { useGameStore } from '@/store/gameStore';
import { COMBOS, ELEMENTS, CATEGORY_NAMES, CATEGORY_COLORS, getComboWithLevel, RARITY_BG } from '@/data/gameData';
import { cn } from '@/lib/utils';

const EFFECT_DESCRIPTIONS: Record<string, string> = {
  burn: '每回合造成持续火焰伤害',
  freeze: '冻结敌人，使其跳过行动',
  poison: '每回合造成持续毒素伤害',
  stun: '眩晕敌人，使其无法行动',
  heal: '恢复自身生命值',
  shield: '获得护盾抵挡伤害',
  draw: '抽取更多卡牌',
  lifesteal: '造成伤害的同时恢复等量生命',
  thorns: '被攻击时反弹伤害给敌人',
  absorb: '造成伤害的同时获得等量护盾',
  weakness: '削弱敌人的攻击力',
  strength: '提升自身的攻击力',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  attack: '以造成伤害为核心的技能',
  defense: '以护盾和防御为核心的技能',
  heal: '以恢复生命为核心的技能',
  control: '以限制敌人行动为核心的技能',
  lifesteal: '攻击时吸取敌人生命',
  thorns: '反弹敌人的攻击伤害',
  absorb: '将伤害转化为护盾',
  utility: '提供抽牌等辅助效果',
};

const RARITY_NAMES: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export default function UpgradePanel() {
  const {
    showUpgradePanel,
    toggleUpgradePanel,
    elementEssence,
    getCurrentComboLevel,
    getUpgradeCost,
    upgradeCombo,
    getComboCooldown,
    isComboOnCooldown,
  } = useGameStore();

  if (!showUpgradePanel) return null;

  const upgradableCombos = COMBOS.filter((c) => c.canUpgrade);

  const handleUpgrade = (comboId: string) => {
    upgradeCombo(comboId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={toggleUpgradePanel}
      />

      <div className="relative w-full max-w-5xl max-h-[85vh] mx-4 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-2xl border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 overflow-hidden animate-rise">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-amber-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-900/20 to-purple-900/20">
          <div>
            <h2 className="text-2xl font-black text-gradient-gold" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              ⚡ 技能升级 ⚡
            </h2>
            <p className="text-white/50 text-sm mt-1">使用元素精华强化你的组合技能</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900/40 border border-purple-500/30">
              <span className="text-2xl">💎</span>
              <div>
                <div className="text-xs text-white/50">元素精华</div>
                <div className="text-xl font-bold text-purple-300">{elementEssence}</div>
              </div>
            </div>

            <button
              onClick={toggleUpgradePanel}
              className="w-10 h-10 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/70 hover:text-white transition-all flex items-center justify-center text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative z-10 p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-white/10">
            <h3 className="text-lg font-bold text-amber-300 mb-3">📖 效果机制说明</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(EFFECT_DESCRIPTIONS).map(([key, desc]) => (
                <div key={key} className="p-3 rounded-lg bg-slate-700/40 border border-white/5">
                  <div className="font-bold text-sm text-white mb-1">
                    {key === 'burn' && '🔥 灼烧'}
                    {key === 'freeze' && '❄️ 冻结'}
                    {key === 'poison' && '☠️ 中毒'}
                    {key === 'stun' && '💫 眩晕'}
                    {key === 'heal' && '💚 治疗'}
                    {key === 'shield' && '🛡️ 护盾'}
                    {key === 'draw' && '🃏 抽牌'}
                    {key === 'lifesteal' && '🩸 吸血'}
                    {key === 'thorns' && '🌵 反伤'}
                    {key === 'absorb' && '💠 吸收'}
                    {key === 'weakness' && '💔 虚弱'}
                    {key === 'strength' && '💪 强化'}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-amber-300 mb-3">🎯 技能类型</h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(CATEGORY_DESCRIPTIONS).map(([key, desc]) => (
                <div key={key} className="p-2 rounded-lg bg-slate-800/40 border border-white/5 text-center">
                  <div className={cn('font-bold text-sm', CATEGORY_COLORS[key])}>
                    {CATEGORY_NAMES[key]}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-amber-300 mb-3">⬆️ 可升级技能</h3>
            {upgradableCombos.map((combo) => {
              const level = getCurrentComboLevel(combo.id);
              const maxLevel = combo.upgrades ? combo.upgrades.length + 1 : 1;
              const cost = getUpgradeCost(combo.id);
              const canUpgrade = level < maxLevel && elementEssence >= cost;
              const effectiveCombo = getComboWithLevel(combo, level);
              const nextCombo = level < maxLevel ? getComboWithLevel(combo, level + 1) : null;
              const onCooldown = isComboOnCooldown(combo.id);
              const cooldownRemaining = getComboCooldown(combo.id);
              const nextUpgrade = combo.upgrades && level < maxLevel ? combo.upgrades[level - 1] : null;

              return (
                <div
                  key={combo.id}
                  className={cn(
                    'relative p-4 rounded-xl border transition-all duration-300',
                    'bg-slate-800/40 hover:bg-slate-700/40',
                    canUpgrade ? 'border-amber-500/40 hover:border-amber-400/60' : 'border-white/10'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-2xl">{ELEMENTS[combo.elements[0]].icon}</span>
                        <span className="text-amber-400 text-sm">+</span>
                        <span className="text-2xl">{ELEMENTS[combo.elements[1]].icon}</span>
                      </div>
                      <div className={cn(
                        'w-16 h-16 rounded-xl flex items-center justify-center',
                        `bg-gradient-to-br ${RARITY_BG[combo.rarity]}`,
                        'shadow-lg border border-white/20'
                      )}>
                        <span className="text-3xl">⚡</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-white" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                          {combo.name}
                        </h4>
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-semibold bg-slate-700/60',
                          CATEGORY_COLORS[combo.category]
                        )}>
                          {CATEGORY_NAMES[combo.category]}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-bold',
                          level >= maxLevel ? 'bg-amber-500/80 text-white' : 'bg-slate-600/60 text-white/70'
                        )}>
                          Lv.{level}/{maxLevel}
                        </span>
                        {onCooldown && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/60 text-white">
                            冷却 {cooldownRemaining}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-white/50 mb-3">{combo.description}</p>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-black text-red-400">
                              {effectiveCombo.damage}
                              {nextCombo && (
                                <span className="text-sm text-green-400 ml-1">
                                  +{nextCombo.damage - effectiveCombo.damage}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-white/40">伤害</div>
                          </div>

                          {effectiveCombo.effect && effectiveCombo.effectValue !== undefined && (
                            <div className="text-center">
                              <div className="text-2xl font-black text-purple-400">
                                {effectiveCombo.effectValue}
                                {nextCombo && nextCombo.effectValue !== undefined && (
                                  <span className="text-sm text-green-400 ml-1">
                                    +{nextCombo.effectValue - effectiveCombo.effectValue}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-white/40">
                                {combo.effect === 'burn' && '灼烧'}
                                {combo.effect === 'freeze' && '冻结'}
                                {combo.effect === 'poison' && '中毒'}
                                {combo.effect === 'stun' && '眩晕'}
                                {combo.effect === 'heal' && '治疗'}
                                {combo.effect === 'shield' && '护盾'}
                                {combo.effect === 'draw' && '抽牌'}
                                {combo.effect === 'lifesteal' && '吸血'}
                                {combo.effect === 'thorns' && '反伤'}
                                {combo.effect === 'absorb' && '吸收'}
                              </div>
                            </div>
                          )}

                          {effectiveCombo.effectDuration !== undefined && effectiveCombo.effectDuration > 0 && (
                            <div className="text-center">
                              <div className="text-2xl font-black text-cyan-400">
                                {effectiveCombo.effectDuration}
                                {nextCombo && nextCombo.effectDuration !== undefined && nextCombo.effectDuration > effectiveCombo.effectDuration && (
                                  <span className="text-sm text-green-400 ml-1">
                                    +{nextCombo.effectDuration - effectiveCombo.effectDuration}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-white/40">持续回合</div>
                            </div>
                          )}

                          <div className="text-center">
                            <div className="text-2xl font-black text-amber-400">{combo.cooldown}</div>
                            <div className="text-xs text-white/40">冷却回合</div>
                          </div>
                        </div>

                        <div className="flex-1" />

                        <div className="flex flex-col items-end gap-2">
                          {nextUpgrade ? (
                            <>
                              <div className="text-xs text-white/40">
                                升级效果：<span className="text-green-400">{nextUpgrade.description}</span>
                              </div>
                              <button
                                onClick={() => handleUpgrade(combo.id)}
                                disabled={!canUpgrade}
                                className={cn(
                                  'px-6 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2',
                                  canUpgrade
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/40 hover:shadow-amber-500/60'
                                    : 'bg-slate-700/60 text-slate-500 cursor-not-allowed'
                                )}
                              >
                                <span>💎</span>
                                <span>{cost}</span>
                                <span>升级</span>
                              </button>
                            </>
                          ) : (
                            <div className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 font-bold border border-amber-500/30">
                              ⭐ 已满级 ⭐
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    'absolute top-2 right-2 w-3 h-3 rounded-full border border-white/30',
                    combo.rarity === 'common' && 'bg-gray-500',
                    combo.rarity === 'rare' && 'bg-blue-500',
                    combo.rarity === 'epic' && 'bg-purple-500',
                    combo.rarity === 'legendary' && 'bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse',
                  )} title={RARITY_NAMES[combo.rarity]} />
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-white/5">
            <h4 className="text-sm font-bold text-white/60 mb-2">💎 元素精华获取方式</h4>
            <ul className="text-xs text-white/40 space-y-1 mb-3">
              <li>• 释放组合技能：传说+5 / 史诗+3 / 稀有+2</li>
              <li>• 直接击杀敌人：传说+15 / 史诗+10 / 稀有+5 (+波次×2)</li>
              <li>• 持续伤害击杀（灼烧/中毒）：+6 (+波次×2)</li>
              <li>• 反伤击杀：+8 (+波次×2)</li>
            </ul>
            <h4 className="text-sm font-bold text-white/60 mb-2">💡 小提示</h4>
            <ul className="text-xs text-white/40 space-y-1">
              <li>• 传说品质技能升级效果最强，但消耗也最高</li>
              <li>• 合理搭配攻击、防御和控制技能可以应对不同敌人</li>
              <li>• 吸血和吸收类技能可以在持久战中发挥巨大作用</li>
              <li>• 反伤配合高护盾可以有效对付高攻击敌人</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
