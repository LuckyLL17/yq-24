import { create } from 'zustand';
import type { Player, Card, StatusEffect, PlayerComboState } from '@/types/game';
import type { PlayerState, PlayerActions } from '@/types/store';
import { createDeck, createPlayer, getComboLevel } from '@/data/gameData';

export const initialPlayerState = (): Player => {
  const deck = createDeck();
  const hand = deck.splice(0, 5);
  return {
    ...createPlayer(),
    hand,
    deck,
    selectedCards: [],
  } as Player;
};

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  player: initialPlayerState(),
  player2: null,
  currentDuoPlayer: 1,

  initPlayer: (): Player => {
    return initialPlayerState();
  },

  resetPlayerState: () => {
    set({ player: initialPlayerState() });
  },

  setPlayer: (player: Player) => {
    set({ player });
  },

  setPlayer2: (player: Player | null) => {
    set({ player2: player });
  },

  selectCard: (card: Card) => {
    const { player } = get();
    if (player.selectedCards.length >= 2) return;
    if (player.selectedCards.find((c) => c.id === card.id)) return;
    const totalManaCost = player.selectedCards.reduce((sum, c) => sum + c.manaCost, 0) + card.manaCost;
    if (totalManaCost > player.mana) return;
    set((state) => ({
      player: {
        ...state.player,
        selectedCards: [...state.player.selectedCards, card],
      },
    }));
  },

  deselectCard: (cardId: string) => {
    set((state) => ({
      player: {
        ...state.player,
        selectedCards: state.player.selectedCards.filter((c) => c.id !== cardId),
      },
    }));
  },

  clearSelectedCards: () => {
    set((state) => ({
      player: {
        ...state.player,
        selectedCards: [],
      },
    }));
  },

  drawCards: (count: number) => {
    set((state) => {
      const newHand = [...state.player.hand];
      const newDeck = [...state.player.deck];
      for (let i = 0; i < count; i++) {
        if (newDeck.length > 0 && newHand.length < 10) {
          newHand.push(newDeck.shift()!);
        } else if (newDeck.length === 0 && newHand.length < 10) {
          const freshDeck = createDeck();
          newHand.push(freshDeck.shift()!);
          newDeck.push(...freshDeck);
        }
      }
      return {
        player: {
          ...state.player,
          hand: newHand,
          deck: newDeck,
        },
      };
    });
  },

  takeDamage: (damage: number) => {
    set((state) => ({
      player: {
        ...state.player,
        hp: Math.max(0, state.player.hp - damage),
      },
    }));
  },

  heal: (amount: number) => {
    set((state) => ({
      player: {
        ...state.player,
        hp: Math.min(state.player.maxHp, state.player.hp + amount),
      },
    }));
  },

  addShield: (amount: number) => {
    set((state) => ({
      player: {
        ...state.player,
        shield: state.player.shield + amount,
      },
    }));
  },

  addStatusEffect: (effect: StatusEffect) => {
    set((state) => {
      const newEffects = [...state.player.statusEffects];
      const existingIndex = newEffects.findIndex((e) => e.type === effect.type);
      if (existingIndex >= 0) {
        newEffects[existingIndex] = {
          ...newEffects[existingIndex],
          value: newEffects[existingIndex].value + effect.value,
          duration: Math.max(newEffects[existingIndex].duration, effect.duration),
        };
      } else {
        newEffects.push(effect);
      }
      return {
        player: {
          ...state.player,
          statusEffects: newEffects,
        },
      };
    });
  },

  applyPlayerStatusEffects: () => {
    set((state) => {
      const newEffects = state.player.statusEffects
        .map((effect) => ({
          ...effect,
          duration: effect.duration - 1,
        }))
        .filter((e) => e.duration > 0);
      return {
        player: {
          ...state.player,
          statusEffects: newEffects,
        },
      };
    });
  },

  consumeMana: (amount: number) => {
    set((state) => ({
      player: {
        ...state.player,
        mana: state.player.mana - amount,
      },
    }));
  },

  resetMana: () => {
    set((state) => ({
      player: {
        ...state.player,
        mana: state.player.maxMana,
      },
    }));
  },

  resetShield: () => {
    set((state) => ({
      player: {
        ...state.player,
        shield: 0,
      },
    }));
  },

  setComboCooldown: (comboId: string, cooldown: number) => {
    set((state) => {
      const newCooldowns = [...state.player.comboCooldowns];
      const existingIndex = newCooldowns.findIndex((c) => c.comboId === comboId);
      if (existingIndex >= 0) {
        newCooldowns[existingIndex] = {
          ...newCooldowns[existingIndex],
          remaining: cooldown,
        };
      } else {
        newCooldowns.push({ comboId, remaining: cooldown });
      }
      return {
        player: {
          ...state.player,
          comboCooldowns: newCooldowns,
        },
      };
    });
  },

  decrementComboCooldowns: () => {
    set((state) => {
      const newCooldowns = state.player.comboCooldowns
        .map((cd) => ({
          ...cd,
          remaining: cd.remaining - 1,
        }))
        .filter((cd) => cd.remaining > 0);
      return {
        player: {
          ...state.player,
          comboCooldowns: newCooldowns,
        },
      };
    });
  },

  getComboCooldown: (comboId: string): number => {
    const { player } = get();
    const cooldown = player.comboCooldowns.find((c) => c.comboId === comboId);
    return cooldown ? cooldown.remaining : 0;
  },

  isComboOnCooldown: (comboId: string): boolean => {
    return get().getComboCooldown(comboId) > 0;
  },

  setComboLevel: (comboId: string, level: number) => {
    set((state) => {
      const newLevels: PlayerComboState[] = [...state.player.comboLevels];
      const existingIndex = newLevels.findIndex((l) => l.comboId === comboId);
      if (existingIndex >= 0) {
        newLevels[existingIndex] = {
          ...newLevels[existingIndex],
          level,
        };
      } else {
        newLevels.push({ comboId, level });
      }
      return {
        player: {
          ...state.player,
          comboLevels: newLevels,
        },
      };
    });
  },

  getCurrentComboLevel: (comboId: string): number => {
    const { player } = get();
    return getComboLevel(comboId, player.comboLevels);
  },

  duoSelectCard: (playerNum: 1 | 2, card: Card) => {
    const { player, player2 } = get();
    const targetPlayer = playerNum === 1 ? player : player2;
    if (!targetPlayer) return;
    if (targetPlayer.selectedCards.length >= 2) return;
    if (targetPlayer.selectedCards.find((c) => c.id === card.id)) return;
    const totalManaCost = targetPlayer.selectedCards.reduce((sum, c) => sum + c.manaCost, 0) + card.manaCost;
    if (totalManaCost > targetPlayer.mana) return;

    if (playerNum === 1) {
      set((state) => ({
        player: {
          ...state.player,
          selectedCards: [...state.player.selectedCards, card],
        },
      }));
    } else {
      set((state) => ({
        player2: state.player2 ? {
          ...state.player2,
          selectedCards: [...state.player2.selectedCards, card],
        } : state.player2,
      }));
    }
  },

  duoDeselectCard: (playerNum: 1 | 2, cardId: string) => {
    if (playerNum === 1) {
      set((state) => ({
        player: {
          ...state.player,
          selectedCards: state.player.selectedCards.filter((c) => c.id !== cardId),
        },
      }));
    } else {
      set((state) => ({
        player2: state.player2 ? {
          ...state.player2,
          selectedCards: state.player2.selectedCards.filter((c) => c.id !== cardId),
        } : state.player2,
      }));
    }
  },

  duoClearSelectedCards: (playerNum: 1 | 2) => {
    if (playerNum === 1) {
      set((state) => ({
        player: {
          ...state.player,
          selectedCards: [],
        },
      }));
    } else {
      set((state) => ({
        player2: state.player2 ? {
          ...state.player2,
          selectedCards: [],
        } : state.player2,
      }));
    }
  },

  duoIsComboOnCooldown: (playerNum: 1 | 2, comboId: string): boolean => {
    return get().duoGetComboCooldown(playerNum, comboId) > 0;
  },

  duoGetComboCooldown: (playerNum: 1 | 2, comboId: string): number => {
    const { player, player2 } = get();
    const target = playerNum === 1 ? player : player2;
    if (!target) return 0;
    const cooldown = target.comboCooldowns.find((c) => c.comboId === comboId);
    return cooldown ? cooldown.remaining : 0;
  },

  duoGetCurrentComboLevel: (playerNum: 1 | 2, comboId: string): number => {
    const { player, player2 } = get();
    const target = playerNum === 1 ? player : player2;
    if (!target) return 1;
    return getComboLevel(comboId, target.comboLevels);
  },

  duoSetCurrentPlayer: (playerNum: 1 | 2) => {
    set({ currentDuoPlayer: playerNum });
  },

  setCurrentDuoPlayer: (playerNum: 1 | 2) => {
    set({ currentDuoPlayer: playerNum });
  },

  setComboCooldowns: (cooldowns: { comboId: string; remaining: number }[]) => {
    set((state) => ({
      player: {
        ...state.player,
        comboCooldowns: cooldowns,
      },
    }));
  },

  duoResetPlayerState: (playerNum: 1 | 2) => {
    const newPlayer = initialPlayerState();
    if (playerNum === 1) {
      set({ player: newPlayer });
    } else {
      set({ player2: newPlayer });
    }
  },
}));
