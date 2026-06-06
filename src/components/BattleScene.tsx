import { useGameStore } from '@/store/gameStore';
import ElementCard from './ElementCard';
import CharacterDisplay from './CharacterDisplay';
import ComboEffect from './ComboEffect';
import { findCombo, ELEMENTS } from '@/data/gameData';
import { cn } from '@/lib/utils';

export default function BattleScene() {
  const {
    player,
    enemy,
    turn,
    mode,
    wave,
    selectCard,
    deselectCard,
    playSelectedCards,
    isAnimating,
    showComboEffect,
    currentCombo,
    streak,
    score,
    goToMenu,
    floatingTexts,
    enemyShaking,
    playerShaking,
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

  const modeNames: Record<string, string> = {
    classic: '经典对战',
    challenge: '挑战模式',
    endless: '无尽模式',
    quick: '快速对战',
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden battle-ground">
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* 魔法光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

      {/* 顶部状态栏 */}
      <div className="relative z-20 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm">
        <button
          onClick={goToMenu}
          className="px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-white/70 hover:text-white transition-all duration-300 border border-white/10 hover:border-amber-500/30"
        >
          ← 返回菜单
        </button>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-xs text-white/50 mb-1">模式</div>
            <div className="text-lg font-bold text-amber-400" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              {modeNames[mode]}
            </div>
          </div>

          <div className="w-px h-10 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

          <div className="text-center">
            <div className="text-xs text-white/50 mb-1">回合</div>
            <div className="text-2xl font-black text-white text-stroke" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              {turn}
            </div>
          </div>

          {(mode === 'challenge' || mode === 'endless') && (
            <>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
              
              <div className="text-center">
                <div className="text-xs text-white/50 mb-1">波次</div>
                <div className="text-2xl font-black text-purple-400 text-stroke" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  {wave}
                </div>
              </div>

              <div className="w-px h-10 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

              <div className="text-center">
                <div className="text-xs text-white/50 mb-1">连击</div>
                <div className="text-2xl font-black text-amber-400 text-stroke" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  {streak}
                </div>
              </div>

              <div className="w-px h-10 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

              <div className="text-center">
                <div className="text-xs text-white/50 mb-1">得分</div>
                <div className="text-2xl font-black text-emerald-400 text-stroke" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  {score}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-white/60 text-sm">
          <span className="text-amber-400">🃏</span> 牌库: {player.deck.length}
        </div>
      </div>

      {/* 战场中央区域 */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-between py-6">
        {/* 敌方区域 */}
        <div className="relative">
          <div className="platform rounded-2xl px-16 py-6">
            <CharacterDisplay
              character={enemy}
              showIntent
              intent={enemy.intent}
              intentValue={enemy.intentValue}
              isShaking={enemyShaking}
              size="lg"
            />
          </div>
        </div>

        {/* 中间装饰分隔 */}
        <div className="relative w-full max-w-xl flex items-center justify-center py-2">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="relative px-6 py-1.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-full border border-amber-500/30">
            <span className="text-amber-400 font-bold text-sm tracking-widest" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              ⚔️ VS ⚔️
            </span>
          </div>
        </div>

        {/* 玩家区域 */}
        <div className="relative">
          <div className="platform rounded-2xl px-16 py-6">
            <CharacterDisplay
              character={player}
              isPlayer
              isShaking={playerShaking}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* 浮动伤害数字 */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className={cn(
            'fixed z-30 pointer-events-none text-4xl font-black text-stroke',
            ft.type === 'damage' && 'text-red-500 animate-damage-float',
            ft.type === 'heal' && 'text-green-400 animate-heal-float',
            ft.type === 'shield' && 'text-amber-400 animate-heal-float'
          )}
          style={{
            left: `${ft.x}%`,
            top: `${ft.y}%`,
            transform: 'translateX(-50%)',
            fontFamily: "'Cinzel Decorative', serif",
          }}
        >
          {ft.type === 'damage' && '-'}
          {ft.type === 'heal' && '+'}
          {ft.type === 'shield' && '🛡️+'}
          {ft.value}
        </div>
      ))}

      {/* 底部手牌区域 */}
      <div className="relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-4">
        {/* 组合预览 */}
        {previewCombo && selectedCards.length === 2 && (
          <div className="text-center mb-4 animate-rise">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gradient-to-r from-purple-900/70 via-indigo-900/70 to-purple-900/70 border border-purple-400/40 shadow-lg shadow-purple-500/20">
              <span className="text-lg">{ELEMENTS[previewCombo.elements[0]].icon}</span>
              <span className="text-amber-400">+</span>
              <span className="text-lg">{ELEMENTS[previewCombo.elements[1]].icon}</span>
              <span className="text-white/60 mx-1">=</span>
              <span className="text-gradient-gold font-bold text-lg" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                {previewCombo.name}
              </span>
              <span className="text-white/50 text-sm ml-2">- {previewCombo.description.slice(0, 20)}...</span>
            </div>
          </div>
        )}

        {/* 选中槽位提示 */}
        <div className="flex justify-center gap-6 mb-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={cn(
                'w-20 h-28 rounded-xl border-2 border-dashed flex items-center justify-center transition-all duration-300',
                selectedCards[i]
                  ? 'border-amber-400/60 bg-amber-400/10 scale-105'
                  : 'border-white/10 bg-white/5'
              )}
            >
              {selectedCards[i] ? (
                <div className="text-4xl animate-pulse">
                  {ELEMENTS[selectedCards[i].element].icon}
                </div>
              ) : (
                <span className="text-white/20 text-3xl">?</span>
              )}
            </div>
          ))}
        </div>

        {/* 手牌展示 */}
        <div className="flex justify-center items-end mb-4 px-4">
          <div className="flex items-end">
            {player.hand.map((card, index) => {
              const isSelected = selectedCards.find((c) => c.id === card.id);
              const totalCards = player.hand.length;
              const middleIndex = (totalCards - 1) / 2;
              const rotation = (index - middleIndex) * 4;
              const yOffset = Math.abs(index - middleIndex) * 5;

              return (
                <div
                  key={card.id}
                  className="transition-all duration-300 -ml-4 first:ml-0"
                  style={{
                    transform: `rotate(${rotation}deg) translateY(${yOffset}px)`,
                    transformOrigin: 'bottom center',
                    zIndex: isSelected ? 20 : index,
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
        </div>

        {/* 释放按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handlePlay}
            disabled={!canPlay}
            className={cn(
              'px-16 py-3 rounded-xl font-bold text-lg transition-all duration-300',
              'border-2',
              canPlay
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 border-amber-300/50'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
            )}
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            {selectedCards.length === 0
              ? '选择两张卡牌'
              : selectedCards.length === 1
              ? '再选一张'
              : previewCombo
              ? `✨ 释放 ${previewCombo.name}! ✨`
              : '无效组合'}
          </button>
        </div>
      </div>

      {/* 组合技能特效 */}
      {currentCombo && (
        <ComboEffect combo={currentCombo} show={showComboEffect} />
      )}
    </div>
  );
}
