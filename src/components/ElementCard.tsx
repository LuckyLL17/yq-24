import { cn } from '@/lib/utils';
import { ELEMENTS } from '@/data/gameData';
import type { Card } from '@/types/game';

interface ElementCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function ElementCard({
  card,
  isSelected = false,
  onClick,
  size = 'md',
  disabled = false,
}: ElementCardProps) {
  const element = ELEMENTS[card.element];

  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-28 h-40',
    lg: 'w-36 h-52',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'relative rounded-xl cursor-pointer transition-all duration-300 transform',
        sizeClasses[size],
        isSelected && 'scale-110 -translate-y-4 z-20',
        !disabled && !isSelected && 'hover:scale-105 hover:-translate-y-2',
        disabled && 'opacity-50 cursor-not-allowed grayscale'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-xl blur-md opacity-60',
          `bg-gradient-to-br ${element.gradient}`
        )}
        style={{ animation: 'pulse 2s infinite' }}
      />

      <div
        className={cn(
          'relative h-full w-full rounded-xl overflow-hidden',
          'border-2 border-white/20',
          'bg-gradient-to-br from-slate-800/90 to-slate-900/90',
          'shadow-lg shadow-black/30'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 opacity-30',
            `bg-gradient-to-br ${element.gradient}`
          )}
        />

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-gradient-to-br from-white/20 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-gradient-to-tl from-black/20 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-between p-2">
          <div className="w-full flex justify-between items-start">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                'bg-gradient-to-br from-amber-300 to-amber-600 text-amber-900',
                'border border-amber-200/50 shadow-md',
                size === 'sm' && 'w-5 h-5 text-[10px]'
              )}
            >
              {card.power}
            </div>
            <div
              className={cn(
                'text-lg drop-shadow-lg',
                size === 'sm' && 'text-base'
              )}
            >
              {element.icon}
            </div>
          </div>

          <div
            className={cn(
              'text-4xl filter drop-shadow-lg',
              size === 'sm' && 'text-2xl',
              size === 'lg' && 'text-6xl'
            )}
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.3)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            {element.icon}
          </div>

          <div className="text-center">
            <div
              className={cn(
                'font-bold text-white drop-shadow-lg tracking-wide',
                size === 'sm' && 'text-xs',
                size === 'md' && 'text-sm',
                size === 'lg' && 'text-lg'
              )}
            >
              {card.name}元素
            </div>
            <div
              className={cn(
                'text-white/60 mt-0.5',
                size === 'sm' && 'text-[10px]',
                size === 'md' && 'text-xs',
                size === 'lg' && 'text-sm'
              )}
            >
              {card.description}
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="absolute inset-0 rounded-xl ring-4 ring-yellow-400 ring-opacity-80 animate-pulse" />
        )}
      </div>
    </div>
  );
}
