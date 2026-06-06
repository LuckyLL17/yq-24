import { cn } from '@/lib/utils';

interface HealthBarProps {
  current: number;
  max: number;
  shield?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'green' | 'blue';
  animated?: boolean;
}

export default function HealthBar({
  current,
  max,
  shield = 0,
  showText = true,
  size = 'md',
  color = 'red',
  animated = true,
}: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const shieldPercentage = Math.min(100 - percentage, (shield / max) * 100);

  const heightClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
  };

  const colorGradients = {
    red: 'from-red-400 via-red-500 to-red-700',
    green: 'from-emerald-400 via-green-500 to-green-700',
    blue: 'from-blue-400 via-blue-500 to-blue-700',
  };

  const isLow = percentage < 30;

  return (
    <div className="w-full">
      <div
        className={cn(
          'relative w-full rounded-full overflow-hidden',
          'bg-gradient-to-b from-gray-800 to-gray-900',
          'border-2 border-amber-700/50',
          'shadow-inner shadow-black/50',
          heightClasses[size],
          isLow && animated && 'animate-pulse'
        )}
      >
        {/* 金属边框高光 */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* 生命值填充 */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 transition-all duration-700 ease-out',
            `bg-gradient-to-r ${colorGradients[color]}`,
            'shadow-lg'
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* 光泽效果 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
          
          {/* 动态光效 */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ 
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* 护盾值 */}
        {shield > 0 && (
          <div
            className="absolute inset-y-0 transition-all duration-500 ease-out"
            style={{
              left: `${percentage}%`,
              width: `${shieldPercentage}%`,
            }}
          >
            <div className="h-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 opacity-90">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
            </div>
          </div>
        )}

        {/* 分隔线装饰 */}
        <div className="absolute inset-y-0 left-1/3 w-px bg-black/20" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-black/20" />

        {/* 数值文字 */}
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'font-black text-white drop-shadow-lg text-stroke',
                size === 'sm' && 'text-xs',
                size === 'md' && 'text-sm',
                size === 'lg' && 'text-base'
              )}
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {current} / {max}
              {shield > 0 && (
                <span className="text-amber-300 ml-1">
                  <span className="text-xs">+</span>{shield}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
