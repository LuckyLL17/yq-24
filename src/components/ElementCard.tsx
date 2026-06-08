import { cn } from '@/lib/utils';
import { ELEMENTS, RARITY_BG, CARD_BORDERS } from '@/data/gameData';
import ElementIcon from './ElementIcon';
import type { Card, CardBorder } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface ElementCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showDetails?: boolean;
  animationDelay?: number;
}

const RARITY_NAMES: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

const RARITY_GEM_COLORS: Record<string, string> = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-300 via-yellow-500 to-orange-500',
};

const RARITY_BORDER_STYLES: Record<string, string> = {
  common: 'border-2 border-gray-500/50',
  rare: 'border-2 border-blue-400/70',
  epic: 'border-2 border-purple-400/80',
  legendary: 'border-2 border-amber-400/90',
};

const RARITY_GLOW_INTENSITY: Record<string, string> = {
  common: 'opacity-30',
  rare: 'opacity-50',
  epic: 'opacity-70',
  legendary: 'opacity-90',
};

const RARITY_PARTICLE_COUNT: Record<string, number> = {
  common: 3,
  rare: 5,
  epic: 8,
  legendary: 12,
};

const RARITY_FRAME_DECORATION: Record<string, boolean> = {
  common: false,
  rare: false,
  epic: true,
  legendary: true,
};

export default function ElementCard({
  card,
  isSelected = false,
  onClick,
  size = 'md',
  disabled = false,
  showDetails = true,
  animationDelay = 0,
  useBorder,
}: ElementCardProps & { useBorder?: CardBorder | null }) {
  const element = ELEMENTS[card.element];
  const { getEquippedCardBorderData } = useGameStore();
  const equippedBorder = useBorder !== undefined ? useBorder : getEquippedCardBorderData();

  const sizeClasses = {
    sm: 'w-24 h-36',
    md: 'w-36 h-52',
    lg: 'w-48 h-72',
  };

  const iconSizes = {
    sm: 'sm',
    md: 'lg',
    lg: 'xl',
  } as const;

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const descSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  const powerSizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const gemSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'relative cursor-pointer transition-all duration-300 transform group',
        sizeClasses[size],
        isSelected && 'scale-110 -translate-y-6 z-30',
        !disabled && !isSelected && 'hover:scale-105 hover:-translate-y-3 hover:z-20',
        disabled && 'opacity-50 cursor-not-allowed grayscale',
        card.rarity === 'legendary' && 'rarity-legendary',
        card.rarity === 'epic' && 'rarity-epic'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* 外发光效果 - 按稀有度增强 */}
      <div
        className={cn(
          'absolute -inset-2 rounded-2xl blur-lg transition-opacity duration-300',
          `bg-gradient-to-br ${element.gradient}`,
          RARITY_GLOW_INTENSITY[card.rarity],
          isSelected ? 'opacity-100' : 'group-hover:opacity-80'
        )}
        style={{ 
          animation: card.rarity === 'legendary' 
            ? 'pulse 1.5s ease-in-out infinite' 
            : card.rarity === 'epic' 
            ? 'pulse 2s ease-in-out infinite'
            : 'pulse 2.5s ease-in-out infinite' 
        }}
      />

      {/* 传说卡牌的额外光晕 */}
      {card.rarity === 'legendary' && (
        <div
          className="absolute -inset-4 rounded-3xl blur-xl opacity-40"
          style={{
            background: `radial-gradient(circle, ${element.color} 0%, transparent 70%)`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* 卡牌主体 - 边框 */}
      <div
        className={cn(
          'relative h-full w-full rounded-xl overflow-hidden',
          equippedBorder
            ? equippedBorder.borderStyle + ' p-0'
            : RARITY_BORDER_STYLES[card.rarity] + ' p-[2px]',
          card.rarity === 'epic' && !equippedBorder && 'card-epic-border',
          card.rarity === 'legendary' && !equippedBorder && 'card-legendary-border'
        )}
        style={equippedBorder ? {
          boxShadow: `0 0 20px ${equippedBorder.glowColor}, inset 0 0 20px ${equippedBorder.glowColor}30`,
          animation: 'pulse 2.5s ease-in-out infinite',
        } : {}}
      >
        {/* 内部深色区域 */}
        <div className="relative h-full w-full rounded-[10px] overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
          {/* 元素光晕背景 - 按稀有度增强 */}
          <div
            className={cn(
              'absolute inset-0',
              `bg-gradient-to-br ${element.gradient}`,
              card.rarity === 'common' && 'opacity-20',
              card.rarity === 'rare' && 'opacity-30',
              card.rarity === 'epic' && 'opacity-40',
              card.rarity === 'legendary' && 'opacity-50'
            )}
          />

          {/* 传说卡牌的动态纹理 */}
          {card.rarity === 'legendary' && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${element.color}20 10px, ${element.color}20 20px)`,
                animation: 'magicCircle 20s linear infinite',
              }}
            />
          )}

          {/* 装饰性花纹 - 顶部 */}
          <div className={cn(
            'absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b rounded-b-full',
            card.rarity === 'legendary' 
              ? 'from-amber-400/30 to-transparent'
              : card.rarity === 'epic'
              ? 'from-purple-400/25 to-transparent'
              : card.rarity === 'rare'
              ? 'from-blue-400/20 to-transparent'
              : 'from-amber-500/20 to-transparent'
          )} />
          
          {/* 装饰性花纹 - 底部 */}
          <div className={cn(
            'absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-t rounded-t-full',
            card.rarity === 'legendary' 
              ? 'from-amber-400/25 to-transparent'
              : card.rarity === 'epic'
              ? 'from-purple-400/20 to-transparent'
              : card.rarity === 'rare'
              ? 'from-blue-400/15 to-transparent'
              : 'from-amber-500/15 to-transparent'
          )} />

          {/* 史诗及以上卡牌的角落装饰 */}
          {RARITY_FRAME_DECORATION[card.rarity] && (
            <>
              <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
              <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
            </>
          )}

          {/* 力量值宝石 */}
          <div
            className={cn(
              'absolute top-2 left-2 z-20',
              powerSizes[size],
              'rounded-full',
              card.rarity === 'legendary'
                ? 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 ring-2 ring-amber-300/50'
                : card.rarity === 'epic'
                ? 'bg-gradient-to-br from-purple-300 via-purple-500 to-purple-700 ring-2 ring-purple-300/40'
                : card.rarity === 'rare'
                ? 'bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 ring-1 ring-blue-300/30'
                : 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700',
              'border-2 border-amber-200/60',
              'flex items-center justify-center font-black',
              'shadow-lg',
              card.rarity === 'legendary' && 'shadow-amber-500/70',
              card.rarity === 'epic' && 'shadow-purple-500/50',
              card.rarity === 'rare' && 'shadow-blue-500/40',
              card.rarity === 'common' && 'shadow-amber-500/50'
            )}
            style={{ 
              color: card.rarity === 'epic' ? '#1e1b4b' : 
                     card.rarity === 'rare' ? '#0c4a6e' : '#78350f',
              animation: card.rarity === 'legendary' ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          >
            {card.power}
          </div>

          {/* 稀有度宝石 */}
          <div className="absolute top-2 right-2 z-20">
            <div
              className={cn(
                gemSizes[size],
                'rounded-full',
                `bg-gradient-to-br ${RARITY_GEM_COLORS[card.rarity]}`,
                'border border-white/40',
                'shadow-md',
                card.rarity === 'legendary' && 'shadow-amber-400/60',
                card.rarity === 'epic' && 'shadow-purple-400/50',
                card.rarity === 'rare' && 'shadow-blue-400/40'
              )}
              style={{ 
                animation: card.rarity === 'legendary' 
                  ? 'pulse 1.5s ease-in-out infinite' 
                  : card.rarity === 'epic'
                  ? 'pulse 2s ease-in-out infinite'
                  : 'pulse 2.5s ease-in-out infinite'
              }}
            />
          </div>

          {/* 中央元素图标区域 */}
          <div className="absolute inset-0 flex items-center justify-center pt-8 pb-20">
            {/* 魔法阵背景 - 按稀有度增强 */}
            <div
              className={cn(
                'absolute aspect-square rounded-full',
                card.rarity === 'common' && 'w-1/2 opacity-15',
                card.rarity === 'rare' && 'w-2/3 opacity-20',
                card.rarity === 'epic' && 'w-3/4 opacity-25',
                card.rarity === 'legendary' && 'w-4/5 opacity-35'
              )}
              style={{ 
                animation: 'magicCircle 12s linear infinite',
                border: `2px solid ${element.color}`,
              }}
            >
              <div 
                className="absolute inset-2 rounded-full border border-current opacity-50"
                style={{ borderColor: element.color }}
              />
              <div 
                className="absolute inset-4 rounded-full border border-current opacity-30"
                style={{ borderColor: element.color }}
              />
              {card.rarity === 'epic' || card.rarity === 'legendary' ? (
                <div 
                  className="absolute inset-6 rounded-full border border-current opacity-20"
                  style={{ borderColor: element.color }}
                />
              ) : null}
              {/* 四角装饰 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
            </div>

            {/* 元素图标 */}
            <div
              className="relative z-10 transition-transform duration-300 group-hover:scale-110"
              style={{ 
                animation: card.rarity === 'legendary' 
                  ? 'float 2s ease-in-out infinite' 
                  : 'float 3s ease-in-out infinite' 
              }}
            >
              <ElementIcon element={card.element} size={iconSizes[size]} animate />
            </div>

            {/* 粒子效果 - 按稀有度增加数量 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(RARITY_PARTICLE_COUNT[card.rarity])].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${15 + i * (70 / RARITY_PARTICLE_COUNT[card.rarity])}%`,
                    top: `${35 + Math.sin(i * 0.8) * 25}%`,
                    width: card.rarity === 'legendary' ? '3px' : card.rarity === 'epic' ? '2.5px' : '2px',
                    height: card.rarity === 'legendary' ? '3px' : card.rarity === 'epic' ? '2.5px' : '2px',
                    backgroundColor: element.color,
                    opacity: card.rarity === 'legendary' ? 0.8 : 0.6,
                    animation: `float ${card.rarity === 'legendary' ? 1.5 : 2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.25}s`,
                    boxShadow: `0 0 ${card.rarity === 'legendary' ? '10px' : '6px'} ${element.color}`,
                  }}
                />
              ))}
            </div>

            {/* 传说卡牌的额外星光粒子 */}
            {card.rarity === 'legendary' && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="absolute w-1.5 h-1.5 bg-white rounded-full"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${25 + (i % 3) * 20}%`,
                      opacity: 0,
                      animation: `sparkle ${2 + i * 0.4}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                      boxShadow: '0 0 8px white, 0 0 15px rgba(255,255,255,0.8)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 卡牌名称横幅 - 按稀有度变化 */}
          <div className="absolute bottom-12 left-0 right-0 z-10">
            <div className="relative">
              <div className={cn(
                'absolute inset-x-0 top-1/2 -translate-y-1/2 h-6',
                card.rarity === 'legendary' 
                  ? 'bg-gradient-to-r from-amber-900/95 via-amber-700/95 to-amber-900/95'
                  : card.rarity === 'epic'
                  ? 'bg-gradient-to-r from-purple-900/90 via-purple-700/90 to-purple-900/90'
                  : card.rarity === 'rare'
                  ? 'bg-gradient-to-r from-blue-900/85 via-blue-700/85 to-blue-900/85'
                  : 'bg-gradient-to-r from-amber-900/90 via-amber-800/95 to-amber-900/90'
              )} />
              <div className={cn(
                'absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent to-transparent',
                card.rarity === 'legendary' && 'via-amber-300/80',
                card.rarity === 'epic' && 'via-purple-300/70',
                card.rarity === 'rare' && 'via-blue-300/60',
                card.rarity === 'common' && 'via-amber-400/70'
              )} />
              <div className={cn(
                'absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent',
                card.rarity === 'legendary' && 'via-amber-500/60',
                card.rarity === 'epic' && 'via-purple-500/50',
                card.rarity === 'rare' && 'via-blue-500/40',
                card.rarity === 'common' && 'via-amber-600/50'
              )} />
              <div
                className={cn(
                  'relative text-center font-bold text-white text-stroke py-1',
                  titleSizes[size]
                )}
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                {card.name}
              </div>
            </div>
          </div>

          {/* 描述区域 */}
          {showDetails && (
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <div className={cn(
                'rounded-md px-2 py-1.5 border',
                card.rarity === 'legendary' 
                  ? 'bg-amber-900/40 border-amber-500/40'
                  : card.rarity === 'epic'
                  ? 'bg-purple-900/40 border-purple-500/30'
                  : card.rarity === 'rare'
                  ? 'bg-blue-900/30 border-blue-500/20'
                  : 'bg-slate-900/90 border-amber-700/30'
              )}>
                <p
                  className={cn(
                    'text-center leading-tight',
                    descSizes[size],
                    card.rarity === 'legendary' ? 'text-amber-100' :
                    card.rarity === 'epic' ? 'text-purple-100' :
                    card.rarity === 'rare' ? 'text-blue-100' :
                    'text-white/80'
                  )}
                >
                  {card.description}
                </p>
              </div>
            </div>
          )}

          {/* 高光效果 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/20 via-white/5 to-transparent"
              style={{ borderRadius: '10px 0 0 0' }}
            />
            <div
              className="absolute bottom-0 right-0 w-1/3 h-1/4 bg-gradient-to-tl from-black/30 to-transparent"
              style={{ borderRadius: '0 0 10px 0' }}
            />
            {/* 斜向光扫效果 - 传说卡牌持续 */}
            {card.rarity === 'legendary' ? (
              <div className="legendary-shine-effect" />
            ) : (
              <div 
                className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:left-full transition-all duration-1000"
              />
            )}
          </div>

          {/* 选中时的光环效果 - 按稀有度变化 */}
          {isSelected && (
            <>
              <div className={cn(
                'absolute inset-0 rounded-[10px] ring-4 animate-pulse',
                card.rarity === 'legendary' && 'ring-amber-400 ring-opacity-90',
                card.rarity === 'epic' && 'ring-purple-400 ring-opacity-80',
                card.rarity === 'rare' && 'ring-blue-400 ring-opacity-70',
                card.rarity === 'common' && 'ring-yellow-400 ring-opacity-90'
              )} />
              <div className={cn(
                'absolute inset-0 rounded-[10px] bg-gradient-to-t to-transparent',
                card.rarity === 'legendary' && 'from-amber-400/30',
                card.rarity === 'epic' && 'from-purple-400/25',
                card.rarity === 'rare' && 'from-blue-400/20',
                card.rarity === 'common' && 'from-yellow-400/20'
              )} />
            </>
          )}

          {/* 传说卡牌的底部光芒 */}
          {card.rarity === 'legendary' && (
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 opacity-60"
              style={{
                background: `radial-gradient(ellipse at center bottom, ${element.color} 0%, transparent 70%)`,
              }}
            />
          )}
        </div>
      </div>

      {/* 稀有度底部标签 */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
        <div
          className={cn(
            'px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wider',
            `bg-gradient-to-r ${RARITY_BG[card.rarity]}`,
            'border border-white/30 shadow-md',
            card.rarity === 'legendary' && 'shadow-amber-500/50',
            card.rarity === 'epic' && 'shadow-purple-500/40',
            card.rarity === 'rare' && 'shadow-blue-500/30'
          )}
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {RARITY_NAMES[card.rarity]}
        </div>
      </div>

      {/* 传说卡牌的顶部皇冠 */}
      {card.rarity === 'legendary' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <div 
            className="text-2xl"
            style={{ 
              animation: 'float 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))',
            }}
          >
            👑
          </div>
        </div>
      )}
    </div>
  );
}
