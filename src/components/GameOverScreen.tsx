import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface GameOverScreenProps {
  type: 'victory' | 'defeat';
}

export default function GameOverScreen({ type }: GameOverScreenProps) {
  const { startBattle, startChallenge, goToMenu, score, streak, mode } = useGameStore();

  const isVictory = type === 'victory';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 text-center">
        <div
          className={cn(
            'text-8xl mb-6 animate-bounce',
            isVictory ? 'animate-pulse' : ''
          )}
        >
          {isVictory ? '🏆' : '💀'}
        </div>

        <h1
          className={cn(
            'text-6xl font-black mb-4',
            isVictory
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600'
          )}
        >
          {isVictory ? '胜利!' : '失败...'}
        </h1>

        <p className="text-white/60 text-xl mb-8">
          {isVictory ? '你击败了敌人!' : '你被击败了，再试一次吧!'}
        </p>

        {mode === 'challenge' && (
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">{score}</div>
              <div className="text-white/50 text-sm">最终得分</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{streak}</div>
              <div className="text-white/50 text-sm">最高连击</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-64 mx-auto">
          <button
            onClick={isVictory ? startBattle : mode === 'challenge' ? startChallenge : startBattle}
            className={cn(
              'px-8 py-3 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95',
              isVictory
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30'
                : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30'
            )}
          >
            {isVictory ? '继续挑战' : '再来一次'}
          </button>

          <button
            onClick={goToMenu}
            className="px-8 py-3 rounded-xl font-bold text-white/70 bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            返回主菜单
          </button>
        </div>
      </div>

      {isVictory && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
