import { cn } from '@/lib/utils';
import type { ComboSkill } from '@/types/game';
import { ELEMENTS } from '@/data/gameData';

interface ComboEffectProps {
  combo: ComboSkill;
  show: boolean;
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-600',
};

const RARITY_GLOW = {
  common: 'shadow-gray-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-amber-500/50',
};

export default function ComboEffect({ combo, show }: ComboEffectProps) {
  if (!show) return null;

  const e1 = ELEMENTS[combo.elements[0]];
  const e2 = ELEMENTS[combo.elements[1]];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative animate-combo-popup">
        <div
          className={cn(
            'absolute inset-0 blur-3xl opacity-60 rounded-full',
            `bg-gradient-to-r ${RARITY_COLORS[combo.rarity]}`
          )}
          style={{ animation: 'pulse 1s infinite' }}
        />

        <div
          className={cn(
            'relative px-16 py-10 rounded-3xl',
            'bg-gradient-to-br from-slate-800/95 to-slate-900/95',
            'border-2 border-white/20',
            'shadow-2xl',
            RARITY_GLOW[combo.rarity]
          )}
        >
          <div className="absolute -top-3 -left-3 text-5xl animate-spin-slow" style={{ animationDuration: '3s' }}>
            {e1.icon}
          </div>
          <div className="absolute -top-3 -right-3 text-5xl animate-spin-slow" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
            {e2.icon}
          </div>

          <div className="text-center">
            <div
              className={cn(
                'text-sm font-bold tracking-widest mb-2',
                `bg-gradient-to-r ${RARITY_COLORS[combo.rarity]} bg-clip-text text-transparent`
              )}
            >
              {combo.rarity.toUpperCase()}
            </div>

            <h2 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
              {combo.name}
            </h2>

            <div className="flex items-center justify-center gap-4 my-4">
              <span className="text-4xl">{e1.icon}</span>
              <span className="text-2xl text-white/50">+</span>
              <span className="text-4xl">{e2.icon}</span>
              <span className="text-2xl text-white/50">=</span>
              <span className="text-3xl">⚡</span>
            </div>

            <p className="text-white/70 text-lg mb-4">{combo.description}</p>

            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-red-400">{combo.damage}</div>
                <div className="text-xs text-white/50">伤害</div>
              </div>
              {combo.effect && (
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400">{combo.effectValue}</div>
                  <div className="text-xs text-white/50">{combo.effect}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          >
            {Math.random() > 0.5 ? e1.icon : e2.icon}
          </div>
        ))}
      </div>
    </div>
  );
}
