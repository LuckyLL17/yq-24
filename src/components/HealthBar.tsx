import { cn } from '@/lib/utils';

interface HealthBarProps {
  current: number;
  max: number;
  shield?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'green' | 'blue';
}

export default function HealthBar({
  current,
  max,
  shield = 0,
  showText = true,
  size = 'md',
  color = 'red',
}: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const shieldPercentage = Math.min(100 - percentage, (shield / max) * 100);

  const heightClasses = {
    sm: 'h-3',
    md: 'h-5',
    lg: 'h-7',
  };

  const colorGradients = {
    red: 'from-red-500 via-red-600 to-red-800',
    green: 'from-emerald-400 via-green-500 to-green-700',
    blue: 'from-blue-400 via-blue-500 to-blue-700',
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'relative w-full rounded-full overflow-hidden',
          'bg-gradient-to-b from-gray-800 to-gray-900',
          'border border-gray-600/50',
          'shadow-inner shadow-black/50',
          heightClasses[size]
        )}
      >
        <div
          className={cn(
            'absolute inset-y-0 left-0 transition-all duration-500 ease-out',
            `bg-gradient-to-r ${colorGradients[color]}`,
            'shadow-lg'
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
        </div>

        {shield > 0 && (
          <div
            className="absolute inset-y-0 bg-gradient-to-r from-amber-300 to-yellow-500 opacity-80"
            style={{
              left: `${percentage}%`,
              width: `${shieldPercentage}%`,
            }}
          />
        )}

        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'font-bold text-white drop-shadow-lg',
                size === 'sm' && 'text-xs',
                size === 'md' && 'text-sm',
                size === 'lg' && 'text-base'
              )}
            >
              {current} / {max}
              {shield > 0 && <span className="text-amber-300"> (+{shield})</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
