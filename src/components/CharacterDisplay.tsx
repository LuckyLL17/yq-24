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
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_ICONS: Record<StatusEffect['type'], { icon: string; color: string; name: string }> = {
  burn: { icon: '🔥', color: 'text-orange-500', name: '灼烧' },
  freeze: { icon: '❄️', color: 'text-cyan-400', name: '冻结' },
  poison: { icon: '☠️', color: 'text-green-500', name: '中毒' },
  stun: { icon: '💫', color: 'text-yellow-400', name: '眩晕' },
  shield: { icon: '🛡️', color: 'text-amber-400', name: '护盾' },
};

const INTENT_INFO = {
  attack: { icon: '⚔️', color: 'text-red-400', bg: 'from-red-900/80 to-red-800/80', border: 'border-red-500/50' },
  defend: { icon: '🛡️', color: 'text-blue-400', bg: 'from-blue-900/80 to-blue-800/80', border: 'border-blue-500/50' },
  buff: { icon: '✨', color: 'text-purple-400', bg: 'from-purple-900/80 to-purple-800/80', border: 'border-purple-500/50' },
};

export default function CharacterDisplay({
  character,
  isPlayer = false,
  showIntent = false,
  intent,
  intentValue,
  isShaking = false,
  size = 'md',
}: CharacterDisplayProps) {
  const sizeConfig = {
    sm: {
      avatar: 'w-20 h-20',
      icon: 'text-4xl',
      name: 'text-sm',
      healthbar: 'w-36',
    },
    md: {
      avatar: 'w-28 h-28',
      icon: 'text-5xl',
      name: 'text-base',
      healthbar: 'w-48',
    },
    lg: {
      avatar: 'w-36 h-36',
      icon: 'text-7xl',
      name: 'text-lg',
      healthbar: 'w-56',
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-3',
        isShaking && 'animate-shake'
      )}
    >
      {/* 意图指示器 */}
      {showIntent && intent && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              `bg-gradient-to-r ${INTENT_INFO[intent].bg}`,
              `border ${INTENT_INFO[intent].border}`,
              'shadow-lg'
            )}
          >
            <span className="text-lg">{INTENT_INFO[intent].icon}</span>
            <span className={cn('font-bold text-sm', INTENT_INFO[intent].color)}>
              {intentValue}
            </span>
          </div>
        </div>
      )}

      {/* 头像外发光 */}
      <div
        className={cn(
          'absolute inset-0 -m-2 rounded-full blur-xl opacity-50',
          isPlayer
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-gradient-to-br from-red-500 to-orange-600',
          'animate-pulse'
        )}
        style={{ animationDuration: '3s' }}
      />

      {/* 头像主体 */}
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          config.avatar,
          'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
          'border-4',
          isPlayer ? 'border-blue-500/60' : 'border-red-500/60',
          'shadow-2xl shadow-black/50'
        )}
      >
        {/* 金属边框高光 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'border-2 border-white/10',
            'bg-gradient-to-br from-white/5 to-transparent'
          )}
        />

        {/* 内部光晕 */}
        <div
          className={cn(
            'absolute inset-2 rounded-full',
            isPlayer
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
              : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
          )}
        />

        {/* 角色图标 */}
        <span
          className={cn(
            'relative z-10 drop-shadow-lg',
            config.icon
          )}
          style={{ 
            animation: 'float 4s ease-in-out infinite',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
          }}
        >
          {character.image}
        </span>

        {/* 状态效果图标 */}
        {character.statusEffects.length > 0 && (
          <div className="absolute -bottom-1 -right-1 flex gap-0.5 z-20">
            {character.statusEffects.slice(0, 3).map((effect, index) => (
              <div
                key={index}
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                  'bg-slate-800 border border-slate-600',
                  'shadow-lg',
                  'animate-pulse'
                )}
                title={`${STATUS_ICONS[effect.type].name}: ${effect.value} (${effect.duration}回合)`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {STATUS_ICONS[effect.type].icon}
              </div>
            ))}
          </div>
        )}

        {/* 护盾显示 */}
        {character.shield > 0 && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 flex items-center justify-center text-sm font-black text-amber-900 border-2 border-amber-200 shadow-lg animate-shield-pulse">
              {character.shield}
            </div>
          </div>
        )}
      </div>

      {/* 角色名称 */}
      <div className="text-center">
        <div
          className={cn(
            'font-bold text-white drop-shadow-lg text-stroke',
            config.name
          )}
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {character.name}
        </div>
      </div>

      {/* 生命值条 */}
      <div className={config.healthbar}>
        <HealthBar
          current={character.hp}
          max={character.maxHp}
          shield={character.shield}
          size="md"
          color={isPlayer ? 'green' : 'red'}
        />
      </div>
    </div>
  );
}
