import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CARD_PACKS, CARD_BORDERS, SHOP_AVATARS, SHOP_CATEGORY_NAMES, SHOP_CATEGORY_ICONS, ELEMENTS } from '@/data/gameData';
import { cn } from '@/lib/utils';
import type { ShopCategory, Card, Rarity } from '@/types/game';
import { X } from 'lucide-react';

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
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<ShopCategory>('card_pack');
  const [openedCards, setOpenedCards] = useState<Card[] | null>(null);
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
      showMessage('已装备边框');
    }
  };

  const handleEquipAvatar = (avatarId: string) => {
    if (getEquippedAvatar() === avatarId) {
      equipAvatar(null);
      showMessage('已卸下头像');
    } else {
      equipAvatar(avatarId);
      showMessage('已装备头像');
    }
  };

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

  const categories: ShopCategory[] = ['card_pack', 'card_border', 'avatar'];

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

          <div className="flex gap-2 mb-6">
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
                <span>{SHOP_CATEGORY_ICONS[cat]}</span>
                <span>{SHOP_CATEGORY_NAMES[cat]}</span>
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
          </div>
        </div>

        {message && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-slate-900/90 border border-amber-500/50 text-amber-400 font-semibold z-20 animate-bounce-in">
            {message}
          </div>
        )}

        {showPackOpening && openedCards && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="text-center">
              <h3
                className="text-3xl font-bold text-gradient-gold mb-8"
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                ✨ 恭喜获得 ✨
              </h3>
              <div className="flex gap-4 mb-8 justify-center">
                {openedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="relative animate-card-reveal"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div
                      className={cn(
                        'w-32 h-44 rounded-xl border-4 flex flex-col items-center justify-center p-3 bg-gradient-to-b from-slate-700 to-slate-900',
                        card.rarity === 'legendary' && 'border-amber-400 shadow-lg shadow-amber-500/50',
                        card.rarity === 'epic' && 'border-purple-400 shadow-lg shadow-purple-500/50',
                        card.rarity === 'rare' && 'border-blue-400 shadow-lg shadow-blue-500/50',
                        card.rarity === 'common' && 'border-gray-500'
                      )}
                    >
                      <div className="text-5xl mb-2">{ELEMENTS[card.element].icon}</div>
                      <div className="text-sm font-bold text-white text-center mb-1">{card.name}</div>
                      <div className="text-xs text-white/50 text-center mb-2">{card.description}</div>
                      <div className={cn('text-xs font-bold', rarityColors[card.rarity])}>
                        {rarityNames[card.rarity]}
                      </div>
                      <div className="mt-1 text-lg font-bold text-amber-400">⚔️ {card.power}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowPackOpening(false);
                  setOpenedCards(null);
                }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-amber-500/30"
              >
                太棒了！
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
