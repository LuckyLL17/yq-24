import { useState, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ELEMENTS, DISASSEMBLE_ESSENCE, SYNTHESIZE_ESSENCE, RARITY_NAMES } from '@/data/gameData';
import { cn } from '@/lib/utils';
import type { Rarity, ElementType, CollectedCard } from '@/types/game';
import { X, Sparkles, Hammer, Package, Trash2, ChevronDown, ChevronUp, StickyNote, Tag } from 'lucide-react';
import CardNoteModal from './CardNoteModal';

type TabType = 'collection' | 'disassemble' | 'synthesize';

export default function MyCards() {
  const {
    elementEssence,
    toggleMyCards,
    getCollection,
    getCollectionStats,
    disassembleCard,
    disassembleAllDuplicates,
    synthesizeCard,
    getSynthesizeCost,
    getDisassembleValue,
    getAllCardTemplates,
    equipMyCard,
    unequipMyCard,
    getEquippedMyCards,
    getCardTags,
    getCardNote,
    getCardsByTag,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('collection');
  const [rarityFilter, setRarityFilter] = useState<'all' | Rarity>('all');
  const [elementFilter, setElementFilter] = useState<'all' | ElementType>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [message, setMessage] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CollectedCard | null>(null);
  const [showNoteModal, setShowNoteModal] = useState<CollectedCard | null>(null);
  const [showSynthesizeConfirm, setShowSynthesizeConfirm] = useState<{ element: ElementType; name: string; rarity: Rarity } | null>(null);

  const collection = getCollection();
  const collectionStats = getCollectionStats();
  const allTemplates = getAllCardTemplates();
  const cardTags = getCardTags();

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const filteredCollection = useMemo(() => {
    let result = [...collection];
    if (rarityFilter !== 'all') {
      result = result.filter((c) => c.rarity === rarityFilter);
    }
    if (elementFilter !== 'all') {
      result = result.filter((c) => c.element === elementFilter);
    }
    if (tagFilter !== 'all') {
      const taggedCardIds = getCardsByTag(tagFilter).map((c) => c.id);
      result = result.filter((c) => taggedCardIds.includes(c.id));
    }
    return result.sort((a, b) => {
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      }
      return a.element.localeCompare(b.element);
    });
  }, [collection, rarityFilter, elementFilter, tagFilter, getCardsByTag]);

  const duplicateCards = useMemo(() => {
    return collection.filter((c) => c.count > 1);
  }, [collection]);

  const totalDisassembleValue = useMemo(() => {
    return duplicateCards.reduce((sum, card) => {
      return sum + (card.count - 1) * getDisassembleValue(card.rarity);
    }, 0);
  }, [duplicateCards, getDisassembleValue]);

  const filteredTemplates = useMemo(() => {
    let result = [...allTemplates];
    if (rarityFilter !== 'all') {
      result = result.filter((t) => t.rarity === rarityFilter);
    }
    if (elementFilter !== 'all') {
      result = result.filter((t) => t.element === elementFilter);
    }
    return result.sort((a, b) => {
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      }
      return a.element.localeCompare(b.element);
    });
  }, [allTemplates, rarityFilter, elementFilter]);

  const handleDisassemble = (cardId: string) => {
    const card = collection.find((c) => c.id === cardId);
    if (!card || card.count <= 1) return;

    const result = disassembleCard(cardId, 1);
    if (result !== null) {
      showMessage(`分解成功！获得 ${result} 元素精华`);
    }
  };

  const handleDisassembleAll = () => {
    if (duplicateCards.length === 0) {
      showMessage('没有多余的卡牌可以分解');
      return;
    }
    const total = disassembleAllDuplicates();
    showMessage(`一键分解完成！共获得 ${total} 元素精华`);
  };

  const handleSynthesize = (element: ElementType, name: string, rarity: Rarity) => {
    const cost = getSynthesizeCost(rarity);
    if (elementEssence < cost) {
      showMessage('元素精华不足！');
      return;
    }
    setShowSynthesizeConfirm({ element, name, rarity });
  };

  const confirmSynthesize = () => {
    if (!showSynthesizeConfirm) return;
    const result = synthesizeCard(showSynthesizeConfirm.element, showSynthesizeConfirm.name);
    if (result) {
      showMessage(`合成成功！获得 ${result.name}`);
      setShowSynthesizeConfirm(null);
    }
  };

  const isCardOwned = (name: string, element: ElementType) => {
    return collection.some((c) => c.name === name && c.element === element);
  };

  const getOwnedCount = (name: string, element: ElementType) => {
    const card = collection.find((c) => c.name === name && c.element === element);
    return card?.count || 0;
  };

  const isCardEquipped = (cardId: string) => {
    return getEquippedMyCards().some(c => c.id === cardId);
  };

  const handleEquipCard = (cardId: string) => {
    const equippedCount = getEquippedMyCards().length;
    if (equippedCount >= 3) {
      showMessage('出战卡组已满（最多3张）');
      return;
    }
    const result = equipMyCard(cardId);
    if (result) {
      showMessage('已装备到出战卡组');
    }
  };

  const handleUnequipCard = (cardId: string) => {
    unequipMyCard(cardId);
    showMessage('已从出战卡组卸下');
  };

  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityBgColors: Record<Rarity, string> = {
    common: 'from-gray-500/20 to-gray-700/20 border-gray-500/30',
    rare: 'from-blue-500/20 to-blue-700/20 border-blue-500/30',
    epic: 'from-purple-500/20 to-purple-700/20 border-purple-500/30',
    legendary: 'from-amber-500/20 to-orange-600/20 border-amber-500/30',
  };

  const rarityGlowColors: Record<Rarity, string> = {
    common: 'shadow-gray-500/20',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-purple-500/30',
    legendary: 'shadow-amber-500/40',
  };

  const elements: ElementType[] = ['fire', 'water', 'earth', 'wind', 'lightning', 'light', 'dark'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-emerald-500/30 shadow-2xl overflow-hidden animate-rise">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🃏</div>
              <div>
                <h2
                  className="text-3xl font-bold text-gradient-gold"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  我的卡牌
                </h2>
                <p className="text-white/50 text-sm">收藏、分解与合成你的元素卡牌</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <span className="text-2xl">💎</span>
                <span className="text-xl font-bold text-amber-400">{elementEssence}</span>
              </div>
              <button
                onClick={toggleMyCards}
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white/70 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-white/30"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <TabButton
              active={activeTab === 'collection'}
              onClick={() => setActiveTab('collection')}
              icon="📚"
              label="收藏图鉴"
            />
            <TabButton
              active={activeTab === 'disassemble'}
              onClick={() => setActiveTab('disassemble')}
              icon="🔨"
              label="分解转化"
              badge={duplicateCards.length > 0 ? duplicateCards.length : undefined}
            />
            <TabButton
              active={activeTab === 'synthesize'}
              onClick={() => setActiveTab('synthesize')}
              icon="✨"
              label="卡牌合成"
            />
          </div>

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex gap-1">
              <button
                onClick={() => setElementFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  elementFilter === 'all'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700/50 text-white/50 hover:bg-slate-600/50'
                )}
              >
                全部元素
              </button>
              {elements.map((el) => (
                <button
                  key={el}
                  onClick={() => setElementFilter(el)}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all text-lg',
                    elementFilter === el
                      ? 'bg-emerald-500/30 ring-2 ring-emerald-400'
                      : 'bg-slate-700/50 hover:bg-slate-600/50'
                  )}
                  title={ELEMENTS[el].name}
                >
                  {ELEMENTS[el].icon}
                </button>
              ))}
            </div>

            <div className="flex gap-1">
              {(['all', 'legendary', 'epic', 'rare', 'common'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRarityFilter(r)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    rarityFilter === r
                      ? r === 'all'
                        ? 'bg-emerald-500 text-white'
                        : rarityColors[r] + ' bg-white/10 border border-white/20'
                      : 'bg-slate-700/50 text-white/50 hover:bg-slate-600/50'
                  )}
                >
                  {r === 'all' ? '全部' : RARITY_NAMES[r]}
                </button>
              ))}
            </div>

            {activeTab === 'collection' && cardTags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-white/40" />
                <div className="flex gap-1 flex-wrap">
                  <button
                    onClick={() => setTagFilter('all')}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold transition-all',
                      tagFilter === 'all'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700/50 text-white/50 hover:bg-slate-600/50'
                    )}
                  >
                    全部标签
                  </button>
                  {cardTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setTagFilter(tag.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1',
                        tagFilter === tag.id
                          ? 'text-white ring-2 ring-offset-1 ring-offset-slate-900'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      )}
                      style={{
                        backgroundColor: tagFilter === tag.id ? tag.color : undefined,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'collection' && (
              <CollectionView
                cards={filteredCollection}
                totalCards={collectionStats.total}
                uniqueCards={collectionStats.unique}
                equippedCards={getEquippedMyCards()}
                onEquip={handleEquipCard}
                onUnequip={handleUnequipCard}
                isCardEquipped={isCardEquipped}
                onNote={(card) => setShowNoteModal(card)}
                getCardNote={getCardNote}
                cardTags={cardTags}
              />
            )}

            {activeTab === 'disassemble' && (
              <DisassembleView
                cards={filteredCollection.filter((c) => c.count > 1)}
                totalDisassembleValue={totalDisassembleValue}
                onDisassemble={handleDisassemble}
                onDisassembleAll={handleDisassembleAll}
                hasDuplicates={duplicateCards.length > 0}
              />
            )}

            {activeTab === 'synthesize' && (
              <SynthesizeView
                templates={filteredTemplates}
                elementEssence={elementEssence}
                isCardOwned={isCardOwned}
                getOwnedCount={getOwnedCount}
                onSynthesize={handleSynthesize}
              />
            )}
          </div>
        </div>

        {message && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-slate-900/90 border border-emerald-500/50 text-emerald-400 font-semibold z-20 animate-bounce-in">
            {message}
          </div>
        )}

        {showSynthesizeConfirm && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full mx-4 border-2 border-emerald-500/30 animate-rise">
              <div className="text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  确认合成
                </h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">{ELEMENTS[showSynthesizeConfirm.element].icon}</span>
                  <span className={cn('font-bold', rarityColors[showSynthesizeConfirm.rarity])}>
                    {showSynthesizeConfirm.name}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-6">
                  消耗 <span className="text-amber-400 font-bold">💎 {getSynthesizeCost(showSynthesizeConfirm.rarity)}</span> 元素精华
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSynthesizeConfirm(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-700/50 text-white/70 hover:bg-slate-600/50 font-semibold transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmSynthesize}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
                  >
                    确认合成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showNoteModal && (
          <CardNoteModal
            card={showNoteModal}
            onClose={() => setShowNoteModal(null)}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 relative',
        active
          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
          : 'bg-slate-700/50 text-white/60 hover:bg-slate-600/50 hover:text-white/80 border border-white/10'
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

function CollectionView({
  cards,
  totalCards,
  uniqueCards,
  equippedCards,
  onEquip,
  onUnequip,
  isCardEquipped,
  onNote,
  getCardNote,
  cardTags,
}: {
  cards: CollectedCard[];
  totalCards: number;
  uniqueCards: number;
  equippedCards: CollectedCard[];
  onEquip: (cardId: string) => void;
  onUnequip: (cardId: string) => void;
  isCardEquipped: (cardId: string) => boolean;
  onNote: (card: CollectedCard) => void;
  getCardNote: (cardId: string) => ReturnType<ReturnType<typeof useGameStore.getState>['getCardNote']>;
  cardTags: ReturnType<ReturnType<typeof useGameStore.getState>['getCardTags']>;
}) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-white/50 text-lg mb-2">收藏空空如也</p>
        <p className="text-white/30 text-sm">购买卡包开启收集之旅吧！</p>
      </div>
    );
  }

  return (
    <div>
      {/* 出战卡组 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl border border-emerald-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <h3 className="text-lg font-bold text-emerald-300" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              出战卡组
            </h3>
            <span className="text-xs text-white/50">({equippedCards.length}/3)</span>
          </div>
          <span className="text-xs text-white/40">战斗中每局限用1次，击败敌人后重置</span>
        </div>
        <div className="flex gap-3">
          {[0, 1, 2].map((slot) => {
            const card = equippedCards[slot];
            return (
              <div
                key={slot}
                className={cn(
                  'w-20 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all',
                  card
                    ? 'border-emerald-400/50 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5'
                )}
              >
                {card ? (
                  <div className="relative w-full h-full p-2">
                    <div className="text-center">
                      <div className="text-2xl mb-1">{ELEMENTS[card.element].icon}</div>
                      <div className="text-[10px] font-bold text-white truncate">{card.name}</div>
                      <div className="text-[9px] text-amber-400">⚔️ {card.power}</div>
                    </div>
                    <button
                      onClick={() => onUnequip(card.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-xs flex items-center justify-center transition-all"
                      title="卸下"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-white/20 text-2xl">+</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6 mb-4 text-sm">
        <span className="text-white/50">
          已收集: <span className="text-emerald-400 font-bold">{uniqueCards}</span> 种
        </span>
        <span className="text-white/50">
          总计: <span className="text-amber-400 font-bold">{totalCards}</span> 张
        </span>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {cards.map((card) => (
          <CollectionCard
            key={card.id}
            card={card}
            isEquipped={isCardEquipped(card.id)}
            onEquip={() => onEquip(card.id)}
            onUnequip={() => onUnequip(card.id)}
            onNote={() => onNote(card)}
            note={getCardNote(card.id)}
            cardTags={cardTags}
          />
        ))}
      </div>
    </div>
  );
}

function DisassembleView({
  cards,
  totalDisassembleValue,
  onDisassemble,
  onDisassembleAll,
  hasDuplicates,
}: {
  cards: CollectedCard[];
  totalDisassembleValue: number;
  onDisassemble: (cardId: string) => void;
  onDisassembleAll: () => void;
  hasDuplicates: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/50">
            多余卡牌: <span className="text-amber-400 font-bold">{cards.length}</span> 种
          </span>
          <span className="text-white/50">
            可获得: <span className="text-emerald-400 font-bold">💎 {totalDisassembleValue}</span>
          </span>
        </div>
        <button
          onClick={onDisassembleAll}
          disabled={!hasDuplicates}
          className={cn(
            'px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all',
            hasDuplicates
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30'
              : 'bg-slate-700/50 text-white/30 cursor-not-allowed'
          )}
        >
          <Trash2 size={16} />
          一键分解多余
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✨</div>
          <p className="text-white/50 text-lg mb-2">没有多余的卡牌</p>
          <p className="text-white/30 text-sm">每种卡牌保留至少一张，多余的可以分解为元素精华</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <DisassembleCard key={card.id} card={card} onDisassemble={onDisassemble} />
          ))}
        </div>
      )}
    </div>
  );
}

function SynthesizeView({
  templates,
  elementEssence,
  isCardOwned,
  getOwnedCount,
  onSynthesize,
}: {
  templates: Array<{ element: ElementType; name: string; description: string; power: number; rarity: Rarity }>;
  elementEssence: number;
  isCardOwned: (name: string, element: ElementType) => boolean;
  getOwnedCount: (name: string, element: ElementType) => number;
  onSynthesize: (element: ElementType, name: string, rarity: Rarity) => void;
}) {
  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityBgColors: Record<Rarity, string> = {
    common: 'from-gray-500/20 to-gray-700/20 border-gray-500/30',
    rare: 'from-blue-500/20 to-blue-700/20 border-blue-500/30',
    epic: 'from-purple-500/20 to-purple-700/20 border-purple-500/30',
    legendary: 'from-amber-500/20 to-orange-600/20 border-amber-500/30',
  };

  return (
    <div>
      <div className="mb-4 text-sm text-white/50">
        使用元素精华合成指定卡牌，获取你想要的卡牌！
      </div>
      <div className="grid grid-cols-4 gap-4">
        {templates.map((template, index) => {
          const owned = isCardOwned(template.name, template.element);
          const ownedCount = getOwnedCount(template.name, template.element);
          const cost = SYNTHESIZE_ESSENCE[template.rarity];
          const canAfford = elementEssence >= cost;

          return (
            <div
              key={`${template.element}_${template.name}_${index}`}
              className={cn(
                'group relative rounded-xl overflow-hidden bg-slate-800/50 border transition-all duration-300',
                rarityBgColors[template.rarity],
                'hover:scale-105 hover:shadow-lg',
                canAfford ? 'cursor-pointer' : 'opacity-60'
              )}
              onClick={() => canAfford && onSynthesize(template.element, template.name, template.rarity)}
            >
              <div className="relative p-4 flex flex-col items-center text-center">
                {owned && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold">
                    已有 ×{ownedCount}
                  </div>
                )}
                <div className="text-4xl mb-2">{ELEMENTS[template.element].icon}</div>
                <h4 className="text-sm font-bold text-white mb-1 truncate w-full">{template.name}</h4>
                <div className={cn('text-xs font-semibold mb-1', rarityColors[template.rarity])}>
                  {RARITY_NAMES[template.rarity]}
                </div>
                <div className="text-xs text-amber-400/80 mb-2">⚔️ {template.power}</div>
                <p className="text-[10px] text-white/40 mb-3 h-8 line-clamp-2">{template.description}</p>
                <button
                  className={cn(
                    'w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1',
                    canAfford
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:scale-105'
                      : 'bg-slate-700/50 text-white/30 cursor-not-allowed'
                  )}
                >
                  <Sparkles size={12} />
                  <span>💎 {cost}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CollectionCard({ card, isEquipped, onEquip, onUnequip, onNote, note, cardTags }: { card: CollectedCard; isEquipped: boolean; onEquip: () => void; onUnequip: () => void; onNote: () => void; note?: ReturnType<ReturnType<typeof useGameStore.getState>['getCardNote']>; cardTags: ReturnType<ReturnType<typeof useGameStore.getState>['getCardTags']>; }) {
  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const hasNote = note && (note.content.trim() || note.tags.length > 0);
  const noteTagNames = note?.tags
    .map((tagId) => cardTags.find((t) => t.id === tagId))
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden bg-slate-800/50 border transition-all duration-300',
        isEquipped
          ? 'border-emerald-400/60 bg-emerald-500/10 ring-2 ring-emerald-400/30'
          : 'border-white/10 hover:border-emerald-500/40 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20'
      )}
    >
      {isEquipped && (
        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold z-10">
          已装备
        </div>
      )}
      {hasNote && (
        <div className="absolute top-1 right-1 z-10">
          <StickyNote size={14} className="text-amber-400 drop-shadow-lg" />
        </div>
      )}
      <div className="relative p-3 flex flex-col items-center text-center">
        <div className="text-3xl mb-2">{ELEMENTS[card.element].icon}</div>
        <h4 className="text-xs font-bold text-white mb-1 truncate w-full">{card.name}</h4>
        <div className={cn('text-[10px] font-semibold mb-1', rarityColors[card.rarity])}>
          {RARITY_NAMES[card.rarity]}
        </div>
        <div className="text-xs text-amber-400 font-bold">
          ×{card.count}
        </div>
        <div className="text-[10px] text-white/40 mt-1">
          ⚔️ {card.power}
        </div>

        {noteTagNames && noteTagNames.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap justify-center">
            {noteTagNames.map((tag) => (
              tag && (
                <span
                  key={tag.id}
                  className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              )
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <div className="flex gap-2">
            {isEquipped ? (
              <button
                onClick={onUnequip}
                className="px-2 py-1 rounded bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold transition-all"
              >
                卸下
              </button>
            ) : (
              <button
                onClick={onEquip}
                className="px-2 py-1 rounded bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
              >
                装备
              </button>
            )}
          </div>
          <button
            onClick={onNote}
            className="px-2 py-1 rounded bg-amber-500/80 hover:bg-amber-500 text-white text-xs font-semibold transition-all flex items-center gap-1"
          >
            <StickyNote size={12} />
            {hasNote ? '编辑备注' : '添加备注'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DisassembleCard({
  card,
  onDisassemble,
}: {
  card: CollectedCard;
  onDisassemble: (cardId: string) => void;
}) {
  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const disassembleValue = DISASSEMBLE_ESSENCE[card.rarity];
  const extraCount = card.count - 1;

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden bg-slate-800/50 border transition-all duration-300',
        'border-white/10 hover:border-red-500/40'
      )}
    >
      <div className="relative p-4 flex flex-col items-center text-center">
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold">
          多余 {extraCount}
        </div>
        <div className="text-4xl mb-2">{ELEMENTS[card.element].icon}</div>
        <h4 className="text-sm font-bold text-white mb-1 truncate w-full">{card.name}</h4>
        <div className={cn('text-xs font-semibold mb-2', rarityColors[card.rarity])}>
          {RARITY_NAMES[card.rarity]}
        </div>
        <div className="text-xs text-white/50 mb-3">
          持有: <span className="text-white font-bold">{card.count}</span> 张
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDisassemble(card.id);
          }}
          className="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-300 hover:from-red-500/50 hover:to-orange-500/50 transition-all flex items-center justify-center gap-1 border border-red-500/30"
        >
          <Hammer size={12} />
          分解 · 💎{disassembleValue}
        </button>
      </div>
    </div>
  );
}
