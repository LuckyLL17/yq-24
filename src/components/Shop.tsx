import { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CARD_PACKS, CARD_BORDERS, SHOP_AVATARS, SHOP_CATEGORY_NAMES, SHOP_CATEGORY_ICONS, ELEMENTS } from '@/data/gameData';
import { cn } from '@/lib/utils';
import type { ShopCategory, Card, Rarity, CollectedCard } from '@/types/game';
import { X, LayoutGrid, Sparkles } from 'lucide-react';
import ElementCard from './ElementCard';

export default function Shop() {
  const {
    elementEssence,
    toggleShop,
    buyCardPack,
    buyCardBorder,
    buyAvatar,
    equipCardBorder,
    equipAvatar,
    isCardBorderOwned,
    isAvatarOwned,
    getEquippedCardBorder,
    getEquippedAvatar,
    getCollection,
    getCollectionStats,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<ShopCategory | 'collection'>('card_pack');
  const [openedCards, setOpenedCards] = useState<Card[] | null>(null);
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<'all' | Rarity>('all');

  const collection = getCollection();
  const collectionStats = getCollectionStats();

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBuyPack = (packId: string) => {
    const pack = CARD_PACKS.find((p) => p.id === packId);
    if (!pack) return;

    if (elementEssence < pack.price) {
      showMessage('元素精华不足！');
      return;
    }

    const cards = buyCardPack(packId);
    if (cards) {
      setOpenedCards(cards);
      setShowPackOpening(true);
    }
  };

  const handleBuyBorder = (borderId: string) => {
    const border = CARD_BORDERS.find((b) => b.id === borderId);
    if (!border) return;

    if (isCardBorderOwned(borderId)) {
      showMessage('你已经拥有这个边框了！');
      return;
    }

    if (elementEssence < border.price) {
      showMessage('元素精华不足！');
      return;
    }

    const success = buyCardBorder(borderId);
    if (success) {
      showMessage('购买成功！');
    }
  };

  const handleBuyAvatar = (avatarId: string) => {
    const avatar = SHOP_AVATARS.find((a) => a.id === avatarId);
    if (!avatar) return;

    if (isAvatarOwned(avatarId)) {
      showMessage('你已经拥有这个头像了！');
      return;
    }

    if (elementEssence < avatar.price) {
      showMessage('元素精华不足！');
      return;
    }

    const success = buyAvatar(avatarId);
    if (success) {
      showMessage('购买成功！');
    }
  };

  const handleEquipBorder = (borderId: string) => {
    if (getEquippedCardBorder() === borderId) {
      equipCardBorder(null);
      showMessage('已卸下边框');
    } else {
      equipCardBorder(borderId);
      showMessage('已装备边框，战斗中生效！');
    }
  };

  const handleEquipAvatar = (avatarId: string) => {
    if (getEquippedAvatar() === avatarId) {
      equipAvatar(null);
      showMessage('已卸下头像');
    } else {
      equipAvatar(avatarId);
      showMessage('已装备头像，战斗中生效！');
    }
  };

  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityBgColors: Record<Rarity, string> = {
    common: 'from-gray-500/20 to-gray-700/20',
    rare: 'from-blue-500/20 to-blue-700/20',
    epic: 'from-purple-500/20 to-purple-700/20',
    legendary: 'from-amber-500/20 to-orange-600/20',
  };

  const rarityNames: Record<Rarity, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };

  const categories: (ShopCategory | 'collection')[] = ['card_pack', 'card_border', 'avatar', 'collection'];

  const filteredCollection = collectionFilter === 'all'
    ? collection
    : collection.filter((c) => c.rarity === collectionFilter);

  const sortedCollection = [...filteredCollection].sort((a, b) => {
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
    if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    }
    return a.element.localeCompare(b.element);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-amber-500/30 shadow-2xl overflow-hidden animate-rise">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏪</div>
              <div>
                <h2
                  className="text-3xl font-bold text-gradient-gold"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  元素商店
                </h2>
                <p className="text-white/50 text-sm">用元素精华兑换珍贵物品</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <span className="text-2xl">💎</span>
                <span className="text-xl font-bold text-amber-400">{elementEssence}</span>
              </div>
              <button
                onClick={toggleShop}
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white/70 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-white/30"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2',
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-slate-700/50 text-white/60 hover:bg-slate-600/50 hover:text-white/80 border border-white/10'
                )}
              >
                <span>{cat === 'collection' ? '📚' : SHOP_CATEGORY_ICONS[cat]}</span>
                <span>{cat === 'collection' ? '收藏图鉴' : SHOP_CATEGORY_NAMES[cat]}</span>
                {cat === 'collection' && collection.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                    {collectionStats.unique}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {activeCategory === 'card_pack' && (
              <div className="grid grid-cols-4 gap-4">
                {CARD_PACKS.map((pack) => (
                  <div
                    key={pack.id}
                    className="group relative rounded-2xl overflow-hidden bg-slate-800/50 border border-white/10 hover:border-amber-500/40 transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="relative p-4 flex flex-col items-center text-center">
                      <div className="text-6xl mb-3 animate-float-slow">{pack.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                        {pack.name}
                      </h3>
                      <p className="text-xs text-white/50 mb-3">{pack.description}</p>
                      <div className="text-xs text-white/40 mb-3">
                        包含 {pack.cardCount} 张卡牌
                        {pack.guaranteedRarity && (
                          <span className={cn(' ml-1', rarityColors[pack.guaranteedRarity])}>
                            · 保底{rarityNames[pack.guaranteedRarity]}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleBuyPack(pack.id)}
                        disabled={elementEssence < pack.price}
                        className={cn(
                          'w-full py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2',
                          elementEssence >= pack.price
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30'
                            : 'bg-slate-700/50 text-white/30 cursor-not-allowed'
                        )}
                      >
                        <span>💎</span>
                        <span>{pack.price}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'card_border' && (
              <div className="grid grid-cols-4 gap-4">
                {CARD_BORDERS.map((border) => {
                  const owned = isCardBorderOwned(border.id);
                  const equipped = getEquippedCardBorder() === border.id;

                  return (
                    <div
                      key={border.id}
                      className={cn(
                        'group relative rounded-2xl overflow-hidden bg-slate-800/50 border transition-all duration-300',
                        equipped ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/10 hover:border-amber-500/40'
                      )}
                    >
                      <div className="relative p-4 flex flex-col items-center text-center">
                        <div
                          className={cn(
                            'w-20 h-28 rounded-lg flex items-center justify-center text-4xl mb-3',
                            border.borderStyle,
                            'bg-gradient-to-b from-slate-700 to-slate-800'
                          )}
                          style={{ boxShadow: `0 0 20px ${border.glowColor}` }}
                        >
                          {border.icon}
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                          {border.name}
                        </h3>
                        <p className="text-xs text-white/50 mb-3 h-8">{border.description}</p>
                        <div className={cn('text-xs font-semibold mb-3', rarityColors[border.rarity])}>
                          {rarityNames[border.rarity]}
                        </div>

                        {owned ? (
                          <button
                            onClick={() => handleEquipBorder(border.id)}
                            className={cn(
                              'w-full py-2 rounded-xl font-semibold text-sm transition-all duration-300',
                              equipped
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50 hover:text-white border border-white/10'
                            )}
                          >
                            {equipped ? '已装备' : '装备'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyBorder(border.id)}
                            disabled={elementEssence < border.price}
                            className={cn(
                              'w-full py-2 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-1',
                              elementEssence >= border.price
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95'
                                : 'bg-slate-700/50 text-white/30 cursor-not-allowed'
                            )}
                          >
                            <span>💎</span>
                            <span>{border.price}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeCategory === 'avatar' && (
              <div className="grid grid-cols-4 gap-4">
                {SHOP_AVATARS.map((avatar) => {
                  const owned = isAvatarOwned(avatar.id);
                  const equipped = getEquippedAvatar() === avatar.id;

                  return (
                    <div
                      key={avatar.id}
                      className={cn(
                        'group relative rounded-2xl overflow-hidden bg-slate-800/50 border transition-all duration-300',
                        equipped ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/10 hover:border-amber-500/40'
                      )}
                    >
                      <div className="relative p-4 flex flex-col items-center text-center">
                        <div
                          className={cn(
                            'w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3',
                            'bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-amber-500/30'
                          )}
                        >
                          {avatar.icon}
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                          {avatar.name}
                        </h3>
                        <p className="text-xs text-white/50 mb-3 h-8">{avatar.description}</p>
                        <div className={cn('text-xs font-semibold mb-3', rarityColors[avatar.rarity])}>
                          {rarityNames[avatar.rarity]}
                        </div>

                        {owned ? (
                          <button
                            onClick={() => handleEquipAvatar(avatar.id)}
                            className={cn(
                              'w-full py-2 rounded-xl font-semibold text-sm transition-all duration-300',
                              equipped
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50 hover:text-white border border-white/10'
                            )}
                          >
                            {equipped ? '已装备' : '装备'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyAvatar(avatar.id)}
                            disabled={elementEssence < avatar.price}
                            className={cn(
                              'w-full py-2 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-1',
                              elementEssence >= avatar.price
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95'
                                : 'bg-slate-700/50 text-white/30 cursor-not-allowed'
                            )}
                          >
                            <span>💎</span>
                            <span>{avatar.price}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeCategory === 'collection' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <LayoutGrid size={18} className="text-amber-400" />
                      <span className="text-white/70 font-semibold">收藏图鉴</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-white/50">
                        已收集: <span className="text-amber-400 font-bold">{collectionStats.unique}</span> 种
                      </span>
                      <span className="text-white/50">
                        总计: <span className="text-blue-400 font-bold">{collectionStats.total}</span> 张
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {(['all', 'legendary', 'epic', 'rare', 'common'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setCollectionFilter(r)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300',
                          collectionFilter === r
                            ? r === 'all'
                              ? 'bg-amber-500 text-white'
                              : `bg-gradient-to-r ${rarityBgColors[r]} text-white border border-white/20`
                            : 'bg-slate-700/50 text-white/50 hover:bg-slate-600/50'
                        )}
                      >
                        {r === 'all' ? '全部' : rarityNames[r]}
                      </button>
                    ))}
                  </div>
                </div>

                {sortedCollection.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-white/50 text-lg mb-2">收藏空空如也</p>
                    <p className="text-white/30 text-sm">购买卡包开启收集之旅吧！</p>
                    <button
                      onClick={() => setActiveCategory('card_pack')}
                      className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:scale-105 transition-all"
                    >
                      去买卡包
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-6 gap-3">
                    {sortedCollection.map((card) => (
                      <CollectionCard key={card.id} card={card} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-slate-900/90 border border-amber-500/50 text-amber-400 font-semibold z-20 animate-bounce-in">
            {message}
          </div>
        )}

        {showPackOpening && openedCards && (
          <PackOpeningAnimation 
            cards={openedCards} 
            onClose={() => {
              setShowPackOpening(false);
              setOpenedCards(null);
            }} 
          />
        )}
      </div>
    </div>
  );
}

function CollectionCard({ card }: { card: CollectedCard }) {
  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityNames: Record<Rarity, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden bg-slate-800/50 border transition-all duration-300',
        'border-white/10 hover:border-amber-500/40 hover:scale-105'
      )}
    >
      <div className="relative p-3 flex flex-col items-center text-center">
        <div className="text-3xl mb-2">{ELEMENTS[card.element].icon}</div>
        <h4 className="text-xs font-bold text-white mb-1 truncate w-full">{card.name}</h4>
        <div className={cn('text-[10px] font-semibold mb-1', rarityColors[card.rarity])}>
          {rarityNames[card.rarity]}
        </div>
        <div className="text-xs text-amber-400 font-bold">
          ×{card.count}
        </div>
        <div className="text-[10px] text-white/40 mt-1">
          ⚔️ {card.power}
        </div>
      </div>
    </div>
  );
}

function PackOpeningAnimation({ cards, onClose }: { cards: Card[]; onClose: () => void }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; color: string; delay: number; duration: number; size: number; shape: 'square' | 'circle' | 'star' }>>([]);

  const hasEpicOrBetter = useMemo(() => {
    return cards.some(c => c.rarity === 'epic' || c.rarity === 'legendary');
  }, [cards]);

  const hasLegendary = useMemo(() => {
    return cards.some(c => c.rarity === 'legendary');
  }, [cards]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    cards.forEach((_, index) => {
      const timer = setTimeout(() => {
        setRevealedCount(prev => prev + 1);
      }, 400 + index * 500);
      timers.push(timer);
    });

    if (hasEpicOrBetter) {
      const celebrationTimer = setTimeout(() => {
        setShowCelebration(true);
      }, 400 + cards.length * 500);
      timers.push(celebrationTimer);
    }

    return () => timers.forEach(t => clearTimeout(t));
  }, [cards, hasEpicOrBetter]);

  useEffect(() => {
    if (showCelebration && hasEpicOrBetter) {
      const pieces = [];
      const colors = hasLegendary 
        ? ['#fbbf24', '#f59e0b', '#fcd34d', '#fff', '#f97316', '#a855f7']
        : ['#a855f7', '#c084fc', '#7c3aed', '#fff', '#60a5fa', '#34d399'];
      
      for (let i = 0; i < 60; i++) {
        pieces.push({
          id: i,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 1.5,
          duration: 2 + Math.random() * 2,
          size: 6 + Math.random() * 10,
          shape: (['square', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
        });
      }
      setConfettiPieces(pieces);
    }
  }, [showCelebration, hasEpicOrBetter, hasLegendary]);

  const rarityColors: Record<Rarity, string> = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
  };

  const rarityNames: Record<Rarity, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn overflow-hidden">
      {showCelebration && hasEpicOrBetter && (
        <div className="confetti-container">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'star' ? '0' : '2px',
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                boxShadow: `0 0 ${piece.size}px ${piece.color}`,
                transform: piece.shape === 'star' ? 'rotate(45deg)' : 'none',
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center relative z-10">
        {showCelebration && hasEpicOrBetter ? (
          <div className="celebration-text mb-6">
            <div className="text-6xl mb-4 animate-bounce">
              {hasLegendary ? '👑' : '✨'}
            </div>
            <h2
              className={cn(
                'text-4xl font-black mb-2',
                hasLegendary ? 'text-gradient-gold' : 'text-purple-400'
              )}
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {hasLegendary ? '传说降临！' : '史诗降临！'}
            </h2>
            <p className="text-white/60 text-lg">
              恭喜获得{hasLegendary ? '传说' : '史诗'}卡牌！
            </p>
          </div>
        ) : (
          <h3
            className="text-2xl font-bold text-gradient-gold mb-8 opacity-0"
            style={{ 
              fontFamily: "'Cinzel Decorative', serif",
              animation: revealedCount > 0 ? 'fadeIn 0.5s forwards' : 'none'
            }}
          >
            ✨ 恭喜获得 ✨
          </h3>
        )}

        <div className="flex gap-6 mb-8 justify-center flex-wrap px-4">
          {cards.map((card, index) => {
            const isRevealed = index < revealedCount;
            const isEpicOrBetter = card.rarity === 'epic' || card.rarity === 'legendary';
            
            return (
              <div
                key={card.id}
                className={cn(
                  'relative transition-all duration-500',
                  isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                )}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
                }}
              >
                {isRevealed && (
                  <>
                    {isEpicOrBetter && (
                      <div 
                        className="absolute -inset-4 rounded-2xl opacity-60"
                        style={{
                          background: card.rarity === 'legendary'
                            ? 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)',
                          animation: 'pulse 2s ease-in-out infinite',
                        }}
                      />
                    )}
                    
                    <div
                      className={cn(
                        'relative',
                        card.rarity === 'legendary' && 'rarity-legendary',
                        card.rarity === 'epic' && 'rarity-epic'
                      )}
                      style={{
                        animation: isEpicOrBetter 
                          ? `cardReveal 0.8s ease-out ${index * 0.1}s both, cardFloat 4s ease-in-out ${1 + index * 0.2}s infinite`
                          : `cardReveal 0.6s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <ElementCard card={card} size="md" showDetails={true} />
                    </div>

                    {card.rarity === 'legendary' && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                        <div 
                          className="text-3xl"
                          style={{ 
                            animation: 'float 2s ease-in-out infinite',
                            filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))',
                          }}
                        >
                          👑
                        </div>
                      </div>
                    )}

                    {card.rarity === 'epic' && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20">
                        <div 
                          className="text-xl"
                          style={{ 
                            animation: 'float 2.5s ease-in-out infinite',
                            filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))',
                          }}
                        >
                          💎
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!isRevealed && (
                  <div className="w-36 h-52 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-slate-600 flex items-center justify-center">
                    <div 
                      className="text-5xl opacity-50"
                      style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                    >
                      🎴
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p 
          className="text-white/50 text-sm mb-6"
          style={{ 
            opacity: revealedCount === cards.length ? 1 : 0,
            transition: 'opacity 0.5s',
            transitionDelay: '0.3s',
          }}
        >
          卡牌已加入收藏图鉴！
        </p>

        <button
          onClick={onClose}
          disabled={revealedCount < cards.length}
          className={cn(
            'px-10 py-3.5 rounded-xl font-bold text-lg transition-all duration-300',
            revealedCount >= cards.length
              ? hasLegendary
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/50'
                : hasEpicOrBetter
                ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/30'
              : 'bg-slate-700/50 text-white/30 cursor-not-allowed'
          )}
          style={{
            animation: revealedCount >= cards.length ? 'zoomIn 0.5s ease-out 0.2s both' : 'none',
          }}
        >
          {revealedCount >= cards.length ? (
            <span className="flex items-center gap-2">
              <Sparkles size={20} />
              太棒了！
            </span>
          ) : (
            '开启中...'
          )}
        </button>

        {revealedCount < cards.length && (
          <p className="text-white/40 text-sm mt-3">
            点击跳过动画
          </p>
        )}
      </div>

      {revealedCount < cards.length && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white/70 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-white/30 z-40"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
