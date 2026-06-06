import { create } from 'zustand';
import type { GameState, Card, ComboSkill, Player, GameMode } from '@/types/game';
import { createDeck, createPlayer, createEnemy, findCombo, ENEMIES } from '@/data/gameData';

interface GameActions {
  startBattle: (mode?: GameMode) => void;
  startChallenge: () => void;
  startEndless: () => void;
  startQuick: () => void;
  goToMenu: () => void;
  selectCard: (card: Card) => void;
  deselectCard: (cardId: string) => void;
  playSelectedCards: () => void;
  enemyTurn: () => void;
  nextTurn: () => void;
  drawCards: (count: number) => void;
  takeDamage: (target: 'player' | 'enemy', damage: number) => void;
  heal: (amount: number) => void;
  addShield: (amount: number) => void;
  applyStatusEffects: () => void;
  setAnimating: (value: boolean) => void;
  showCombo: (combo: ComboSkill) => void;
  hideCombo: () => void;
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  nextWave: () => void;
  addFloatingText: (type: 'damage' | 'heal' | 'shield', value: number, target: 'player' | 'enemy') => void;
  removeFloatingText: (id: string) => void;
  setShaking: (target: 'player' | 'enemy', value: boolean) => void;
}

const initialPlayerState = (): Player => {
  const deck = createDeck();
  const hand = deck.splice(0, 5);
  return {
    ...createPlayer(),
    hand,
    deck,
    selectedCards: [],
  } as Player;
};

const initialState: GameState = {
  phase: 'menu',
  mode: 'classic',
  turn: 1,
  player: initialPlayerState(),
  enemy: null,
  comboHistory: [],
  streak: 0,
  score: 0,
  isAnimating: false,
  currentCombo: null,
  showComboEffect: false,
  wave: 1,
  floatingTexts: [],
  enemyShaking: false,
  playerShaking: false,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  startBattle: (mode: GameMode = 'classic') => {
    const enemy = createEnemy(0);
    const playerState = initialPlayerState();
    
    if (mode === 'quick') {
      playerState.maxHp = 60;
      playerState.hp = 60;
      enemy.maxHp = 50;
      enemy.hp = 50;
    }
    
    set({
      phase: 'battle',
      mode,
      turn: 1,
      player: playerState,
      enemy,
      comboHistory: [],
      streak: 0,
      score: 0,
      isAnimating: false,
      currentCombo: null,
      showComboEffect: false,
      wave: 1,
      floatingTexts: [],
    });
  },

  startChallenge: () => {
    get().startBattle('challenge');
  },

  startEndless: () => {
    get().startBattle('endless');
  },

  startQuick: () => {
    get().startBattle('quick');
  },

  goToMenu: () => {
    set({ phase: 'menu' });
  },

  selectCard: (card: Card) => {
    const { player, isAnimating } = get();
    const selectedCards = player.selectedCards;
    if (isAnimating) return;
    if (selectedCards.length >= 2) return;
    if (selectedCards.find((c) => c.id === card.id)) return;
    set((state) => ({
      player: {
        ...state.player,
        selectedCards: [...state.player.selectedCards, card],
      },
    }));
  },

  deselectCard: (cardId: string) => {
    const { isAnimating } = get();
    if (isAnimating) return;
    set((state) => ({
      player: {
        ...state.player,
        selectedCards: state.player.selectedCards.filter((c) => c.id !== cardId),
      },
    }));
  },

  playSelectedCards: () => {
    const { player, enemy, isAnimating, mode } = get();
    if (isAnimating || !enemy) return;
    if (player.selectedCards.length !== 2) return;

    const [card1, card2] = player.selectedCards;
    const combo = findCombo(card1.element, card2.element);
    if (!combo) return;

    set({ isAnimating: true, currentCombo: combo, showComboEffect: true });

    const newHand = player.hand.filter((c) => c.id !== card1.id && c.id !== card2.id);
    const newDeck = [...player.deck];

    setTimeout(() => {
      const state = get();
      const currentEnemy = state.enemy;
      if (!currentEnemy) return;

      let damage = combo.damage;
      const newStatusEffects = [...currentEnemy.statusEffects];

      if (combo.effect && combo.effectValue && combo.effectDuration) {
        if (combo.effect === 'burn' || combo.effect === 'poison' || combo.effect === 'freeze' || combo.effect === 'stun') {
          const existingIndex = newStatusEffects.findIndex((e) => e.type === combo.effect);
          if (existingIndex >= 0) {
            newStatusEffects[existingIndex] = {
              ...newStatusEffects[existingIndex],
              value: newStatusEffects[existingIndex].value + combo.effectValue,
              duration: Math.max(newStatusEffects[existingIndex].duration, combo.effectDuration),
            };
          } else {
            newStatusEffects.push({
              type: combo.effect,
              value: combo.effectValue,
              duration: combo.effectDuration,
            });
          }
        }
      }

      let newEnemyHp = currentEnemy.hp;
      let newEnemyShield = currentEnemy.shield;

      if (damage > 0) {
        if (newEnemyShield >= damage) {
          newEnemyShield -= damage;
          damage = 0;
        } else {
          damage -= newEnemyShield;
          newEnemyShield = 0;
          newEnemyHp -= damage;
        }
      }

      get().addFloatingText('damage', combo.damage, 'enemy');
      set({ enemyShaking: true });
      setTimeout(() => set({ enemyShaking: false }), 500);

      let newPlayerHp = state.player.hp;
      let newPlayerShield = state.player.shield;
      let cardsToDraw = 0;

      if (combo.effect === 'heal' && combo.effectValue) {
        newPlayerHp = Math.min(state.player.maxHp, newPlayerHp + combo.effectValue);
        get().addFloatingText('heal', combo.effectValue, 'player');
      }
      if (combo.effect === 'shield' && combo.effectValue) {
        newPlayerShield += combo.effectValue;
        get().addFloatingText('shield', combo.effectValue, 'player');
      }
      if (combo.effect === 'draw' && combo.effectValue) {
        cardsToDraw = combo.effectValue;
      }

      const finalDeck = [...newDeck];
      const finalHand = [...newHand];
      for (let i = 0; i < cardsToDraw && finalDeck.length > 0; i++) {
        finalHand.push(finalDeck.shift()!);
      }

      const isEnemyDead = newEnemyHp <= 0;

      set((s) => ({
        enemy: isEnemyDead
          ? null
          : {
              ...currentEnemy,
              hp: Math.max(0, newEnemyHp),
              shield: newEnemyShield,
              statusEffects: newStatusEffects,
            },
        player: {
          ...s.player,
          hp: newPlayerHp,
          shield: newPlayerShield,
          hand: finalHand,
          deck: finalDeck,
          selectedCards: [],
        },
        comboHistory: [...s.comboHistory, combo],
        isAnimating: false,
        showComboEffect: false,
      }));

      if (mode === 'challenge' || mode === 'endless') {
        get().incrementStreak();
        get().addScore(combo.damage * 10);
      }

      if (isEnemyDead) {
        if (mode === 'classic' || mode === 'quick') {
          setTimeout(() => set({ phase: 'victory' }), 800);
        } else {
          setTimeout(() => {
            get().nextWave();
          }, 1200);
        }
      } else {
        setTimeout(() => get().enemyTurn(), 1000);
      }
    }, 1500);
  },

  enemyTurn: () => {
    const { enemy, player, mode } = get();
    if (!enemy) return;

    const stunned = enemy.statusEffects.find((e) => e.type === 'stun');
    const frozen = enemy.statusEffects.find((e) => e.type === 'freeze');

    if ((stunned && stunned.duration > 0) || (frozen && frozen.duration > 0)) {
      setTimeout(() => {
        get().applyStatusEffects();
        get().nextTurn();
      }, 800);
      return;
    }

    let damage = enemy.attackPower;
    let newPlayerShield = player.shield;
    let newPlayerHp = player.hp;

    if (damage > 0) {
      if (newPlayerShield >= damage) {
        newPlayerShield -= damage;
        damage = 0;
      } else {
        damage -= newPlayerShield;
        newPlayerShield = 0;
        newPlayerHp -= damage;
      }
    }

    set((state) => ({
      player: {
        ...state.player,
        hp: Math.max(0, newPlayerHp),
        shield: newPlayerShield,
      },
    }));

    if (damage > 0) {
      get().addFloatingText('damage', damage, 'player');
      set({ playerShaking: true });
      setTimeout(() => set({ playerShaking: false }), 500);
    }

    setTimeout(() => {
      const state = get();
      if (state.player.hp <= 0) {
        set({ phase: 'defeat' });
        return;
      }
      state.applyStatusEffects();
      if (mode === 'challenge' || mode === 'endless') {
        get().resetStreak();
      }
      state.nextTurn();
    }, 1000);
  },

  nextTurn: () => {
    set((state) => ({
      turn: state.turn + 1,
      player: {
        ...state.player,
        mana: state.player.maxMana,
        shield: 0,
      },
    }));
    get().drawCards(2);
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

  takeDamage: (target: 'player' | 'enemy', damage: number) => {
    if (target === 'player') {
      set((state) => ({
        player: {
          ...state.player,
          hp: Math.max(0, state.player.hp - damage),
        },
      }));
    } else if (target === 'enemy') {
      set((state) => {
        if (!state.enemy) return state;
        return {
          enemy: {
            ...state.enemy,
            hp: Math.max(0, state.enemy.hp - damage),
          },
        };
      });
    }
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

  applyStatusEffects: () => {
    set((state) => {
      if (!state.enemy) return state;
      let totalDamage = 0;
      const newEffects = state.enemy.statusEffects
        .map((effect) => {
          if (effect.type === 'burn' || effect.type === 'poison') {
            totalDamage += effect.value;
          }
          return {
            ...effect,
            duration: effect.duration - 1,
          };
        })
        .filter((e) => e.duration > 0);

      let newEnemyHp = state.enemy.hp;
      if (totalDamage > 0) {
        newEnemyHp = Math.max(0, newEnemyHp - totalDamage);
        get().addFloatingText('damage', totalDamage, 'enemy');
      }

      return {
        enemy: {
          ...state.enemy,
          hp: newEnemyHp,
          statusEffects: newEffects,
        },
      };
    });
  },

  setAnimating: (value: boolean) => {
    set({ isAnimating: value });
  },

  showCombo: (combo: ComboSkill) => {
    set({ currentCombo: combo, showComboEffect: true });
  },

  hideCombo: () => {
    set({ showComboEffect: false, currentCombo: null });
  },

  addScore: (points: number) => {
    set((state) => ({ score: state.score + points }));
  },

  incrementStreak: () => {
    set((state) => ({ streak: state.streak + 1 }));
  },

  resetStreak: () => {
    set({ streak: 0 });
  },

  nextWave: () => {
    set((state) => {
      const nextWaveNum = state.wave + 1;
      const enemyIndex = Math.min(nextWaveNum - 1, ENEMIES.length - 1);
      const newEnemy = createEnemy(enemyIndex);
      
      const multiplier = 1 + (nextWaveNum - 1) * 0.2;
      newEnemy.maxHp = Math.floor(newEnemy.maxHp * multiplier);
      newEnemy.hp = newEnemy.maxHp;
      newEnemy.attackPower = Math.floor(newEnemy.attackPower * multiplier);
      newEnemy.intentValue = Math.floor(newEnemy.intentValue * multiplier);

      return {
        wave: nextWaveNum,
        enemy: newEnemy,
        turn: state.turn + 1,
      };
    });
    get().drawCards(2);
  },

  addFloatingText: (type: 'damage' | 'heal' | 'shield', value: number, target: 'player' | 'enemy') => {
    const id = `ft_${Date.now()}_${Math.random()}`;
    set((state) => ({
      floatingTexts: [...state.floatingTexts, {
        id,
        value,
        type,
        x: target === 'enemy' ? 50 : 50,
        y: target === 'enemy' ? 25 : 65,
      }],
    }));
    setTimeout(() => {
      get().removeFloatingText(id);
    }, 1000);
  },

  removeFloatingText: (id: string) => {
    set((state) => ({
      floatingTexts: state.floatingTexts.filter((t) => t.id !== id),
    }));
  },

  setShaking: (target: 'player' | 'enemy', value: boolean) => {
    if (target === 'player') {
      set({ playerShaking: value });
    } else {
      set({ enemyShaking: value });
    }
  },
}));
