import { create } from 'zustand';
import type { GameState, Card, ComboSkill, Player, GameMode, StatusEffect } from '@/types/game';
import { createDeck, createPlayer, createEnemy, findCombo, ENEMIES, getComboLevel, getComboWithLevel, COMBOS } from '@/data/gameData';

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
  getComboCooldown: (comboId: string) => number;
  isComboOnCooldown: (comboId: string) => boolean;
  upgradeCombo: (comboId: string) => boolean;
  getCurrentComboLevel: (comboId: string) => number;
  applyPlayerStatusEffects: () => void;
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

    if (get().isComboOnCooldown(combo.id)) return;

    const level = get().getCurrentComboLevel(combo.id);
    const effectiveCombo = getComboWithLevel(combo, level);

    set({ isAnimating: true, currentCombo: effectiveCombo, showComboEffect: true });

    const newHand = player.hand.filter((c) => c.id !== card1.id && c.id !== card2.id);
    const newDeck = [...player.deck];

    setTimeout(() => {
      const state = get();
      const currentEnemy = state.enemy;
      if (!currentEnemy) return;

      let damage = effectiveCombo.damage;
      const newEnemyStatusEffects = [...currentEnemy.statusEffects];
      const newPlayerStatusEffects = [...state.player.statusEffects];

      if (effectiveCombo.effect && effectiveCombo.effectValue && effectiveCombo.effectDuration !== undefined) {
        const debuffEffects = ['burn', 'poison', 'freeze', 'stun', 'weakness'] as const;
        if (debuffEffects.includes(effectiveCombo.effect as typeof debuffEffects[number])) {
          const existingIndex = newEnemyStatusEffects.findIndex((e) => e.type === effectiveCombo.effect);
          if (existingIndex >= 0) {
            newEnemyStatusEffects[existingIndex] = {
              ...newEnemyStatusEffects[existingIndex],
              value: newEnemyStatusEffects[existingIndex].value + (effectiveCombo.effectValue || 0),
              duration: Math.max(newEnemyStatusEffects[existingIndex].duration, effectiveCombo.effectDuration || 0),
            };
          } else {
            newEnemyStatusEffects.push({
              type: effectiveCombo.effect,
              value: effectiveCombo.effectValue,
              duration: effectiveCombo.effectDuration,
            });
          }
        }

        const buffEffects = ['thorns', 'strength'] as const;
        if (buffEffects.includes(effectiveCombo.effect as typeof buffEffects[number]) && effectiveCombo.effectDuration > 0) {
          const existingIndex = newPlayerStatusEffects.findIndex((e) => e.type === effectiveCombo.effect);
          if (existingIndex >= 0) {
            newPlayerStatusEffects[existingIndex] = {
              ...newPlayerStatusEffects[existingIndex],
              value: newPlayerStatusEffects[existingIndex].value + (effectiveCombo.effectValue || 0),
              duration: Math.max(newPlayerStatusEffects[existingIndex].duration, effectiveCombo.effectDuration || 0),
            };
          } else {
            newPlayerStatusEffects.push({
              type: effectiveCombo.effect,
              value: effectiveCombo.effectValue,
              duration: effectiveCombo.effectDuration,
            });
          }
        }
      }

      let newEnemyHp = currentEnemy.hp;
      let newEnemyShield = currentEnemy.shield;
      let actualDamageDealt = 0;

      if (damage > 0) {
        if (newEnemyShield >= damage) {
          newEnemyShield -= damage;
          actualDamageDealt = damage;
          damage = 0;
        } else {
          const beforeDamage = damage;
          damage -= newEnemyShield;
          newEnemyShield = 0;
          newEnemyHp -= damage;
          actualDamageDealt = beforeDamage;
        }
      }

      get().addFloatingText('damage', effectiveCombo.damage, 'enemy');
      set({ enemyShaking: true });
      setTimeout(() => set({ enemyShaking: false }), 500);

      let newPlayerHp = state.player.hp;
      let newPlayerShield = state.player.shield;
      let cardsToDraw = 0;

      if (effectiveCombo.effect === 'heal' && effectiveCombo.effectValue) {
        newPlayerHp = Math.min(state.player.maxHp, newPlayerHp + effectiveCombo.effectValue);
        get().addFloatingText('heal', effectiveCombo.effectValue, 'player');
      }
      if (effectiveCombo.effect === 'shield' && effectiveCombo.effectValue) {
        newPlayerShield += effectiveCombo.effectValue;
        get().addFloatingText('shield', effectiveCombo.effectValue, 'player');
      }
      if (effectiveCombo.effect === 'draw' && effectiveCombo.effectValue) {
        cardsToDraw = effectiveCombo.effectValue;
      }
      if (effectiveCombo.effect === 'lifesteal' && effectiveCombo.effectValue) {
        const healAmount = Math.min(effectiveCombo.effectValue, actualDamageDealt);
        newPlayerHp = Math.min(state.player.maxHp, newPlayerHp + healAmount);
        get().addFloatingText('heal', healAmount, 'player');
      }
      if (effectiveCombo.effect === 'absorb' && effectiveCombo.effectValue) {
        const absorbAmount = Math.min(effectiveCombo.effectValue, actualDamageDealt);
        newPlayerShield += absorbAmount;
        get().addFloatingText('shield', absorbAmount, 'player');
      }

      const finalDeck = [...newDeck];
      const finalHand = [...newHand];
      for (let i = 0; i < cardsToDraw && finalDeck.length > 0; i++) {
        finalHand.push(finalDeck.shift()!);
      }

      const isEnemyDead = newEnemyHp <= 0;

      const newCooldowns = [...state.player.comboCooldowns];
      const existingCooldownIndex = newCooldowns.findIndex((c) => c.comboId === combo.id);
      if (existingCooldownIndex >= 0) {
        newCooldowns[existingCooldownIndex] = {
          ...newCooldowns[existingCooldownIndex],
          remaining: combo.cooldown,
        };
      } else {
        newCooldowns.push({ comboId: combo.id, remaining: combo.cooldown });
      }

      set((s) => ({
        enemy: isEnemyDead
          ? null
          : {
              ...currentEnemy,
              hp: Math.max(0, newEnemyHp),
              shield: newEnemyShield,
              statusEffects: newEnemyStatusEffects,
            },
        player: {
          ...s.player,
          hp: newPlayerHp,
          shield: newPlayerShield,
          hand: finalHand,
          deck: finalDeck,
          selectedCards: [],
          statusEffects: newPlayerStatusEffects,
          comboCooldowns: newCooldowns,
        },
        comboHistory: [...s.comboHistory, combo],
        isAnimating: false,
        showComboEffect: false,
      }));

      if (mode === 'challenge' || mode === 'endless') {
        get().incrementStreak();
        get().addScore(effectiveCombo.damage * 10);
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
        get().applyPlayerStatusEffects();
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

    let thornsDamage = 0;
    const thorns = player.statusEffects.find((e) => e.type === 'thorns');
    if (thorns && thorns.value > 0) {
      thornsDamage = thorns.value;
    }

    let newEnemyHp = enemy.hp;
    if (thornsDamage > 0) {
      newEnemyHp = Math.max(0, enemy.hp - thornsDamage);
      get().addFloatingText('damage', thornsDamage, 'enemy');
    }

    set((state) => ({
      player: {
        ...state.player,
        hp: Math.max(0, newPlayerHp),
        shield: newPlayerShield,
      },
      enemy: state.enemy ? {
        ...state.enemy,
        hp: newEnemyHp,
      } : state.enemy,
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
      if (state.enemy && state.enemy.hp <= 0) {
        if (mode === 'classic' || mode === 'quick') {
          set({ phase: 'victory' });
        } else {
          get().nextWave();
        }
        return;
      }
      state.applyStatusEffects();
      state.applyPlayerStatusEffects();
      if (mode === 'challenge' || mode === 'endless') {
        get().resetStreak();
      }
      state.nextTurn();
    }, 1000);
  },

  nextTurn: () => {
    set((state) => {
      const newCooldowns = state.player.comboCooldowns
        .map((cd) => ({
          ...cd,
          remaining: cd.remaining - 1,
        }))
        .filter((cd) => cd.remaining > 0);

      return {
        turn: state.turn + 1,
        player: {
          ...state.player,
          mana: state.player.maxMana,
          shield: 0,
          comboCooldowns: newCooldowns,
        },
      };
    });
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

  getComboCooldown: (comboId: string) => {
    const { player } = get();
    const cooldown = player.comboCooldowns.find((c) => c.comboId === comboId);
    return cooldown ? cooldown.remaining : 0;
  },

  isComboOnCooldown: (comboId: string) => {
    return get().getComboCooldown(comboId) > 0;
  },

  upgradeCombo: (comboId: string) => {
    const { player } = get();
    const combo = COMBOS.find((c) => c.id === comboId);
    if (!combo || !combo.canUpgrade || !combo.upgrades) return false;

    const currentLevel = get().getCurrentComboLevel(comboId);
    const maxLevel = combo.upgrades.length + 1;
    if (currentLevel >= maxLevel) return false;

    set((state) => {
      const newLevels = [...state.player.comboLevels];
      const existingIndex = newLevels.findIndex((l) => l.comboId === comboId);
      if (existingIndex >= 0) {
        newLevels[existingIndex] = {
          ...newLevels[existingIndex],
          level: newLevels[existingIndex].level + 1,
        };
      } else {
        newLevels.push({ comboId, level: 2 });
      }
      return {
        player: {
          ...state.player,
          comboLevels: newLevels,
        },
      };
    });
    return true;
  },

  getCurrentComboLevel: (comboId: string) => {
    const { player } = get();
    return getComboLevel(comboId, player.comboLevels);
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
}));
