import { cn } from '@/lib/utils';
import type { ComboSkill } from '@/types/game';
import { ELEMENTS, RARITY_BG } from '@/data/gameData';

interface ComboEffectProps {
  combo: ComboSkill;
  show: boolean;
}

const RARITY_GLOW = {
  common: 'shadow-gray-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-amber-500/70',
};

const EFFECT_BACKGROUNDS: Record<string, string> = {
  firestorm: 'from-orange-600/30 via-red-600/30 to-rose-700/30',
  vinewrap: 'from-green-600/30 via-emerald-600/30 to-teal-700/30',
  steamburst: 'from-cyan-500/30 via-blue-500/30 to-indigo-600/30',
  sandstorm: 'from-amber-600/30 via-orange-700/30 to-stone-700/30',
  lavaeruption: 'from-red-600/30 via-orange-600/30 to-amber-700/30',
  icestorm: 'from-cyan-400/30 via-blue-500/30 to-indigo-600/30',
  thunderstrike: 'from-violet-600/30 via-purple-600/30 to-fuchsia-700/30',
  holylight: 'from-yellow-400/30 via-amber-500/30 to-orange-600/30',
  shadowflame: 'from-purple-700/30 via-indigo-800/30 to-slate-900/30',
  thundercloud: 'from-slate-600/30 via-violet-600/30 to-purple-700/30',
  prismbeam: 'from-yellow-400/30 via-cyan-500/30 to-pink-500/30',
  voidstorm: 'from-indigo-800/30 via-purple-900/30 to-slate-900/30',
  earthquake: 'from-amber-700/30 via-orange-800/30 to-stone-800/30',
  divineguard: 'from-yellow-300/30 via-amber-400/30 to-yellow-500/30',
  shadowbind: 'from-slate-800/30 via-purple-900/30 to-indigo-900/30',
  galeforce: 'from-emerald-400/30 via-cyan-500/30 to-violet-500/30',
  blessing: 'from-yellow-300/30 via-green-400/30 to-cyan-400/30',
  darkwhisper: 'from-purple-800/30 via-slate-800/30 to-indigo-900/30',
  thunderbolt: 'from-violet-500/30 via-purple-600/30 to-fuchsia-700/30',
  solarflare: 'from-yellow-400/30 via-orange-500/30 to-red-600/30',
  abyssalvoid: 'from-slate-900/30 via-purple-900/30 to-indigo-900/30',
};

const RARITY_NAMES: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export default function ComboEffect({ combo, show }: ComboEffectProps) {
  if (!show) return null;

  const e1 = ELEMENTS[combo.elements[0]];
  const e2 = ELEMENTS[combo.elements[1]];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* 暗化背景 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />

      {/* 全屏光效背景 */}
      <div
        className={cn(
          'absolute inset-0 opacity-40',
          `bg-gradient-to-br ${EFFECT_BACKGROUNDS[combo.effectType] || 'from-purple-600/30 via-blue-600/30 to-indigo-700/30'}`
        )}
        style={{ animation: 'pulse 1s ease-in-out infinite' }}
      />

      {/* 魔法阵背景 */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20 border-4 border-current text-amber-400"
          style={{ animation: 'magicCircle 8s linear infinite' }}
        >
          <div className="absolute inset-8 rounded-full border-2 border-current opacity-60" />
          <div className="absolute inset-16 rounded-full border border-current opacity-40" />
          <div className="absolute inset-24 rounded-full border border-current opacity-20" />
        </div>
      </div>

      {/* 主内容 */}
      <div className="relative animate-combo-popup">
        {/* 外发光 */}
        <div
          className={cn(
            'absolute -inset-8 blur-3xl opacity-70 rounded-full',
            `bg-gradient-to-r ${RARITY_BG[combo.rarity]}`
          )}
          style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
        />

        {/* 卡牌框架 */}
        <div
          className={cn(
            'relative px-20 py-12 rounded-3xl',
            'bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95',
            'border-2 border-amber-500/40',
            'shadow-2xl',
            RARITY_GLOW[combo.rarity],
            'overflow-hidden'
          )}
        >
          {/* 背景元素光效 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br ${e1.gradient} opacity-20 blur-2xl`} />
            <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${e2.gradient} opacity-20 blur-2xl`} />
          </div>

          {/* 装饰角 */}
          <div className="absolute top-3 left-3 text-3xl animate-spin-slow" style={{ animationDuration: '6s' }}>
            {e1.icon}
          </div>
          <div className="absolute top-3 right-3 text-3xl animate-spin-slow" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            {e2.icon}
          </div>
          <div className="absolute bottom-3 left-3 text-2xl opacity-50">{e1.icon}</div>
          <div className="absolute bottom-3 right-3 text-2xl opacity-50">{e2.icon}</div>

          <div className="relative z-10 text-center">
            {/* 稀有度标签 */}
            <div className="mb-4">
              <span
                className={cn(
                  'inline-block px-6 py-1 rounded-full text-sm font-bold tracking-[0.3em]',
                  `bg-gradient-to-r ${RARITY_BG[combo.rarity]}`,
                  'text-white shadow-lg'
                )}
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                {RARITY_NAMES[combo.rarity]}
              </span>
            </div>

            {/* 技能名称 */}
            <h2
              className="text-5xl font-black text-white mb-4 text-gradient-gold"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {combo.name}
            </h2>

            {/* 元素组合展示 */}
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="relative">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-3xl',
                    `bg-gradient-to-br ${e1.gradient}`,
                    'shadow-lg shadow-black/50',
                    'border-2 border-white/30'
                  )}
                  style={{ animation: 'float 2s ease-in-out infinite' }}
                >
                  {e1.icon}
                </div>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${e1.gradient} blur-lg opacity-60 -z-10`} />
              </div>

              <span className="text-3xl text-amber-400 font-black">+</span>

              <div className="relative">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-3xl',
                    `bg-gradient-to-br ${e2.gradient}`,
                    'shadow-lg shadow-black/50',
                    'border-2 border-white/30'
                  )}
                  style={{ animation: 'float 2s ease-in-out infinite', animationDelay: '0.3s' }}
                >
                  {e2.icon}
                </div>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${e2.gradient} blur-lg opacity-60 -z-10`} />
              </div>

              <span className="text-3xl text-amber-400 font-black">=</span>

              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-lg shadow-amber-500/50 border-2 border-amber-200/50"
                  style={{ animation: 'pulse 1s ease-in-out infinite' }}
                >
                  ⚡
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 blur-xl opacity-60 -z-10 animate-pulse" />
              </div>
            </div>

            {/* 技能描述 */}
            <p className="text-white/80 text-lg mb-6 max-w-md mx-auto leading-relaxed">
              {combo.description}
            </p>

            {/* 属性数值 */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-black text-red-400 drop-shadow-lg">
                  {combo.damage}
                </div>
                <div className="text-sm text-white/50 mt-1">伤害</div>
              </div>

              {combo.effect && combo.effectValue && (
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
              )}

              {combo.effect && combo.effectValue && (
                <div className="text-center">
                  <div className="text-4xl font-black text-purple-400 drop-shadow-lg">
                    {combo.effectValue}
                  </div>
                  <div className="text-sm text-white/50 mt-1">
                    {combo.effect === 'burn' && '灼烧'}
                    {combo.effect === 'freeze' && '冻结'}
                    {combo.effect === 'poison' && '中毒'}
                    {combo.effect === 'stun' && '眩晕'}
                    {combo.effect === 'heal' && '治疗'}
                    {combo.effect === 'shield' && '护盾'}
                    {combo.effect === 'draw' && '抽牌'}
                  </div>
                </div>
              )}

              {combo.effectDuration && combo.effectDuration > 0 && (
                <>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
                  <div className="text-center">
                    <div className="text-4xl font-black text-cyan-400 drop-shadow-lg">
                      {combo.effectDuration}
                    </div>
                    <div className="text-sm text-white/50 mt-1">回合</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 粒子效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xl animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--tx': `${(Math.random() - 0.5) * 200}px`,
              '--ty': `${(Math.random() - 0.5) * 200}px`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random() * 1.5}s`,
            } as React.CSSProperties}
          >
            {[e1.icon, e2.icon, '✨', '⭐'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>
    </div>
  );
}
