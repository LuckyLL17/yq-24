import { useState, useMemo, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ELEMENTS, RARITY_NAMES } from '@/data/gameData';
import { cn } from '@/lib/utils';
import type { Rarity, ElementType, CollectedCard } from '@/types/game';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CardTemplate {
  element: ElementType;
  name: string;
  description: string;
  power: number;
  rarity: Rarity;
  skillType?: string;
  skillValue?: number;
}

export default function CardCollection() {
  const { toggleCollection, getCollection, getCollectionStats, getAllCardTemplates } = useGameStore();

  const [selectedCard, setSelectedCard] = useState<CardTemplate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rarityFilter, setRarityFilter] = useState<'all' | Rarity>('all');
  const [elementFilter, setElementFilter] = useState<'all' | ElementType>('all');
  const [isFlipping, setIsFlipping] = useState(false);

  const collection = getCollection();
  const collectionStats = getCollectionStats();
  const allTemplates = getAllCardTemplates();

  const CARDS_PER_PAGE = 12;

  const isCardOwned = (name: string, element: ElementType): CollectedCard | undefined => {
    return collection.find((c) => c.name === name && c.element === element);
  };

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

  const totalPages = Math.ceil(filteredTemplates.length / CARDS_PER_PAGE);

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredTemplates.slice(start, start + CARDS_PER_PAGE);
  }, [filteredTemplates, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rarityFilter, elementFilter]);

  const handleCardClick = (card: CardTemplate) => {
    setSelectedCard(card);
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 600);
  };

  const closeDetail = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setSelectedCard(null);
      setIsFlipping(false);
    }, 400);
  };

  const elements: ElementType[] = ['fire', 'water', 'earth', 'wind', 'lightning', 'light', 'dark'];

  const ownedCount = collection.length;
  const totalCount = allTemplates.length;
  const progressPercent = Math.round((ownedCount / totalCount) * 100);

  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityGlowColors: Record<Rarity, string> = {
    common: 'shadow-gray-500/20',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-purple-500/40',
    legendary: 'shadow-amber-500/50',
  };

  const rarityBorderColors: Record<Rarity, string> = {
    common: 'border-gray-500/30',
    rare: 'border-blue-500/50',
    epic: 'border-purple-500/60',
    legendary: 'border-amber-500/70',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-amber-500/30 shadow-2xl overflow-hidden animate-rise">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-30">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-amber-400 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  opacity: Math.random() * 0.6 + 0.2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏛️</div>
              <div>
                <h2
                  className="text-3xl font-bold text-gradient-gold"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  卡牌收藏
                </h2>
                <p className="text-white/50 text-sm">收集所有元素卡牌，完成你的图鉴</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-white/50 mb-1">收藏进度</div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-amber-400 font-bold text-sm">
                    {ownedCount}/{totalCount}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleCollection}
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white/70 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-white/30"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex gap-1">
              <button
                onClick={() => setElementFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  elementFilter === 'all'
                    ? 'bg-amber-500 text-white'
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
                      ? 'bg-amber-500/30 ring-2 ring-amber-400'
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
                        ? 'bg-amber-500 text-white'
                        : rarityColors[r] + ' bg-white/10 border border-white/20'
                      : 'bg-slate-700/50 text-white/50 hover:bg-slate-600/50'
                  )}
                >
                  {r === 'all' ? '全部' : RARITY_NAMES[r]}
                </button>
              ))}
            </div>

            <div className="ml-auto text-xs text-white/40">
              共 {filteredTemplates.length} 张卡牌
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {paginatedCards.map((card, index) => {
              const owned = isCardOwned(card.name, card.element);
              return (
                <CollectionCardDisplay
                  key={`${card.element}_${card.name}`}
                  card={card}
                  owned={!!owned}
                  count={owned?.count || 0}
                  onClick={() => handleCardClick(card)}
                  index={index}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                  currentPage === 1
                    ? 'bg-slate-800/50 text-white/20 cursor-not-allowed'
                    : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50 hover:text-white'
                )}
              >
                <ChevronLeft size={18} />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                const isNearby = Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages;
                if (!isNearby) {
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={page} className="text-white/30 px-1">...</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-9 h-9 rounded-lg text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-slate-700/50 text-white/60 hover:bg-slate-600/50 hover:text-white'
                    )}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                  currentPage === totalPages
                    ? 'bg-slate-800/50 text-white/20 cursor-not-allowed'
                    : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50 hover:text-white'
                )}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10">
            {Object.entries(collectionStats.byRarity).map(([rarity, count]) => (
              <div
                key={rarity}
                className="text-center p-2 rounded-lg bg-slate-800/30"
              >
                <div className={cn('text-lg font-bold', rarityColors[rarity as Rarity])}>
                  {count}
                </div>
                <div className="text-[10px] text-white/40">{RARITY_NAMES[rarity as Rarity]}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedCard && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeDetail}
          >
            <div
              className="relative animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
              style={{ perspective: '1000px' }}
            >
              <button
                onClick={closeDetail}
                className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white/70 hover:text-white transition-all flex items-center justify-center border border-white/20"
              >
                <X size={20} />
              </button>

              <div
                className={cn(
                  'transition-transform duration-500',
                  isFlipping ? 'animate-card-flip' : ''
                )}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <LargeCardDisplay
                  card={selectedCard}
                  owned={!!isCardOwned(selectedCard.name, selectedCard.element)}
                  count={isCardOwned(selectedCard.name, selectedCard.element)?.count || 0}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionCardDisplay({
  card,
  owned,
  count,
  onClick,
  index,
}: {
  card: CardTemplate;
  owned: boolean;
  count: number;
  onClick: () => void;
  index: number;
}) {
  const element = ELEMENTS[card.element];

  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityBorderColors: Record<Rarity, string> = {
    common: 'border-gray-500/30',
    rare: 'border-blue-500/50',
    epic: 'border-purple-500/60',
    legendary: 'border-amber-500/70',
  };

  const rarityBgGradients: Record<Rarity, string> = {
    common: 'from-gray-600/20 to-gray-800/20',
    rare: 'from-blue-600/20 to-blue-800/20',
    epic: 'from-purple-600/20 to-purple-800/20',
    legendary: 'from-amber-500/20 to-orange-600/20',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
        'border-2',
        owned
          ? `${rarityBorderColors[card.rarity]} hover:scale-105 hover:shadow-xl`
          : 'border-white/10 hover:border-white/20',
        owned && card.rarity === 'legendary' && 'rarity-legendary',
        owned && card.rarity === 'epic' && 'rarity-epic',
        !owned && 'grayscale opacity-60'
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className={cn('relative p-4 bg-gradient-to-b', rarityBgGradients[card.rarity], 'h-48')}>
        <div className="absolute inset-0 bg-slate-900/60" />

        {owned && card.rarity === 'legendary' && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${element.color}20 10px, ${element.color}20 20px)`,
              animation: 'magicCircle 20s linear infinite',
            }}
          />
        )}

        {owned && (
          <div
            className={cn(
              'absolute -inset-1 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300',
              `bg-gradient-to-br ${element.gradient}`
            )}
          />
        )}

        <div className="relative z-10 flex flex-col items-center h-full">
          <div className="flex items-center justify-between w-full mb-2">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm',
                'bg-gradient-to-br border border-white/30',
                card.rarity === 'legendary'
                  ? 'from-amber-300 via-yellow-500 to-amber-700 text-amber-900'
                  : card.rarity === 'epic'
                  ? 'from-purple-300 via-purple-500 to-purple-700 text-purple-900'
                  : card.rarity === 'rare'
                  ? 'from-blue-300 via-blue-500 to-blue-700 text-blue-900'
                  : 'from-gray-300 via-gray-500 to-gray-700 text-gray-900'
              )}
            >
              {card.power}
            </div>

            <div
              className={cn(
                'w-3.5 h-3.5 rounded-full',
                card.rarity === 'legendary'
                  ? 'bg-gradient-to-br from-amber-300 to-orange-500 animate-pulse'
                  : card.rarity === 'epic'
                  ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                  : card.rarity === 'rare'
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-600'
              )}
            />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div
              className={cn(
                'text-5xl transition-transform duration-300 group-hover:scale-110',
                owned && 'animate-float-slow'
              )}
              style={{ animationDuration: '3s' }}
            >
              {owned ? element.icon : '❓'}
            </div>
          </div>

          <div className="text-center w-full">
            <div className="text-sm font-bold text-white mb-0.5 truncate">
              {owned ? card.name : '???'}
            </div>
            <div className={cn('text-[10px] font-semibold', rarityColors[card.rarity])}>
              {RARITY_NAMES[card.rarity]}
            </div>
          </div>
        </div>

        {owned && count > 1 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
            ×{count}
          </div>
        )}

        {!owned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-3xl opacity-40">🔒</div>
          </div>
        )}

        {owned && card.rarity === 'legendary' && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg" style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))' }}>
            👑
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function LargeCardDisplay({
  card,
  owned,
  count,
}: {
  card: CardTemplate;
  owned: boolean;
  count: number;
}) {
  const element = ELEMENTS[card.element];

  return (
    <div
      className={cn(
        'relative w-64 rounded-2xl overflow-hidden border-4 transition-all duration-500',
        owned
          ? card.rarity === 'legendary'
            ? 'border-amber-400 shadow-2xl shadow-amber-500/50'
            : card.rarity === 'epic'
            ? 'border-purple-500 shadow-2xl shadow-purple-500/40'
            : card.rarity === 'rare'
            ? 'border-blue-500 shadow-xl shadow-blue-500/30'
            : 'border-gray-500 shadow-lg shadow-gray-500/20'
          : 'border-white/20 grayscale'
      )}
      style={{
        animation: owned && card.rarity === 'legendary' ? 'cardFloat 3s ease-in-out infinite' : 'none',
      }}
    >
      <div className="relative bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 h-96">
        <div
          className={cn(
            'absolute inset-0',
            `bg-gradient-to-br ${element.gradient}`,
            owned ? (card.rarity === 'legendary' ? 'opacity-50' : card.rarity === 'epic' ? 'opacity-40' : 'opacity-30') : 'opacity-20'
          )}
        />

        {owned && card.rarity === 'legendary' && (
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${element.color}30 10px, ${element.color}30 20px)`,
              animation: 'magicCircle 20s linear infinite',
            }}
          />
        )}

        <div className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-b rounded-b-full',
          card.rarity === 'legendary'
            ? 'from-amber-400/30 to-transparent'
            : card.rarity === 'epic'
            ? 'from-purple-400/25 to-transparent'
            : card.rarity === 'rare'
            ? 'from-blue-400/20 to-transparent'
            : 'from-gray-400/15 to-transparent'
        )} />

        <div className={cn(
          'absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t rounded-t-full',
          card.rarity === 'legendary'
            ? 'from-amber-400/25 to-transparent'
            : card.rarity === 'epic'
            ? 'from-purple-400/20 to-transparent'
            : card.rarity === 'rare'
            ? 'from-blue-400/15 to-transparent'
            : 'from-gray-400/10 to-transparent'
        )} />

        {(card.rarity === 'epic' || card.rarity === 'legendary') && owned && (
          <>
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
          </>
        )}

        <div className="absolute top-4 left-4 z-10">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center font-black text-lg',
              'bg-gradient-to-br border-2 border-white/40',
              'shadow-lg',
              card.rarity === 'legendary'
                ? 'from-amber-300 via-yellow-500 to-amber-700 text-amber-900 shadow-amber-500/50'
                : card.rarity === 'epic'
                ? 'from-purple-300 via-purple-500 to-purple-700 text-purple-900 shadow-purple-500/40'
                : card.rarity === 'rare'
                ? 'from-blue-300 via-blue-500 to-blue-700 text-blue-900 shadow-blue-500/30'
                : 'from-gray-300 via-gray-500 to-gray-700 text-gray-900 shadow-gray-500/20'
            )}
            style={{
              animation: owned && card.rarity === 'legendary' ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          >
            {card.power}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div
            className={cn(
              'w-5 h-5 rounded-full',
              card.rarity === 'legendary'
                ? 'bg-gradient-to-br from-amber-300 to-orange-500 animate-pulse'
                : card.rarity === 'epic'
                ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                : card.rarity === 'rare'
                ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                : 'bg-gradient-to-br from-gray-400 to-gray-600'
            )}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pt-12 pb-28">
          <div
            className={cn(
              'absolute aspect-square rounded-full',
              owned ? (card.rarity === 'legendary' ? 'w-4/5 opacity-35' : card.rarity === 'epic' ? 'w-3/4 opacity-25' : 'w-2/3 opacity-20') : 'w-1/2 opacity-10'
            )}
            style={{
              animation: 'magicCircle 12s linear infinite',
              border: `2px solid ${element.color}`,
            }}
          >
            <div className="absolute inset-3 rounded-full border border-current opacity-50" style={{ borderColor: element.color }} />
            <div className="absolute inset-6 rounded-full border border-current opacity-30" style={{ borderColor: element.color }} />
            {card.rarity === 'epic' || card.rarity === 'legendary' ? (
              <div className="absolute inset-9 rounded-full border border-current opacity-20" style={{ borderColor: element.color }} />
            ) : null}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-current opacity-60" />
          </div>

          <div
            className={cn(
              'relative z-10 transition-transform',
              owned && 'animate-float-slow'
            )}
            style={{ fontSize: '5rem' }}
          >
            {owned ? element.icon : '❓'}
          </div>

          {owned && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(card.rarity === 'legendary' ? 10 : card.rarity === 'epic' ? 7 : 4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${20 + i * (60 / (card.rarity === 'legendary' ? 10 : card.rarity === 'epic' ? 7 : 4))}%`,
                    top: `${35 + Math.sin(i * 0.8) * 20}%`,
                    width: card.rarity === 'legendary' ? '4px' : '3px',
                    height: card.rarity === 'legendary' ? '4px' : '3px',
                    backgroundColor: element.color,
                    opacity: card.rarity === 'legendary' ? 0.8 : 0.6,
                    animation: `float ${card.rarity === 'legendary' ? 1.5 : 2 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.25}s`,
                    boxShadow: `0 0 ${card.rarity === 'legendary' ? '10px' : '6px'} ${element.color}`,
                  }}
                />
              ))}
            </div>
          )}

          {owned && card.rarity === 'legendary' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`star-${i}`}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${20 + (i % 4) * 15}%`,
                    opacity: 0,
                    animation: `sparkle ${2 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    boxShadow: '0 0 8px white, 0 0 15px rgba(255,255,255,0.8)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-20 left-0 right-0 z-10">
          <div className="relative">
            <div className={cn(
              'absolute inset-x-0 top-1/2 -translate-y-1/2 h-8',
              card.rarity === 'legendary'
                ? 'bg-gradient-to-r from-amber-900/95 via-amber-700/95 to-amber-900/95'
                : card.rarity === 'epic'
                ? 'bg-gradient-to-r from-purple-900/90 via-purple-700/90 to-purple-900/90'
                : card.rarity === 'rare'
                ? 'bg-gradient-to-r from-blue-900/85 via-blue-700/85 to-blue-900/85'
                : 'bg-gradient-to-r from-gray-900/90 via-gray-800/95 to-gray-900/90'
            )} />
            <div className={cn(
              'absolute inset-x-3 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent to-transparent',
              card.rarity === 'legendary' && 'via-amber-300/80',
              card.rarity === 'epic' && 'via-purple-300/70',
              card.rarity === 'rare' && 'via-blue-300/60',
              card.rarity === 'common' && 'via-gray-400/70'
            )} />
            <div className={cn(
              'absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent',
              card.rarity === 'legendary' && 'via-amber-500/60',
              card.rarity === 'epic' && 'via-purple-500/50',
              card.rarity === 'rare' && 'via-blue-500/40',
              card.rarity === 'common' && 'via-gray-500/50'
            )} />
            <div
              className={cn(
                'relative text-center font-black text-white text-stroke py-2 text-xl',
              )}
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {owned ? card.name : '???'}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-3 right-3 z-10">
          <div className={cn(
            'rounded-lg px-3 py-2.5 border',
            card.rarity === 'legendary'
              ? 'bg-amber-900/40 border-amber-500/40'
              : card.rarity === 'epic'
              ? 'bg-purple-900/40 border-purple-500/30'
              : card.rarity === 'rare'
              ? 'bg-blue-900/30 border-blue-500/20'
              : 'bg-slate-900/90 border-gray-600/30'
          )}>
            <p
              className={cn(
                'text-center leading-snug text-sm',
                card.rarity === 'legendary' ? 'text-amber-100' :
                card.rarity === 'epic' ? 'text-purple-100' :
                card.rarity === 'rare' ? 'text-blue-100' :
                'text-white/80'
              )}
            >
              {owned ? card.description : '尚未解锁，继续探索收集吧！'}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/20 via-white/5 to-transparent"
            style={{ borderRadius: '10px 0 0 0' }}
          />
          {owned && card.rarity === 'legendary' && (
            <div className="legendary-shine-effect" />
          )}
        </div>

        {owned && card.rarity === 'legendary' && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-12 opacity-70"
            style={{
              background: `radial-gradient(ellipse at center bottom, ${element.color} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>

      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20">
        <div
          className={cn(
            'px-4 py-1 rounded-full text-sm font-bold text-white tracking-wider',
            `bg-gradient-to-r`,
            card.rarity === 'legendary'
              ? 'from-amber-500 to-orange-600'
              : card.rarity === 'epic'
              ? 'from-purple-500 to-purple-700'
              : card.rarity === 'rare'
              ? 'from-blue-500 to-blue-700'
              : 'from-gray-500 to-gray-700',
            'border border-white/30 shadow-md',
            card.rarity === 'legendary' && 'shadow-amber-500/50',
            card.rarity === 'epic' && 'shadow-purple-500/40',
            card.rarity === 'rare' && 'shadow-blue-500/30'
          )}
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {RARITY_NAMES[card.rarity]}
        </div>
      </div>

      {owned && card.rarity === 'legendary' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
          <div
            className="text-3xl"
            style={{
              animation: 'float 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))',
            }}
          >
            👑
          </div>
        </div>
      )}

      {!owned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <div className="text-white/60 text-sm">未解锁</div>
          </div>
        </div>
      )}

      {owned && count > 1 && (
        <div className="absolute top-4 right-4 mt-8 z-20">
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            持有 ×{count}
          </div>
        </div>
      )}
    </div>
  );
}
