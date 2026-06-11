import { useGameStore } from '@/store/gameStore';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { GameSaveSlot, GameMode } from '@/types/game';

const modeNames: Record<GameMode, string> = {
  classic: '经典对战',
  challenge: '挑战模式',
  endless: '无尽模式',
  quick: '快速对战',
  duo: '双人对战',
};

interface SaveManagerProps {
  showSaveOption?: boolean;
  onClose?: () => void;
}

export default function SaveManager({ showSaveOption = true, onClose }: SaveManagerProps) {
  const { 
    currentAccount, 
    getAccountSaveSlots, 
    saveGameToSlot, 
    loadGameFromSlot, 
    removeSaveSlot, 
    renameGameSaveSlot,
    setShowSaveManager,
    phase,
  } = useGameStore();

  const [slots, setSlots] = useState<GameSaveSlot[]>([]);
  const [renamingSlot, setRenamingSlot] = useState<1 | 2 | 3 | null>(null);
  const [renameText, setRenameText] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    refreshSlots();
  }, [currentAccount]);

  const refreshSlots = () => {
    setSlots(getAccountSaveSlots());
  };

  const handleSave = (slotId: 1 | 2 | 3) => {
    try {
      saveGameToSlot(slotId);
      setActionSuccess(`已保存到存档 ${slotId}`);
      refreshSlots();
      setTimeout(() => setActionSuccess(null), 2000);
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  const handleLoad = (slotId: 1 | 2 | 3) => {
    const slot = slots.find(s => s.slotId === slotId);
    if (!slot) return;
    
    if (!confirm(`确定要读取「${slot.slotName}」吗？当前进度将会丢失。`)) return;
    
    const success = loadGameFromSlot(slotId);
    if (success) {
      setActionSuccess(`已读取存档 ${slotId}`);
      refreshSlots();
      setTimeout(() => {
        setActionSuccess(null);
        onClose?.();
      }, 1000);
    }
  };

  const handleDelete = (slotId: 1 | 2 | 3) => {
    const slot = slots.find(s => s.slotId === slotId);
    if (!slot) return;
    
    if (!confirm(`确定要删除「${slot.slotName}」吗？此操作不可撤销！`)) return;
    
    removeSaveSlot(slotId);
    refreshSlots();
  };

  const handleStartRename = (slotId: 1 | 2 | 3, currentName: string) => {
    setRenamingSlot(slotId);
    setRenameText(currentName);
  };

  const handleConfirmRename = (slotId: 1 | 2 | 3) => {
    if (!renameText.trim()) return;
    renameGameSaveSlot(slotId, renameText.trim());
    setRenamingSlot(null);
    setRenameText('');
    refreshSlots();
  };

  const getSlotData = (slotId: 1 | 2 | 3) => {
    return slots.find(s => s.slotId === slotId);
  };

  const renderSlot = (slotId: 1 | 2 | 3) => {
    const slot = getSlotData(slotId);
    const isRenaming = renamingSlot === slotId;

    const slotColors: Record<1 | 2 | 3, string> = {
      1: 'from-blue-600/20 via-blue-500/10 to-blue-600/20 border-blue-500/30',
      2: 'from-purple-600/20 via-purple-500/10 to-purple-600/20 border-purple-500/30',
      3: 'from-emerald-600/20 via-emerald-500/10 to-emerald-600/20 border-emerald-500/30',
    };

    const slotGlowColors: Record<1 | 2 | 3, string> = {
      1: 'shadow-blue-500/20',
      2: 'shadow-purple-500/20',
      3: 'shadow-emerald-500/20',
    };

    return (
      <div
        key={slotId}
        className={cn(
          'relative rounded-2xl p-5 border-2 transition-all duration-300',
          slot 
            ? `bg-gradient-to-br ${slotColors[slotId]} shadow-lg ${slotGlowColors[slotId]}`
            : 'bg-slate-800/30 border-white/10 border-dashed'
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-white/40 mb-1">存档槽 {slotId}</div>
            {isRenaming ? (
              <input
                type="text"
                value={renameText}
                onChange={(e) => setRenameText(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-700 text-white border border-amber-500/50 focus:outline-none focus:border-amber-400 text-sm w-32"
                autoFocus
                maxLength={16}
              />
            ) : (
              <div className="text-lg font-bold text-white">
                {slot?.slotName || `存档 ${slotId}`}
              </div>
            )}
          </div>
          {slot && !isRenaming && (
            <button
              onClick={() => handleStartRename(slotId, slot.slotName)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
              title="重命名"
            >
              ✏️
            </button>
          )}
        </div>

        {slot ? (
          <>
            <div className="space-y-2 mb-4">
              {slot.battleData ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/40">模式:</span>
                    <span className="text-amber-300 font-semibold">{modeNames[slot.battleData.mode]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/40">进度:</span>
                    <span className="text-white/80">
                      第 {slot.battleData.level} 关
                      {slot.battleData.mode === 'challenge' || slot.battleData.mode === 'endless' 
                        ? ` · 第 ${slot.battleData.wave} 波`
                        : ` / ${slot.battleData.maxLevel}`
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/40">回合:</span>
                    <span className="text-white/80">{slot.battleData.turn}</span>
                  </div>
                  {(slot.battleData.mode === 'challenge' || slot.battleData.mode === 'endless') && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/40">得分:</span>
                      <span className="text-emerald-400 font-semibold">{slot.battleData.score}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-white/50">仅永久存档（无战斗进度）</div>
              )}
              
              <div className="flex items-center gap-2 text-sm pt-2 border-t border-white/10">
                <span className="text-white/40">精华:</span>
                <span className="text-purple-300 font-semibold">💎 {slot.permanentData.elementEssence}</span>
              </div>
              
              <div className="text-xs text-white/30">
                保存于 {new Date(slot.savedAt).toLocaleString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleLoad(slotId)}
                className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/80 to-orange-500/80 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all duration-300"
              >
                📂 读取
              </button>
              {showSaveOption && phase === 'battle' && (
                <button
                  onClick={() => handleSave(slotId)}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold transition-all duration-300"
                >
                  💾 保存
                </button>
              )}
              <button
                onClick={() => handleDelete(slotId)}
                className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm font-bold transition-all duration-300"
                title="删除"
              >
                🗑️
              </button>
              {isRenaming && (
                <>
                  <button
                    onClick={() => handleConfirmRename(slotId)}
                    className="px-3 py-2 rounded-xl bg-emerald-500/50 hover:bg-emerald-500/70 text-white text-sm font-bold transition-all"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => { setRenamingSlot(null); setRenameText(''); }}
                    className="px-3 py-2 rounded-xl bg-slate-600/60 hover:bg-slate-500/60 text-white/80 text-sm font-bold transition-all"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-3 text-white/20">📭</div>
            <div className="text-sm text-white/40 mb-4">空存档槽</div>
            {showSaveOption && phase === 'battle' && (
              <button
                onClick={() => handleSave(slotId)}
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/60 to-teal-500/60 hover:from-emerald-400/80 hover:to-teal-400/80 text-white font-bold transition-all duration-300"
              >
                💾 保存到此处
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 max-w-3xl w-full mx-4 border border-amber-500/30 shadow-2xl shadow-amber-500/10 animate-rise">
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-3xl font-bold text-gradient-gold"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            💾 存档管理
          </h2>
          {currentAccount && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-white/10">
              <span className="text-2xl">{currentAccount.avatar}</span>
              <span className="text-white/80 font-semibold">{currentAccount.name}</span>
            </div>
          )}
        </div>

        {actionSuccess && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-semibold animate-pulse">
            {actionSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((slotId) => renderSlot(slotId as 1 | 2 | 3))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => { setShowSaveManager(false); onClose?.(); }}
            className="px-8 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 text-white/80 font-bold transition-all duration-300 border border-white/10"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
