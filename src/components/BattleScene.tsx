import { useGameStore } from '@/store/gameStore';
import ElementCard from './ElementCard';
import CharacterDisplay from './CharacterDisplay';
import ComboEffect from './ComboEffect';
import { findCombo } from '@/data/gameData';
import { cn } from '@/lib/utils';

interface BattleSceneProps {
  mode?: 'battle' | 'challenge';
}

export default function BattleScene({ mode = 'battle' }: BattleSceneProps) {
  const {
    player,
    enemy,
    turn,
    selectCard,
    deselectCard,
    playSelectedCards,
    isAnimating,
    showComboEffect,
    currentCombo,
    streak,
    score,
    goToMenu,
  } = useGameStore();

  const selectedCards = player.selectedCards;

  const previewCombo = selectedCards.length === 2
    ? findCombo(selectedCards[0].element, selectedCards[1].element)
    : null;

  const canPlay = selectedCards.length === 2 && previewCombo && !isAnimating;

  const handleCardClick = (card: typeof selectedCards[0]) => {
    if (isAnimating) return;
    if (selectedCards.find((c) => c.id === card.id)) {
      deselectCard(card.id);
    } else {
      selectCard(card);
    }
  };

  const handlePlay = () => {
    if (canPlay) {
      playSelectedCards();
    }
  };

  if (!enemy) return null;

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950" />

      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between px-8 py-4 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <button
          onClick={goToMenu}
          className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white/70 hover:text-white transition-colors"
        >
          ← 返回
        </button>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-white/50">回合</div>
            <div className="text-2xl font-bold text-white">{turn}</div>
          </div>

          {mode === 'challenge' && (
            <>
              <div className="text-center">
                <div className="text-xs text-white/50">连击</div>
                <div className="text-2xl font-bold text-amber-400">{streak}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-white/50">分数</div>
                <div className="text-2xl font-bold text-emerald-400">{score}</div>
              </div>
            </>
          )}
        </div>

        <div className="text-white/50 text-sm">
          牌库: {player.deck.length}
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-col items-center justify-center py-8">
        <div className="mb-8">
          <CharacterDisplay
            character={enemy}
            showIntent
            intent={enemy.intent}
            intentValue={enemy.intentValue}
          />
        </div>

        <div className="relative w-full max-w-md h-1 flex items-center justify-center my-4">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative px-4 py-1 bg-slate-800 rounded-full border border-white/10">
            <span className="text-white/50 text-sm">VS</span>
          </div>
        </div>

        <div className="mt-8">
          <CharacterDisplay character={player} isPlayer />
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-6">
        {previewCombo && (
          <div className="text-center mb-4">
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600/50 to-blue-600/50 border border-purple-400/30">
              <span className="text-white font-bold">{previewCombo.name}</span>
              <span className="text-white/60 ml-2">- {previewCombo.description}</span>
            </div>
          </div>
        )}

        <div className="flex justify-center items-end gap-2 mb-6 px-4">
          {player.hand.map((card, index) => {
            const isSelected = selectedCards.find((c) => c.id === card.id);
            return (
              <div
                key={card.id}
                className="transition-all duration-300"
                style={{
                  transform: `rotate(${(index - (player.hand.length - 1) / 2) * 3}deg)`,
                  transformOrigin: 'bottom center',
                }}
              >
                <ElementCard
                  card={card}
                  isSelected={!!isSelected}
                  onClick={() => handleCardClick(card)}
                  disabled={isAnimating}
                  size="md"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handlePlay}
            disabled={!canPlay}
            className={cn(
              'px-12 py-3 rounded-xl font-bold text-lg transition-all duration-300',
              canPlay
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            )}
          >
            {selectedCards.length === 0
              ? '选择两张卡牌'
              : selectedCards.length === 1
              ? '再选一张'
              : previewCombo
              ? `释放 ${previewCombo.name}!`
              : '无效组合'}
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={cn(
                'w-24 h-32 rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-300',
                selectedCards[i]
                  ? 'border-amber-400/50 bg-amber-400/10'
                  : 'border-white/10 bg-white/5'
              )}
            >
              {selectedCards[i] ? (
                <span className="text-3xl">{selectedCards[i].element === 'fire' ? '🔥' : selectedCards[i].element === 'water' ? '💧' : selectedCards[i].element === 'earth' ? '🌍' : '🌪️'}</span>
              ) : (
                <span className="text-white/20 text-2xl">?</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {currentCombo && (
        <ComboEffect combo={currentCombo} show={showComboEffect} />
      )}
    </div>
  );
}
