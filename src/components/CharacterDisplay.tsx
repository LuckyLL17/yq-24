import { cn } from '@/lib/utils';
import HealthBar from './HealthBar';
import EnemyAvatar from './EnemyAvatar';
import ElementIcon from './ElementIcon';
import type { Combatant, EnemyTier, BossPhase, BossIntentType } from '@/types/game';

interface CharacterDisplayProps {
  character: Combatant;
  isPlayer?: boolean;
  showIntent?: boolean;
  intent?: BossIntentType;
  intentValue?: number;
  isShaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tier?: EnemyTier;
  bossPhase?: BossPhase;
  isBoss?: boolean;
  level?: number;
}

const STATUS_ICONS: Record<string, { icon: string; color: string; name: string; glow: string }> = {
  burn: { icon: '🔥', color: 'text-orange-400', name: '灼烧', glow: 'shadow-orange-500/50' },
  freeze: { icon: '❄️', color: 'text-cyan-300', name: '冻结', glow: 'shadow-cyan-500/50' },
  poison: { icon: '☠️', color: 'text-green-400', name: '中毒', glow: 'shadow-green-500/50' },
  stun: { icon: '💫', color: 'text-yellow-300', name: '眩晕', glow: 'shadow-yellow-500/50' },
  shield: { icon: '🛡️', color: 'text-amber-300', name: '护盾', glow: 'shadow-amber-500/50' },
  lifesteal: { icon: '🩸', color: 'text-pink-400', name: '吸血', glow: 'shadow-pink-500/50' },
  thorns: { icon: '🌵', color: 'text-orange-400', name: '反伤', glow: 'shadow-orange-500/50' },
  absorb: { icon: '💠', color: 'text-cyan-400', name: '吸收', glow: 'shadow-cyan-500/50' },
  weakness: { icon: '💔', color: 'text-red-400', name: '虚弱', glow: 'shadow-red-500/50' },
  strength: { icon: '💪', color: 'text-yellow-400', name: '强化', glow: 'shadow-yellow-500/50' },
  heal: { icon: '💚', color: 'text-green-400', name: '治疗', glow: 'shadow-green-500/50' },
  draw: { icon: '🃏', color: 'text-blue-400', name: '抽牌', glow: 'shadow-blue-500/50' },
};

const INTENT_INFO: Record<BossIntentType, { icon: string; color: string; bg: string; border: string; glow: string }> = {
  attack: { icon: '⚔️', color: 'text-red-300', bg: 'from-red-950/90 to-red-900/90', border: 'border-red-500/60', glow: 'shadow-red-500/30' },
  defend: { icon: '🛡️', color: 'text-blue-300', bg: 'from-blue-950/90 to-blue-900/90', border: 'border-blue-500/60', glow: 'shadow-blue-500/30' },
  buff: { icon: '✨', color: 'text-purple-300', bg: 'from-purple-950/90 to-purple-900/90', border: 'border-purple-500/60', glow: 'shadow-purple-500/30' },
  debuff: { icon: '💀', color: 'text-green-300', bg: 'from-green-950/90 to-emerald-900/90', border: 'border-green-500/60', glow: 'shadow-green-500/30' },
};

function PlayerAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };
  
  return (
    <div className={cn('relative flex items-center justify-center', sizes[size])}>
      {/* 魔法阵背景 */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-blue-400/30"
        style={{ animation: 'magicCircle 10s linear infinite' }}
      >
        <div className="absolute inset-2 rounded-full border border-purple-400/20" />
        <div className="absolute inset-4 rounded-full border border-blue-300/15" />
      </div>
      
      {/* 四元素环绕 */}
      <div className="absolute inset-0" style={{ animation: 'spin 20s linear infinite' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
          <div className="w-4 h-4">
            <ElementIcon element="fire" size="sm" animate={false} />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
          <div className="w-4 h-4">
            <ElementIcon element="water" size="sm" animate={false} />
          </div>
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1">
          <div className="w-4 h-4">
            <ElementIcon element="earth" size="sm" animate={false} />
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
          <div className="w-4 h-4">
            <ElementIcon element="wind" size="sm" animate={false} />
          </div>
        </div>
      </div>
      
      {/* 中央水晶 */}
      <div 
        className="relative z-10"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <div className={cn(
          'rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500',
          'shadow-2xl shadow-purple-500/50',
          size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : 'w-20 h-20',
        )}>
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-white font-black', size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl')}>
              ✦
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharacterDisplay({
  character,
  isPlayer = false,
  showIntent = false,
  intent,
  intentValue,
  isShaking = false,
  size = 'md',
  tier = 'common',
  bossPhase,
  isBoss = false,
  level,
}: CharacterDisplayProps) {
  const sizeConfig = {
    sm: {
      avatar: 'w-20 h-20',
      name: 'text-xs',
      healthbar: 'w-32',
      avatarSize: 'sm' as const,
    },
    md: {
      avatar: 'w-28 h-28',
      name: 'text-sm',
      healthbar: 'w-44',
      avatarSize: 'md' as const,
    },
    lg: {
      avatar: 'w-36 h-36',
      name: 'text-base',
      healthbar: 'w-56',
      avatarSize: 'lg' as const,
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-2.5',
        isShaking && 'animate-shake'
      )}
    >
      {/* 意图指示器 */}
      {showIntent && intent && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30">
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              `bg-gradient-to-r ${INTENT_INFO[intent].bg}`,
              `border ${INTENT_INFO[intent].border}`,
              `shadow-lg ${INTENT_INFO[intent].glow}`,
              'backdrop-blur-sm'
            )}
          >
            <span className="text-base">{INTENT_INFO[intent].icon}</span>
            <span className={cn('font-bold text-sm', INTENT_INFO[intent].color)}>
              {intentValue}
            </span>
          </div>
        </div>
      )}

      {/* 头像外发光 */}
      <div
        className={cn(
          'absolute -inset-3 rounded-full blur-2xl opacity-40',
          isPlayer
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-gradient-to-br from-red-500 to-orange-600',
          'animate-pulse'
        )}
        style={{ animationDuration: '3s' }}
      />

      {/* 头像主体容器 */}
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center overflow-visible',
          config.avatar
        )}
      >
        {/* 金属边框 */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-br from-amber-300 via-yellow-600 to-amber-800',
            'p-[3px]'
          )}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
        </div>

        {/* 内部高光 */}
        <div
          className={cn(
            'absolute inset-1.5 rounded-full',
            'bg-gradient-to-br from-white/5 to-transparent',
            'pointer-events-none'
          )}
        />

        {/* 角色头像 */}
        <div className="relative z-10">
          {isPlayer ? (
            <PlayerAvatar size={config.avatarSize} />
          ) : character.avatarType ? (
            <EnemyAvatar type={character.avatarType} size={config.avatarSize} animate tier={tier} bossPhase={bossPhase} />
          ) : (
            <span className={cn('text-5xl drop-shadow-lg')} style={{ animation: 'float 4s ease-in-out infinite' }}>
              {character.image}
            </span>
          )}
        </div>

        {/* 状态效果图标 */}
        {character.statusEffects.length > 0 && (
          <div className="absolute -bottom-1 -right-0 flex gap-1 z-30">
            {character.statusEffects.slice(0, 3).map((effect, index) => (
              <div
                key={index}
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-sm',
                  'bg-gradient-to-br from-slate-700 to-slate-900',
                  'border-2 border-slate-500/60',
                  `shadow-lg ${STATUS_ICONS[effect.type].glow}`,
                  'animate-bounce'
                )}
                title={`${STATUS_ICONS[effect.type].name}: ${effect.value} (${effect.duration}回合)`}
                style={{ animationDelay: `${index * 0.15}s`, animationDuration: '1.5s' }}
              >
                <span className={cn(STATUS_ICONS[effect.type].color, 'drop-shadow-sm')}>
                  {STATUS_ICONS[effect.type].icon}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 护盾显示 */}
        {character.shield > 0 && (
          <div className="absolute -top-1 -right-1 z-30">
            <div 
              className={cn(
                'rounded-full flex items-center justify-center font-black text-amber-900',
                'bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600',
                'border-2 border-amber-100/80',
                'shadow-lg shadow-amber-500/50',
                'animate-shield-pulse',
                size === 'sm' ? 'w-7 h-7 text-xs' : size === 'md' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base'
              )}
            >
              {character.shield}
            </div>
          </div>
        )}
      </div>

      {/* 角色名称 */}
      <div className="text-center">
        {!isPlayer && (
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className={cn(
              'text-xs font-bold px-2 py-0.5 rounded',
              tier === 'boss' && 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
              tier === 'elite' && 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
              tier === 'common' && 'bg-slate-600 text-slate-200',
            )}>
              {tier === 'boss' && '👑 BOSS'}
              {tier === 'elite' && '⭐ 精英'}
              {tier === 'common' && '普通'}
            </span>
            {level !== undefined && (
              <span className="text-xs text-amber-300 font-bold">
                Lv.{level}
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
            isBoss && 'text-amber-300',
            config.name
          )}
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {character.name}
        </div>
        {isBoss && bossPhase && (
          <div className="text-xs text-amber-400/80 mt-0.5">
            阶段 {bossPhase}
          </div>
        )}
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
