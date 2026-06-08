import { create } from 'zustand';
import type { GameState, Card, ComboSkill, Player, GameMode, BossIntentType, Difficulty, ComboCategory, PlayerCosmetics, TutorialStep, CollectedCard, ElementType, Rarity, DuoScreenLayout } from '@/types/game';
import { createDeck, createPlayer, createEnemy, findCombo, ENEMIES, getComboLevel, getComboWithLevel, COMBOS, DIFFICULTY_CONFIG, CLASSIC_LEVELS, QUICK_LEVELS, generateDailyQuests, getTodayString, REFRESH_COST, CARD_PACKS, CARD_BORDERS, SHOP_AVATARS, CARD_VARIANTS, DISASSEMBLE_ESSENCE, SYNTHESIZE_ESSENCE, RARITY_NAMES, createCardByRarityWeight } from '@/data/gameData';
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
  toggleShop: () => void;
  buyCardPack: (packId: string) => Card[] | null;
  buyCardBorder: (borderId: string) => boolean;
  buyAvatar: (avatarId: string) => boolean;
  equipCardBorder: (borderId: string | null) => void;
  equipAvatar: (avatarId: string | null) => void;
  isCardBorderOwned: (borderId: string) => boolean;
  isAvatarOwned: (avatarId: string) => boolean;
  getEquippedCardBorder: () => string | null;
  getEquippedAvatar: () => string | null;
  getCollection: () => import('@/types/game').CollectedCard[];
  getCollectionStats: () => { total: number; unique: number; byRarity: Record<string, number> };
  getEquippedCardBorderData: () => import('@/types/game').CardBorder | null;
  getEquippedAvatarData: () => import('@/types/game').ShopAvatar | null;
  startTutorial: () => void;
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  setTutorialStep: (step: TutorialStep) => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  isTutorialCompleted: () => boolean;
  toggleMyCards: () => void;
  disassembleCard: (cardId: string, count?: number) => number | null;
  disassembleAllDuplicates: () => number;
  synthesizeCard: (element: ElementType, cardName: string) => CollectedCard | null;
  getSynthesizeCost: (rarity: Rarity) => number;
  getDisassembleValue: (rarity: Rarity) => number;
  getAllCardTemplates: () => Array<{ element: ElementType; name: string; description: string; power: number; rarity: Rarity; skillType?: string; skillValue?: number }>;
  equipMyCard: (cardId: string) => boolean;
  unequipMyCard: (cardId: string) => void;
  getEquippedMyCards: () => CollectedCard[];
  useMyCard: (cardId: string) => boolean;
  isMyCardOnCooldown: (cardId: string) => boolean;
  resetMyCardCooldowns: () => void;
  addCardToCollection: (card: Card) => void;
  getBattleCardReward: () => Card | null;
  selectMyCard: (cardId: string) => void;
  startDuo: (layout?: DuoScreenLayout) => void;
  duoSelectCard: (playerNum: 1 | 2, card: Card) => void;
  duoDeselectCard: (playerNum: 1 | 2, cardId: string) => void;
  duoPlaySelectedCards: (playerNum: 1 | 2) => void;
  duoNextTurn: () => void;
  duoIsComboOnCooldown: (playerNum: 1 | 2, comboId: string) => boolean;
  duoGetComboCooldown: (playerNum: 1 | 2, comboId: string) => number;
  duoGetCurrentComboLevel: (playerNum: 1 | 2, comboId: string) => number;
  setDuoLayout: (layout: DuoScreenLayout) => void;
  getStreakDamageBonus: () => number;
  calculateDamageTier: (damage: number) => import('@/types/game').DamageTier;
  calculateBattleRating: () => import('@/types/game').BattleRating;
  addDamageFloatingText: (damage: number, target: 'player' | 'enemy', element?: ElementType) => void;
  addComboFloatingText: (comboCount: number, damageBonus: number) => void;
  showBattleRatingEffect: () => void;
  hideBattleRating: () => void;
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

const initialCosmeticsState = (): PlayerCosmetics => ({
  ownedCardBorders: [],
  ownedAvatars: [],
  equippedCardBorder: null,
  equippedAvatar: null,
  openedCardPacks: [],
  collection: [],
  equippedMyCards: [],
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
    showShop: false,
    showMyCards: false,
    cosmetics: initialCosmeticsState(),
    tutorial: {
      tutorialCompleted: false,
      showTutorial: false,
      currentStep: 'welcome',
    },
    myCardUsedIds: [],
    levelCardReward: null,
    player2: null,
    currentDuoPlayer: 1,
    duoLayout: 'horizontal',
    player2Shaking: false,
    duoWinner: null,
    maxStreak: 0,
    totalDamageDealt: 0,
    totalHealingDone: 0,
    combosUsed: 0,
    showStreakBonus: false,
    lastStreakBonus: 0,
    battleRating: null,
    showBattleRating: false,
    highestHitDamage: 0,
  };

  const permanentData = loadPermanentData();
  if (permanentData) {
    baseState.elementEssence = permanentData.elementEssence ?? 0;
    baseState.player.comboLevels = permanentData.comboLevels ?? baseState.player.comboLevels;
    baseState.dailyQuests = permanentData.dailyQuests ?? baseState.dailyQuests;
    baseState.tutorial.tutorialCompleted = permanentData.tutorialCompleted ?? false;
    if (permanentData.cosmetics) {
      baseState.cosmetics = {
        ...initialCosmeticsState(),
        ...permanentData.cosmetics,
      };
    }
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
      cosmetics: state.cosmetics,
      tutorialCompleted: state.tutorial.tutorialCompleted,
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
      myCardUsedIds: [],
      levelCardReward: null,
      maxStreak: 0,
      totalDamageDealt: 0,
      totalHealingDone: 0,
      combosUsed: 0,
      showStreakBonus: false,
      lastStreakBonus: 0,
      battleRating: null,
      showBattleRating: false,
      highestHitDamage: 0,
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

      const streakBonus = get().getStreakDamageBonus();
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
      get().addDamageFloatingText(damage, 'enemy', card1.element);
      set({ enemyShaking: true });
      setTimeout(() => set({ enemyShaking: false }), 500);

      set((s) => ({
        totalDamageDealt: s.totalDamageDealt + actualDamageDealt,
        highestHitDamage: Math.max(s.highestHitDamage, damage),
        combosUsed: s.combosUsed + 1,
      }));

      let newPlayerHp = state.player.hp;
      let newPlayerShield = state.player.shield;
      let cardsToDraw = 0;

      let totalHealAmount = 0;

      if (effectiveCombo.effect === 'heal' && effectiveCombo.effectValue) {
        newPlayerHp = Math.min(state.player.maxHp, newPlayerHp + effectiveCombo.effectValue);
        totalHealAmount += effectiveCombo.effectValue;
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
        totalHealAmount += healAmount;
        get().addFloatingText('heal', healAmount, 'player');
      }
      if (effectiveCombo.effect === 'absorb' && effectiveCombo.effectValue) {
        const absorbAmount = Math.min(effectiveCombo.effectValue, actualDamageDealt);
        newPlayerShield += absorbAmount;
        get().addFloatingText('shield', absorbAmount, 'player');
      }

      if (totalHealAmount > 0) {
        set((s) => ({
          totalHealingDone: s.totalHealingDone + totalHealAmount,
        }));
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

      const equippedMyCardIds = get().getEquippedMyCards().map(c => c.id);
      const myCardIdsUsed = [card1, card2].filter(c => equippedMyCardIds.includes(c.id)).map(c => c.id);

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
        myCardUsedIds: [...s.myCardUsedIds, ...myCardIdsUsed],
        comboHistory: [...s.comboHistory, combo],
        isAnimating: false,
        showComboEffect: false,
      }));

      get().incrementStreak();
      if (mode === 'challenge' || mode === 'endless') {
        get().addScore(effectiveCombo.damage * 10);
      }
      const newStreak = get().streak;
      if (newStreak >= 2) {
        const bonus = get().getStreakDamageBonus();
        setTimeout(() => {
          get().addComboFloatingText(newStreak, bonus);
        }, 300);
      }
      set((s) => ({
        maxStreak: Math.max(s.maxStreak, newStreak),
      }));

      const comboEssence = combo.rarity === 'legendary' ? 5 : combo.rarity === 'epic' ? 3 : 2;
      get().addEssence(comboEssence);

      if (isEnemyDead) {
        const killBonus = combo.rarity === 'legendary' ? 15 : combo.rarity === 'epic' ? 10 : 5;
        const waveBonus = get().wave * 2;
        const essenceReward = killBonus + waveBonus;
        get().addEssence(essenceReward);
        get().trackWin();

        setTimeout(() => {
          get().showBattleRatingEffect();
        }, 600);

        const cardReward = get().getBattleCardReward();
        if (cardReward) {
          get().addCardToCollection(cardReward);
          set({ levelCardReward: cardReward });
        }
        
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
            get().addFloatingText('shield', usedAbility.value, 'enemy');
            break;
          case 'heal_self': {
            const healAmount = Math.min(usedAbility.value, enemy.maxHp - newEnemyHp);
            newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + usedAbility.value);
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
              get().addFloatingText('shield', drainAmount, 'enemy');
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
    } else if (enemy.intent === 'heal') {
      const healAmount = Math.min(enemy.intentValue, enemy.maxHp - newEnemyHp);
      newEnemyHp = Math.min(enemy.maxHp, newEnemyHp + enemy.intentValue);
      if (healAmount > 0) {
        get().addFloatingText('heal', healAmount, 'enemy');
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
      get().resetStreak();
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
        showLevelComplete: false,
        myCardUsedIds: [],
        levelCardReward: null,
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
        showLevelComplete: false,
        myCardUsedIds: [],
        levelCardReward: null,
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

  getStreakDamageBonus: () => {
    const { streak } = get();
    if (streak <= 1) return 0;
    const bonusPerStreak = 5;
    const maxBonus = 100;
    return Math.min((streak - 1) * bonusPerStreak, maxBonus);
  },

  calculateDamageTier: (damage: number): import('@/types/game').DamageTier => {
    if (damage >= 50) return 'devastating';
    if (damage >= 35) return 'critical';
    if (damage >= 20) return 'heavy';
    if (damage >= 10) return 'normal';
    return 'light';
  },

  calculateBattleRating: (): import('@/types/game').BattleRating => {
    const { maxStreak, totalDamageDealt, turn, mode, difficulty, highestHitDamage } = get();
    
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

  addDamageFloatingText: (damage: number, target: 'player' | 'enemy', element?: ElementType) => {
    const tier = get().calculateDamageTier(damage);
    const id = `ft_${Date.now()}_${Math.random()}`;
    const baseY = target === 'enemy' ? 25 : 65;
    const offsetY = (Math.random() - 0.5) * 10;
    const offsetX = (Math.random() - 0.5) * 15;
    
    set((state) => ({
      floatingTexts: [...state.floatingTexts, {
        id,
        value: damage,
        type: 'damage',
        x: 50 + offsetX,
        y: baseY + offsetY,
        tier,
        isCrit: tier === 'critical' || tier === 'devastating',
        element,
      }],
    }));
    
    const duration = tier === 'devastating' ? 1800 : tier === 'critical' ? 1500 : 1200;
    setTimeout(() => {
      get().removeFloatingText(id);
    }, duration);
  },

  addComboFloatingText: (comboCount: number, damageBonus: number) => {
    const id = `ft_combo_${Date.now()}_${Math.random()}`;
    set((state) => ({
      floatingTexts: [...state.floatingTexts, {
        id,
        value: comboCount,
        type: 'combo',
        x: 50,
        y: 45,
        comboCount,
        damageBonus,
      }],
      showStreakBonus: true,
      lastStreakBonus: damageBonus,
    }));
    
    setTimeout(() => {
      get().removeFloatingText(id);
      set({ showStreakBonus: false });
    }, 1500);
  },

  showBattleRatingEffect: () => {
    const rating = get().calculateBattleRating();
    const id = `ft_rating_${Date.now()}_${Math.random()}`;
    set((state) => ({
      battleRating: rating,
      showBattleRating: true,
      floatingTexts: [...state.floatingTexts, {
        id,
        value: 0,
        type: 'rating',
        x: 50,
        y: 40,
        rating,
      }],
    }));
    
    setTimeout(() => {
      get().removeFloatingText(id);
    }, 3000);
  },

  hideBattleRating: () => {
    set({ showBattleRating: false, battleRating: null });
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
      cosmetics: get().cosmetics,
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
      cosmetics: get().cosmetics,
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

      const enemy = state.enemy;
      const player = state.player;
      const hpPercent = enemy.hp / enemy.maxHp;
      const playerShield = player.shield;
      const playerHpPercent = player.hp / player.maxHp;
      const hasStrength = enemy.statusEffects.some(e => e.type === 'strength' && e.duration > 0);
      const hasWeakness = player.statusEffects.some(e => e.type === 'weakness' && e.duration > 0);
      const hasHealAbility = enemy.abilities?.some(a => a.type === 'heal_self' && (a.currentCooldown ?? 0) <= 0) ?? false;
      const hasShieldAbility = enemy.abilities?.some(a => a.type === 'shield_wall' && (a.currentCooldown ?? 0) <= 0) ?? false;

      if (pattern && pattern.length > 0) {
        selectedIntent = pattern[newPatternIndex % pattern.length];
        newPatternIndex = (newPatternIndex + 1) % pattern.length;

        if (hpPercent < 0.3 && hasHealAbility && Math.random() < 0.7) {
          selectedIntent = 'heal';
        } else if (hpPercent < 0.5 && hasShieldAbility && Math.random() < 0.5) {
          selectedIntent = 'defend';
        }
      } else {
        const weights: Record<BossIntentType, number> = {
          attack: 0.4,
          defend: 0.2,
          buff: 0.15,
          debuff: 0.15,
          heal: 0.1,
        };

        if (hpPercent < 0.3) {
          weights.heal = 0.35;
          weights.defend = 0.25;
          weights.attack = 0.25;
          weights.buff = 0.05;
          weights.debuff = 0.1;
        } else if (hpPercent < 0.6) {
          weights.heal = 0.15;
          weights.defend = 0.25;
          weights.attack = 0.35;
          weights.buff = 0.1;
          weights.debuff = 0.15;
        }

        if (playerShield > player.maxHp * 0.3) {
          weights.debuff = 0.25;
          weights.attack = 0.3;
        }

        if (playerHpPercent < 0.3) {
          weights.attack = 0.5;
          weights.buff = 0.1;
        }

        if (hasStrength) {
          weights.buff = 0.05;
          weights.attack = weights.attack + 0.1;
        }

        if (hasWeakness) {
          weights.debuff = 0.05;
          weights.attack = weights.attack + 0.1;
        }

        if (enemy.shield > enemy.maxHp * 0.3) {
          weights.defend = 0.1;
          weights.attack = weights.attack + 0.1;
        }

        if (!hasHealAbility) {
          weights.heal = 0;
        }
        if (!hasShieldAbility && enemy.shield === 0) {
          weights.defend = Math.max(0.05, weights.defend * 0.5);
        }

        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        const rand = Math.random() * totalWeight;
        let cumulative = 0;

        for (const [intent, weight] of Object.entries(weights) as [BossIntentType, number][]) {
          cumulative += weight;
          if (rand <= cumulative) {
            selectedIntent = intent;
            break;
          }
        }
      }

      if (selectedIntent === 'defend') {
        intentValue = Math.floor(enemy.attackPower * 1.3);
      } else if (selectedIntent === 'buff') {
        intentValue = Math.floor(enemy.attackPower * 0.9);
      } else if (selectedIntent === 'debuff') {
        intentValue = Math.floor(enemy.attackPower * 0.7);
      } else if (selectedIntent === 'heal') {
        intentValue = Math.floor(enemy.attackPower * 1.5);
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
        cosmetics: get().cosmetics,
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
        cosmetics: get().cosmetics,
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
        cosmetics: get().cosmetics,
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

    const cardDropChance = quest.rarity === 'common' ? 0.3 : quest.rarity === 'rare' ? 0.5 : 0.8;
    if (Math.random() < cardDropChance) {
      const rarityWeights = quest.rarity === 'common'
        ? { common: 70, rare: 25, epic: 4, legendary: 1 }
        : quest.rarity === 'rare'
        ? { common: 50, rare: 35, epic: 12, legendary: 3 }
        : { common: 30, rare: 30, epic: 28, legendary: 12 };
      const cardReward = createCardByRarityWeight(rarityWeights);
      get().addCardToCollection(cardReward);
    }

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
      tutorialCompleted: get().tutorial.tutorialCompleted,
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

  toggleShop: () => {
    set((state) => ({ showShop: !state.showShop }));
  },

  buyCardPack: (packId: string): Card[] | null => {
    const state = get();
    const pack = CARD_PACKS.find((p) => p.id === packId);
    if (!pack) return null;
    if (state.elementEssence < pack.price) return null;

    const cards: Card[] = [];
    const rarityWeights: Record<string, number> = {
      common: 60,
      rare: 30,
      epic: 8,
      legendary: 2,
    };

    const pickRarity = (guaranteed?: string): string => {
      if (guaranteed) {
        const guaranteedWeights: Record<string, number> = {
          common: 0,
          rare: 50,
          epic: 35,
          legendary: 15,
        };
        if (guaranteed === 'epic') {
          guaranteedWeights.epic = 70;
          guaranteedWeights.legendary = 30;
        } else if (guaranteed === 'legendary') {
          guaranteedWeights.legendary = 100;
        }
        const totalWeight = Object.values(guaranteedWeights).reduce((a, b) => a + b, 0);
        let rand = Math.random() * totalWeight;
        for (const [rarity, weight] of Object.entries(guaranteedWeights)) {
          rand -= weight;
          if (rand <= 0) return rarity;
        }
        return guaranteed;
      }
      const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
      let rand = Math.random() * totalWeight;
      for (const [rarity, weight] of Object.entries(rarityWeights)) {
        rand -= weight;
        if (rand <= 0) return rarity;
      }
      return 'common';
    };

    const elements = ['fire', 'water', 'earth', 'wind', 'lightning', 'light', 'dark'] as const;

    for (let i = 0; i < pack.cardCount; i++) {
      const isGuaranteed = i === pack.cardCount - 1 && pack.guaranteedRarity;
      const rarity = pickRarity(isGuaranteed ? pack.guaranteedRarity : undefined);
      const element = elements[Math.floor(Math.random() * elements.length)];
      const variants = CARD_VARIANTS[element];
      const matchingVariants = variants.filter((v) => v.rarity === rarity);
      
      let variant;
      if (matchingVariants.length > 0) {
        variant = matchingVariants[Math.floor(Math.random() * matchingVariants.length)];
      } else {
        variant = variants[Math.floor(Math.random() * variants.length)];
      }

      const cardId = `pack_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
      cards.push({
        id: cardId,
        element,
        name: variant.name,
        description: variant.description,
        power: variant.power,
        rarity: variant.rarity,
        skillType: variant.skillType as Card['skillType'],
        skillValue: variant.skillValue,
      });
    }

    set((s) => {
      const newCollection = [...s.cosmetics.collection];
      
      for (const card of cards) {
        const collectionKey = `${card.element}_${card.name}`;
        const existingIndex = newCollection.findIndex((c) => `${c.element}_${c.name}` === collectionKey);
        
        if (existingIndex >= 0) {
          newCollection[existingIndex] = {
            ...newCollection[existingIndex],
            count: newCollection[existingIndex].count + 1,
          };
        } else {
          newCollection.push({
            id: collectionKey,
            element: card.element,
            name: card.name,
            description: card.description,
            power: card.power,
            rarity: card.rarity,
            skillType: card.skillType,
            skillValue: card.skillValue,
            count: 1,
            obtainedAt: Date.now(),
          });
        }
      }

      return {
        elementEssence: s.elementEssence - pack.price,
        cosmetics: {
          ...s.cosmetics,
          openedCardPacks: [...s.cosmetics.openedCardPacks, packId],
          collection: newCollection,
        },
      };
    });

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
    });

    return cards;
  },

  buyCardBorder: (borderId: string): boolean => {
    const state = get();
    const border = CARD_BORDERS.find((b) => b.id === borderId);
    if (!border) return false;
    if (state.elementEssence < border.price) return false;
    if (state.cosmetics.ownedCardBorders.includes(borderId)) return false;

    set((s) => ({
      elementEssence: s.elementEssence - border.price,
      cosmetics: {
        ...s.cosmetics,
        ownedCardBorders: [...s.cosmetics.ownedCardBorders, borderId],
      },
    }));

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
    });

    return true;
  },

  buyAvatar: (avatarId: string): boolean => {
    const state = get();
    const avatar = SHOP_AVATARS.find((a) => a.id === avatarId);
    if (!avatar) return false;
    if (state.elementEssence < avatar.price) return false;
    if (state.cosmetics.ownedAvatars.includes(avatarId)) return false;

    set((s) => ({
      elementEssence: s.elementEssence - avatar.price,
      cosmetics: {
        ...s.cosmetics,
        ownedAvatars: [...s.cosmetics.ownedAvatars, avatarId],
      },
    }));

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
    });

    return true;
  },

  equipCardBorder: (borderId: string | null) => {
    if (borderId && !get().cosmetics.ownedCardBorders.includes(borderId)) return;

    set((s) => ({
      cosmetics: {
        ...s.cosmetics,
        equippedCardBorder: borderId,
      },
    }));

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
    });
  },

  equipAvatar: (avatarId: string | null) => {
    if (avatarId && !get().cosmetics.ownedAvatars.includes(avatarId)) return;

    set((s) => ({
      cosmetics: {
        ...s.cosmetics,
        equippedAvatar: avatarId,
      },
    }));

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
    });
  },

  isCardBorderOwned: (borderId: string): boolean => {
    return get().cosmetics?.ownedCardBorders?.includes(borderId) ?? false;
  },

  isAvatarOwned: (avatarId: string): boolean => {
    return get().cosmetics?.ownedAvatars?.includes(avatarId) ?? false;
  },

  getEquippedCardBorder: (): string | null => {
    return get().cosmetics?.equippedCardBorder ?? null;
  },

  getEquippedAvatar: (): string | null => {
    return get().cosmetics?.equippedAvatar ?? null;
  },

  getCollection: () => {
    return get().cosmetics?.collection || [];
  },

  getCollectionStats: () => {
    const collection = get().cosmetics?.collection || [];
    const total = collection.reduce((sum, c) => sum + c.count, 0);
    const byRarity: Record<string, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };
    collection.forEach((c) => {
      byRarity[c.rarity] = (byRarity[c.rarity] || 0) + c.count;
    });
    return { total, unique: collection.length, byRarity };
  },

  getEquippedCardBorderData: () => {
    const borderId = get().cosmetics?.equippedCardBorder;
    if (!borderId) return null;
    return CARD_BORDERS.find((b) => b.id === borderId) || null;
  },

  getEquippedAvatarData: () => {
    const avatarId = get().cosmetics?.equippedAvatar;
    if (!avatarId) return null;
    return SHOP_AVATARS.find((a) => a.id === avatarId) || null;
  },

  startTutorial: () => {
    set({
      tutorial: {
        tutorialCompleted: false,
        showTutorial: true,
        currentStep: 'welcome',
      },
    });
  },

  nextTutorialStep: () => {
    const { tutorial } = get();
    const steps: TutorialStep[] = ['welcome', 'cards', 'combo', 'release', 'status_effects', 'turn_based', 'hp_shield', 'complete'];
    const currentIndex = steps.indexOf(tutorial.currentStep);
    if (currentIndex < steps.length - 1) {
      set({
        tutorial: {
          ...tutorial,
          currentStep: steps[currentIndex + 1],
        },
      });
    }
  },

  prevTutorialStep: () => {
    const { tutorial } = get();
    const steps: TutorialStep[] = ['welcome', 'cards', 'combo', 'release', 'status_effects', 'turn_based', 'hp_shield', 'complete'];
    const currentIndex = steps.indexOf(tutorial.currentStep);
    if (currentIndex > 0) {
      set({
        tutorial: {
          ...tutorial,
          currentStep: steps[currentIndex - 1],
        },
      });
    }
  },

  setTutorialStep: (step: TutorialStep) => {
    set((state) => ({
      tutorial: {
        ...state.tutorial,
        currentStep: step,
      },
    }));
  },

  skipTutorial: () => {
    set((state) => ({
      tutorial: {
        ...state.tutorial,
        showTutorial: false,
        tutorialCompleted: true,
      },
    }));
    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
      tutorialCompleted: true,
    });
  },

  completeTutorial: () => {
    set((state) => ({
      tutorial: {
        ...state.tutorial,
        showTutorial: false,
        tutorialCompleted: true,
      },
    }));
    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
      tutorialCompleted: true,
    });
  },

  isTutorialCompleted: (): boolean => {
    return get().tutorial.tutorialCompleted;
  },

  toggleMyCards: () => {
    set((state) => ({ showMyCards: !state.showMyCards }));
  },

  getDisassembleValue: (rarity: Rarity): number => {
    return DISASSEMBLE_ESSENCE[rarity] || 0;
  },

  getSynthesizeCost: (rarity: Rarity): number => {
    return SYNTHESIZE_ESSENCE[rarity] || 0;
  },

  disassembleCard: (cardId: string, count: number = 1): number | null => {
    const state = get();
    const collection = state.cosmetics.collection;
    const cardIndex = collection.findIndex((c) => c.id === cardId);

    if (cardIndex < 0) return null;

    const card = collection[cardIndex];
    const actualCount = Math.min(count, card.count - 1);

    if (actualCount <= 0) return null;

    const essenceGain = DISASSEMBLE_ESSENCE[card.rarity] * actualCount;

    set((s) => {
      const newCollection = [...s.cosmetics.collection];
      const idx = newCollection.findIndex((c) => c.id === cardId);
      if (idx >= 0) {
        newCollection[idx] = {
          ...newCollection[idx],
          count: newCollection[idx].count - actualCount,
        };
      }
      return {
        elementEssence: s.elementEssence + essenceGain,
        cosmetics: {
          ...s.cosmetics,
          collection: newCollection,
        },
      };
    });

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
      tutorialCompleted: get().tutorial.tutorialCompleted,
    });

    return essenceGain;
  },

  disassembleAllDuplicates: (): number => {
    const state = get();
    const collection = state.cosmetics.collection;
    let totalEssence = 0;

    set((s) => {
      const newCollection = s.cosmetics.collection.map((card) => {
        if (card.count > 1) {
          const extraCount = card.count - 1;
          totalEssence += DISASSEMBLE_ESSENCE[card.rarity] * extraCount;
          return { ...card, count: 1 };
        }
        return card;
      });

      return {
        elementEssence: s.elementEssence + totalEssence,
        cosmetics: {
          ...s.cosmetics,
          collection: newCollection,
        },
      };
    });

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
      tutorialCompleted: get().tutorial.tutorialCompleted,
    });

    return totalEssence;
  },

  synthesizeCard: (element: ElementType, cardName: string): CollectedCard | null => {
    const state = get();
    const variants = CARD_VARIANTS[element];
    const cardTemplate = variants.find((v) => v.name === cardName);

    if (!cardTemplate) return null;

    const cost = SYNTHESIZE_ESSENCE[cardTemplate.rarity];
    if (state.elementEssence < cost) return null;

    const collectionKey = `${element}_${cardName}`;
    const existingIndex = state.cosmetics.collection.findIndex((c) => c.id === collectionKey);

    let newCard: CollectedCard;

    set((s) => {
      const newCollection = [...s.cosmetics.collection];
      const idx = newCollection.findIndex((c) => c.id === collectionKey);

      if (idx >= 0) {
        newCollection[idx] = {
          ...newCollection[idx],
          count: newCollection[idx].count + 1,
        };
        newCard = newCollection[idx];
      } else {
        newCard = {
          id: collectionKey,
          element,
          name: cardName,
          description: cardTemplate.description,
          power: cardTemplate.power,
          rarity: cardTemplate.rarity,
          skillType: cardTemplate.skillType as CollectedCard['skillType'],
          skillValue: cardTemplate.skillValue,
          count: 1,
          obtainedAt: Date.now(),
        };
        newCollection.push(newCard);
      }

      return {
        elementEssence: s.elementEssence - cost,
        cosmetics: {
          ...s.cosmetics,
          collection: newCollection,
        },
      };
    });

    savePermanentData({
      elementEssence: get().elementEssence,
      comboLevels: get().player.comboLevels,
      dailyQuests: get().dailyQuests,
      cosmetics: get().cosmetics,
      tutorialCompleted: get().tutorial.tutorialCompleted,
    });

    return newCard!;
  },

  getAllCardTemplates: () => {
    const templates: Array<{ element: ElementType; name: string; description: string; power: number; rarity: Rarity; skillType?: string; skillValue?: number }> = [];
    const elements: ElementType[] = ['fire', 'water', 'earth', 'wind', 'lightning', 'light', 'dark'];
    elements.forEach((element) => {
      CARD_VARIANTS[element].forEach((variant) => {
        templates.push({
          element,
          name: variant.name,
          description: variant.description,
          power: variant.power,
          rarity: variant.rarity,
          skillType: variant.skillType,
          skillValue: variant.skillValue,
        });
      });
    });
    return templates;
  },

  selectMyCard: (cardId: string): void => {
    const { player, isAnimating, enemy, showLevelComplete, myCardUsedIds } = get();
    if (isAnimating) return;
    if (!enemy || enemy.hp <= 0) return;
    if (showLevelComplete) return;
    if (myCardUsedIds.includes(cardId)) return;

    const collectedCard = get().getEquippedMyCards().find(c => c.id === cardId);
    if (!collectedCard) return;

    const isSelected = player.selectedCards.find((c) => c.id === cardId);

    if (isSelected) {
      set((state) => ({
        player: {
          ...state.player,
          selectedCards: state.player.selectedCards.filter((c) => c.id !== cardId),
        },
      }));
    } else {
      if (player.selectedCards.length >= 2) return;
      set((state) => ({
        player: {
          ...state.player,
          selectedCards: [...state.player.selectedCards, collectedCard as unknown as Card],
        },
      }));
    }
  },

  equipMyCard: (cardId: string): boolean => {
    const state = get();
    const card = state.cosmetics.collection.find(c => c.id === cardId);
    if (!card) return false;
    if (state.cosmetics.equippedMyCards.length >= 3) return false;
    if (state.cosmetics.equippedMyCards.includes(cardId)) return false;

    set((s) => ({
      cosmetics: {
        ...s.cosmetics,
        equippedMyCards: [...s.cosmetics.equippedMyCards, cardId],
      },
    }));
    setTimeout(() => get().saveGame(), 0);
    return true;
  },

  unequipMyCard: (cardId: string): void => {
    set((state) => ({
      cosmetics: {
        ...state.cosmetics,
        equippedMyCards: state.cosmetics.equippedMyCards.filter(id => id !== cardId),
      },
    }));
    setTimeout(() => get().saveGame(), 0);
  },

  getEquippedMyCards: (): CollectedCard[] => {
    const state = get();
    return state.cosmetics.equippedMyCards
      .map(id => state.cosmetics.collection.find(c => c.id === id))
      .filter((c): c is CollectedCard => c !== undefined);
  },

  isMyCardOnCooldown: (cardId: string): boolean => {
    return get().myCardUsedIds.includes(cardId);
  },

  resetMyCardCooldowns: (): void => {
    set({ myCardUsedIds: [] });
  },

  useMyCard: (cardId: string): boolean => {
    const state = get();
    if (state.isAnimating) return false;
    if (!state.enemy || state.enemy.hp <= 0) return false;
    if (state.myCardUsedIds.includes(cardId)) return false;

    const card = state.cosmetics.collection.find(c => c.id === cardId);
    if (!card) return false;

    set((s) => ({
      myCardUsedIds: [...s.myCardUsedIds, cardId],
      isAnimating: true,
    }));

    const damage = card.power;
    const skillType = card.skillType;
    const skillValue = card.skillValue || 0;

    setTimeout(() => {
      const s = get();
      if (!s.enemy) return;

      let totalDamage = damage;
      let healAmount = 0;
      let shieldAmount = 0;
      const newEnemyStatusEffects = [...s.enemy.statusEffects];
      const newPlayerStatusEffects = [...s.player.statusEffects];

      if (skillType === 'heavy_damage') {
        totalDamage = damage;
      } else if (skillType === 'damage_heal') {
        totalDamage = damage;
        healAmount = skillValue;
      } else if (skillType === 'damage_freeze') {
        totalDamage = damage;
        const existingFreeze = newEnemyStatusEffects.find(e => e.type === 'freeze');
        if (existingFreeze) {
          existingFreeze.duration = Math.max(existingFreeze.duration, skillValue);
        } else {
          newEnemyStatusEffects.push({ type: 'freeze', value: 0, duration: skillValue });
        }
      } else if (skillType === 'damage_shield') {
        totalDamage = damage;
        shieldAmount = skillValue;
      } else if (skillType === 'multi_hit') {
        totalDamage = Math.floor(damage * 0.4) * skillValue;
      } else if (skillType === 'big_heal') {
        healAmount = skillValue;
        totalDamage = 0;
      } else if (skillType === 'life_drain') {
        totalDamage = damage;
        healAmount = skillValue;
      }

      if (totalDamage > 0) {
        get().takeDamage('enemy', totalDamage);
        get().addFloatingText('damage', totalDamage, 'enemy');
      }
      if (healAmount > 0) {
        get().heal(healAmount);
        get().addFloatingText('heal', healAmount, 'player');
      }
      if (shieldAmount > 0) {
        get().addShield(shieldAmount);
        get().addFloatingText('shield', shieldAmount, 'player');
      }

      set((s) => ({
        enemy: s.enemy ? {
          ...s.enemy,
          statusEffects: newEnemyStatusEffects,
        } : null,
        player: {
          ...s.player,
          statusEffects: newPlayerStatusEffects,
        },
      }));

      setTimeout(() => {
        const currentState = get();
        if (!currentState.enemy) {
          set({ isAnimating: false });
          return;
        }

        if (currentState.enemy.hp <= 0) {
          const killBonus = card.rarity === 'legendary' ? 20 : card.rarity === 'epic' ? 12 : card.rarity === 'rare' ? 7 : 4;
          const waveBonus = currentState.wave * 2;
          const essenceReward = killBonus + waveBonus;
          get().addEssence(essenceReward);
          get().trackWin();

          const cardReward = get().getBattleCardReward();
          if (cardReward) {
            get().addCardToCollection(cardReward);
            set({ levelCardReward: cardReward });
          }

          if (currentState.mode === 'classic' || currentState.mode === 'quick') {
            const st = get();
            const levels = currentState.mode === 'quick' ? QUICK_LEVELS : CLASSIC_LEVELS;
            if (st.level >= levels.length) {
              clearBattleSave();
              setTimeout(() => set({ phase: 'victory', isAnimating: false }), 800);
            } else {
              setTimeout(() => {
                get().showLevelCompleteScreen(essenceReward);
                set({ isAnimating: false });
              }, 800);
            }
          } else {
            setTimeout(() => {
              get().nextWave();
              set({ isAnimating: false });
            }, 1200);
          }
        } else {
          setTimeout(() => {
            get().checkBossPhaseTransition();
            setTimeout(() => {
              get().enemyTurn();
              set({ isAnimating: false });
            }, 500);
          }, 500);
        }
      }, 500);
    }, 600);

    return true;
  },

  addCardToCollection: (card: Card): void => {
    set((state) => {
      const existingCard = state.cosmetics.collection.find(
        c => c.element === card.element && c.name === card.name
      );

      let newCollection: CollectedCard[];
      if (existingCard) {
        newCollection = state.cosmetics.collection.map(c =>
          c.id === existingCard.id
            ? { ...c, count: c.count + 1 }
            : c
        );
      } else {
        const newCollectedCard: CollectedCard = {
          id: `collected_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          element: card.element,
          name: card.name,
          description: card.description,
          power: card.power,
          rarity: card.rarity,
          skillType: card.skillType,
          skillValue: card.skillValue,
          count: 1,
          obtainedAt: Date.now(),
        };
        newCollection = [...state.cosmetics.collection, newCollectedCard];
      }

      return {
        cosmetics: {
          ...state.cosmetics,
          collection: newCollection,
        },
      };
    });
    setTimeout(() => get().saveGame(), 0);
  },

  getBattleCardReward: (): Card | null => {
    const state = get();
    const dropChance = state.difficulty === 'easy' ? 0.3 : state.difficulty === 'normal' ? 0.4 : state.difficulty === 'hard' ? 0.5 : 0.6;
    
    if (Math.random() > dropChance) return null;

    const rarityWeights = state.difficulty === 'easy'
      ? { common: 70, rare: 25, epic: 4, legendary: 1 }
      : state.difficulty === 'normal'
      ? { common: 60, rare: 28, epic: 9, legendary: 3 }
      : state.difficulty === 'hard'
      ? { common: 45, rare: 30, epic: 18, legendary: 7 }
      : { common: 30, rare: 30, epic: 25, legendary: 15 };

    return createCardByRarityWeight(rarityWeights);
  },

  startDuo: (layout: DuoScreenLayout = 'horizontal') => {
    const player1 = initialPlayerState();
    const player2State = initialPlayerState();
    
    player1.name = '玩家 1';
    player2State.name = '玩家 2';
    
    clearBattleSave();
    
    set({
      phase: 'battle',
      mode: 'duo',
      difficulty: 'normal',
      turn: 1,
      player: player1,
      player2: player2State,
      enemy: null,
      comboHistory: [],
      streak: 0,
      score: 0,
      isAnimating: false,
      currentCombo: null,
      showComboEffect: false,
      wave: 1,
      level: 1,
      maxLevel: 1,
      floatingTexts: [],
      playerShaking: false,
      player2Shaking: false,
      currentDuoPlayer: 1,
      duoLayout: layout,
      duoWinner: null,
      showLevelComplete: false,
      levelCardReward: null,
    });
  },

  setDuoLayout: (layout: DuoScreenLayout) => {
    set({ duoLayout: layout });
  },

  duoSelectCard: (playerNum: 1 | 2, card: Card) => {
    const { isAnimating, player2, duoWinner } = get();
    if (isAnimating) return;
    if (duoWinner) return;
    
    const targetPlayer = playerNum === 1 ? get().player : player2;
    if (!targetPlayer) return;
    
    if (targetPlayer.selectedCards.length >= 2) return;
    if (targetPlayer.selectedCards.find((c) => c.id === card.id)) return;
    
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
    const { isAnimating, duoWinner } = get();
    if (isAnimating) return;
    if (duoWinner) return;
    
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

  duoPlaySelectedCards: (playerNum: 1 | 2) => {
    const state = get();
    const { isAnimating, player2, currentDuoPlayer, duoWinner } = state;
    
    if (isAnimating || duoWinner) return;
    if (currentDuoPlayer !== playerNum) return;
    
    const attacker = playerNum === 1 ? state.player : player2;
    const defender = playerNum === 1 ? player2 : state.player;
    
    if (!attacker || !defender) return;
    if (attacker.selectedCards.length !== 2) return;

    const [card1, card2] = attacker.selectedCards;
    const combo = findCombo(card1.element, card2.element);
    if (!combo) return;

    if (get().duoIsComboOnCooldown(playerNum, combo.id)) return;

    const level = get().duoGetCurrentComboLevel(playerNum, combo.id);
    const effectiveCombo = getComboWithLevel(combo, level);

    set({ isAnimating: true, currentCombo: effectiveCombo, showComboEffect: true });

    const newAttackerHand = attacker.hand.filter((c) => c.id !== card1.id && c.id !== card2.id);
    const newAttackerDeck = [...attacker.deck];

    setTimeout(() => {
      const s = get();
      const currentDefender = playerNum === 1 ? s.player2 : s.player;
      const currentAttacker = playerNum === 1 ? s.player : s.player2;
      
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

      let newDefenderHp = currentDefender.hp;
      let newDefenderShield = currentDefender.shield;
      let actualDamageDealt = 0;

      if (damage > 0) {
        if (newDefenderShield >= damage) {
          newDefenderShield -= damage;
          actualDamageDealt = damage;
          damage = 0;
        } else {
          const beforeDamage = damage;
          damage -= newDefenderShield;
          newDefenderShield = 0;
          newDefenderHp -= damage;
          actualDamageDealt = beforeDamage;
        }
      }

      const defenderShakingKey = playerNum === 1 ? 'player2Shaking' : 'playerShaking';
      set({ [defenderShakingKey]: true } as Partial<GameState>);
      setTimeout(() => set({ [defenderShakingKey]: false } as Partial<GameState>), 500);

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
        const healAmount = Math.min(effectiveCombo.effectValue, actualDamageDealt);
        newAttackerHp = Math.min(currentAttacker.maxHp, newAttackerHp + healAmount);
      }
      if (effectiveCombo.effect === 'absorb' && effectiveCombo.effectValue) {
        const absorbAmount = Math.min(effectiveCombo.effectValue, actualDamageDealt);
        newAttackerShield += absorbAmount;
      }

      const finalDeck = [...newAttackerDeck];
      const finalHand = [...newAttackerHand];
      for (let i = 0; i < cardsToDraw && finalDeck.length > 0; i++) {
        finalHand.push(finalDeck.shift()!);
      }

      const isDefenderDead = newDefenderHp <= 0;

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
        set((s) => ({
          player: {
            ...s.player,
            hp: newAttackerHp,
            shield: newAttackerShield,
            hand: finalHand,
            deck: finalDeck,
            selectedCards: [],
            statusEffects: newAttackerStatusEffects,
            comboCooldowns: newCooldowns,
          },
          player2: s.player2 ? {
            ...s.player2,
            hp: Math.max(0, newDefenderHp),
            shield: newDefenderShield,
            statusEffects: newDefenderStatusEffects,
          } : s.player2,
          isAnimating: false,
          showComboEffect: false,
          comboHistory: [...s.comboHistory, combo],
        }));
      } else {
        set((s) => ({
          player2: s.player2 ? {
            ...s.player2,
            hp: newAttackerHp,
            shield: newAttackerShield,
            hand: finalHand,
            deck: finalDeck,
            selectedCards: [],
            statusEffects: newAttackerStatusEffects,
            comboCooldowns: newCooldowns,
          } : s.player2,
          player: {
            ...s.player,
            hp: Math.max(0, newDefenderHp),
            shield: newDefenderShield,
            statusEffects: newDefenderStatusEffects,
          },
          isAnimating: false,
          showComboEffect: false,
          comboHistory: [...s.comboHistory, combo],
        }));
      }

      if (isDefenderDead) {
        set({ duoWinner: playerNum, phase: 'victory' });
      } else {
        setTimeout(() => {
          get().duoNextTurn();
        }, 800);
      }
    }, 1500);
  },

  duoNextTurn: () => {
    const state = get();
    const { currentDuoPlayer, player, player2 } = state;
    
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
      set((s) => ({
        currentDuoPlayer: 1,
        turn: s.turn + 1,
        player: {
          ...s.player,
          mana: s.player.maxMana,
          shield: 0,
          comboCooldowns: newCooldowns,
        },
      }));
    } else {
      set((s) => ({
        currentDuoPlayer: 2,
        turn: s.turn + 1,
        player2: s.player2 ? {
          ...s.player2,
          mana: s.player2.maxMana,
          shield: 0,
          comboCooldowns: newCooldowns,
        } : s.player2,
      }));
    }

    setTimeout(() => {
      const st = get();
      const target = nextPlayer === 1 ? st.player : st.player2;
      if (!target) return;
      
      const newHand = [...target.hand];
      const newDeck = [...target.deck];
      for (let i = 0; i < 2; i++) {
        if (newDeck.length > 0 && newHand.length < 10) {
          newHand.push(newDeck.shift()!);
        } else if (newDeck.length === 0 && newHand.length < 10) {
          const freshDeck = createDeck();
          newHand.push(freshDeck.shift()!);
          newDeck.push(...freshDeck);
        }
      }

      if (nextPlayer === 1) {
        set((s) => ({
          player: { ...s.player, hand: newHand, deck: newDeck },
        }));
      } else {
        set((s) => ({
          player2: s.player2 ? { ...s.player2, hand: newHand, deck: newDeck } : s.player2,
        }));
      }
    }, 300);
  },

  duoIsComboOnCooldown: (playerNum: 1 | 2, comboId: string) => {
    return get().duoGetComboCooldown(playerNum, comboId) > 0;
  },

  duoGetComboCooldown: (playerNum: 1 | 2, comboId: string) => {
    const { player, player2 } = get();
    const target = playerNum === 1 ? player : player2;
    if (!target) return 0;
    
    const cooldown = target.comboCooldowns.find((c) => c.comboId === comboId);
    return cooldown ? cooldown.remaining : 0;
  },

  duoGetCurrentComboLevel: (playerNum: 1 | 2, comboId: string) => {
    const { player, player2 } = get();
    const target = playerNum === 1 ? player : player2;
    if (!target) return 1;
    
    return getComboLevel(comboId, target.comboLevels);
  },
}));
