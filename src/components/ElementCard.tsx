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
        disabled && 'opacity-50 cursor-not-allowed grayscale'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* 外发光效果 */}
      <div
        className={cn(
          'absolute -inset-2 rounded-2xl blur-lg opacity-60 transition-opacity duration-300',
          `bg-gradient-to-br ${element.gradient}`,
          isSelected ? 'opacity-100' : 'group-hover:opacity-80 opacity-40'
        )}
        style={{ animation: 'pulse 2.5s ease-in-out infinite' }}
      />

      {/* 卡牌主体 - 边框 */}
      <div
        className={cn(
          'relative h-full w-full rounded-xl overflow-hidden',
          equippedBorder
            ? equippedBorder.borderStyle + ' p-0'
            : 'bg-gradient-to-b from-amber-200 via-yellow-600 to-amber-900 p-[2px]'
        )}
        style={equippedBorder ? {
          boxShadow: `0 0 20px ${equippedBorder.glowColor}, inset 0 0 20px ${equippedBorder.glowColor}30`,
          animation: 'pulse 2.5s ease-in-out infinite',
        } : {}}
      >
        {/* 内部深色区域 */}
        <div className="relative h-full w-full rounded-[10px] overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
          {/* 元素光晕背景 */}
          <div
            className={cn(
              'absolute inset-0 opacity-30',
              `bg-gradient-to-br ${element.gradient}`
            )}
          />

          {/* 装饰性花纹 - 顶部 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-amber-500/20 to-transparent rounded-b-full" />
          
          {/* 装饰性花纹 - 底部 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-t from-amber-500/15 to-transparent rounded-t-full" />

          {/* 力量值宝石 */}
          <div
            className={cn(
              'absolute top-2 left-2 z-20',
              powerSizes[size],
              'rounded-full',
              'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700',
              'border-2 border-amber-200/60',
              'flex items-center justify-center font-black text-amber-900',
              'shadow-lg shadow-amber-500/50'
            )}
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
                'shadow-md'
              )}
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            />
          </div>

          {/* 中央元素图标区域 */}
          <div className="absolute inset-0 flex items-center justify-center pt-8 pb-20">
            {/* 魔法阵背景 */}
            <div
              className="absolute w-3/4 aspect-square rounded-full opacity-20"
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
              {/* 四角装饰 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
            </div>

            {/* 元素图标 */}
            <div
              className="relative z-10 transition-transform duration-300 group-hover:scale-110"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <ElementIcon element={card.element} size={iconSizes[size]} animate />
            </div>

            {/* 粒子效果 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${40 + Math.sin(i) * 20}%`,
                    backgroundColor: element.color,
                    opacity: 0.6,
                    animation: `float ${2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    boxShadow: `0 0 6px ${element.color}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* 卡牌名称横幅 */}
          <div className="absolute bottom-12 left-0 right-0 z-10">
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-gradient-to-r from-amber-900/90 via-amber-800/95 to-amber-900/90" />
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
              <div className="absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
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
              <div className="bg-slate-900/90 rounded-md px-2 py-1.5 border border-amber-700/30">
                <p
                  className={cn(
                    'text-center text-white/80 leading-tight',
                    descSizes[size]
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
            {/* 斜向光扫效果 */}
            <div 
              className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:left-full transition-all duration-1000"
            />
          </div>

          {/* 选中时的金色光环 */}
          {isSelected && (
            <>
              <div className="absolute inset-0 rounded-[10px] ring-4 ring-yellow-400 ring-opacity-90 animate-pulse" />
              <div className="absolute inset-0 rounded-[10px] bg-gradient-to-t from-yellow-400/20 to-transparent" />
            </>
          )}
        </div>
      </div>

      {/* 稀有度底部标签 */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
        <div
          className={cn(
            'px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wider',
            `bg-gradient-to-r ${RARITY_BG[card.rarity]}`,
            'border border-white/30 shadow-md'
          )}
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {RARITY_NAMES[card.rarity]}
        </div>
      </div>
    </div>
  );
}
