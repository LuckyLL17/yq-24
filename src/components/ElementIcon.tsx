import { cn } from '@/lib/utils';

type ElementType = 'fire' | 'water' | 'earth' | 'wind';

interface ElementIconProps {
  element: ElementType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export function FireIcon({ size = 'md', animate = true, className }: ElementIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizes[size], className, animate && 'animate-flame-flicker')}
      style={{ filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.8))' }}
    >
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="40%" stopColor="#ff6b35" />
          <stop offset="70%" stopColor="#ffa500" />
          <stop offset="100%" stopColor="#ffeb3b" />
        </linearGradient>
        <filter id="fireGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M50 10 C35 30, 20 50, 25 70 C28 85, 38 92, 50 92 C62 92, 72 85, 75 70 C80 50, 65 30, 50 10 Z"
        fill="url(#fireGrad)"
        filter="url(#fireGlow)"
      />
      <path
        d="M50 30 C42 45, 35 55, 38 70 C40 78, 45 82, 50 82 C55 82, 60 78, 62 70 C65 55, 58 45, 50 30 Z"
        fill="#ffeb3b"
        opacity="0.8"
      />
      <ellipse cx="50" cy="70" rx="8" ry="12" fill="#fff8dc" opacity="0.9" />
    </svg>
  );
}

export function WaterIcon({ size = 'md', animate = true, className }: ElementIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizes[size], className, animate && 'animate-wave')}
      style={{ filter: 'drop-shadow(0 0 8px rgba(78, 205, 196, 0.8))' }}
    >
      <defs>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87ceeb" />
          <stop offset="30%" stopColor="#4ecdc4" />
          <stop offset="70%" stopColor="#2196f3" />
          <stop offset="100%" stopColor="#1565c0" />
        </linearGradient>
        <filter id="waterGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M50 10 L75 55 Q75 85, 50 90 Q25 85, 25 55 Z"
        fill="url(#waterGrad)"
        filter="url(#waterGlow)"
      />
      <ellipse cx="40" cy="45" rx="8" ry="12" fill="#fff" opacity="0.4" transform="rotate(-15 40 45)" />
      <ellipse cx="55" cy="35" rx="4" ry="6" fill="#fff" opacity="0.3" transform="rotate(-10 55 35)" />
      <path
        d="M35 70 Q40 65, 50 68 Q60 71, 65 68"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export function EarthIcon({ size = 'md', animate = true, className }: ElementIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizes[size], className)}
      style={{ filter: 'drop-shadow(0 0 8px rgba(139, 90, 43, 0.8))' }}
    >
      <defs>
        <linearGradient id="earthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d2691e" />
          <stop offset="30%" stopColor="#8b5a2b" />
          <stop offset="70%" stopColor="#654321" />
          <stop offset="100%" stopColor="#3d2914" />
        </linearGradient>
        <filter id="earthGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="50,15 80,35 85,70 65,90 35,90 15,70 20,35"
        fill="url(#earthGrad)"
        filter="url(#earthGlow)"
      />
      <polygon
        points="50,25 70,40 72,65 58,80 42,80 28,65 30,40"
        fill="#8b5a2b"
        opacity="0.7"
      />
      <polygon
        points="50,35 60,45 62,60 54,70 46,70 38,60 40,45"
        fill="#a0522d"
        opacity="0.5"
      />
      <circle cx="38" cy="50" r="3" fill="#ffd700" opacity={animate ? 0.8 : 0.6} />
      <circle cx="58" cy="58" r="2" fill="#ffd700" opacity={animate ? 0.6 : 0.4} />
      <circle cx="48" cy="68" r="2.5" fill="#ffd700" opacity={animate ? 0.7 : 0.5} />
      <path
        d="M30 30 L35 25 M65 28 L70 23 M50 22 L52 18"
        stroke="#ffd700"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}

export function WindIcon({ size = 'md', animate = true, className }: ElementIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizes[size], className, animate && 'animate-spin-slow')}
      style={{ filter: 'drop-shadow(0 0 8px rgba(152, 216, 170, 0.8))' }}
    >
      <defs>
        <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#98d8aa" />
          <stop offset="50%" stopColor="#4ecdc4" />
          <stop offset="100%" stopColor="#20b2aa" />
        </linearGradient>
        <filter id="windGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#windGlow)">
        <path
          d="M20 40 Q35 30, 55 35 Q75 40, 80 30 Q85 25, 82 35 Q78 45, 65 42 Q45 38, 30 48 Q20 55, 20 40 Z"
          fill="url(#windGrad)"
          opacity="0.9"
        />
        <path
          d="M25 55 Q40 45, 60 50 Q75 55, 78 48 Q82 42, 80 52 Q76 62, 60 58 Q40 54, 28 62 Q22 68, 25 55 Z"
          fill="url(#windGrad)"
          opacity="0.8"
        />
        <path
          d="M30 70 Q45 60, 62 65 Q72 68, 75 62 Q78 58, 76 68 Q72 76, 58 72 Q42 68, 32 76 Q28 80, 30 70 Z"
          fill="url(#windGrad)"
          opacity="0.7"
        />
      </g>
      <circle cx="50" cy="50" r="5" fill="#fff" opacity="0.6" />
      <circle cx="40" cy="42" r="3" fill="#fff" opacity="0.4" />
      <circle cx="65" cy="60" r="2.5" fill="#fff" opacity="0.5" />
    </svg>
  );
}

const elementComponents = {
  fire: FireIcon,
  water: WaterIcon,
  earth: EarthIcon,
  wind: WindIcon,
};

export default function ElementIcon({ element, size = 'md', animate = true, className }: ElementIconProps) {
  const IconComponent = elementComponents[element];
  return <IconComponent element={element} size={size} animate={animate} className={className} />;
}
