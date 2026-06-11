import { create } from 'zustand';
import type { Player, Enemy, Card, ComboSkill, StatusEffect, BattleRating, DamageTier, CollectedCard } from '@/types/game';
import type { BattleState, BattleActions } from '@/types/store';
import { findCombo, getComboWithLevel, COMBOS, DIFFICULTY_CONFIG, CLASSIC_LEVELS, QUICK_LEVELS, ENEMIES, createCardByRarityWeight } from '@/data/gameData';
import { usePlayerStore } from './playerStore';
import { useEnemyStore } from './enemyStore';
import { useUIStore } from './uiStore';

const getStores = () => ({
  playerStore: usePlayerStore.getState(),
  enemyStore: useEnemyStore.getState(),
  uiStore: useUIStore.getState(),
});

export const useBattleStore = create<BattleState & BattleActions>((set, get) => ({
  phase: 'menu',
  mode: 'classic',
  difficulty: 'normal',
  turn: 1,
  wave: 1,
  level: 1,
  maxLevel: 5,
  comboHistory: [],
  streak: 0,
  maxStreak: 0,
  score: 0,
  elementEssence: 0,
  totalDamageDealt: 0,
  totalHealingDone: 0,
  combosUsed: 0,
  highestHitDamage: 0,
  battleRating: null,
  duoLayout: 'horizontal',
  duoWinner: null,
  myCardUsedIds: [],
  levelCardReward: null,

  startBattle: (mode: BattleState['mode'] = 'classic', difficulty: BattleState['difficulty'] = 'normal') => {
    const diffConfig = DIFFICULTY_CONFIG[difficulty];
    const { playerStore, enemyStore } = getStores();
    
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
    
    const enemy = enemyStore.createEnemy(startEnemyIndex, diffConfig.enemyHpMultiplier);
    const playerState = playerStore.initPlayer();
    
    playerState.maxHp = Math.floor(playerState.maxHp * diffConfig.playerHpMultiplier);
    playerState.hp = playerState.maxHp;
    playerState.comboLevels = playerStore.player.comboLevels;
    
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
    
    playerStore.setPlayer(playerState);
    enemyStore.setEnemy(enemy);
    
    set({
      phase: 'battle',
      mode,
      difficulty,
      turn: 1,
      comboHistory: [],
      streak: 0,
      score: 0,
      wave: 1,
      level: 1,
      maxLevel,
      myCardUsedIds: [],
      levelCardReward: null,
      maxStreak: 0,
      totalDamageDealt: 0,
      totalHealingDone: 0,
      combosUsed: 0,
      battleRating: null,
      highestHitDamage: 0,
    });
  },

  startChallenge: (difficulty: BattleState['difficulty'] = 'normal') => {
    get().startBattle('challenge', difficulty);
  },

  startEndless: (difficulty: BattleState['difficulty'] = 'normal') => {
    get().startBattle('endless', difficulty);
  },

  startQuick: (difficulty: BattleState['difficulty'] = 'normal') => {
    get().startBattle('quick', difficulty);
  },

  startDuo: (layout: 'horizontal' | 'vertical' = 'horizontal') => {
    const { playerStore } = getStores();
    const player1 = playerStore.initPlayer();
    const player2 = playerStore.initPlayer();
    
    player1.name = '玩家 1';
    player2.name = '玩家 2';
    
    playerStore.setPlayer(player1);
    playerStore.setPlayer2(player2);
    useEnemyStore.getState().setEnemy(null);
    
    set({
      phase: 'battle',
      mode: 'duo',
      difficulty: 'normal',
      turn: 1,
      comboHistory: [],
      streak: 0,
      score: 0,
      wave: 1,
      level: 1,
      maxLevel: 1,
      duoLayout: layout,
      duoWinner: null,
      myCardUsedIds: [],
      levelCardReward: null,
    });
  },

  calculateDamage: (baseDamage: number, attacker: Player | Enemy, defender: Player | Enemy) => {
    let damage = baseDamage;
    let remainingShield = defender.shield;
    let actualDamageDealt = 0;

    if (damage > 0) {
      if (remainingShield >= damage) {
        remainingShield -= damage;
        actualDamageDealt = damage;
        damage = 0;
      } else {
        const beforeDamage = damage;
        damage -= remainingShield;
        remainingShield = 0;
        actualDamageDealt = beforeDamage;
      }
    }

    const newHp = Math.max(0, defender.hp - damage);
    return {
      finalDamage: damage,
      actualDamageDealt,
      remainingShield,
      newHp,
    };
  },

  applyComboEffect: (combo: ComboSkill, target: 'player' | 'enemy') => {
    const damage = combo.damage;
    let heal = 0;
    let shield = 0;
    let drawCards = 0;
    const statusEffects: StatusEffect[] = [];

    if (combo.effect && combo.effectValue && combo.effectDuration !== undefined) {
      const debuffEffects = ['burn', 'poison', 'freeze', 'stun', 'weakness'] as const;
      const buffEffects = ['thorns', 'strength'] as const;

      if (debuffEffects.includes(combo.effect as typeof debuffEffects[number])) {
        statusEffects.push({
          type: combo.effect as StatusEffect['type'],
          value: combo.effectValue,
          duration: combo.effectDuration,
        });
      }

      if (buffEffects.includes(combo.effect as typeof buffEffects[number]) && combo.effectDuration > 0) {
        statusEffects.push({
          type: combo.effect as StatusEffect['type'],
          value: combo.effectValue,
          duration: combo.effectDuration,
        });
      }

      if (combo.effect === 'heal') {
        heal = combo.effectValue;
      }
      if (combo.effect === 'shield') {
        shield = combo.effectValue;
      }
      if (combo.effect === 'draw') {
        drawCards = combo.effectValue;
      }
      if (combo.effect === 'lifesteal') {
        heal = combo.effectValue;
      }
      if (combo.effect === 'absorb') {
        shield = combo.effectValue;
      }
    }

    return { damage, heal, shield, drawCards, statusEffects };
  },

  getStreakDamageBonus: (): number => {
    const { streak } = get();
    if (streak <= 1) return 0;
    const bonusPerStreak = 5;
    const maxBonus = 100;
    return Math.min((streak - 1) * bonusPerStreak, maxBonus);
  },

  calculateDamageTier: (damage: number): DamageTier => {
    if (damage >= 50) return 'devastating';
    if (damage >= 35) return 'critical';
    if (damage >= 20) return 'heavy';
    if (damage >= 10) return 'normal';
    return 'light';
  },

  calculateBattleRating: (): BattleRating => {
    const { maxStreak, totalDamageDealt, turn, difficulty, highestHitDamage } = get();
    
    let score = 0;
    score += Math.min(maxStreak * 10, 100);
    score += Math.min(totalDamageDealt / 10, 100);
    score += Math.min(highestHitDamage, 50);
    const turnBonus = Math.max(0, 50 - turn * 2);
    score += turnBonus;
    const difficultyMultiplier = DIFFICULTY_CONFIG[difficulty].essenceMultiplier;
    score = Math.floor(score * difficultyMultiplier);
    
    if (score >= 220) return 'S';
    if (score >= 170) return 'A';
    if (score >= 120) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  },

  addScore: (points: number) => {
    set((state) => ({ score: state.score + points }));
  },

  incrementStreak: () => {
    set((state) => ({ 
      streak: state.streak + 1,
      maxStreak: Math.max(state.maxStreak, state.streak + 1),
    }));
  },

  resetStreak: () => {
    set({ streak: 0 });
  },

  addEssence: (amount: number) => {
    const { difficulty } = get();
    const diffConfig = DIFFICULTY_CONFIG[difficulty];
    const adjustedAmount = Math.floor(amount * diffConfig.essenceMultiplier);
    set((state) => ({ elementEssence: state.elementEssence + adjustedAmount }));
  },

  trackComboUse: (combo: ComboSkill) => {
    const updateQuestProgress = (window as any).__updateQuestProgress;
    if (updateQuestProgress) {
      updateQuestProgress('use_combo', 1, combo.id);
      updateQuestProgress('use_combo_category', 1, undefined, combo.category);
    }
  },

  trackDamage: (amount: number) => {
    if (amount <= 0) return;
    const updateQuestProgress = (window as any).__updateQuestProgress;
    if (updateQuestProgress) {
      updateQuestProgress('total_damage', amount);
    }
  },

  trackWin: () => {
    const updateQuestProgress = (window as any).__updateQuestProgress;
    if (updateQuestProgress) {
      updateQuestProgress('win_battle', 1);
    }
  },

  trackWave: (wave: number) => {
    const state = get();
    const updateQuestProgress = (window as any).__updateQuestProgress;
    if (updateQuestProgress && wave > (state as any).sessionMaxWave) {
      updateQuestProgress('reach_wave', 1);
    }
  },

  restartGame: () => {
    const state = get();
    const { mode, difficulty } = state;
    state.startBattle(mode, difficulty);
  },

  goToMenu: () => {
    set({ phase: 'menu' });
  },

  setDuoLayout: (layout: 'horizontal' | 'vertical') => {
    set({ duoLayout: layout });
  },

  resetMyCardCooldowns: () => {
    set({ myCardUsedIds: [] });
  },

  addCardToUsed: (cardId: string) => {
    set((state) => ({
      myCardUsedIds: [...state.myCardUsedIds, cardId],
    }));
  },

  isMyCardOnCooldown: (cardId: string): boolean => {
    return get().myCardUsedIds.includes(cardId);
  },

  getBattleCardReward: (): Card | null => {
    const { difficulty } = get();
    const dropChance = difficulty === 'easy' ? 0.3 : difficulty === 'normal' ? 0.4 : difficulty === 'hard' ? 0.5 : 0.6;
    
    if (Math.random() > dropChance) return null;

    const rarityWeights = difficulty === 'easy'
      ? { common: 70, rare: 25, epic: 4, legendary: 1 }
      : difficulty === 'normal'
      ? { common: 60, rare: 28, epic: 9, legendary: 3 }
      : difficulty === 'hard'
      ? { common: 45, rare: 30, epic: 18, legendary: 7 }
      : { common: 30, rare: 30, epic: 25, legendary: 15 };

    return createCardByRarityWeight(rarityWeights);
  },

  addCardToCollection: (card: Card) => {
    const addCardToCollectionGlobal = (window as any).__addCardToCollection;
    if (addCardToCollectionGlobal) {
      addCardToCollectionGlobal(card);
    }
  },

  setBattleRating: (rating: BattleRating | null) => {
    set({ battleRating: rating });
  },

  playSelectedCards: () => {
    const { playerStore, enemyStore, uiStore } = getStores();
    const state = get();
    const { player, enemy } = { player: playerStore.player, enemy: enemyStore.enemy };
    
    if (uiStore.isAnimating || !enemy) return;
    if (enemy.hp <= 0) return;
    if (uiStore.showLevelComplete) return;
    if (player.selectedCards.length !== 2) return;

    const [card1, card2] = player.selectedCards;
    const combo = findCombo(card1.element, card2.element);
    if (!combo) return;

    if (playerStore.isComboOnCooldown(combo.id)) return;

    const level = playerStore.getCurrentComboLevel(combo.id);
    const effectiveCombo = getComboWithLevel(combo, level);

    get().trackComboUse(combo);

    uiStore.setAnimating(true);
    uiStore.showCombo(effectiveCombo);

    const newHand = player.hand.filter((c) => c.id !== card1.id && c.id !== card2.id);
    const newDeck = [...player.deck];

    setTimeout(() => {
      const s = get();
      const currentEnemy = enemyStore.enemy;
      if (!currentEnemy) return;

      let damage = effectiveCombo.damage;
      const newEnemyStatusEffects = [...currentEnemy.statusEffects];
      const newPlayerStatusEffects = [...player.statusEffects];

      const streakBonus = s.getStreakDamageBonus();
      if (streakBonus > 0 && effectiveCombo.damage > 0) {
        const bonusDamage = Math.floor(effectiveCombo.damage * streakBonus / 100);
        damage += bonusDamage;
      }

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

      const damageResult = s.calculateDamage(damage, player, currentEnemy);

      s.trackDamage(damageResult.actualDamageDealt);
      uiStore.addDamageFloatingText(damageResult.finalDamage, 'enemy', card1.element);
      uiStore.setShaking('enemy', true);
      setTimeout(() => uiStore.setShaking('enemy', false), 500);

      set((st) => ({
        totalDamageDealt: st.totalDamageDealt + damageResult.actualDamageDealt,
        highestHitDamage: Math.max(st.highestHitDamage, damageResult.finalDamage),
        combosUsed: st.combosUsed + 1,
      }));

      let newPlayerHp = player.hp;
      let newPlayerShield = player.shield;
      let cardsToDraw = 0;
      let totalHealAmount = 0;

      if (effectiveCombo.effect === 'heal' && effectiveCombo.effectValue) {
        newPlayerHp = Math.min(player.maxHp, newPlayerHp + effectiveCombo.effectValue);
        totalHealAmount += effectiveCombo.effectValue;
        uiStore.addFloatingText('heal', effectiveCombo.effectValue, 'player');
      }
      if (effectiveCombo.effect === 'shield' && effectiveCombo.effectValue) {
        newPlayerShield += effectiveCombo.effectValue;
        uiStore.addFloatingText('shield', effectiveCombo.effectValue, 'player');
      }
      if (effectiveCombo.effect === 'draw' && effectiveCombo.effectValue) {
        cardsToDraw = effectiveCombo.effectValue;
      }
      if (effectiveCombo.effect === 'lifesteal' && effectiveCombo.effectValue) {
        const healAmount = Math.min(effectiveCombo.effectValue, damageResult.actualDamageDealt);
        newPlayerHp = Math.min(player.maxHp, newPlayerHp + healAmount);
        totalHealAmount += healAmount;
        uiStore.addFloatingText('heal', healAmount, 'player');
      }
      if (effectiveCombo.effect === 'absorb' && effectiveCombo.effectValue) {
        const absorbAmount = Math.min(effectiveCombo.effectValue, damageResult.actualDamageDealt);
        newPlayerShield += absorbAmount;
        uiStore.addFloatingText('shield', absorbAmount, 'player');
      }

      if (totalHealAmount > 0) {
        set((st) => ({
          totalHealingDone: st.totalHealingDone + totalHealAmount,
        }));
      }

      const finalDeck = [...newDeck];
      const finalHand = [...newHand];
      for (let i = 0; i < cardsToDraw && finalDeck.length > 0; i++) {
        finalHand.push(finalDeck.shift()!);
      }

      const isEnemyDead = damageResult.newHp <= 0;

      playerStore.setComboCooldown(combo.id, combo.cooldown);

      const equippedMyCardIds = ((window as any).__getEquippedMyCards?.() || []).map((c: CollectedCard) => c.id);
      const myCardIdsUsed = [card1, card2].filter(c => equippedMyCardIds.includes(c.id)).map(c => c.id);

      playerStore.setPlayer({
        ...player,
        hp: newPlayerHp,
        shield: newPlayerShield,
        mana: player.mana - (card1.manaCost + card2.manaCost),
        hand: finalHand,
        deck: finalDeck,
        selectedCards: [],
        statusEffects: newPlayerStatusEffects,
      });

      enemyStore.setEnemy({
        ...currentEnemy,
        hp: damageResult.newHp,
        shield: damageResult.remainingShield,
        statusEffects: newEnemyStatusEffects,
      });

      set((st) => ({
        myCardUsedIds: [...st.myCardUsedIds, ...myCardIdsUsed],
        comboHistory: [...st.comboHistory, combo],
      }));

      uiStore.setAnimating(false);
      uiStore.hideCombo();

      s.incrementStreak();
      if (state.mode === 'challenge' || state.mode === 'endless') {
        s.addScore(effectiveCombo.damage * 10);
      }
      const newStreak = s.streak;
      if (newStreak >= 2) {
        const bonus = s.getStreakDamageBonus();
        setTimeout(() => {
          uiStore.addComboFloatingText(newStreak, bonus);
        }, 300);
      }

      const comboEssence = combo.rarity === 'legendary' ? 5 : combo.rarity === 'epic' ? 3 : 2;
      s.addEssence(comboEssence);

      if (isEnemyDead) {
        const killBonus = combo.rarity === 'legendary' ? 15 : combo.rarity === 'epic' ? 10 : 5;
        const waveBonus = s.wave * 2;
        const essenceReward = killBonus + waveBonus;
        s.addEssence(essenceReward);
        s.trackWin();

        setTimeout(() => {
          uiStore.showBattleRatingEffect();
        }, 600);

        const cardReward = s.getBattleCardReward();
        if (cardReward) {
          s.addCardToCollection(cardReward);
          set({ levelCardReward: cardReward });
        }
        
        if (state.mode === 'classic' || state.mode === 'quick') {
          const levels = state.mode === 'quick' ? QUICK_LEVELS : CLASSIC_LEVELS;
          if (s.level >= levels.length) {
            setTimeout(() => set({ phase: 'victory' }), 800);
          } else {
            setTimeout(() => {
              uiStore.showLevelCompleteScreen(essenceReward);
            }, 800);
          }
        } else {
          setTimeout(() => {
            s.nextWave();
          }, 1200);
        }
      } else {
        setTimeout(() => {
          enemyStore.checkBossPhaseTransition();
          setTimeout(() => {
            s.enemyTurn();
          }, 500);
        }, 500);
      }
    }, 1500);
  },

  enemyTurn: () => {
    const { playerStore, enemyStore, uiStore } = getStores();
    const state = get();
    const { player, enemy } = { player: playerStore.player, enemy: enemyStore.enemy };
    
    if (!enemy) return;

    const stunned = enemy.statusEffects.find((e) => e.type === 'stun');
    const frozen = enemy.statusEffects.find((e) => e.type === 'freeze');

    if ((stunned && stunned.duration > 0) || (frozen && frozen.duration > 0)) {
      setTimeout(() => {
        enemyStore.applyEnemyStatusEffects();
        playerStore.applyPlayerStatusEffects();
        enemyStore.updateEnemyIntent();
        enemyStore.decrementAbilityCooldowns();
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
          return ['damage_boost', 'multi_attack', 'lifesteal', 'poison_attack', 'burn_attack', 'pierce_attack', 'rage_mode'].includes(a.type);
        } else if (intent === 'debuff') {
          return ['weaken_player', 'poison_attack', 'burn_attack', 'freeze_attack', 'stun_attack', 'drain_shield'].includes(a.type);
        } else if (intent === 'defend') {
          return ['shield_wall', 'counter_strike', 'thorns_aura', 'regen', 'shield_bash'].includes(a.type);
        } else if (intent === 'heal') {
          return ['heal_self', 'regen', 'lifesteal'].includes(a.type);
        } else {
          return ['enrage', 'heal_self', 'element_absorb', 'thorns_aura', 'rage_mode'].includes(a.type);
        }
      });
      
      if (matchingAbilities.length === 0) {
        matchingAbilities = availableAbilities;
      }

      const useChance = enemy.isBoss ? 0.85 : 0.5;
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
            uiStore.addFloatingText('shield', usedAbility.value, 'enemy');
            break;
          case 'heal_self': {
            const healAmount = Math.min(usedAbility.value, enemy.maxHp - newEnemyHp);
            newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + usedAbility.value);
            uiStore.addFloatingText('heal', healAmount, 'enemy');
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
          case 'poison_attack': {
            const existingPoison = newPlayerStatusEffects.find(e => e.type === 'poison');
            if (existingPoison) {
              existingPoison.value += usedAbility.value;
              existingPoison.duration = Math.max(existingPoison.duration, 3);
            } else {
              newPlayerStatusEffects.push({
                type: 'poison',
                value: usedAbility.value,
                duration: 3,
              });
            }
            break;
          }
          case 'burn_attack': {
            const existingBurn = newPlayerStatusEffects.find(e => e.type === 'burn');
            if (existingBurn) {
              existingBurn.value += usedAbility.value;
              existingBurn.duration = Math.max(existingBurn.duration, 2);
            } else {
              newPlayerStatusEffects.push({
                type: 'burn',
                value: usedAbility.value,
                duration: 2,
              });
            }
            break;
          }
          case 'freeze_attack': {
            const existingFreeze = newPlayerStatusEffects.find(e => e.type === 'freeze');
            if (existingFreeze) {
              existingFreeze.duration = Math.max(existingFreeze.duration, 1);
            } else {
              newPlayerStatusEffects.push({
                type: 'freeze',
                value: 1,
                duration: 1,
              });
            }
            break;
          }
          case 'stun_attack': {
            const existingStun = newPlayerStatusEffects.find(e => e.type === 'stun');
            if (existingStun) {
              existingStun.duration = Math.max(existingStun.duration, 1);
            } else {
              newPlayerStatusEffects.push({
                type: 'stun',
                value: 1,
                duration: 1,
              });
            }
            break;
          }
          case 'thorns_aura': {
            const existingThorns = newEnemyStatusEffects.find(e => e.type === 'thorns');
            if (existingThorns) {
              existingThorns.value += usedAbility.value;
              existingThorns.duration = Math.max(existingThorns.duration, 3);
            } else {
              newEnemyStatusEffects.push({
                type: 'thorns',
                value: usedAbility.value,
                duration: 3,
              });
            }
            break;
          }
          case 'regen': {
            const existingHeal = newEnemyStatusEffects.find(e => e.type === 'heal');
            if (existingHeal) {
              existingHeal.value += usedAbility.value;
              existingHeal.duration = Math.max(existingHeal.duration, 3);
            } else {
              newEnemyStatusEffects.push({
                type: 'heal',
                value: usedAbility.value,
                duration: 3,
              });
            }
            break;
          }
          case 'shield_bash':
            baseDamage += enemy.shield * 0.3;
            newEnemyShield = Math.max(0, newEnemyShield - Math.floor(enemy.shield * 0.3));
            break;
          case 'drain_shield': {
            const drainAmount = Math.min(player.shield, usedAbility.value);
            newEnemyShield += drainAmount;
            if (drainAmount > 0) {
              uiStore.addFloatingText('shield', drainAmount, 'enemy');
            }
            break;
          }
          case 'pierce_attack':
            baseDamage += usedAbility.value;
            break;
          case 'rage_mode': {
            const existingStrength = newEnemyStatusEffects.find(e => e.type === 'strength');
            const rageDuration = usedAbility.cooldown + 2;
            const rageValue = Math.floor(usedAbility.value * 1.5);
            if (existingStrength) {
              existingStrength.value += rageValue;
              existingStrength.duration = Math.max(existingStrength.duration, rageDuration);
            } else {
              newEnemyStatusEffects.push({
                type: 'strength',
                value: rageValue,
                duration: rageDuration,
              });
            }
            newEnemyHp = Math.max(1, newEnemyHp - Math.floor(enemy.maxHp * 0.05));
            break;
          }
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
          uiStore.addFloatingText('heal', healFromLifesteal, 'enemy');
        }
      }
    } else if (enemy.intent === 'defend') {
      const shieldGain = enemy.intentValue;
      newEnemyShield += shieldGain;
      uiStore.addFloatingText('shield', shieldGain, 'enemy');
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
    } else if (enemy.intent === 'heal') {
      const healAmount = Math.min(enemy.intentValue, enemy.maxHp - newEnemyHp);
      newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + enemy.intentValue);
      if (healAmount > 0) {
        uiStore.addFloatingText('heal', healAmount, 'enemy');
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
      uiStore.addFloatingText('damage', thornsDamage, 'enemy');
    }

    if (usedAbility) {
      enemyStore.useEnemyAbility(usedAbility.id);
    }

    playerStore.setPlayer({
      ...player,
      hp: Math.max(0, newPlayerHp),
      shield: newPlayerShield,
      statusEffects: newPlayerStatusEffects,
    });

    enemyStore.setEnemy(enemyStore.enemy ? {
      ...enemyStore.enemy,
      hp: newEnemyHp,
      shield: newEnemyShield,
      statusEffects: newEnemyStatusEffects,
    } : enemyStore.enemy);

    if (totalDamageToPlayer > 0) {
      uiStore.addFloatingText('damage', totalDamageToPlayer, 'player');
      uiStore.setShaking('player', true);
      setTimeout(() => uiStore.setShaking('player', false), 500);
    }

    setTimeout(() => {
      const st = get();
      const currentPlayer = playerStore.player;
      const currentEnemy = enemyStore.enemy;
      
      if (currentPlayer.hp <= 0) {
        set({ phase: 'defeat' });
        return;
      }
      if (currentEnemy && currentEnemy.hp <= 0) {
        const thornsKillEssence = 8 + st.wave * 2;
        st.addEssence(thornsKillEssence);
        st.trackWin();
        
        if (state.mode === 'classic' || state.mode === 'quick') {
          const levels = state.mode === 'quick' ? QUICK_LEVELS : CLASSIC_LEVELS;
          if (st.level >= levels.length) {
            set({ phase: 'victory' });
          } else {
            uiStore.showLevelCompleteScreen(thornsKillEssence);
          }
        } else {
          st.nextWave();
        }
        return;
      }
      enemyStore.applyEnemyStatusEffects();
      playerStore.applyPlayerStatusEffects();
      st.resetStreak();
      enemyStore.decrementAbilityCooldowns();
      enemyStore.updateEnemyIntent();
      st.nextTurn();
    }, 1000);
  },

  nextTurn: () => {
    const { playerStore } = getStores();
    playerStore.decrementComboCooldowns();
    playerStore.resetMana();
    playerStore.resetShield();
    
    set((state) => ({
      turn: state.turn + 1,
    }));
    
    playerStore.drawCards(2);
  },

  nextWave: () => {
    const { enemyStore, playerStore } = getStores();
    const state = get();
    
    set((st) => {
      const nextWaveNum = st.wave + 1;
      const enemyIndex = Math.min(nextWaveNum - 1, ENEMIES.length - 1);
      const diffConfig = DIFFICULTY_CONFIG[st.difficulty];
      const multiplier = 1 + (nextWaveNum - 1) * 0.2;
      
      const newEnemy = enemyStore.createEnemy(enemyIndex, multiplier * diffConfig.enemyHpMultiplier);
      newEnemy.attackPower = Math.floor(newEnemy.attackPower * diffConfig.enemyAttackMultiplier);
      newEnemy.intentValue = Math.floor(newEnemy.intentValue * diffConfig.enemyAttackMultiplier);

      return {
        wave: nextWaveNum,
        turn: st.turn + 1,
        myCardUsedIds: [],
        levelCardReward: null,
      };
    });
    
    useUIStore.getState().hideLevelCompleteScreen();
    playerStore.drawCards(2);
    get().trackWave(get().wave);
  },

  nextLevel: () => {
    const { enemyStore, playerStore } = getStores();
    const state = get();
    
    set((st) => {
      const nextLevelNum = st.level + 1;
      const levels = st.mode === 'quick' ? QUICK_LEVELS : CLASSIC_LEVELS;
      
      if (nextLevelNum > levels.length) {
        return { phase: 'victory' };
      }
      
      const levelData = levels[nextLevelNum - 1];
      const diffConfig = DIFFICULTY_CONFIG[st.difficulty];
      const levelMultiplier = 1 + (nextLevelNum - 1) * 0.15;
      
      const newEnemy = enemyStore.createEnemy(levelData.enemyIndex, diffConfig.enemyHpMultiplier * levelMultiplier);
      newEnemy.attackPower = Math.floor(newEnemy.attackPower * diffConfig.enemyAttackMultiplier * levelMultiplier);
      newEnemy.intentValue = Math.floor(newEnemy.intentValue * diffConfig.enemyAttackMultiplier * levelMultiplier);

      return {
        level: nextLevelNum,
        turn: st.turn + 1,
        myCardUsedIds: [],
        levelCardReward: null,
      };
    });
    
    useUIStore.getState().hideLevelCompleteScreen();
    playerStore.drawCards(2);
  },

  proceedToNextLevel: () => {
    useUIStore.getState().hideLevelCompleteScreen();
    get().nextLevel();
  },

  duoPlaySelectedCards: (playerNum: 1 | 2) => {
    const { playerStore, uiStore } = getStores();
    const state = get();
    const { player, player2, currentDuoPlayer, duoWinner } = { 
      player: playerStore.player, 
      player2: playerStore.player2,
      currentDuoPlayer: playerStore.currentDuoPlayer,
      duoWinner: state.duoWinner,
    };
    
    if (uiStore.isAnimating || duoWinner) return;
    if (currentDuoPlayer !== playerNum) return;
    
    const attacker = playerNum === 1 ? player : player2;
    const defender = playerNum === 1 ? player2 : player;
    
    if (!attacker || !defender) return;
    if (attacker.selectedCards.length !== 2) return;

    const [card1, card2] = attacker.selectedCards;
    const combo = findCombo(card1.element, card2.element);
    if (!combo) return;

    if (playerStore.duoIsComboOnCooldown(playerNum, combo.id)) return;

    const level = playerStore.duoGetCurrentComboLevel(playerNum, combo.id);
    const effectiveCombo = getComboWithLevel(combo, level);

    uiStore.setAnimating(true);
    uiStore.showCombo(effectiveCombo);

    const newAttackerHand = attacker.hand.filter((c) => c.id !== card1.id && c.id !== card2.id);
    const newAttackerDeck = [...attacker.deck];

    setTimeout(() => {
      const s = get();
      const currentDefender = playerNum === 1 ? playerStore.player2 : playerStore.player;
      const currentAttacker = playerNum === 1 ? playerStore.player : playerStore.player2;
      
      if (!currentDefender || !currentAttacker) return;

      let damage = effectiveCombo.damage;
      const newDefenderStatusEffects = [...currentDefender.statusEffects];
      const newAttackerStatusEffects = [...currentAttacker.statusEffects];

      if (effectiveCombo.effect && effectiveCombo.effectValue && effectiveCombo.effectDuration !== undefined) {
        const debuffEffects = ['burn', 'poison', 'freeze', 'stun', 'weakness'] as const;
        if (debuffEffects.includes(effectiveCombo.effect as typeof debuffEffects[number])) {
          const existingIndex = newDefenderStatusEffects.findIndex((e) => e.type === effectiveCombo.effect);
          if (existingIndex >= 0) {
            newDefenderStatusEffects[existingIndex] = {
              ...newDefenderStatusEffects[existingIndex],
              value: newDefenderStatusEffects[existingIndex].value + (effectiveCombo.effectValue || 0),
              duration: Math.max(newDefenderStatusEffects[existingIndex].duration, effectiveCombo.effectDuration || 0),
            };
          } else {
            newDefenderStatusEffects.push({
              type: effectiveCombo.effect,
              value: effectiveCombo.effectValue,
              duration: effectiveCombo.effectDuration,
            });
          }
        }

        const buffEffects = ['thorns', 'strength'] as const;
        if (buffEffects.includes(effectiveCombo.effect as typeof buffEffects[number]) && effectiveCombo.effectDuration > 0) {
          const existingIndex = newAttackerStatusEffects.findIndex((e) => e.type === effectiveCombo.effect);
          if (existingIndex >= 0) {
            newAttackerStatusEffects[existingIndex] = {
              ...newAttackerStatusEffects[existingIndex],
              value: newAttackerStatusEffects[existingIndex].value + (effectiveCombo.effectValue || 0),
              duration: Math.max(newAttackerStatusEffects[existingIndex].duration, effectiveCombo.effectDuration || 0),
            };
          } else {
            newAttackerStatusEffects.push({
              type: effectiveCombo.effect,
              value: effectiveCombo.effectValue,
              duration: effectiveCombo.effectDuration,
            });
          }
        }
      }

      const damageResult = s.calculateDamage(damage, currentAttacker, currentDefender);

      const defenderShakingKey = playerNum === 1 ? 'player2' : 'player';
      uiStore.setShaking(defenderShakingKey as 'player' | 'enemy' | 'player2', true);
      setTimeout(() => uiStore.setShaking(defenderShakingKey as 'player' | 'enemy' | 'player2', false), 500);

      let newAttackerHp = currentAttacker.hp;
      let newAttackerShield = currentAttacker.shield;
      let cardsToDraw = 0;

      if (effectiveCombo.effect === 'heal' && effectiveCombo.effectValue) {
        newAttackerHp = Math.min(currentAttacker.maxHp, newAttackerHp + effectiveCombo.effectValue);
      }
      if (effectiveCombo.effect === 'shield' && effectiveCombo.effectValue) {
        newAttackerShield += effectiveCombo.effectValue;
      }
      if (effectiveCombo.effect === 'draw' && effectiveCombo.effectValue) {
        cardsToDraw = effectiveCombo.effectValue;
      }
      if (effectiveCombo.effect === 'lifesteal' && effectiveCombo.effectValue) {
        const healAmount = Math.min(effectiveCombo.effectValue, damageResult.actualDamageDealt);
        newAttackerHp = Math.min(currentAttacker.maxHp, newAttackerHp + healAmount);
      }
      if (effectiveCombo.effect === 'absorb' && effectiveCombo.effectValue) {
        const absorbAmount = Math.min(effectiveCombo.effectValue, damageResult.actualDamageDealt);
        newAttackerShield += absorbAmount;
      }

      const finalDeck = [...newAttackerDeck];
      const finalHand = [...newAttackerHand];
      for (let i = 0; i < cardsToDraw && finalDeck.length > 0; i++) {
        finalHand.push(finalDeck.shift()!);
      }

      const isDefenderDead = damageResult.newHp <= 0;

      const newCooldowns = [...currentAttacker.comboCooldowns];
      const existingCooldownIndex = newCooldowns.findIndex((c) => c.comboId === combo.id);
      if (existingCooldownIndex >= 0) {
        newCooldowns[existingCooldownIndex] = {
          ...newCooldowns[existingCooldownIndex],
          remaining: combo.cooldown,
        };
      } else {
        newCooldowns.push({ comboId: combo.id, remaining: combo.cooldown });
      }

      if (playerNum === 1) {
        playerStore.setPlayer({
          ...currentAttacker,
          hp: newAttackerHp,
          shield: newAttackerShield,
          mana: currentAttacker.mana - (card1.manaCost + card2.manaCost),
          hand: finalHand,
          deck: finalDeck,
          selectedCards: [],
          statusEffects: newAttackerStatusEffects,
          comboCooldowns: newCooldowns,
        });
        playerStore.setPlayer2(playerStore.player2 ? {
          ...playerStore.player2,
          hp: Math.max(0, damageResult.newHp),
          shield: damageResult.remainingShield,
          statusEffects: newDefenderStatusEffects,
        } : playerStore.player2);
      } else {
        playerStore.setPlayer2(playerStore.player2 ? {
          ...playerStore.player2,
          hp: newAttackerHp,
          shield: newAttackerShield,
          mana: playerStore.player2!.mana - (card1.manaCost + card2.manaCost),
          hand: finalHand,
          deck: finalDeck,
          selectedCards: [],
          statusEffects: newAttackerStatusEffects,
          comboCooldowns: newCooldowns,
        } : playerStore.player2);
        playerStore.setPlayer({
          ...playerStore.player,
          hp: Math.max(0, damageResult.newHp),
          shield: damageResult.remainingShield,
          statusEffects: newDefenderStatusEffects,
        });
      }

      uiStore.setAnimating(false);
      uiStore.hideCombo();
      
      set((st) => ({
        comboHistory: [...st.comboHistory, combo],
      }));

      if (isDefenderDead) {
        set({ duoWinner: playerNum, phase: 'victory' });
      } else {
        setTimeout(() => {
          s.duoNextTurn();
        }, 800);
      }
    }, 1500);
  },

  duoNextTurn: () => {
    const { playerStore } = getStores();
    const state = get();
    const { currentDuoPlayer, player, player2 } = { 
      currentDuoPlayer: playerStore.currentDuoPlayer,
      player: playerStore.player,
      player2: playerStore.player2,
    };
    
    const nextPlayer = currentDuoPlayer === 1 ? 2 : 1;
    const nextPlayerState = nextPlayer === 1 ? player : player2;
    if (!nextPlayerState) return;

    const newCooldowns = nextPlayerState.comboCooldowns
      .map((cd) => ({
        ...cd,
        remaining: cd.remaining - 1,
      }))
      .filter((cd) => cd.remaining > 0);

    if (nextPlayer === 1) {
      playerStore.setPlayer({
        ...player,
        mana: player.maxMana,
        shield: 0,
        comboCooldowns: newCooldowns,
      });
      playerStore.duoSetCurrentPlayer(1);
    } else {
      playerStore.setPlayer2(player2 ? {
        ...player2,
        mana: player2.maxMana,
        shield: 0,
        comboCooldowns: newCooldowns,
      } : player2);
      playerStore.duoSetCurrentPlayer(2);
    }

    set((st) => ({
      turn: st.turn + 1,
    }));

    setTimeout(() => {
      const target = nextPlayer === 1 ? playerStore.player : playerStore.player2;
      if (!target) return;
      
      const newHand = [...target.hand];
      const newDeck = [...target.deck];
      for (let i = 0; i < 2; i++) {
        if (newDeck.length > 0 && newHand.length < 10) {
          newHand.push(newDeck.shift()!);
        } else if (newDeck.length === 0 && newHand.length < 10) {
          const freshDeck = (window as any).__createDeck?.() || [];
          if (freshDeck.length > 0) {
            newHand.push(freshDeck.shift()!);
            newDeck.push(...freshDeck);
          }
        }
      }

      if (nextPlayer === 1) {
        playerStore.setPlayer({ ...playerStore.player, hand: newHand, deck: newDeck });
      } else {
        playerStore.setPlayer2(playerStore.player2 ? { ...playerStore.player2, hand: newHand, deck: newDeck } : playerStore.player2);
      }
    }, 300);
  },
}));
