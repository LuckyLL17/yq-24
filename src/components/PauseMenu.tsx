import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';

interface PauseMenuProps {
  onClose?: () => void;
}

export default function PauseMenu({ onClose }: PauseMenuProps) {
  const { 
    isPaused, 
    resumeGame, 
    goToMenu, 
    restartGame, 
    toggleSaveManager,
    saveGame,
  } = useGameStore();

  if (!isPaused) return null;

  const handleResume = () => {
    resumeGame();
    onClose?.();
  };

  const handleSave = () => {
    saveGame();
  };

  const handleSaveToSlot = () => {
    toggleSaveManager();
  };

  const handleRestart = () => {
    if (!confirm('确定要重新开始吗？当前战斗进度将会丢失！')) return;
    restartGame();
    onClose?.();
  };

  const handleQuit = () => {
    if (!confirm('确定要返回主菜单吗？当前进度会自动保存。')) return;
    goToMenu();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-amber-500/30 shadow-2xl shadow-amber-500/10 animate-rise">
        <h2 
          className="text-3xl font-bold text-center mb-8 text-gradient-gold"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          ⏸️ 游戏暂停
        </h2>

        <div className="space-y-3">
          <button
            onClick={handleResume}
            className={cn(
              'w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300',
              'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white',
              'hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400',
              'hover:scale-[1.02] active:scale-[0.98]',
              'shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
              'border-2 border-emerald-400/30'
            )}
          >
            ▶️ 继续游戏
          </button>

          <button
            onClick={handleSave}
            className={cn(
              'w-full px-6 py-3.5 rounded-xl font-bold transition-all duration-300',
              'bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white',
              'hover:from-blue-400 hover:to-indigo-400',
              'hover:scale-[1.02] active:scale-[0.98]',
              'shadow-lg shadow-blue-500/20',
              'border border-blue-400/30'
            )}
          >
            💾 快速保存
          </button>

          <button
            onClick={handleSaveToSlot}
            className={cn(
              'w-full px-6 py-3.5 rounded-xl font-bold transition-all duration-300',
              'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white',
              'hover:from-purple-400 hover:to-pink-400',
              'hover:scale-[1.02] active:scale-[0.98]',
              'shadow-lg shadow-purple-500/20',
              'border border-purple-400/30'
            )}
          >
            📁 存档管理 (3个槽位)
          </button>

          <div className="my-4 border-t border-white/10" />

          <button
            onClick={handleRestart}
            className={cn(
              'w-full px-6 py-3.5 rounded-xl font-bold transition-all duration-300',
              'bg-gradient-to-r from-amber-500/80 to-orange-500/80 text-white',
              'hover:from-amber-400 hover:to-orange-400',
              'hover:scale-[1.02] active:scale-[0.98]',
              'shadow-lg shadow-orange-500/20',
              'border border-amber-400/30'
            )}
          >
            🔄 重新开始
          </button>

          <button
            onClick={handleQuit}
            className={cn(
              'w-full px-6 py-3.5 rounded-xl font-bold transition-all duration-300',
              'bg-slate-700/60 text-white/80 hover:bg-slate-600/60',
              'hover:scale-[1.02] active:scale-[0.98]',
              'border border-white/10 hover:border-white/20'
            )}
          >
            🏠 返回主菜单
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-center text-xs text-white/40">
            提示：每个账号最多可保存 3 个游戏进度
          </p>
        </div>
      </div>
    </div>
  );
}
