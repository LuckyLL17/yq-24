import { cn } from '@/lib/utils';
import HealthBar from './HealthBar';
import type { Combatant, StatusEffect } from '@/types/game';

interface CharacterDisplayProps {
  character: Combatant;
  isPlayer?: boolean;
  showIntent?: boolean;
  intent?: 'attack' | 'defend' | 'buff';
  intentValue?: number;
  isShaking?: boolean;
}

const STATUS_ICONS: Record<StatusEffect['type'], { icon: string; color: string }> = {
  burn: { icon: '🔥', color: 'text-orange-500' },
  freeze: { icon: '❄️', color: 'text-cyan-400' },
  poison: { icon: '☠️', color: 'text-green-500' },
  stun: { icon: '💫', color: 'text-yellow-400' },
  shield: { icon: '🛡️', color: 'text-amber-400' },
};

export default function CharacterDisplay({
  character,
  isPlayer = false,
  showIntent = false,
  intent,
  intentValue,
  isShaking = false,
}: CharacterDisplayProps) {
  const intentIcons = {
    attack: '⚔️',
    defend: '🛡️',
    buff: '✨',
  };

  return (
    <div
      className={cn(
      'relative flex flex-col items-center gap-3',
      isShaking && 'animate-shake'
    )}
  >
    {showIntent && intent && (
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1.5 bg-red-900/80 rounded-full border border-red-500/50">
      <span className="text-lg">{intentIcons[intent]}</span>
      <span className="text-red-300 font-bold text-sm">{intentValue}</span>
    </div>
    )}

    <div
      className={cn(
        'relative w-28 h-28 rounded-full flex items-center justify-center text-6xl',
        'bg-gradient-to-br from-slate-700 to-slate-900',
        'border-4 border-slate-500/50',
        'shadow-2xl shadow-black/50',
        isPlayer ? 'border-blue-500/50' : 'border-red-500/50'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          isPlayer
            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
            : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
        )}
      />
      <span className="relative z-10 drop-shadow-lg" style={{ animation: 'float 4s ease-in-out infinite' }}>
        {character.image}
      </span>

      {character.statusEffects.length > 0 && (
        <div className="absolute -bottom-1 -right-1 flex gap-0.5">
          {character.statusEffects.slice(0, 3).map((effect, index) => (
            <div
              key={index}
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                'bg-slate-800 border border-slate-600',
                STATUS_ICONS[effect.type].color
              )}
              title={`${effect.type}: ${effect.value} (${effect.duration}回合)`}
            >
              {STATUS_ICONS[effect.type].icon}
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="text-center">
      <div className="text-white font-bold text-lg drop-shadow-lg">{character.name}</div>
    </div>

    <div className="w-48">
      <HealthBar current={character.hp} max={character.maxHp} shield={character.shield} />
    </div>
  </div>
  );
}
