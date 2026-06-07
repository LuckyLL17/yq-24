import { create } from 'zustand';
import type { GameState, Card, ComboSkill, Player, GameMode, BossIntentType, Difficulty, DailyQuest, ComboCategory } from '@/types/game';
import { createDeck, createPlayer, createEnemy, findCombo, ENEMIES, getComboLevel, getComboWithLevel, COMBOS, DIFFICULTY_CONFIG, CLASSIC_LEVELS, QUICK_LEVELS, generateDailyQuests, getTodayString, REFRESH_COST } from '@/data/gameData';
import { savePermanentData, saveBattleData, loadPermanentData, loadBattleData, clearBattleSave, hasBattleSave, hasPermanentSave } from '@/lib/gameSave';

interface GameActions {
  startBattle: (mode?: GameMode, difficulty?: Difficulty) => void;
  startChallenge: (difficulty?: Difficulty) => void;
  startEndless: (difficulty?: Difficulty) => void;
  startQuick: (difficulty?: Difficulty) => void;
  continueGame: () => boolean;
  hasSave: () => boolean;
  hasPermanent: () => boolean;
  saveGame: () => void;
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
  nextLevel: () => void;
  addFloatingText: (type: 'damage' | 'heal' | 'shield', value: number, target: 'player' | 'enemy') => void;
  removeFloatingText: (id: string) => void;
  setShaking: (target: 'player' | 'enemy', value: boolean) => void;
  getComboCooldown: (comboId: string) => number;
  isComboOnCooldown: (comboId: string) => boolean;
  upgradeCombo: (comboId: string) => boolean;
  getCurrentComboLevel: (comboId: string) => number;
  applyPlayerStatusEffects: () => void;
  toggleUpgradePanel: () => void;
  getUpgradeCost: (comboId: string) => number;
  addEssence: (amount: number) => void;
  checkBossPhaseTransition: () => void;
  transitionBossPhase: () => void;
  useEnemyAbility: (abilityId: string) => void;
  updateEnemyIntent: () => void;
  decrementAbilityCooldowns: () => void;
  showLevelCompleteScreen: (essenceReward: number) => void;
  hideLevelCompleteScreen: () => void;
  proceedToNextLevel: () => void;
  toggleDailyQuests: () => void;
  refreshDailyQuests: () => boolean;
  claimQuestReward: (questId: string) => boolean;
  updateQuestProgress: (type: string, value: number, comboId?: string, category?: ComboCategory) => void;
  checkDailyRefresh: () => void;
  trackComboUse: (combo: ComboSkill) => void;
  trackDamage: (amount: number) => void;
  trackWin: () => void;
  trackWave: (wave: number) => void;
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

const initialDailyQuestState = () => ({
  quests: generateDailyQuests(3),
  lastRefreshDate: getTodayString(),
  freeRefreshUsed: false,
  sessionDamage: 0,
  sessionCombos: [],
  sessionWins: 0,
  sessionMaxWave: 0,
  sessionComboCategories: [],
});

const loadInitialState = (): GameState => {
  const baseState: GameState = {
    phase: 'menu',
    mode: 'classic',
    difficulty: 'normal',
    turn: 1,
    player: initialPlayerState(),
    enemy: null,
    comboHistory: [],
    streak: 0,
    score: 0,
    elementEssence: 0,
    isAnimating: false,
    currentCombo: null,
    showComboEffect: false,
    showUpgradePanel: false,
    showLevelComplete: false,
    levelEssenceReward: 0,
    wave: 1,
    level: 1,
    maxLevel: 5,
    floatingTexts: [],
    enemyShaking: false,
    playerShaking: false,
    dailyQuests: initialDailyQuestState(),
    showDailyQuests: false,
  };

  const permanentData = loadPermanentData();
  if (permanentData) {
    baseState.elementEssence = permanentData.elementEssence;
    baseState.player.comboLevels = permanentData.comboLevels;
    baseState.dailyQuests = permanentData.dailyQuests;
  }

  return baseState;
};

const initialState: GameState = loadInitialState();

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  hasSave: () => hasBattleSave(),

  hasPermanent: () => hasPermanentSave(),

  saveGame: () => {
    const state = get();
    
    savePermanentData({
      elementEssence: state.elementEssence,
      comboLevels: state.player.comboLevels,
      dailyQuests: state.dailyQuests,
    });

    if (state.phase === 'battle' && state.enemy) {
      saveBattleData({
        phase: state.phase,
        mode: state.mode,
        difficulty: state.difficulty,
        turn: state.turn,
        player: state.player,
        enemy: state.enemy,
        wave: state.wave,
        level: state.level,
        maxLevel: state.maxLevel,
        score: state.score,
        streak: state.streak,
        comboHistory: state.comboHistory,
      });
    }
  },

  continueGame: (): boolean => {
    const battleData = loadBattleData();
    if (!battleData) return false;

    const permanentData = loadPermanentData();
    const comboLevels = permanentData?.comboLevels || [];

    set({
      phase: battleData.phase,
      mode: battleData.mode,
      difficulty: battleData.difficulty,
      turn: battleData.turn,
      player: {
        ...battleData.player,
        comboLevels,
      },
      enemy: battleData.enemy,
      wave: battleData.wave,
      level: battleData.level,
      maxLevel: battleData.maxLevel,
      score: battleData.score,
      streak: battleData.streak,
      comboHistory: battleData.comboHistory,
      isAnimating: false,
      currentCombo: null,
      showComboEffect: false,
      floatingTexts: [],
      showLevelComplete: false,
      levelEssenceReward: 0,
    });

    return true;
  },

  startBattle: (mode: GameMode = 'classic', difficulty: Difficulty = 'normal') => {
    const diffConfig = DIFFICULTY_CONFIG[difficulty];
    const currentState = get();
    
    let levels = CLASSIC_LEVELS;
    let startEnemyIndex = 0;
    
    if (mode === 'quick') {
      levels = QUICK_LEVELS;
      startEnemyIndex = QUICK_LEVELS[0].enemyIndex;
    } else if (mode === 'classic') {
      startEnemyIndex = CLASSIC_LEVELS[0].enemyIndex;
    } else if (mode === 'challenge' || mode === 'endless') {
      startEnemyIndex = 0;
    }
    
    const enemy = createEnemy(startEnemyIndex);
    const playerState = initialPlayerState();
    
    playerState.maxHp = Math.floor(playerState.maxHp * diffConfig.playerHpMultiplier);
    playerState.hp = playerState.maxHp;
    playerState.comboLevels = currentState.player.comboLevels;
    
    enemy.maxHp = Math.floor(enemy.maxHp * diffConfig.enemyHpMultiplier);
    enemy.hp = enemy.maxHp;
    enemy.attackPower = Math.floor(enemy.attackPower * diffConfig.enemyAttackMultiplier);
    enemy.intentValue = Math.floor(enemy.intentValue * diffConfig.enemyAttackMultiplier);
    
    if (enemy.abilities && enemy.abilities.length > 0) {
      enemy.abilities = enemy.abilities.map(a => ({
        ...a,
        value: Math.floor(a.value * diffConfig.enemyAttackMultiplier),
      }));
    }
    
    if (mode === 'quick') {
      playerState.maxHp = Math.floor(playerState.maxHp * 0.7);
      playerState.hp = playerState.maxHp;
    }
    
    const maxLevel = mode === 'classic' ? CLASSIC_LEVELS.length : mode === 'quick' ? QUICK_LEVELS.length : 999;
    
    clearBattleSave();
    
    set({
      phase: 'battle',
      mode,
      difficulty,
      turn: 1,
      player: playerState,
      enemy,
      comboHistory: [],
      streak: 0,
      score: 0,
      isAnimating: false,
      currentCombo: null,
      showComboEffect: false,
      showUpgradePanel: false,
      showLevelComplete: false,
      levelEssenceReward: 0,
      wave: 1,
      level: 1,
      maxLevel,
      floatingTexts: [],
    });

    setTimeout(() => get().saveGame(), 0);
  },

  startChallenge: (difficulty: Difficulty = 'normal') => {
    get().startBattle('challenge', difficulty);
  },

  startEndless: (difficulty: Difficulty = 'normal') => {
    get().startBattle('endless', difficulty);
  },

  startQuick: (difficulty: Difficulty = 'normal') => {
    get().startBattle('quick', difficulty);
  },

  goToMenu: () => {
    get().saveGame();
    set({ phase: 'menu' });
  },

  selectCard: (card: Card) => {
    const { player, isAnimating, enemy, showLevelComplete } = get();
    const selectedCards = player.selectedCards;
    if (isAnimating) return;
    if (!enemy || enemy.hp <= 0) return;
    if (showLevelComplete) return;
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
    const { isAnimating, showLevelComplete, enemy } = get();
    if (isAnimating) return;
    if (showLevelComplete) return;
    if (!enemy || enemy.hp <= 0) return;
    set((state) => ({
      player: {
        ...state.player,
        selectedCards: state.player.selectedCards.filter((c) => c.id !== cardId),
      },
    }));
  },

  playSelectedCards: () => {
    const { player, enemy, isAnimating, mode, showLevelComplete } = get();
    if (isAnimating || !enemy) return;
    if (enemy.hp <= 0) return;
    if (showLevelComplete) return;
    if (player.selectedCards.length !== 2) return;

    const [card1, card2] = player.selectedCards;
    const combo = findCombo(card1.element, card2.element);
    if (!combo) return;

    if (get().isComboOnCooldown(combo.id)) return;

    const level = get().getCurrentComboLevel(combo.id);
    const effectiveCombo = getComboWithLevel(combo, level);

    get().trackComboUse(combo);

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

      get().trackDamage(actualDamageDealt);
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
        enemy: {
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

      const comboEssence = combo.rarity === 'legendary' ? 5 : combo.rarity === 'epic' ? 3 : 2;
      get().addEssence(comboEssence);

      if (isEnemyDead) {
        const killBonus = combo.rarity === 'legendary' ? 15 : combo.rarity === 'epic' ? 10 : 5;
        const waveBonus = get().wave * 2;
        const essenceReward = killBonus + waveBonus;
        get().addEssence(essenceReward);
        get().trackWin();
        
        if (mode === 'classic' || mode === 'quick') {
          const state = get();
          const levels = mode === 'quick' ? QUICK_LEVELS : CLASSIC_LEVELS;
          if (state.level >= levels.length) {
            clearBattleSave();
            setTimeout(() => set({ phase: 'victory' }), 800);
          } else {
            setTimeout(() => {
              get().showLevelCompleteScreen(essenceReward);
            }, 800);
          }
        } else {
          setTimeout(() => {
            get().nextWave();
          }, 1200);
        }
      } else {
        setTimeout(() => {
          get().checkBossPhaseTransition();
          setTimeout(() => {
            get().enemyTurn();
          }, 500);
        }, 500);
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
        get().updateEnemyIntent();
        get().decrementAbilityCooldowns();
        get().nextTurn();
      }, 800);
      return;
    }

    let totalDamageToPlayer = 0;
    let newPlayerShield = player.shield;
    let newPlayerHp = player.hp;
    let newEnemyHp = enemy.hp;
    let newEnemyShield = enemy.shield;
    let attackCount = 1;
    const newPlayerStatusEffects = [...player.statusEffects];
    const newEnemyStatusEffects = [...enemy.statusEffects];

    const strength = enemy.statusEffects.find(e => e.type === 'strength');
    let baseDamage = enemy.attackPower + (strength ? strength.value : 0);

    const availableAbilities = enemy.abilities?.filter(a => (a.currentCooldown ?? 0) <= 0) || [];
    let usedAbility: typeof availableAbilities[0] | null = null;
    let lifestealAmount = 0;

    if (availableAbilities.length > 0) {
      const intent = enemy.intent;
      let matchingAbilities = availableAbilities.filter(a => {
        if (intent === 'attack') {
          return ['damage_boost', 'multi_attack', 'lifesteal'].includes(a.type);
        } else if (intent === 'debuff') {
          return ['weaken_player', 'lifesteal'].includes(a.type);
        } else if (intent === 'defend') {
          return ['shield_wall', 'counter_strike', 'thorns'].includes(a.type);
        } else {
          return ['enrage', 'heal_self', 'element_absorb', 'buff_self'].includes(a.type);
        }
      });
      
      if (matchingAbilities.length === 0) {
        matchingAbilities = availableAbilities;
      }

      const useChance = enemy.isBoss ? 0.8 : 0.4;
      if (matchingAbilities.length > 0 && Math.random() < useChance) {
        usedAbility = matchingAbilities[Math.floor(Math.random() * matchingAbilities.length)];
        
        switch (usedAbility.type) {
          case 'damage_boost':
            baseDamage += usedAbility.value;
            break;
          case 'multi_attack':
            attackCount = usedAbility.value;
            break;
          case 'shield_wall':
            newEnemyShield += usedAbility.value;
            get().addFloatingText('shield', usedAbility.value, 'enemy');
            break;
          case 'heal_self': {
            const healAmount = Math.min(usedAbility.value, enemy.maxHp - enemy.hp);
            newEnemyHp = Math.min(enemy.maxHp, enemy.hp + usedAbility.value);
            get().addFloatingText('heal', healAmount, 'enemy');
            break;
          }
          case 'enrage': {
            const existingStrength = newEnemyStatusEffects.find(e => e.type === 'strength');
            const enrageDuration = usedAbility.cooldown + 1;
            if (existingStrength) {
              existingStrength.value += usedAbility.value;
              existingStrength.duration = Math.max(existingStrength.duration, enrageDuration);
            } else {
              newEnemyStatusEffects.push({
                type: 'strength',
                value: usedAbility.value,
                duration: enrageDuration,
              });
            }
            break;
          }
          case 'weaken_player': {
            const existingWeakness = newPlayerStatusEffects.find(e => e.type === 'weakness');
            if (existingWeakness) {
              existingWeakness.value += usedAbility.value;
              existingWeakness.duration = Math.max(existingWeakness.duration, 3);
            } else {
              newPlayerStatusEffects.push({
                type: 'weakness',
                value: usedAbility.value,
                duration: 3,
              });
            }
            break;
          }
          case 'lifesteal':
            lifestealAmount = usedAbility.value;
            break;
          default:
            break;
        }
      }
    }

    const isAttackIntent = enemy.intent === 'attack' || enemy.intent === 'debuff';
    
    if (isAttackIntent) {
      const weakness = player.statusEffects.find(e => e.type === 'weakness');
      let actualDamage = baseDamage;
      if (weakness && weakness.value > 0) {
        actualDamage = Math.max(1, actualDamage - weakness.value);
      }

      for (let i = 0; i < attackCount; i++) {
        let damage = actualDamage;
        if (newPlayerShield >= damage) {
          newPlayerShield -= damage;
          damage = 0;
        } else {
          damage -= newPlayerShield;
          newPlayerShield = 0;
          newPlayerHp -= damage;
        }
        totalDamageToPlayer += actualDamage;
      }

      if (lifestealAmount > 0 && totalDamageToPlayer > 0) {
        const healFromLifesteal = Math.min(lifestealAmount, enemy.maxHp - newEnemyHp);
        newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + lifestealAmount);
        if (healFromLifesteal > 0) {
          get().addFloatingText('heal', healFromLifesteal, 'enemy');
        }
      }
    } else if (enemy.intent === 'defend') {
      const shieldGain = enemy.intentValue;
      newEnemyShield += shieldGain;
      get().addFloatingText('shield', shieldGain, 'enemy');
    } else if (enemy.intent === 'buff') {
      const buffValue = enemy.intentValue;
      const existingBuff = newEnemyStatusEffects.find(e => e.type === 'strength');
      if (existingBuff) {
        existingBuff.value += Math.floor(buffValue * 0.5);
        existingBuff.duration = Math.max(existingBuff.duration, 3);
      } else {
        newEnemyStatusEffects.push({
          type: 'strength',
          value: Math.floor(buffValue * 0.5),
          duration: 3,
        });
      }
    }

    let thornsDamage = 0;
    const thorns = player.statusEffects.find((e) => e.type === 'thorns');
    if (thorns && thorns.value > 0 && isAttackIntent) {
      thornsDamage = thorns.value * attackCount;
    }

    if (thornsDamage > 0) {
      newEnemyHp = Math.max(0, newEnemyHp - thornsDamage);
      get().trackDamage(thornsDamage);
      get().addFloatingText('damage', thornsDamage, 'enemy');
    }

    const updatedAbilities = enemy.abilities?.map(a => {
      if (usedAbility && a.id === usedAbility.id) {
        return { ...a, currentCooldown: a.cooldown };
      }
      return a;
    });

    set((state) => ({
      player: {
        ...state.player,
        hp: Math.max(0, newPlayerHp),
        shield: newPlayerShield,
        statusEffects: newPlayerStatusEffects,
      },
      enemy: state.enemy ? {
        ...state.enemy,
        hp: newEnemyHp,
        shield: newEnemyShield,
        statusEffects: newEnemyStatusEffects,
        abilities: updatedAbilities,
      } : state.enemy,
    }));

    if (totalDamageToPlayer > 0) {
      get().addFloatingText('damage', totalDamageToPlayer, 'player');
      set({ playerShaking: true });
      setTimeout(() => set({ playerShaking: false }), 500);
    }

    setTimeout(() => {
      const state = get();
      if (state.player.hp <= 0) {
        clearBattleSave();
        set({ phase: 'defeat' });
        return;
      }
      if (state.enemy && state.enemy.hp <= 0) {
        const thornsKillEssence = 8 + get().wave * 2;
        get().addEssence(thornsKillEssence);
        get().trackWin();
        
        if (mode === 'classic' || mode === 'quick') {
          const levels = mode === 'quick' ? QUICK_LEVELS : CLASSIC_LEVELS;
          if (state.level >= levels.length) {
            clearBattleSave();
            set({ phase: 'victory' });
          } else {
            get().showLevelCompleteScreen(thornsKillEssence);
          }
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
      state.decrementAbilityCooldowns();
      state.updateEnemyIntent();
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
    setTimeout(() => get().saveGame(), 0);
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
    let totalDamage = 0;
    let enemyDied = false;

    set((state) => {
      if (!state.enemy) return state;

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

      if (newEnemyHp <= 0 && state.enemy.hp > 0) {
        enemyDied = true;
      }

      return {
        enemy: {
          ...state.enemy,
          hp: newEnemyHp,
          statusEffects: newEffects,
        },
      };
    });

    if (totalDamage > 0) {
      get().trackDamage(totalDamage);
    }

    if (enemyDied) {
      const dotKillEssence = 6 + get().wave * 2;
      get().addEssence(dotKillEssence);
      get().trackWin();
    }
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
      
      const diffConfig = DIFFICULTY_CONFIG[state.difficulty];
      const multiplier = 1 + (nextWaveNum - 1) * 0.2;
      newEnemy.maxHp = Math.floor(newEnemy.maxHp * multiplier * diffConfig.enemyHpMultiplier);
      newEnemy.hp = newEnemy.maxHp;
      newEnemy.attackPower = Math.floor(newEnemy.attackPower * multiplier * diffConfig.enemyAttackMultiplier);
      newEnemy.intentValue = Math.floor(newEnemy.intentValue * multiplier * diffConfig.enemyAttackMultiplier);
      
      if (newEnemy.abilities && newEnemy.abilities.length > 0) {
        newEnemy.abilities = newEnemy.abilities.map(a => ({
          ...a,
          value: Math.floor(a.value * multiplier * diffConfig.enemyAttackMultiplier),
          currentCooldown: 0,
        }));
      }

      return {
        wave: nextWaveNum,
        enemy: newEnemy,
        turn: state.turn + 1,
      };
    });
    get().drawCards(2);
    get().trackWave(get().wave);
    setTimeout(() => get().saveGame(), 0);
  },

  nextLevel: () => {
    set((state) => {
      const nextLevelNum = state.level + 1;
      const levels = state.mode === 'quick' ? QUICK_LEVELS : CLASSIC_LEVELS;
      
      if (nextLevelNum > levels.length) {
        clearBattleSave();
        return { phase: 'victory' };
      }
      
      const levelData = levels[nextLevelNum - 1];
      const newEnemy = createEnemy(levelData.enemyIndex);
      
      const diffConfig = DIFFICULTY_CONFIG[state.difficulty];
      const levelMultiplier = 1 + (nextLevelNum - 1) * 0.15;
      
      newEnemy.maxHp = Math.floor(newEnemy.maxHp * diffConfig.enemyHpMultiplier * levelMultiplier);
      newEnemy.hp = newEnemy.maxHp;
      newEnemy.attackPower = Math.floor(newEnemy.attackPower * diffConfig.enemyAttackMultiplier * levelMultiplier);
      newEnemy.intentValue = Math.floor(newEnemy.intentValue * diffConfig.enemyAttackMultiplier * levelMultiplier);
      
      if (newEnemy.abilities && newEnemy.abilities.length > 0) {
        newEnemy.abilities = newEnemy.abilities.map(a => ({
          ...a,
          value: Math.floor(a.value * diffConfig.enemyAttackMultiplier * levelMultiplier),
          currentCooldown: 0,
        }));
      }

      return {
        level: nextLevelNum,
        enemy: newEnemy,
        turn: state.turn + 1,
      };
    });
    get().drawCards(2);
    setTimeout(() => get().saveGame(), 0);
  },

  showLevelCompleteScreen: (essenceReward: number) => {
    set({
      showLevelComplete: true,
      levelEssenceReward: essenceReward,
    });
  },

  hideLevelCompleteScreen: () => {
    set({ showLevelComplete: false });
  },

  proceedToNextLevel: () => {
    set({ showLevelComplete: false });
    get().nextLevel();
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
    const { elementEssence } = get();
    const combo = COMBOS.find((c) => c.id === comboId);
    if (!combo || !combo.canUpgrade || !combo.upgrades) return false;

    const currentLevel = get().getCurrentComboLevel(comboId);
    const maxLevel = combo.upgrades.length + 1;
    if (currentLevel >= maxLevel) return false;

    const cost = get().getUpgradeCost(comboId);
    if (elementEssence < cost) return false;

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
        elementEssence: state.elementEssence - cost,
        player: {
          ...state.player,
          comboLevels: newLevels,
        },
      };
    });

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
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

  toggleUpgradePanel: () => {
    set((state) => ({ showUpgradePanel: !state.showUpgradePanel }));
  },

  getUpgradeCost: (comboId: string) => {
    const combo = COMBOS.find((c) => c.id === comboId);
    if (!combo || !combo.canUpgrade || !combo.upgrades) return 0;

    const currentLevel = get().getCurrentComboLevel(comboId);
    const baseCost = combo.rarity === 'legendary' ? 30 : combo.rarity === 'epic' ? 20 : 10;
    return baseCost * currentLevel;
  },

  addEssence: (amount: number) => {
    const state = get();
    const diffConfig = DIFFICULTY_CONFIG[state.difficulty];
    const adjustedAmount = Math.floor(amount * diffConfig.essenceMultiplier);
    set((state) => ({ elementEssence: state.elementEssence + adjustedAmount }));
    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
    });
  },

  checkBossPhaseTransition: () => {
    const { enemy } = get();
    if (!enemy || !enemy.isBoss || !enemy.bossPhases || !enemy.bossPhase) return;
    if (enemy.phaseTransitionTriggered) return;

    const currentPhaseIndex = enemy.bossPhase - 1;
    const nextPhaseIndex = currentPhaseIndex + 1;
    
    if (nextPhaseIndex >= enemy.bossPhases.length) return;

    const hpPercent = enemy.hp / enemy.maxHp;
    
    const phaseThresholds = [0.7, 0.4];
    const triggerThreshold = phaseThresholds[currentPhaseIndex] ?? 0.5;

    if (hpPercent <= triggerThreshold) {
      get().transitionBossPhase();
    }
  },

  transitionBossPhase: () => {
    set((state) => {
      if (!state.enemy || !state.enemy.isBoss || !state.enemy.bossPhases || !state.enemy.bossPhase) {
        return state;
      }

      const currentPhaseIndex = state.enemy.bossPhase - 1;
      const nextPhaseIndex = currentPhaseIndex + 1;

      if (nextPhaseIndex >= state.enemy.bossPhases.length) {
        return state;
      }

      const nextPhaseData = state.enemy.bossPhases[nextPhaseIndex];
      const currentHpPercent = state.enemy.hp / state.enemy.maxHp;
      const newMaxHp = nextPhaseData.maxHp;
      const newHp = Math.floor(newMaxHp * currentHpPercent);
      const transitionShield = Math.floor(newMaxHp * 0.15);

      const cleanedStatusEffects = state.enemy.statusEffects.filter(
        e => ['strength', 'shield'].includes(e.type)
      );

      return {
        enemy: {
          ...state.enemy,
          name: nextPhaseData.name,
          maxHp: newMaxHp,
          hp: newHp,
          attackPower: nextPhaseData.attackPower,
          avatarType: nextPhaseData.avatarType,
          bossPhase: nextPhaseData.phase as 1 | 2 | 3,
          abilities: nextPhaseData.abilities.map(a => ({ ...a, currentCooldown: 0 })),
          phaseTransitionTriggered: true,
          shield: transitionShield,
          statusEffects: cleanedStatusEffects,
          intentPatternIndex: 0,
        },
        isAnimating: true,
      };
    });

    setTimeout(() => {
      set((state) => ({
        enemy: state.enemy ? { ...state.enemy, phaseTransitionTriggered: false } : state.enemy,
        isAnimating: false,
      }));
    }, 2000);
  },

  useEnemyAbility: (abilityId: string) => {
    const { enemy } = get();
    if (!enemy) return;

    const ability = enemy.abilities?.find(a => a.id === abilityId);
    if (!ability || (ability.currentCooldown ?? 0) > 0) return;

    let newEnemyHp = enemy.hp;
    let newEnemyShield = enemy.shield;
    let newEnemyAttackPower = enemy.attackPower;

    switch (ability.type) {
      case 'shield_wall':
        newEnemyShield += ability.value;
        get().addFloatingText('shield', ability.value, 'enemy');
        break;
      
      case 'heal_self': {
        const healAmount = Math.min(ability.value, enemy.maxHp - enemy.hp);
        newEnemyHp = Math.min(enemy.maxHp, enemy.hp + ability.value);
        get().addFloatingText('heal', healAmount, 'enemy');
        break;
      }
      
      case 'enrage':
        newEnemyAttackPower += ability.value;
        break;
      
      case 'weaken_player': {
        const { player } = get();
        const updatedEffects = [...player.statusEffects];
        const existingWeakness = updatedEffects.find(e => e.type === 'weakness');
        if (existingWeakness) {
          existingWeakness.value += ability.value;
          existingWeakness.duration = Math.max(existingWeakness.duration, 2);
        } else {
          updatedEffects.push({
            type: 'weakness',
            value: ability.value,
            duration: 2,
          });
        }
        set((state) => ({
          player: {
            ...state.player,
            statusEffects: updatedEffects,
          },
        }));
        break;
      }
      
      default:
        break;
    }

    set((state) => {
      if (!state.enemy) return state;
      
      const updatedAbilities = state.enemy.abilities?.map(a => 
        a.id === abilityId ? { ...a, currentCooldown: a.cooldown } : a
      );

      return {
        enemy: {
          ...state.enemy,
          hp: newEnemyHp,
          shield: newEnemyShield,
          attackPower: newEnemyAttackPower,
          abilities: updatedAbilities,
        },
      };
    });
  },

  updateEnemyIntent: () => {
    set((state) => {
      if (!state.enemy) return state;

      let selectedIntent: BossIntentType = 'attack';
      let intentValue = state.enemy.attackPower;
      let newPatternIndex = state.enemy.intentPatternIndex ?? 0;

      const bossPhase = state.enemy.bossPhase;
      const bossPhases = state.enemy.bossPhases;
      let pattern: BossIntentType[] | undefined;

      if (state.enemy.isBoss && bossPhases && bossPhase) {
        const phaseData = bossPhases[bossPhase - 1];
        if (phaseData && phaseData.intentPattern) {
          pattern = phaseData.intentPattern;
        }
      }

      if (pattern && pattern.length > 0) {
        selectedIntent = pattern[newPatternIndex % pattern.length];
        newPatternIndex = (newPatternIndex + 1) % pattern.length;
      } else {
        const intents: BossIntentType[] = ['attack', 'defend', 'buff'];
        const weights = state.enemy.isBoss ? [0.5, 0.3, 0.2] : [0.6, 0.25, 0.15];
        const rand = Math.random();
        let cumulative = 0;

        for (let i = 0; i < intents.length; i++) {
          cumulative += weights[i];
          if (rand <= cumulative) {
            selectedIntent = intents[i];
            break;
          }
        }
      }

      if (selectedIntent === 'defend') {
        intentValue = Math.floor(state.enemy.attackPower * 1.2);
      } else if (selectedIntent === 'buff') {
        intentValue = Math.floor(state.enemy.attackPower * 0.8);
      } else if (selectedIntent === 'debuff') {
        intentValue = Math.floor(state.enemy.attackPower * 0.6);
      }

      return {
        enemy: {
          ...state.enemy,
          intent: selectedIntent,
          intentValue,
          intentPatternIndex: newPatternIndex,
        },
      };
    });
  },

  decrementAbilityCooldowns: () => {
    set((state) => {
      if (!state.enemy || !state.enemy.abilities) return state;

      const updatedAbilities = state.enemy.abilities.map(a => ({
        ...a,
        currentCooldown: Math.max(0, (a.currentCooldown ?? 0) - 1),
      }));

      return {
        enemy: {
          ...state.enemy,
          abilities: updatedAbilities,
        },
      };
    });
  },

  toggleDailyQuests: () => {
    set((state) => ({ showDailyQuests: !state.showDailyQuests }));
  },

  checkDailyRefresh: () => {
    const today = getTodayString();
    const state = get();
    if (state.dailyQuests.lastRefreshDate !== today) {
      set({
        dailyQuests: {
          quests: generateDailyQuests(3),
          lastRefreshDate: today,
          freeRefreshUsed: false,
          sessionDamage: 0,
          sessionCombos: [],
          sessionWins: 0,
          sessionMaxWave: 0,
          sessionComboCategories: [],
        },
      });
      savePermanentData({
        elementEssence: get().elementEssence,
        comboLevels: get().player.comboLevels,
        dailyQuests: get().dailyQuests,
      });
    }
  },

  refreshDailyQuests: () => {
    const state = get();
    const { freeRefreshUsed } = state.dailyQuests;

    if (!freeRefreshUsed) {
      set({
        dailyQuests: {
          ...state.dailyQuests,
          quests: generateDailyQuests(3),
          freeRefreshUsed: true,
        },
      });
      savePermanentData({
        elementEssence: get().elementEssence,
        comboLevels: get().player.comboLevels,
        dailyQuests: get().dailyQuests,
      });
      return true;
    }

    if (state.elementEssence >= REFRESH_COST) {
      set((s) => ({
        elementEssence: s.elementEssence - REFRESH_COST,
        dailyQuests: {
          ...s.dailyQuests,
          quests: generateDailyQuests(3),
        },
      }));
      savePermanentData({
        elementEssence: get().elementEssence,
        comboLevels: get().player.comboLevels,
        dailyQuests: get().dailyQuests,
      });
      return true;
    }

    return false;
  },

  claimQuestReward: (questId: string) => {
    const state = get();
    const quest = state.dailyQuests.quests.find((q) => q.id === questId);

    if (!quest || !quest.completed || quest.claimed) return false;

    set((s) => ({
      elementEssence: s.elementEssence + quest.reward,
      dailyQuests: {
        ...s.dailyQuests,
        quests: s.dailyQuests.quests.map((q) =>
          q.id === questId ? { ...q, claimed: true } : q
        ),
      },
    }));

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
    });

    return true;
  },

  updateQuestProgress: (type: string, value: number, comboId?: string, category?: ComboCategory) => {
    set((state) => {
      const updatedQuests = state.dailyQuests.quests.map((quest) => {
        if (quest.completed || quest.claimed) return quest;

        let shouldUpdate = false;

        if (quest.type === type) {
          if (type === 'use_combo' && quest.targetComboId === comboId) {
            shouldUpdate = true;
          } else if (type === 'use_combo_category' && quest.targetCategory === category) {
            shouldUpdate = true;
          } else if (type === 'win_battle' || type === 'total_damage' || type === 'reach_wave') {
            shouldUpdate = true;
          }
        }

        if (!shouldUpdate) return quest;

        const newProgress = Math.min(quest.target, quest.progress + value);
        const completed = newProgress >= quest.target;

        return {
          ...quest,
          progress: newProgress,
          completed,
        };
      });

      return {
        dailyQuests: {
          ...state.dailyQuests,
          quests: updatedQuests,
        },
      };
    });
  },

  trackComboUse: (combo: ComboSkill) => {
    get().updateQuestProgress('use_combo', 1, combo.id);
    get().updateQuestProgress('use_combo_category', 1, undefined, combo.category);
  },

  trackDamage: (amount: number) => {
    if (amount <= 0) return;
    set((state) => ({
      dailyQuests: {
        ...state.dailyQuests,
        sessionDamage: state.dailyQuests.sessionDamage + amount,
      },
    }));
    get().updateQuestProgress('total_damage', amount);
  },

  trackWin: () => {
    set((state) => ({
      dailyQuests: {
        ...state.dailyQuests,
        sessionWins: state.dailyQuests.sessionWins + 1,
      },
    }));
    get().updateQuestProgress('win_battle', 1);
  },

  trackWave: (wave: number) => {
    const state = get();
    if (wave > state.dailyQuests.sessionMaxWave) {
      set((s) => ({
        dailyQuests: {
          ...s.dailyQuests,
          sessionMaxWave: wave,
        },
      }));
      get().updateQuestProgress('reach_wave', 1);
    }
  },
}));
