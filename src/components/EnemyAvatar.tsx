import { cn } from '@/lib/utils';

interface EnemyAvatarProps {
  type: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizes = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

const innerSizes = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
  xl: 'w-36 h-36',
};

function FireEnemy({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 10px rgba(255, 80, 0, 0.7))' }}>
      <defs>
        <radialGradient id="fireBody" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="40%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#b22222" />
        </radialGradient>
      </defs>
      {/* 火焰身体 */}
      <path
        d="M50 15 C35 30, 18 45, 22 65 C25 85, 38 92, 50 92 C62 92, 75 85, 78 65 C82 45, 65 30, 50 15 Z"
        fill="url(#fireBody)"
        className="animate-pulse"
      />
      {/* 眼睛 */}
      <ellipse cx="38" cy="55" rx="7" ry="9" fill="#fff8dc" />
      <ellipse cx="62" cy="55" rx="7" ry="9" fill="#fff8dc" />
      <circle cx="39" cy="57" r="3.5" fill="#1a1a2e" />
      <circle cx="63" cy="57" r="3.5" fill="#1a1a2e" />
      <circle cx="40" cy="55" r="1.2" fill="#fff" />
      <circle cx="64" cy="55" r="1.2" fill="#fff" />
      {/* 眉毛 */}
      <path d="M30 46 L44 49" stroke="#8b0000" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 46 L56 49" stroke="#8b0000" strokeWidth="3" strokeLinecap="round" />
      {/* 嘴巴 */}
      <path d="M38 72 Q50 82, 62 72" stroke="#8b0000" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* 小牙齿 */}
      <path d="M44 74 L46 78 L48 74" fill="#fff" />
      <path d="M52 74 L54 78 L56 74" fill="#fff" />
      {/* 头顶火焰装饰 */}
      <path d="M50 12 L46 20 L50 17 L54 20 Z" fill="#ffeb3b" />
      <path d="M40 18 L38 25 L42 23 L44 26 Z" fill="#ffa500" />
      <path d="M60 18 L62 25 L58 23 L56 26 Z" fill="#ffa500" />
    </svg>
  );
}

function WaterEnemy({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 10px rgba(0, 150, 255, 0.7))' }}>
      <defs>
        <radialGradient id="waterBody" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#b3e5fc" />
          <stop offset="50%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#0277bd" />
        </radialGradient>
      </defs>
      {/* 水滴形身体 */}
      <path
        d="M50 10 L75 50 Q75 88, 50 92 Q25 88, 25 50 Z"
        fill="url(#waterBody)"
      />
      {/* 高光 */}
      <ellipse cx="38" cy="45" rx="10" ry="15" fill="#fff" opacity="0.35" transform="rotate(-20 38 45)" />
      <ellipse cx="55" cy="35" rx="5" ry="8" fill="#fff" opacity="0.25" transform="rotate(-15 55 35)" />
      {/* 眼睛 */}
      <ellipse cx="38" cy="60" rx="8" ry="6" fill="#fff" />
      <ellipse cx="62" cy="60" rx="8" ry="6" fill="#fff" />
      <circle cx="39" cy="61" r="3.5" fill="#0d47a1" />
      <circle cx="63" cy="61" r="3.5" fill="#0d47a1" />
      <circle cx="40.5" cy="59.5" r="1.2" fill="#fff" />
      <circle cx="64.5" cy="59.5" r="1.2" fill="#fff" />
      {/* 可爱的嘴巴 */}
      <path d="M42 75 Q50 82, 58 75" stroke="#01579b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* 水泡装饰 */}
      <circle cx="72" cy="25" r="4" fill="#fff" opacity="0.6">
        <animate attributeName="cy" values="25;15;25" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="28" cy="35" r="3" fill="#fff" opacity="0.5">
        <animate attributeName="cy" values="35;22;35" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function EarthEnemy({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 10px rgba(139, 90, 43, 0.7))' }}>
      <defs>
        <radialGradient id="earthBody" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#d2691e" />
          <stop offset="50%" stopColor="#8b5a2b" />
          <stop offset="100%" stopColor="#3d2914" />
        </radialGradient>
      </defs>
      {/* 岩石身体 */}
      <path
        d="M50 12 L82 32 L88 65 L70 88 L30 88 L12 65 L18 32 Z"
        fill="url(#earthBody)"
        stroke="#5d4037"
        strokeWidth="2"
      />
      {/* 岩石纹理 */}
      <path d="M30 40 L45 35" stroke="#5d4037" strokeWidth="1.5" opacity="0.6" />
      <path d="M60 45 L75 42" stroke="#5d4037" strokeWidth="1.5" opacity="0.6" />
      <path d="M35 60 L50 58" stroke="#5d4037" strokeWidth="1.5" opacity="0.5" />
      <path d="M55 70 L70 68" stroke="#5d4037" strokeWidth="1.5" opacity="0.5" />
      {/* 眼睛 */}
      <ellipse cx="37" cy="50" rx="9" ry="7" fill="#fff8dc" />
      <ellipse cx="63" cy="50" rx="9" ry="7" fill="#fff8dc" />
      <circle cx="38" cy="51" r="4" fill="#3e2723" />
      <circle cx="64" cy="51" r="4" fill="#3e2723" />
      <circle cx="39.5" cy="49.5" r="1.5" fill="#fff" />
      <circle cx="65.5" cy="49.5" r="1.5" fill="#fff" />
      {/* 眉毛 - 石质 */}
      <rect x="27" y="40" width="18" height="4" rx="2" fill="#5d4037" />
      <rect x="55" y="40" width="18" height="4" rx="2" fill="#5d4037" />
      {/* 嘴巴 */}
      <rect x="38" y="68" width="24" height="8" rx="2" fill="#3e2723" />
      <rect x="42" y="68" width="3" height="8" fill="#fff" />
      <rect x="50" y="68" width="3" height="8" fill="#fff" />
      <rect x="58" y="68" width="3" height="8" fill="#fff" />
      {/* 金色宝石装饰 */}
      <circle cx="50" cy="25" r="4" fill="#ffd700" className="animate-pulse" />
      <circle cx="20" cy="50" r="3" fill="#ffd700" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="55" r="3.5" fill="#ffd700" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function WindEnemy({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 10px rgba(100, 200, 180, 0.7))' }}>
      <defs>
        <radialGradient id="windBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0f7fa" />
          <stop offset="50%" stopColor="#80cbc4" />
          <stop offset="100%" stopColor="#26a69a" />
        </radialGradient>
      </defs>
      {/* 漩涡形身体 */}
      <g className="animate-spin-slow" style={{ transformOrigin: '50px 50px', animationDuration: '8s' }}>
        <path
          d="M50 20 Q70 25, 75 45 Q80 65, 60 75 Q40 85, 25 70 Q10 55, 25 40 Q40 25, 50 20 Z"
          fill="url(#windBody)"
          opacity="0.9"
        />
        <path
          d="M50 35 Q62 38, 65 50 Q68 62, 55 68 Q42 74, 35 65 Q28 56, 35 48 Q42 40, 50 35 Z"
          fill="#b2dfdb"
          opacity="0.7"
        />
      </g>
      {/* 眼睛 - 在漩涡前方 */}
      <g style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))' }}>
        <ellipse cx="38" cy="48" rx="8" ry="6" fill="#fff" />
        <ellipse cx="62" cy="48" rx="8" ry="6" fill="#fff" />
        <circle cx="38" cy="49" r="3" fill="#00695c" />
        <circle cx="62" cy="49" r="3" fill="#00695c" />
        <circle cx="39" cy="47.5" r="1" fill="#fff" />
        <circle cx="63" cy="47.5" r="1" fill="#fff" />
      </g>
      {/* 小嘴巴 */}
      <path d="M44 62 Q50 66, 56 62" stroke="#00695c" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* 风的粒子 */}
      <circle cx="15" cy="30" r="3" fill="#e0f7fa" opacity="0.7">
        <animate attributeName="cx" values="15;5;15" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="85" cy="35" r="2.5" fill="#e0f7fa" opacity="0.7">
        <animate attributeName="cx" values="85;95;85" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="20" cy="75" r="2" fill="#e0f7fa" opacity="0.6">
        <animate attributeName="cx" values="20;10;20" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="78" r="3" fill="#e0f7fa" opacity="0.6">
        <animate attributeName="cx" values="80;92;80" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function BossDragon({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 15px rgba(180, 50, 255, 0.8))' }}>
      <defs>
        <radialGradient id="dragonBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9c27b0" />
          <stop offset="50%" stopColor="#6a1b9a" />
          <stop offset="100%" stopColor="#311b92" />
        </radialGradient>
        <linearGradient id="hornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#5d4037" />
          <stop offset="100%" stopColor="#8d6e63" />
        </linearGradient>
      </defs>
      {/* 龙的身体 */}
      <ellipse cx="50" cy="58" rx="32" ry="30" fill="url(#dragonBody)" />
      {/* 肚皮 */}
      <ellipse cx="50" cy="65" rx="18" ry="16" fill="#ce93d8" opacity="0.6" />
      {/* 头部 */}
      <ellipse cx="50" cy="40" rx="28" ry="22" fill="url(#dragonBody)" />
      {/* 角 */}
      <path d="M28 28 L22 10 L32 22 Z" fill="url(#hornGrad)" />
      <path d="M72 28 L78 10 L68 22 Z" fill="url(#hornGrad)" />
      <path d="M25 30 L18 18 L30 26 Z" fill="url(#hornGrad)" opacity="0.8" />
      <path d="M75 30 L82 18 L70 26 Z" fill="url(#hornGrad)" opacity="0.8" />
      {/* 眼睛 */}
      <ellipse cx="37" cy="42" rx="9" ry="8" fill="#ffeb3b" />
      <ellipse cx="63" cy="42" rx="9" ry="8" fill="#ffeb3b" />
      <ellipse cx="38" cy="44" rx="5" ry="6" fill="#d32f2f" />
      <ellipse cx="64" cy="44" rx="5" ry="6" fill="#d32f2f" />
      <circle cx="40" cy="42" r="2" fill="#000" />
      <circle cx="66" cy="42" r="2" fill="#000" />
      <circle cx="41" cy="41" r="0.8" fill="#fff" />
      <circle cx="67" cy="41" r="0.8" fill="#fff" />
      {/* 眉毛 - 邪恶的 */}
      <path d="M26 32 L42 36" stroke="#4a148c" strokeWidth="4" strokeLinecap="round" />
      <path d="M74 32 L58 36" stroke="#4a148c" strokeWidth="4" strokeLinecap="round" />
      {/* 鼻子 */}
      <ellipse cx="50" cy="52" rx="6" ry="4" fill="#4a148c" />
      <circle cx="47" cy="52" r="1.5" fill="#1a0033" />
      <circle cx="53" cy="52" r="1.5" fill="#1a0033" />
      {/* 嘴巴 */}
      <path d="M30 60 Q50 72, 70 60" stroke="#4a148c" strokeWidth="3" fill="none" />
      {/* 尖牙 */}
      <path d="M36 60 L38 68 L40 60 Z" fill="#fff" />
      <path d="M60 60 L62 68 L64 60 Z" fill="#fff" />
      {/* 翅膀尖端 */}
      <path d="M15 50 L2 40 L10 55 Z" fill="#7b1fa2" />
      <path d="M85 50 L98 40 L90 55 Z" fill="#7b1fa2" />
      <path d="M8 60 L2 55 L5 65 Z" fill="#7b1fa2" />
      <path d="M92 60 L98 55 L95 65 Z" fill="#7b1fa2" />
      {/* 脖子上的尖刺 */}
      <path d="M40 25 L42 32 L44 25 Z" fill="#5d4037" />
      <path d="M50 22 L52 30 L54 22 Z" fill="#5d4037" />
      <path d="M56 25 L58 32 L60 25 Z" fill="#5d4037" />
    </svg>
  );
}

const enemyComponents: Record<string, React.FC<{ size?: string }>> = {
  flame_imp: FireEnemy,
  water_sprite: WaterEnemy,
  earth_golem: EarthEnemy,
  wind_spirit: WindEnemy,
  boss_dragon: BossDragon,
  fire_elemental: FireEnemy,
  water_elemental: WaterEnemy,
  earth_elemental: EarthEnemy,
};

export default function EnemyAvatar({ type, size = 'md', animate = true, className }: EnemyAvatarProps) {
  const EnemyComponent = enemyComponents[type] || FireEnemy;
  
  return (
    <div className={cn('relative flex items-center justify-center', sizes[size as keyof typeof sizes], className)}>
      {/* 外发光光环 */}
      <div 
        className="absolute inset-0 rounded-full opacity-50"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
          animation: animate ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      {/* 头像容器 */}
      <div className="relative flex items-center justify-center">
        <EnemyComponent size={size} />
      </div>
    </div>
  );
}
