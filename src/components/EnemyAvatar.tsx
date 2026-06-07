import { cn } from '@/lib/utils';
import type { EnemyTier } from '@/types/game';

interface EnemyAvatarProps {
  type: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
  tier?: EnemyTier;
  bossPhase?: number;
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

const tierBorderStyles: Record<EnemyTier, { border: string; glow: string; ring: string }> = {
  common: {
    border: 'border-2 border-slate-400/50',
    glow: 'shadow-slate-500/30',
    ring: 'from-slate-400 via-slate-500 to-slate-600',
  },
  elite: {
    border: 'border-2 border-blue-400/70',
    glow: 'shadow-blue-500/50',
    ring: 'from-blue-400 via-indigo-500 to-purple-500',
  },
  boss: {
    border: 'border-3 border-amber-400/80',
    glow: 'shadow-amber-500/60',
    ring: 'from-amber-400 via-orange-500 to-red-500',
  },
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

function BossDragonPhase2({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 18px rgba(255, 80, 0, 0.9))' }}>
      <defs>
        <radialGradient id="dragonBody2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff5722" />
          <stop offset="40%" stopColor="#e64a19" />
          <stop offset="100%" stopColor="#bf360c" />
        </radialGradient>
        <linearGradient id="hornGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#4a148c" />
          <stop offset="100%" stopColor="#7b1fa2" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="58" rx="34" ry="32" fill="url(#dragonBody2)" />
      <ellipse cx="50" cy="65" rx="20" ry="18" fill="#ffccbc" opacity="0.5" />
      <ellipse cx="50" cy="38" rx="30" ry="24" fill="url(#dragonBody2)" />
      <path d="M26 26 L18 6 L30 20 Z" fill="url(#hornGrad2)" />
      <path d="M74 26 L82 6 L70 20 Z" fill="url(#hornGrad2)" />
      <path d="M22 30 L12 16 L26 26 Z" fill="url(#hornGrad2)" />
      <path d="M78 30 L88 16 L74 26 Z" fill="url(#hornGrad2)" />
      <path d="M30 34 L20 22 L34 30 Z" fill="url(#hornGrad2)" opacity="0.7" />
      <path d="M70 34 L80 22 L66 30 Z" fill="url(#hornGrad2)" opacity="0.7" />
      <ellipse cx="36" cy="40" rx="10" ry="9" fill="#fff59d" />
      <ellipse cx="64" cy="40" rx="10" ry="9" fill="#fff59d" />
      <ellipse cx="37" cy="42" rx="6" ry="7" fill="#b71c1c" />
      <ellipse cx="63" cy="42" rx="6" ry="7" fill="#b71c1c" />
      <circle cx="39" cy="40" r="2.5" fill="#000" />
      <circle cx="61" cy="40" r="2.5" fill="#000" />
      <circle cx="40.5" cy="38.5" r="1" fill="#fff" />
      <circle cx="62.5" cy="38.5" r="1" fill="#fff" />
      <path d="M24 30 L42 34" stroke="#3e2723" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 30 L58 34" stroke="#3e2723" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="50" cy="52" rx="7" ry="5" fill="#3e2723" />
      <circle cx="46" cy="52" r="2" fill="#1a0033" />
      <circle cx="54" cy="52" r="2" fill="#1a0033" />
      <path d="M28 58 Q50 72, 72 58" stroke="#3e2723" strokeWidth="3" fill="none" />
      <path d="M34 58 L36 68 L38 58 Z" fill="#fff" />
      <path d="M62 58 L64 68 L66 58 Z" fill="#fff" />
      <path d="M46 58 L48 66 L50 58 Z" fill="#fff" />
      <path d="M50 58 L52 66 L54 58 Z" fill="#fff" />
      <path d="M12 50 L0 35 L8 58 Z" fill="#e64a19" />
      <path d="M88 50 L100 35 L92 58 Z" fill="#e64a19" />
      <path d="M5 62 L0 56 L4 68 Z" fill="#e64a19" />
      <path d="M95 62 L100 56 L96 68 Z" fill="#e64a19" />
      <path d="M38 22 L40 30 L42 22 Z" fill="#4a148c" />
      <path d="M50 18 L52 28 L54 18 Z" fill="#4a148c" />
      <path d="M58 22 L60 30 L62 22 Z" fill="#4a148c" />
      <circle cx="30" cy="50" r="3" fill="#ff9800" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="48" r="2.5" fill="#ff9800" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function BossDragonPhase3({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 22px rgba(255, 0, 100, 1))' }}>
      <defs>
        <radialGradient id="dragonBody3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f50057" />
          <stop offset="35%" stopColor="#c51162" />
          <stop offset="70%" stopColor="#880e4f" />
          <stop offset="100%" stopColor="#4a0025" />
        </radialGradient>
        <linearGradient id="hornGrad3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1a0033" />
          <stop offset="100%" stopColor="#4a148c" />
        </linearGradient>
        <linearGradient id="wingGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4a0025" />
          <stop offset="50%" stopColor="#880e4f" />
          <stop offset="100%" stopColor="#4a0025" />
        </linearGradient>
      </defs>
      <path d="M15 45 Q0 35, 5 55 Q10 70, 25 60 Z" fill="url(#wingGrad3)">
        <animate attributeName="d" values="M15 45 Q0 35, 5 55 Q10 70, 25 60 Z;M15 45 Q2 32, 7 57 Q12 72, 25 60 Z;M15 45 Q0 35, 5 55 Q10 70, 25 60 Z" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M85 45 Q100 35, 95 55 Q90 70, 75 60 Z" fill="url(#wingGrad3)">
        <animate attributeName="d" values="M85 45 Q100 35, 95 55 Q90 70, 75 60 Z;M85 45 Q98 32, 93 57 Q88 72, 75 60 Z;M85 45 Q100 35, 95 55 Q90 70, 75 60 Z" dur="2s" repeatCount="indefinite" />
      </path>
      <ellipse cx="50" cy="58" rx="36" ry="34" fill="url(#dragonBody3)" />
      <ellipse cx="50" cy="65" rx="22" ry="20" fill="#f8bbd0" opacity="0.4" />
      <ellipse cx="50" cy="36" rx="32" ry="26" fill="url(#dragonBody3)" />
      <path d="M24 24 L14 2 L30 18 Z" fill="url(#hornGrad3)" />
      <path d="M76 24 L86 2 L70 18 Z" fill="url(#hornGrad3)" />
      <path d="M20 28 L8 12 L26 24 Z" fill="url(#hornGrad3)" />
      <path d="M80 28 L92 12 L74 24 Z" fill="url(#hornGrad3)" />
      <path d="M28 32 L16 18 L32 28 Z" fill="url(#hornGrad3)" opacity="0.8" />
      <path d="M72 32 L84 18 L68 28 Z" fill="url(#hornGrad3)" opacity="0.8" />
      <ellipse cx="35" cy="38" rx="11" ry="10" fill="#ffeb3b" />
      <ellipse cx="65" cy="38" rx="11" ry="10" fill="#ffeb3b" />
      <ellipse cx="36" cy="40" rx="7" ry="8" fill="#d50000" />
      <ellipse cx="64" cy="40" rx="7" ry="8" fill="#d50000" />
      <circle cx="38" cy="38" r="3" fill="#000" />
      <circle cx="62" cy="38" r="3" fill="#000" />
      <circle cx="39.5" cy="36.5" r="1.2" fill="#fff" />
      <circle cx="63.5" cy="36.5" r="1.2" fill="#fff" />
      <path d="M22 28 L42 32" stroke="#1a0033" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M78 28 L58 32" stroke="#1a0033" strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx="50" cy="50" rx="8" ry="5" fill="#1a0033" />
      <circle cx="45" cy="50" r="2.2" fill="#ff1744" />
      <circle cx="55" cy="50" r="2.2" fill="#ff1744" />
      <path d="M26 56 Q50 74, 74 56" stroke="#1a0033" strokeWidth="3.5" fill="none" />
      <path d="M32 56 L34 68 L36 56 Z" fill="#fff" />
      <path d="M64 56 L66 68 L68 56 Z" fill="#fff" />
      <path d="M42 56 L44 67 L46 56 Z" fill="#fff" />
      <path d="M54 56 L56 67 L58 56 Z" fill="#fff" />
      <path d="M48 56 L50 65 L52 56 Z" fill="#fff" />
      <path d="M36 20 L38 28 L40 20 Z" fill="#1a0033" />
      <path d="M50 16 L52 26 L54 16 Z" fill="#1a0033" />
      <path d="M60 20 L62 28 L64 20 Z" fill="#1a0033" />
      <circle cx="28" cy="48" r="4" fill="#e91e63" opacity="0.9">
        <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="72" cy="46" r="3.5" fill="#e91e63" opacity="0.8">
        <animate attributeName="r" values="3.5;5.5;3.5" dur="1.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="70" r="2.5" fill="#e91e63" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="72" r="3" fill="#e91e63" opacity="0.75">
        <animate attributeName="opacity" values="0.75;0.25;0.75" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ShadowAssassin({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 12px rgba(80, 20, 120, 0.8))' }}>
      <defs>
        <radialGradient id="shadowBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6a1b9a" />
          <stop offset="50%" stopColor="#4a148c" />
          <stop offset="100%" stopColor="#1a0033" />
        </radialGradient>
      </defs>
      <path d="M50 12 L70 35 L65 75 L50 88 L35 75 L30 35 Z" fill="url(#shadowBody)" />
      <path d="M50 10 L60 30 L50 25 L40 30 Z" fill="#7b1fa2" />
      <ellipse cx="40" cy="42" rx="6" ry="5" fill="#e91e63" />
      <ellipse cx="60" cy="42" rx="6" ry="5" fill="#e91e63" />
      <path d="M30 35 L45 40" stroke="#1a0033" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 35 L55 40" stroke="#1a0033" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 60 L50 65 L58 60" stroke="#1a0033" strokeWidth="2" fill="none" />
      <path d="M20 50 L10 45 L15 60 Z" fill="#9c27b0" opacity="0.7" />
      <path d="M80 50 L90 45 L85 60 Z" fill="#9c27b0" opacity="0.7" />
    </svg>
  );
}

function CrystalGuardian({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 12px rgba(100, 200, 255, 0.8))' }}>
      <defs>
        <radialGradient id="crystalBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#81d4fa" />
          <stop offset="50%" stopColor="#29b6f6" />
          <stop offset="100%" stopColor="#0277bd" />
        </radialGradient>
      </defs>
      <path d="M50 10 L75 30 L80 60 L65 85 L35 85 L20 60 L25 30 Z" fill="url(#crystalBody)" />
      <polygon points="50,10 60,25 50,30 40,25" fill="#b3e5fc" opacity="0.8" />
      <polygon points="30,35 40,30 45,50 35,55" fill="#b3e5fc" opacity="0.5" />
      <polygon points="70,35 60,30 55,50 65,55" fill="#01579b" opacity="0.4" />
      <ellipse cx="40" cy="48" rx="7" ry="6" fill="#fff" />
      <ellipse cx="60" cy="48" rx="7" ry="6" fill="#fff" />
      <circle cx="40" cy="49" r="3.5" fill="#0277bd" />
      <circle cx="60" cy="49" r="3.5" fill="#0277bd" />
      <circle cx="41" cy="47.5" r="1.2" fill="#fff" />
      <circle cx="61" cy="47.5" r="1.2" fill="#fff" />
      <path d="M40 65 Q50 72, 60 65" stroke="#01579b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ThunderLord({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 12px rgba(150, 50, 255, 0.8))' }}>
      <defs>
        <radialGradient id="thunderBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ce93d8" />
          <stop offset="50%" stopColor="#9c27b0" />
          <stop offset="100%" stopColor="#4a148c" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="55" rx="30" ry="32" fill="url(#thunderBody)" />
      <path d="M52 12 L42 35 L50 35 L45 60 L65 30 L55 30 L60 12 Z" fill="#ffeb3b" className="animate-pulse">
        <animate attributeName="opacity" values="1;0.7;1" dur="0.5s" repeatCount="indefinite" />
      </path>
      <ellipse cx="38" cy="50" rx="8" ry="7" fill="#fff" />
      <ellipse cx="62" cy="50" rx="8" ry="7" fill="#fff" />
      <ellipse cx="38" cy="51" r="4" fill="#ffeb3b" />
      <ellipse cx="62" cy="51" r="4" fill="#ffeb3b" />
      <circle cx="38" cy="52" r="2" fill="#311b92" />
      <circle cx="62" cy="52" r="2" fill="#311b92" />
      <path d="M30 40 L45 44" stroke="#4a148c" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 40 L55 44" stroke="#4a148c" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 70 Q50 76, 62 70" stroke="#4a148c" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function VoidWalker({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 10px rgba(30, 30, 60, 0.9))' }}>
      <defs>
        <radialGradient id="voidBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3f51b5" />
          <stop offset="50%" stopColor="#1a237e" />
          <stop offset="100%" stopColor="#0d1030" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="55" rx="28" ry="30" fill="url(#voidBody)" />
      <ellipse cx="50" cy="40" rx="25" ry="22" fill="url(#voidBody)" />
      <ellipse cx="38" cy="42" rx="8" ry="7" fill="#7c4dff" />
      <ellipse cx="62" cy="42" rx="8" ry="7" fill="#7c4dff" />
      <circle cx="38" cy="43" r="3" fill="#fff" opacity="0.8" />
      <circle cx="62" cy="43" r="3" fill="#fff" opacity="0.8" />
      <circle cx="38.5" cy="42" r="1.2" fill="#fff" />
      <circle cx="62.5" cy="42" r="1.2" fill="#fff" />
      <path d="M40 65 Q50 70, 60 65" stroke="#311b92" strokeWidth="2" fill="none" />
      <circle cx="25" cy="30" r="3" fill="#7c4dff" opacity="0.6">
        <animate attributeName="cy" values="30;20;30" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="35" r="2.5" fill="#7c4dff" opacity="0.5">
        <animate attributeName="cy" values="35;25;35" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="75" r="2" fill="#7c4dff" opacity="0.4">
        <animate attributeName="cy" values="75;65;75" dur="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function PhoenixLord({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 15px rgba(255, 100, 0, 0.9))' }}>
      <defs>
        <radialGradient id="phoenixBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="35%" stopColor="#ff9800" />
          <stop offset="70%" stopColor="#f44336" />
          <stop offset="100%" stopColor="#b71c1c" />
        </radialGradient>
      </defs>
      <path d="M20 45 Q10 35, 15 55 Q20 70, 30 60 Z" fill="#ff5722" opacity="0.8">
        <animate attributeName="d" values="M20 45 Q10 35, 15 55 Q20 70, 30 60 Z;M20 45 Q8 32, 13 57 Q18 72, 30 60 Z;M20 45 Q10 35, 15 55 Q20 70, 30 60 Z" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M80 45 Q90 35, 85 55 Q80 70, 70 60 Z" fill="#ff5722" opacity="0.8">
        <animate attributeName="d" values="M80 45 Q90 35, 85 55 Q80 70, 70 60 Z;M80 45 Q92 32, 87 57 Q82 72, 70 60 Z;M80 45 Q90 35, 85 55 Q80 70, 70 60 Z" dur="1.5s" repeatCount="indefinite" />
      </path>
      <ellipse cx="50" cy="55" rx="28" ry="28" fill="url(#phoenixBody)" />
      <ellipse cx="50" cy="38" rx="24" ry="20" fill="url(#phoenixBody)" />
      <path d="M50 10 L42 25 L50 20 L58 25 Z" fill="#ffeb3b" className="animate-pulse" />
      <path d="M30 22 L25 10 L35 20 Z" fill="#ff9800" />
      <path d="M70 22 L75 10 L65 20 Z" fill="#ff9800" />
      <ellipse cx="38" cy="40" rx="9" ry="8" fill="#fff" />
      <ellipse cx="62" cy="40" rx="9" ry="8" fill="#fff" />
      <ellipse cx="39" cy="41" rx="5" ry="5.5" fill="#d32f2f" />
      <ellipse cx="61" cy="41" rx="5" ry="5.5" fill="#d32f2f" />
      <circle cx="40" cy="40" r="2" fill="#000" />
      <circle cx="60" cy="40" r="2" fill="#000" />
      <circle cx="41" cy="39" r="0.8" fill="#fff" />
      <circle cx="61" cy="39" r="0.8" fill="#fff" />
      <path d="M40 55 L45 50 L50 55 L55 50 L60 55" stroke="#b71c1c" strokeWidth="2.5" fill="none" />
      <path d="M45 55 L50 60 L55 55" fill="#ffeb3b" />
    </svg>
  );
}

function IceQueen({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 12px rgba(100, 200, 255, 0.8))' }}>
      <defs>
        <radialGradient id="iceBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e1f5fe" />
          <stop offset="50%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#0288d1" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="58" rx="30" ry="30" fill="url(#iceBody)" />
      <ellipse cx="50" cy="38" rx="26" ry="22" fill="url(#iceBody)" />
      <path d="M30 25 L25 8 L38 22 Z" fill="#b3e5fc" />
      <path d="M70 25 L75 8 L62 22 Z" fill="#b3e5fc" />
      <path d="M40 18 L35 2 L50 15 Z" fill="#e1f5fe" />
      <path d="M60 18 L65 2 L50 15 Z" fill="#e1f5fe" />
      <polygon points="50,5 52,15 50,12 48,15" fill="#fff" />
      <ellipse cx="38" cy="40" rx="8" ry="7" fill="#fff" />
      <ellipse cx="62" cy="40" rx="8" ry="7" fill="#fff" />
      <ellipse cx="38" cy="41" rx="4" ry="5" fill="#0277bd" />
      <ellipse cx="62" cy="41" rx="4" ry="5" fill="#0277bd" />
      <circle cx="38.5" cy="40" r="1.5" fill="#fff" />
      <circle cx="62.5" cy="40" r="1.5" fill="#fff" />
      <path d="M28 32 L44 36" stroke="#01579b" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 32 L56 36" stroke="#01579b" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 58 Q50 64, 60 58" stroke="#01579b" strokeWidth="2.5" fill="none" />
      <circle cx="75" cy="25" r="3" fill="#fff" opacity="0.7">
        <animate attributeName="cy" values="25;35;25" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="30" r="2.5" fill="#fff" opacity="0.6">
        <animate attributeName="cy" values="30;40;30" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function StormTitan({ size = 'md' }: { size?: string }) {
  const s = size as keyof typeof innerSizes;
  return (
    <svg viewBox="0 0 100 100" className={cn(innerSizes[s])} style={{ filter: 'drop-shadow(0 0 15px rgba(100, 100, 200, 0.9))' }}>
      <defs>
        <radialGradient id="stormBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#90a4ae" />
          <stop offset="50%" stopColor="#546e7a" />
          <stop offset="100%" stopColor="#263238" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="58" rx="34" ry="32" fill="url(#stormBody)" />
      <ellipse cx="50" cy="38" rx="28" ry="24" fill="url(#stormBody)" />
      <path d="M25 20 L15 5 L30 18 Z" fill="#78909c" />
      <path d="M75 20 L85 5 L70 18 Z" fill="#78909c" />
      <path d="M35 15 L28 0 L42 12 Z" fill="#90a4ae" />
      <path d="M65 15 L72 0 L58 12 Z" fill="#90a4ae" />
      <path d="M50 5 L53 18 L50 15 L47 18 Z" fill="#b0bec5" />
      <ellipse cx="37" cy="42" rx="10" ry="9" fill="#eceff1" />
      <ellipse cx="63" cy="42" rx="10" ry="9" fill="#eceff1" />
      <ellipse cx="38" cy="43" rx="5" ry="6" fill="#1565c0" />
      <ellipse cx="62" cy="43" rx="5" ry="6" fill="#1565c0" />
      <circle cx="39" cy="42" r="2.5" fill="#0d47a1" />
      <circle cx="61" cy="42" r="2.5" fill="#0d47a1" />
      <circle cx="40" cy="40.5" r="1" fill="#fff" />
      <circle cx="62" cy="40.5" r="1" fill="#fff" />
      <path d="M25 32 L43 38" stroke="#37474f" strokeWidth="4" strokeLinecap="round" />
      <path d="M75 32 L57 38" stroke="#37474f" strokeWidth="4" strokeLinecap="round" />
      <path d="M38 62 Q50 70, 62 62" stroke="#37474f" strokeWidth="3" fill="none" />
      <path d="M42 62 L45 70 L48 62 Z" fill="#fff" />
      <path d="M52 62 L55 70 L58 62 Z" fill="#fff" />
      <path d="M30 50 L20 55 L25 60 Z" fill="#ffeb3b" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.8s" repeatCount="indefinite" />
      </path>
      <path d="M70 48 L80 53 L75 58 Z" fill="#ffeb3b" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

const enemyComponents: Record<string, React.FC<{ size?: string }>> = {
  flame_imp: FireEnemy,
  water_sprite: WaterEnemy,
  earth_golem: EarthEnemy,
  wind_spirit: WindEnemy,
  boss_dragon: BossDragon,
  boss_dragon_phase2: BossDragonPhase2,
  boss_dragon_phase3: BossDragonPhase3,
  fire_elemental: FireEnemy,
  water_elemental: WaterEnemy,
  earth_elemental: EarthEnemy,
  lightning_elemental: ThunderLord,
  light_elemental: PhoenixLord,
  dark_elemental: ShadowAssassin,
  shadow_assassin: ShadowAssassin,
  crystal_guardian: CrystalGuardian,
  thunder_lord: ThunderLord,
  void_walker: VoidWalker,
  phoenix_lord: PhoenixLord,
  ice_queen: IceQueen,
  storm_titan: StormTitan,
};

export default function EnemyAvatar({ type, size = 'md', animate = true, className, tier = 'common', bossPhase }: EnemyAvatarProps) {
  const EnemyComponent = enemyComponents[type] || FireEnemy;
  const tierStyle = tierBorderStyles[tier];
  
  return (
    <div className={cn('relative flex items-center justify-center', sizes[size as keyof typeof sizes], className)}>
      {tier === 'boss' && (
        <div 
          className="absolute -inset-2 rounded-full opacity-70"
          style={{ 
            background: 'conic-gradient(from 0deg, #f59e0b, #ef4444, #8b5cf6, #3b82f6, #10b981, #f59e0b)',
            animation: animate ? 'spin 3s linear infinite' : 'none',
            filter: 'blur(4px)',
          }}
        />
      )}
      {tier === 'elite' && (
        <div 
          className="absolute -inset-1 rounded-full opacity-60"
          style={{ 
            background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)',
            animation: animate ? 'spin 4s linear infinite' : 'none',
            filter: 'blur(3px)',
          }}
        />
      )}
      <div 
        className={cn(
          'absolute inset-0 rounded-full',
          'p-[3px]',
          tier === 'boss' && 'p-[4px]'
        )}
        style={{
          background: `linear-gradient(135deg, ${
            tier === 'boss' ? '#fbbf24, #f59e0b, #d97706' :
            tier === 'elite' ? '#60a5fa, #818cf8, #a78bfa' :
            '#9ca3af, #6b7280, #4b5563'
          })`,
        }}
      >
        <div 
          className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
        />
      </div>
      <div 
        className="absolute inset-1.5 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
        }}
      />
      <div className="relative z-10 flex items-center justify-center">
        <EnemyComponent size={size} />
      </div>
      {tier === 'boss' && bossPhase && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-0.5">
            {[1, 2, 3].slice(0, 3).map((phase) => (
              <div
                key={phase}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  phase <= bossPhase
                    ? 'bg-amber-400 shadow-lg shadow-amber-500/50'
                    : 'bg-slate-600'
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
