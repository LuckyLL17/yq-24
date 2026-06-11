import { cn } from '@/lib/utils';

interface ManaCrystalsProps {
  current: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ManaCrystals({ current, max, size = 'md', showLabel = true }: ManaCrystalsProps) {
  const sizeConfig = {
    sm: {
      crystal: 'w-4 h-4',
      inner: 'w-2.5 h-2.5',
      gap: 'gap-1',
      text: 'text-xs',
      container: 'px-2 py-1',
    },
    md: {
      crystal: 'w-6 h-6',
      inner: 'w-4 h-4',
      gap: 'gap-1.5',
      text: 'text-sm',
      container: 'px-3 py-2',
    },
    lg: {
      crystal: 'w-8 h-8',
      inner: 'w-5 h-5',
      gap: 'gap-2',
      text: 'text-base',
      container: 'px-4 py-2.5',
    },
  };

  const config = sizeConfig[size];
  const displayMax = Math.min(max, 10);

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80',
      'border border-blue-400/40 shadow-lg shadow-blue-500/20 backdrop-blur-sm',
      config.container
    )}>
      {showLabel && (
        <span className="text-blue-300 font-bold mr-1" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          💎
        </span>
      )}
      <div className={cn('flex items-center', config.gap)}>
        {[...Array(displayMax)].map((_, i) => {
          const isFilled = i < current;
          return (
            <div
              key={i}
              className={cn(
                'relative transition-all duration-500 transform',
                config.crystal
              )}
            >
              <svg
                viewBox="0 0 40 48"
                className={cn(
                  'w-full h-full transition-all duration-500',
                  isFilled ? 'scale-100 opacity-100' : 'scale-90 opacity-40'
                )}
                style={{
                  filter: isFilled
                    ? 'drop-shadow(0 0 6px #60a5fa) drop-shadow(0 0 12px #3b82f6)'
                    : 'drop-shadow(0 0 2px rgba(96,165,250,0.3))',
                  animation: isFilled ? `manaCrystalPulse 2s ease-in-out ${i * 0.1}s infinite` : 'none',
                }}
              >
                <defs>
                  <linearGradient id={`mana-filled-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5f3fc" />
                    <stop offset="25%" stopColor="#67e8f9" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="75%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                  <linearGradient id={`mana-empty-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <filter id={`mana-glow-${i}`}>
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <polygon
                  points="20,2 36,16 32,44 8,44 4,16"
                  fill={isFilled ? `url(#mana-filled-${i})` : `url(#mana-empty-${i})`}
                  stroke={isFilled ? '#93c5fd' : '#64748b'}
                  strokeWidth="1.5"
                  filter={isFilled ? `url(#mana-glow-${i})` : undefined}
                />
                <polygon
                  points="20,2 36,16 20,24 4,16"
                  fill={isFilled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.05)'}
                />
                <polygon
                  points="20,24 32,44 20,40"
                  fill={isFilled ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.2)'}
                />
                <polygon
                  points="20,24 8,44 20,40"
                  fill={isFilled ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)'}
                />
                {isFilled && (
                  <polygon
                    points="14,10 18,8 16,16"
                    fill="rgba(255,255,255,0.6)"
                  />
                )}
              </svg>
              {isFilled && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    animation: `manaShimmer 2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              )}
            </div>
          );
        })}
        {max > 10 && (
          <span className="text-blue-300/70 text-xs ml-1">+{max - 10}</span>
        )}
      </div>
      {showLabel && (
        <span className={cn(
          'font-bold ml-1 tabular-nums',
          config.text,
          current > 0 ? 'text-cyan-300' : 'text-slate-500'
        )} style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          {current} / {max}
        </span>
      )}
    </div>
  );
}
