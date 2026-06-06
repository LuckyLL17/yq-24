import { useGameStore } from '@/store/gameStore';
import { ELEMENTS, COMBOS, CATEGORY_NAMES, CATEGORY_COLORS } from '@/data/gameData';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function MainMenu() {
  const { startBattle, startChallenge, startEndless, startQuick } = useGameStore();
  const [showCodex, setShowCodex] = useState(false);

  const gameModes = [
    {
      id: 'classic',
      name: '经典对战',
      description: '与AI对手进行一场完整的卡牌对决',
      icon: '⚔️',
      color: 'from-blue-600 via-purple-600 to-blue-600',
      glow: 'shadow-blue-500/30',
      onClick: () => startBattle('classic'),
    },
    {
      id: 'challenge',
      name: '挑战模式',
      description: '多关卡Boss挑战，击败越来越强的敌人',
      icon: '🏆',
      color: 'from-amber-500 via-orange-500 to-red-500',
      glow: 'shadow-orange-500/30',
      onClick: () => startChallenge(),
    },
    {
      id: 'endless',
      name: '无尽模式',
      description: '无限波次敌人，看看你能坚持多久',
      icon: '♾️',
      color: 'from-purple-600 via-pink-600 to-purple-600',
      glow: 'shadow-purple-500/30',
      onClick: () => startEndless(),
    },
    {
      id: 'quick',
      name: '快速对战',
      description: '简化规则，3分钟一局，适合碎片时间',
      icon: '⚡',
      color: 'from-cyan-500 via-teal-500 to-emerald-500',
      glow: 'shadow-cyan-500/30',
      onClick: () => startQuick(),
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden battle-ground">
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* 装饰性大元素 */}
      <div className="absolute top-16 left-16 text-7xl animate-float-slow opacity-20">🔥</div>
      <div className="absolute top-32 right-24 text-6xl animate-float-slow opacity-20" style={{ animationDelay: '1s' }}>💧</div>
      <div className="absolute bottom-40 left-24 text-8xl animate-float-slow opacity-20" style={{ animationDelay: '0.5s' }}>🌍</div>
      <div className="absolute bottom-24 right-16 text-7xl animate-float-slow opacity-20" style={{ animationDelay: '1.5s' }}>🌪️</div>

      {/* 魔法阵背景 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          className="w-[800px] h-[800px] rounded-full opacity-10 border-4 border-current text-amber-400"
          style={{ animation: 'magicCircle 30s linear infinite' }}
        >
          <div className="absolute inset-12 rounded-full border-2 border-current opacity-60" />
          <div className="absolute inset-24 rounded-full border border-current opacity-40" />
          <div className="absolute inset-36 rounded-full border border-current opacity-20" />
          
          {/* 四元素位置 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl">🔥</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl">🌍</div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl">💧</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl">🌪️</div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo和标题 */}
        <div className="text-center mb-10">
          {/* 四元素图标排列 */}
          <div className="flex justify-center gap-6 mb-6">
            {Object.values(ELEMENTS).map((el, i) => (
              <div
                key={i}
                className="relative"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/40 shadow-lg"
                  style={{ 
                    animation: 'float 3s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  {el.icon}
                </div>
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${el.gradient} blur-lg opacity-40 -z-10`}
                  style={{ animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}
                />
              </div>
            ))}
          </div>

          {/* 游戏标题 */}
          <h1
            className="text-7xl font-black text-gradient-gold mb-3"
            style={{ 
              fontFamily: "'Cinzel Decorative', serif",
              textShadow: '0 0 60px rgba(251, 191, 36, 0.4)',
            }}
          >
            元素对决
          </h1>
          
          <p className="text-xl text-white/60 tracking-[0.5em] mb-2">ELEMENTAL DUELS</p>
          <p className="text-amber-400/70 text-base tracking-wider">两两搭配 · 释放组合技 · 策略对决</p>
        </div>

        {/* 游戏模式选择 */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-8">
          {gameModes.map((mode, index) => (
            <button
              key={mode.id}
              onClick={mode.onClick}
              className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 背景渐变 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* 光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
              
              {/* 外发光 */}
              <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${mode.color} blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />

              {/* 边框 */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/30" />

              {/* 内容 */}
              <div className="relative z-10">
                <div className="text-4xl mb-2">{mode.icon}</div>
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  {mode.name}
                </h3>
                <p className="text-white/70 text-sm">{mode.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* 组合技图鉴按钮 */}
        <button
          onClick={() => setShowCodex(!showCodex)}
          className="px-8 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-amber-500/30 flex items-center gap-2"
        >
          <span>📖</span>
          <span style={{ fontFamily: "'Cinzel Decorative', serif" }}>组合技图鉴</span>
        </button>

        {/* 组合技图鉴展开 */}
        {showCodex && (
          <div className="mt-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full border border-amber-500/20 animate-rise max-h-[70vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-amber-400 mb-4 text-center" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              ✨ 元素组合技 ✨
            </h3>

            <div className="mb-5 p-4 rounded-xl bg-slate-800/50 border border-white/10">
              <h4 className="text-sm font-bold text-amber-300 mb-3">📖 效果类型说明</h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-orange-400 font-bold">🔥 灼烧</span>
                  <p className="text-white/50 mt-1">每回合持续伤害</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-cyan-300 font-bold">❄️ 冻结</span>
                  <p className="text-white/50 mt-1">跳过敌人行动</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-green-400 font-bold">☠️ 中毒</span>
                  <p className="text-white/50 mt-1">持续毒素伤害</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-yellow-300 font-bold">💫 眩晕</span>
                  <p className="text-white/50 mt-1">无法行动</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-green-400 font-bold">💚 治疗</span>
                  <p className="text-white/50 mt-1">恢复生命值</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-amber-300 font-bold">🛡️ 护盾</span>
                  <p className="text-white/50 mt-1">抵挡伤害</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-blue-400 font-bold">🃏 抽牌</span>
                  <p className="text-white/50 mt-1">抽取更多卡牌</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-pink-400 font-bold">🩸 吸血</span>
                  <p className="text-white/50 mt-1">伤害转生命</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-orange-400 font-bold">🌵 反伤</span>
                  <p className="text-white/50 mt-1">反弹敌人攻击</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-cyan-400 font-bold">💠 吸收</span>
                  <p className="text-white/50 mt-1">伤害转护盾</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-red-400 font-bold">💔 虚弱</span>
                  <p className="text-white/50 mt-1">降低敌人攻击</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-700/40">
                  <span className="text-yellow-400 font-bold">💪 强化</span>
                  <p className="text-white/50 mt-1">提升自身攻击</p>
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-white/60">技能类型：</span>
              {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
                <span
                  key={key}
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-semibold bg-slate-700/60',
                    CATEGORY_COLORS[key]
                  )}
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3">
              {COMBOS.map((combo) => (
                <div
                  key={combo.id}
                  className="group relative p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-white/5 hover:border-amber-500/30 cursor-default"
                >
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-2xl">{ELEMENTS[combo.elements[0]].icon}</span>
                    <span className="text-amber-400 text-sm">+</span>
                    <span className="text-2xl">{ELEMENTS[combo.elements[1]].icon}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                      {combo.name}
                    </div>
                    <div className={cn(
                      'text-xs font-semibold mb-1',
                      CATEGORY_COLORS[combo.category]
                    )}>
                      {CATEGORY_NAMES[combo.category]}
                    </div>
                    <div className="text-xs text-red-400 font-bold">
                      ⚔️ {combo.damage} 伤害
                    </div>
                    {combo.effect && (
                      <div className="text-xs text-purple-400 mt-0.5">
                        ✨ {combo.effect === 'burn' && '灼烧'}
                        {combo.effect === 'freeze' && '冻结'}
                        {combo.effect === 'poison' && '中毒'}
                        {combo.effect === 'stun' && '眩晕'}
                        {combo.effect === 'heal' && '治疗'}
                        {combo.effect === 'shield' && '护盾'}
                        {combo.effect === 'draw' && '抽牌'}
                        {combo.effect === 'lifesteal' && '吸血'}
                        {combo.effect === 'thorns' && '反伤'}
                        {combo.effect === 'absorb' && '吸收'}
                        {combo.effect === 'weakness' && '虚弱'}
                        {combo.effect === 'strength' && '强化'}
                        {combo.effectValue !== undefined && ` ${combo.effectValue}`}
                      </div>
                    )}
                    <div className="text-xs text-amber-400/80 mt-0.5">
                      ⏱️ 冷却 {combo.cooldown} 回合
                    </div>
                    {combo.canUpgrade && (
                      <div className="text-xs text-green-400 mt-0.5">
                        ⬆️ 可升级
                      </div>
                    )}
                  </div>
                  
                  {/* 稀有度指示 */}
                  <div className={cn(
                    'absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white/30',
                    combo.rarity === 'common' && 'bg-gray-500',
                    combo.rarity === 'rare' && 'bg-blue-500',
                    combo.rarity === 'epic' && 'bg-purple-500',
                    combo.rarity === 'legendary' && 'bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse',
                  )} title={combo.rarity} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-8 text-white/30 text-sm">
          选择两张元素卡牌 → 组合释放强力技能 → 击败对手
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
}
