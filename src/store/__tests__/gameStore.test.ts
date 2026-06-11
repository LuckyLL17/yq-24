import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../gameStore';
import { usePlayerStore } from '../playerStore';
import { useEnemyStore } from '../enemyStore';
import { useBattleStore } from '../battleStore';
import { useUIStore } from '../uiStore';
import * as gameSave from '@/lib/gameSave';
import * as gameData from '@/data/gameData';

const {
  mockPlayerFields,
  mockPlayerState,
  mockEnemyState,
  mockBattleState,
  mockUIState,
} = vi.hoisted(() => {
  const mockPlayerFields = {
    hp: 50,
    maxHp: 50,
    shield: 0,
    mana: 5,
    maxMana: 5,
    selectedCards: [],
    hand: [],
    deck: [],
    comboLevels: [],
    comboCooldowns: [],
    statusEffects: [],
  };

  const mockPlayerState = {
    player: { ...mockPlayerFields },
    setPlayer: vi.fn(),
    initPlayer: vi.fn(() => ({ ...mockPlayerFields, id: 'p1' })),
    selectCard: vi.fn(),
    deselectCard: vi.fn(),
    drawCards: vi.fn(),
    takeDamage: vi.fn(),
    heal: vi.fn(),
    addShield: vi.fn(),
    getComboCooldown: vi.fn(() => 0),
    isComboOnCooldown: vi.fn(() => false),
    getCurrentComboLevel: vi.fn(() => 1),
    setComboLevel: vi.fn(),
    applyPlayerStatusEffects: vi.fn(),
    duoSelectCard: vi.fn(),
    duoDeselectCard: vi.fn(),
    duoIsComboOnCooldown: vi.fn(() => false),
    duoGetComboCooldown: vi.fn(() => 0),
    duoGetCurrentComboLevel: vi.fn(() => 1),
    setPlayer2: vi.fn(),
    setCurrentDuoPlayer: vi.fn(),
    setComboCooldowns: vi.fn(),
    player2: null,
    currentDuoPlayer: 1,
  };

  const mockEnemyState = {
    enemy: null,
    setEnemy: vi.fn(),
    updateEnemyHp: vi.fn(),
    applyEnemyStatusEffects: vi.fn(() => ({ totalDamage: 0, enemyDied: false })),
    checkBossPhaseTransition: vi.fn(),
    transitionBossPhase: vi.fn(),
    useEnemyAbility: vi.fn(),
    updateEnemyIntent: vi.fn(),
    decrementAbilityCooldowns: vi.fn(),
  };

  const mockBattleState = {
    elementEssence: 0,
    streak: 0,
    phase: 'menu',
    mode: 'classic',
    difficulty: 'normal',
    turn: 1,
    wave: 1,
    level: 1,
    maxLevel: 5,
    score: 0,
    comboHistory: [],
    isMyCardOnCooldown: vi.fn(() => false),
    myCardUsedIds: [],
    startBattle: vi.fn(),
    goToMenu: vi.fn(),
    playSelectedCards: vi.fn(),
    enemyTurn: vi.fn(),
    nextTurn: vi.fn(),
    nextWave: vi.fn(),
    nextLevel: vi.fn(),
    addScore: vi.fn(),
    incrementStreak: vi.fn(),
    resetStreak: vi.fn(),
    addEssence: vi.fn(),
    getBattleCardReward: vi.fn(() => null),
    startDuo: vi.fn(),
    duoPlaySelectedCards: vi.fn(),
    duoNextTurn: vi.fn(),
    setDuoLayout: vi.fn(),
    getStreakDamageBonus: vi.fn(() => 0),
    calculateDamageTier: vi.fn(),
    calculateBattleRating: vi.fn(),
    duoWinner: null,
  };

  const mockUIState = {
    isAnimating: false,
    currentCombo: null,
    showComboEffect: false,
    showUpgradePanel: false,
    showLevelComplete: false,
    floatingTexts: [],
    toggleShop: vi.fn(),
    toggleMyCards: vi.fn(),
    toggleCollection: vi.fn(),
    toggleDailyQuests: vi.fn(),
    setAnimating: vi.fn(),
    showCombo: vi.fn(),
    hideCombo: vi.fn(),
    addFloatingText: vi.fn(),
    removeFloatingText: vi.fn(),
    setShaking: vi.fn(),
    toggleUpgradePanel: vi.fn(),
    showLevelCompleteScreen: vi.fn(),
    hideLevelCompleteScreen: vi.fn(),
    addDamageFloatingText: vi.fn(),
    addComboFloatingText: vi.fn(),
    showBattleRatingEffect: vi.fn(),
    hideBattleRating: vi.fn(),
  };

  return { mockPlayerFields, mockPlayerState, mockEnemyState, mockBattleState, mockUIState };
});

const mockPlayer = { ...mockPlayerFields, id: 'p1' };

const mockCollectedCard = (overrides: Record<string, unknown> = {}) => ({
  id: 'fire_火焰弹',
  element: 'fire' as const,
  name: '火焰弹',
  description: '发射一颗火球',
  power: 4,
  rarity: 'common' as const,
  manaCost: 1,
  count: 2,
  obtainedAt: Date.now(),
  ...overrides,
});

const mockDailyQuest = (overrides: Record<string, unknown> = {}) => ({
  id: 'quest_1',
  type: 'win_battle' as const,
  title: 'Win a battle',
  description: 'Win 1 battle',
  target: 1,
  progress: 0,
  reward: 30,
  rarity: 'common' as const,
  completed: false,
  claimed: false,
  ...overrides,
});

const mockCombo: import('@/types/game').ComboSkill = {
  id: 'combo_fire_water',
  elements: ['fire', 'water'] as [import('@/types/game').ElementType, import('@/types/game').ElementType],
  name: 'Steam Burst',
  description: 'Steam attack',
  damage: 10,
  rarity: 'rare',
  effectType: 'steamburst',
  category: 'attack',
};

vi.mock('@/lib/gameSave', () => ({
  savePermanentData: vi.fn(),
  saveBattleData: vi.fn(),
  loadPermanentData: vi.fn(() => null),
  loadBattleData: vi.fn(() => null),
  clearBattleSave: vi.fn(),
  hasBattleSave: vi.fn(() => false),
  hasPermanentSave: vi.fn(() => false),
  getAccounts: vi.fn(() => []),
  createAccount: vi.fn((name: string, avatar?: string) => ({
    id: 'acc1',
    name,
    avatar: avatar ?? '🗡️',
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  })),
  deleteAccount: vi.fn(),
  getCurrentAccount: vi.fn(() => null),
  setCurrentAccountId: vi.fn(),
  updateAccount: vi.fn(),
  getSaveSlots: vi.fn(() => []),
  saveToSlot: vi.fn((_accountId: string, slotId: 1 | 2 | 3, data: unknown) => ({
    slotId,
    accountId: _accountId,
    slotName: 'Slot ' + slotId,
    ...data,
  })),
  deleteSaveSlot: vi.fn(),
  renameSaveSlot: vi.fn(),
  migrateLegacySavesToAccount: vi.fn(),
  getSaveSlot: vi.fn(() => null),
}));

vi.mock('../playerStore', () => ({
  usePlayerStore: {
    getState: vi.fn(() => mockPlayerState),
  },
  initialPlayerState: vi.fn(() => mockPlayerFields),
}));

vi.mock('../enemyStore', () => ({
  useEnemyStore: {
    getState: vi.fn(() => mockEnemyState),
  },
}));

vi.mock('../battleStore', () => ({
  useBattleStore: {
    getState: vi.fn(() => mockBattleState),
    setState: vi.fn(),
  },
}));

vi.mock('../uiStore', () => ({
  useUIStore: {
    getState: vi.fn(() => mockUIState),
    setState: vi.fn(),
  },
}));

vi.mock('@/data/gameData', () => {
  const mockQuest = (i: number) => ({
    id: `quest_${i}`,
    type: ['win_battle', 'total_damage', 'reach_wave'][i % 3] as const,
    title: `Quest ${i}`,
    description: `Do quest ${i}`,
    target: 1,
    progress: 0,
    reward: 30,
    rarity: 'common' as const,
    completed: false,
    claimed: false,
  });

  return {
    COMBOS: [],
    DIFFICULTY_CONFIG: {},
    CLASSIC_LEVELS: [],
    QUICK_LEVELS: [],
    REFRESH_COST: 50,
    CARD_PACKS: [
      { id: 'basic_pack', name: 'Basic Pack', description: 'Basic', price: 50, rarity: 'common', cardCount: 3, icon: '📦', gradient: 'from-gray-500 to-gray-700' },
      { id: 'rare_pack', name: 'Rare Pack', description: 'Rare', price: 120, rarity: 'rare', cardCount: 5, guaranteedRarity: 'rare', icon: '🎁', gradient: 'from-blue-500 to-blue-700' },
    ],
    CARD_BORDERS: [
      { id: 'bronze_border', name: 'Bronze', description: 'Bronze border', price: 80, rarity: 'common', borderStyle: 'border-4 border-amber-700', glowColor: 'rgba(146,64,14,0.5)', icon: '🟤' },
      { id: 'silver_border', name: 'Silver', description: 'Silver border', price: 200, rarity: 'rare', borderStyle: 'border-4 border-slate-300', glowColor: 'rgba(203,213,225,0.5)', icon: '⚪' },
    ],
    SHOP_AVATARS: [
      { id: 'avatar_flame_imp', name: 'Flame Imp', description: 'Flame imp', price: 100, rarity: 'common', avatarType: 'flame_imp', icon: '🔥' },
      { id: 'avatar_fire_elemental', name: 'Fire Elemental', description: 'Fire elem', price: 250, rarity: 'rare', avatarType: 'fire_elemental', icon: '🔥' },
    ],
    CARD_VARIANTS: {
      fire: [
        { name: '火焰弹', description: 'Fireball', power: 4, rarity: 'common', manaCost: 1 },
        { name: '烈焰冲击', description: 'Flame', power: 6, rarity: 'rare', manaCost: 2 },
        { name: '炎爆术', description: 'Explosion', power: 8, rarity: 'epic', manaCost: 3 },
        { name: '凤凰涅槃', description: 'Phoenix', power: 15, rarity: 'legendary', manaCost: 6, skillType: 'damage_heal', skillValue: 20 },
      ],
      water: [
        { name: '水流弹', description: 'Water', power: 3, rarity: 'common', manaCost: 1 },
      ],
      earth: [
        { name: '岩石弹', description: 'Rock', power: 4, rarity: 'common', manaCost: 1 },
      ],
      wind: [
        { name: '风刃', description: 'Wind', power: 3, rarity: 'common', manaCost: 1 },
      ],
      lightning: [
        { name: '闪电箭', description: 'Lightning', power: 5, rarity: 'common', manaCost: 2 },
      ],
      light: [
        { name: '圣光弹', description: 'Holy', power: 3, rarity: 'common', manaCost: 1 },
      ],
      dark: [
        { name: '暗影弹', description: 'Dark', power: 3, rarity: 'common', manaCost: 1 },
      ],
    } as Record<string, Array<{ name: string; description: string; power: number; rarity: string; manaCost: number; skillType?: string; skillValue?: number }>>,
    DISASSEMBLE_ESSENCE: { common: 5, rare: 20, epic: 100, legendary: 500 },
    SYNTHESIZE_ESSENCE: { common: 20, rare: 80, epic: 400, legendary: 2000 },
    RARITY_NAMES: { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' },
    generateDailyQuests: vi.fn((count: number = 3) => {
      const quests = [];
      const types = ['win_battle', 'total_damage', 'reach_wave', 'use_combo', 'use_combo_category'];
      for (let i = 0; i < count; i++) {
        quests.push({
          id: `quest_gen_${i}`,
          type: types[i % types.length],
          title: `Generated Quest ${i}`,
          description: `Do quest ${i}`,
          target: i + 1,
          progress: 0,
          reward: 20 + i * 10,
          rarity: (['common', 'rare', 'epic'] as const)[i % 3],
          completed: false,
          claimed: false,
        });
      }
      return quests;
    }),
    getTodayString: vi.fn(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }),
    createCardByRarityWeight: vi.fn(() => ({
      id: 'card_reward_1',
      element: 'fire',
      name: '火焰弹',
      description: 'Fireball',
      power: 4,
      rarity: 'common',
      manaCost: 1,
    })),
    getComboLevel: vi.fn(() => 1),
    getComboWithLevel: vi.fn((combo: unknown) => combo),
    createPlayer: vi.fn(() => ({
      name: '元素法师',
      maxHp: 100,
      hp: 100,
      shield: 0,
      statusEffects: [],
      image: '🧙‍♂️',
      mana: 3,
      maxMana: 3,
      comboCooldowns: [],
      comboLevels: [],
    })),
    createDeck: vi.fn(() => []),
    createCard: vi.fn(() => ({
      id: 'card_mock',
      element: 'fire',
      name: '火焰弹',
      description: 'Fireball',
      power: 4,
      rarity: 'common',
      manaCost: 1,
    })),
    generateCardId: vi.fn(() => 'gen_id_mock'),
  };
});

function resetStore() {
  const { setState } = useGameStore;
  setState({
    phase: 'menu',
    mode: 'classic',
    difficulty: 'normal',
    turn: 1,
    player: { ...mockPlayerFields },
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
    dailyQuests: {
      quests: [],
      lastRefreshDate: '',
      freeRefreshUsed: false,
      sessionDamage: 0,
      sessionCombos: [],
      sessionWins: 0,
      sessionMaxWave: 0,
      sessionComboCategories: [],
    },
    showDailyQuests: false,
    showShop: false,
    showMyCards: false,
    showCollection: false,
    cosmetics: {
      ownedCardBorders: [],
      ownedAvatars: [],
      equippedCardBorder: null,
      equippedAvatar: null,
      openedCardPacks: [],
      collection: [],
      equippedMyCards: [],
      cardTags: [
        { id: 'tag_default_1', name: '常用', color: '#10b981' },
        { id: 'tag_default_2', name: '组合技', color: '#8b5cf6' },
        { id: 'tag_default_3', name: '待研究', color: '#f59e0b' },
      ],
      cardNotes: [],
    },
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
    currentAccount: null,
    accounts: [],
    showAccountManager: true,
    showSaveManager: false,
    isPaused: false,
  });
}

describe('gameStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  describe('Cosmetics - Collection', () => {
    it('getCollection returns empty array by default', () => {
      expect(useGameStore.getState().getCollection()).toEqual([]);
    });

    it('getCollection returns collection from cosmetics', () => {
      const card = mockCollectedCard();
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card] } });
      expect(useGameStore.getState().getCollection()).toEqual([card]);
    });

    it('getCollectionStats computes total, unique, byRarity', () => {
      const cards = [
        mockCollectedCard({ id: 'c1', rarity: 'common', count: 3 }),
        mockCollectedCard({ id: 'c2', element: 'water', name: '水流弹', rarity: 'rare', count: 1 }),
      ];
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: cards } });
      const stats = useGameStore.getState().getCollectionStats();
      expect(stats.total).toBe(4);
      expect(stats.unique).toBe(2);
      expect(stats.byRarity.common).toBe(3);
      expect(stats.byRarity.rare).toBe(1);
      expect(stats.byRarity.epic).toBe(0);
      expect(stats.byRarity.legendary).toBe(0);
    });

    it('getCollectionStats returns zeros for empty collection', () => {
      const stats = useGameStore.getState().getCollectionStats();
      expect(stats.total).toBe(0);
      expect(stats.unique).toBe(0);
    });
  });

  describe('Cosmetics - Card Borders', () => {
    it('isCardBorderOwned returns false when not owned', () => {
      expect(useGameStore.getState().isCardBorderOwned('bronze_border')).toBe(false);
    });

    it('isCardBorderOwned returns true when owned', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedCardBorders: ['bronze_border'] } });
      expect(useGameStore.getState().isCardBorderOwned('bronze_border')).toBe(true);
    });

    it('equipCardBorder does nothing if border not owned', () => {
      useGameStore.getState().equipCardBorder('bronze_border');
      expect(useGameStore.getState().cosmetics.equippedCardBorder).toBeNull();
    });

    it('equipCardBorder sets equipped border when owned', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedCardBorders: ['bronze_border'] } });
      useGameStore.getState().equipCardBorder('bronze_border');
      expect(useGameStore.getState().cosmetics.equippedCardBorder).toBe('bronze_border');
    });

    it('equipCardBorder can unequip with null', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedCardBorders: ['bronze_border'], equippedCardBorder: 'bronze_border' } });
      useGameStore.getState().equipCardBorder(null);
      expect(useGameStore.getState().cosmetics.equippedCardBorder).toBeNull();
    });

    it('getEquippedCardBorder returns null by default', () => {
      expect(useGameStore.getState().getEquippedCardBorder()).toBeNull();
    });

    it('getEquippedCardBorder returns equipped border id', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, equippedCardBorder: 'bronze_border' } });
      expect(useGameStore.getState().getEquippedCardBorder()).toBe('bronze_border');
    });

    it('getEquippedCardBorderData returns null when no border equipped', () => {
      expect(useGameStore.getState().getEquippedCardBorderData()).toBeNull();
    });

    it('getEquippedCardBorderData returns border data when equipped', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, equippedCardBorder: 'bronze_border' } });
      const data = useGameStore.getState().getEquippedCardBorderData();
      expect(data).not.toBeNull();
      expect(data!.id).toBe('bronze_border');
    });

    it('getEquippedCardBorderData returns null for unknown border id', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, equippedCardBorder: 'nonexistent' } });
      expect(useGameStore.getState().getEquippedCardBorderData()).toBeNull();
    });

    it('buyCardBorder fails if border not found', () => {
      expect(useGameStore.getState().buyCardBorder('nonexistent')).toBe(false);
    });

    it('buyCardBorder fails if not enough essence', () => {
      mockBattleState.elementEssence = 10;
      expect(useGameStore.getState().buyCardBorder('bronze_border')).toBe(false);
    });

    it('buyCardBorder fails if already owned', () => {
      mockBattleState.elementEssence = 500;
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedCardBorders: ['bronze_border'] } });
      expect(useGameStore.getState().buyCardBorder('bronze_border')).toBe(false);
    });

    it('buyCardBorder succeeds, deducts essence, adds to owned', () => {
      mockBattleState.elementEssence = 500;
      const result = useGameStore.getState().buyCardBorder('bronze_border');
      expect(result).toBe(true);
      expect(useGameStore.getState().cosmetics.ownedCardBorders).toContain('bronze_border');
      expect(useBattleStore.setState).toHaveBeenCalled();
    });
  });

  describe('Cosmetics - Avatars', () => {
    it('isAvatarOwned returns false when not owned', () => {
      expect(useGameStore.getState().isAvatarOwned('avatar_flame_imp')).toBe(false);
    });

    it('isAvatarOwned returns true when owned', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedAvatars: ['avatar_flame_imp'] } });
      expect(useGameStore.getState().isAvatarOwned('avatar_flame_imp')).toBe(true);
    });

    it('equipAvatar does nothing if avatar not owned', () => {
      useGameStore.getState().equipAvatar('avatar_flame_imp');
      expect(useGameStore.getState().cosmetics.equippedAvatar).toBeNull();
    });

    it('equipAvatar sets equipped avatar when owned', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedAvatars: ['avatar_flame_imp'] } });
      useGameStore.getState().equipAvatar('avatar_flame_imp');
      expect(useGameStore.getState().cosmetics.equippedAvatar).toBe('avatar_flame_imp');
    });

    it('equipAvatar can unequip with null', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedAvatars: ['avatar_flame_imp'], equippedAvatar: 'avatar_flame_imp' } });
      useGameStore.getState().equipAvatar(null);
      expect(useGameStore.getState().cosmetics.equippedAvatar).toBeNull();
    });

    it('getEquippedAvatar returns null by default', () => {
      expect(useGameStore.getState().getEquippedAvatar()).toBeNull();
    });

    it('getEquippedAvatarData returns null when no avatar equipped', () => {
      expect(useGameStore.getState().getEquippedAvatarData()).toBeNull();
    });

    it('getEquippedAvatarData returns avatar data when equipped', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, equippedAvatar: 'avatar_flame_imp' } });
      const data = useGameStore.getState().getEquippedAvatarData();
      expect(data).not.toBeNull();
      expect(data!.id).toBe('avatar_flame_imp');
    });

    it('buyAvatar fails if avatar not found', () => {
      expect(useGameStore.getState().buyAvatar('nonexistent')).toBe(false);
    });

    it('buyAvatar fails if not enough essence', () => {
      mockBattleState.elementEssence = 10;
      expect(useGameStore.getState().buyAvatar('avatar_flame_imp')).toBe(false);
    });

    it('buyAvatar fails if already owned', () => {
      mockBattleState.elementEssence = 500;
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, ownedAvatars: ['avatar_flame_imp'] } });
      expect(useGameStore.getState().buyAvatar('avatar_flame_imp')).toBe(false);
    });

    it('buyAvatar succeeds, deducts essence, adds to owned', () => {
      mockBattleState.elementEssence = 500;
      const result = useGameStore.getState().buyAvatar('avatar_flame_imp');
      expect(result).toBe(true);
      expect(useGameStore.getState().cosmetics.ownedAvatars).toContain('avatar_flame_imp');
      expect(useBattleStore.setState).toHaveBeenCalled();
    });
  });

  describe('Cosmetics - Card Packs', () => {
    it('buyCardPack returns null if pack not found', () => {
      expect(useGameStore.getState().buyCardPack('nonexistent')).toBeNull();
    });

    it('buyCardPack returns null if not enough essence', () => {
      mockBattleState.elementEssence = 10;
      expect(useGameStore.getState().buyCardPack('basic_pack')).toBeNull();
    });

    it('buyCardPack succeeds with enough essence', () => {
      mockBattleState.elementEssence = 500;
      const result = useGameStore.getState().buyCardPack('basic_pack');
      expect(result).not.toBeNull();
      expect(result!.length).toBe(3);
      expect(useGameStore.getState().cosmetics.openedCardPacks).toContain('basic_pack');
      expect(useBattleStore.setState).toHaveBeenCalled();
    });

    it('buyCardPack adds cards to collection (new and existing)', () => {
      mockBattleState.elementEssence = 500;
      const existingCard = mockCollectedCard({ id: 'fire_火焰弹', element: 'fire', name: '火焰弹', count: 1 });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [existingCard] } });
      useGameStore.getState().buyCardPack('basic_pack');
      const collection = useGameStore.getState().cosmetics.collection;
      const fireCard = collection.find(c => c.name === '火焰弹');
      if (fireCard) {
        expect(fireCard.count).toBeGreaterThanOrEqual(1);
      }
      expect(collection.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Cosmetics - My Cards', () => {
    it('equipMyCard returns false if card not in collection', () => {
      expect(useGameStore.getState().equipMyCard('nonexistent')).toBe(false);
    });

    it('equipMyCard returns false if already equipped', () => {
      const card = mockCollectedCard({ id: 'mc1' });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card], equippedMyCards: ['mc1'] } });
      expect(useGameStore.getState().equipMyCard('mc1')).toBe(false);
    });

    it('equipMyCard returns false if 3 cards already equipped', () => {
      const cards = [
        mockCollectedCard({ id: 'mc1' }),
        mockCollectedCard({ id: 'mc2', element: 'water', name: '水流弹' }),
        mockCollectedCard({ id: 'mc3', element: 'earth', name: '岩石弹' }),
        mockCollectedCard({ id: 'mc4', element: 'wind', name: '风刃' }),
      ];
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: cards, equippedMyCards: ['mc1', 'mc2', 'mc3'] } });
      expect(useGameStore.getState().equipMyCard('mc4')).toBe(false);
    });

    it('equipMyCard succeeds and adds to equippedMyCards', () => {
      const card = mockCollectedCard({ id: 'mc1' });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card] } });
      expect(useGameStore.getState().equipMyCard('mc1')).toBe(true);
      expect(useGameStore.getState().cosmetics.equippedMyCards).toContain('mc1');
    });

    it('unequipMyCard removes card from equippedMyCards', () => {
      const card = mockCollectedCard({ id: 'mc1' });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card], equippedMyCards: ['mc1'] } });
      useGameStore.getState().unequipMyCard('mc1');
      expect(useGameStore.getState().cosmetics.equippedMyCards).not.toContain('mc1');
    });

    it('getEquippedMyCards returns mapped collected cards', () => {
      const card = mockCollectedCard({ id: 'mc1' });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card], equippedMyCards: ['mc1'] } });
      const equipped = useGameStore.getState().getEquippedMyCards();
      expect(equipped.length).toBe(1);
      expect(equipped[0].id).toBe('mc1');
    });

    it('getEquippedMyCards filters out cards not in collection', () => {
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [], equippedMyCards: ['ghost'] } });
      expect(useGameStore.getState().getEquippedMyCards()).toEqual([]);
    });
  });

  describe('Cosmetics - addCardToCollection', () => {
    it('adds a new card to collection', () => {
      const card = { id: 'new1', element: 'fire' as const, name: '火焰弹', description: 'Fireball', power: 4, rarity: 'common' as const, manaCost: 1 };
      useGameStore.getState().addCardToCollection(card);
      const collection = useGameStore.getState().cosmetics.collection;
      expect(collection.length).toBe(1);
      expect(collection[0].name).toBe('火焰弹');
      expect(collection[0].count).toBe(1);
    });

    it('increments count for existing card (same element+name)', () => {
      const card = { id: 'new1', element: 'fire' as const, name: '火焰弹', description: 'Fireball', power: 4, rarity: 'common' as const, manaCost: 1 };
      useGameStore.getState().addCardToCollection(card);
      useGameStore.getState().addCardToCollection(card);
      const collection = useGameStore.getState().cosmetics.collection;
      expect(collection.length).toBe(1);
      expect(collection[0].count).toBe(2);
    });
  });

  describe('Cosmetics - Disassemble', () => {
    it('getDisassembleValue returns correct values', () => {
      expect(useGameStore.getState().getDisassembleValue('common')).toBe(5);
      expect(useGameStore.getState().getDisassembleValue('rare')).toBe(20);
      expect(useGameStore.getState().getDisassembleValue('epic')).toBe(100);
      expect(useGameStore.getState().getDisassembleValue('legendary')).toBe(500);
    });

    it('disassembleCard returns null if card not in collection', () => {
      expect(useGameStore.getState().disassembleCard('nonexistent')).toBeNull();
    });

    it('disassembleCard returns null if count is 1 (cannot disassemble last copy)', () => {
      const card = mockCollectedCard({ id: 'dc1', count: 1 });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card] } });
      expect(useGameStore.getState().disassembleCard('dc1')).toBeNull();
    });

    it('disassembleCard reduces count and returns essence gain', () => {
      mockBattleState.elementEssence = 0;
      const card = mockCollectedCard({ id: 'dc1', count: 3, rarity: 'common' });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card] } });
      const gain = useGameStore.getState().disassembleCard('dc1', 2);
      expect(gain).toBe(10);
      const updated = useGameStore.getState().cosmetics.collection.find(c => c.id === 'dc1');
      expect(updated!.count).toBe(1);
    });

    it('disassembleCard clamps count to count-1', () => {
      mockBattleState.elementEssence = 0;
      const card = mockCollectedCard({ id: 'dc1', count: 2, rarity: 'rare' });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card] } });
      const gain = useGameStore.getState().disassembleCard('dc1', 5);
      expect(gain).toBe(20);
      const updated = useGameStore.getState().cosmetics.collection.find(c => c.id === 'dc1');
      expect(updated!.count).toBe(1);
    });

    it('disassembleAllDuplicates disassembles all duplicates, keeps 1 each', () => {
      mockBattleState.elementEssence = 0;
      const cards = [
        mockCollectedCard({ id: 'dc1', count: 3, rarity: 'common' }),
        mockCollectedCard({ id: 'dc2', element: 'water', name: '水流弹', count: 1, rarity: 'rare' }),
        mockCollectedCard({ id: 'dc3', element: 'earth', name: '岩石弹', count: 5, rarity: 'epic' }),
      ];
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: cards } });
      const total = useGameStore.getState().disassembleAllDuplicates();
      expect(total).toBe(2 * 5 + 0 + 4 * 100);
      const collection = useGameStore.getState().cosmetics.collection;
      collection.forEach(c => expect(c.count).toBe(1));
    });
  });

  describe('Cosmetics - Synthesize', () => {
    it('getSynthesizeCost returns correct values', () => {
      expect(useGameStore.getState().getSynthesizeCost('common')).toBe(20);
      expect(useGameStore.getState().getSynthesizeCost('rare')).toBe(80);
      expect(useGameStore.getState().getSynthesizeCost('epic')).toBe(400);
      expect(useGameStore.getState().getSynthesizeCost('legendary')).toBe(2000);
    });

    it('synthesizeCard returns null if card template not found', () => {
      expect(useGameStore.getState().synthesizeCard('fire', 'NonexistentCard')).toBeNull();
    });

    it('synthesizeCard returns null if not enough essence', () => {
      mockBattleState.elementEssence = 5;
      expect(useGameStore.getState().synthesizeCard('fire', '火焰弹')).toBeNull();
    });

    it('synthesizeCard creates new card in collection when not existing', () => {
      mockBattleState.elementEssence = 500;
      const result = useGameStore.getState().synthesizeCard('fire', '火焰弹');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('火焰弹');
      expect(result!.count).toBe(1);
      expect(useGameStore.getState().cosmetics.collection.length).toBe(1);
      expect(useBattleStore.setState).toHaveBeenCalled();
    });

    it('synthesizeCard increments count if card already in collection', () => {
      mockBattleState.elementEssence = 500;
      const existing = mockCollectedCard({ id: 'fire_火焰弹', element: 'fire', name: '火焰弹', count: 1 });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [existing] } });
      const result = useGameStore.getState().synthesizeCard('fire', '火焰弹');
      expect(result).not.toBeNull();
      expect(result!.count).toBe(2);
    });
  });

  describe('Cosmetics - getAllCardTemplates', () => {
    it('returns templates from all elements', () => {
      const templates = useGameStore.getState().getAllCardTemplates();
      expect(templates.length).toBeGreaterThan(0);
      const elements = new Set(templates.map(t => t.element));
      expect(elements.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Cosmetics - Card Tags', () => {
    it('getCardTags returns default tags', () => {
      const tags = useGameStore.getState().getCardTags();
      expect(tags.length).toBe(3);
      expect(tags[0].name).toBe('常用');
    });

    it('addCardTag returns null for empty name', () => {
      expect(useGameStore.getState().addCardTag('  ', '#ff0000')).toBeNull();
    });

    it('addCardTag adds a new tag', () => {
      const tag = useGameStore.getState().addCardTag('Test Tag', '#ff0000');
      expect(tag).not.toBeNull();
      expect(tag!.name).toBe('Test Tag');
      expect(tag!.color).toBe('#ff0000');
      const tags = useGameStore.getState().getCardTags();
      expect(tags.some(t => t.name === 'Test Tag')).toBe(true);
    });

    it('updateCardTag returns false for empty name', () => {
      expect(useGameStore.getState().updateCardTag('tag_default_1', '', '#000')).toBe(false);
    });

    it('updateCardTag returns false for nonexistent tag', () => {
      expect(useGameStore.getState().updateCardTag('nonexistent', 'Name', '#000')).toBe(false);
    });

    it('updateCardTag updates existing tag', () => {
      const result = useGameStore.getState().updateCardTag('tag_default_1', 'Updated', '#00ff00');
      expect(result).toBe(true);
      const tag = useGameStore.getState().getCardTags().find(t => t.id === 'tag_default_1');
      expect(tag!.name).toBe('Updated');
      expect(tag!.color).toBe('#00ff00');
    });

    it('deleteCardTag returns false for nonexistent tag', () => {
      expect(useGameStore.getState().deleteCardTag('nonexistent')).toBe(false);
    });

    it('deleteCardTag removes tag and cleans up cardNotes references', () => {
      useGameStore.setState({
        cosmetics: {
          ...useGameStore.getState().cosmetics,
          cardNotes: [
            { id: 'note_1', cardId: 'c1', content: 'test', tags: ['tag_default_1', 'tag_default_2'], createdAt: Date.now(), updatedAt: Date.now() },
          ],
        },
      });
      const result = useGameStore.getState().deleteCardTag('tag_default_1');
      expect(result).toBe(true);
      const tags = useGameStore.getState().getCardTags();
      expect(tags.every(t => t.id !== 'tag_default_1')).toBe(true);
      const notes = useGameStore.getState().cosmetics.cardNotes;
      expect(notes[0].tags).not.toContain('tag_default_1');
      expect(notes[0].tags).toContain('tag_default_2');
    });
  });

  describe('Cosmetics - Card Notes', () => {
    it('getCardNote returns undefined for non-existent note', () => {
      expect(useGameStore.getState().getCardNote('c1')).toBeUndefined();
    });

    it('getCardNotes returns empty array by default', () => {
      expect(useGameStore.getState().getCardNotes()).toEqual([]);
    });

    it('saveCardNote returns null for empty content', () => {
      expect(useGameStore.getState().saveCardNote('c1', '  ', [])).toBeNull();
    });

    it('saveCardNote creates a new note', () => {
      const note = useGameStore.getState().saveCardNote('c1', 'My note', ['tag1']);
      expect(note).not.toBeNull();
      expect(note!.cardId).toBe('c1');
      expect(note!.content).toBe('My note');
      expect(note!.tags).toEqual(['tag1']);
      expect(useGameStore.getState().getCardNote('c1')).toBeDefined();
    });

    it('saveCardNote updates existing note', () => {
      useGameStore.getState().saveCardNote('c1', 'First', []);
      const updated = useGameStore.getState().saveCardNote('c1', 'Second', ['tagA']);
      expect(updated).not.toBeNull();
      expect(updated!.content).toBe('Second');
      expect(updated!.tags).toEqual(['tagA']);
      expect(useGameStore.getState().cosmetics.cardNotes.length).toBe(1);
    });

    it('deleteCardNote returns false if note does not exist', () => {
      expect(useGameStore.getState().deleteCardNote('c1')).toBe(false);
    });

    it('deleteCardNote removes note', () => {
      useGameStore.getState().saveCardNote('c1', 'Note', []);
      expect(useGameStore.getState().deleteCardNote('c1')).toBe(true);
      expect(useGameStore.getState().getCardNote('c1')).toBeUndefined();
    });

    it('getCardsByTag returns cards that have notes with the given tag', () => {
      const card = mockCollectedCard({ id: 'c1' });
      useGameStore.setState({ cosmetics: { ...useGameStore.getState().cosmetics, collection: [card] } });
      useGameStore.getState().saveCardNote('c1', 'Tagged note', ['tagA']);
      const result = useGameStore.getState().getCardsByTag('tagA');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('c1');
    });

    it('getCardsByTag returns empty for unused tag', () => {
      expect(useGameStore.getState().getCardsByTag('nonexistent')).toEqual([]);
    });
  });

  describe('Daily Quests - checkDailyRefresh', () => {
    it('does nothing if lastRefreshDate is today', () => {
      const { getTodayString } = gameData;
      const today = '2026-06-11';
      gameData.getTodayString.mockReturnValue(today);
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, lastRefreshDate: today } });
      useGameStore.getState().checkDailyRefresh();
      expect(gameData.generateDailyQuests).not.toHaveBeenCalled();
    });

    it('resets quests if lastRefreshDate is different', () => {
      const { getTodayString } = gameData;
      gameData.getTodayString.mockReturnValue('2026-06-11');
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, lastRefreshDate: '2026-06-10', freeRefreshUsed: true } });
      useGameStore.getState().checkDailyRefresh();
      expect(gameData.generateDailyQuests).toHaveBeenCalledWith(3);
      expect(useGameStore.getState().dailyQuests.freeRefreshUsed).toBe(false);
      expect(useGameStore.getState().dailyQuests.lastRefreshDate).toBe('2026-06-11');
    });
  });

  describe('Daily Quests - refreshDailyQuests', () => {
    it('uses free refresh first', () => {
      const state = useGameStore.getState().dailyQuests;
      useGameStore.setState({ dailyQuests: { ...state, freeRefreshUsed: false } });
      const result = useGameStore.getState().refreshDailyQuests();
      expect(result).toBe(true);
      expect(useGameStore.getState().dailyQuests.freeRefreshUsed).toBe(true);
      expect(gameData.generateDailyQuests).toHaveBeenCalled();
    });

    it('uses paid refresh if free used and enough essence', () => {
      mockBattleState.elementEssence = 100;
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, freeRefreshUsed: true } });
      const result = useGameStore.getState().refreshDailyQuests();
      expect(result).toBe(true);
      expect(useBattleStore.setState).toHaveBeenCalled();
    });

    it('fails if free used and not enough essence', () => {
      mockBattleState.elementEssence = 10;
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, freeRefreshUsed: true } });
      const result = useGameStore.getState().refreshDailyQuests();
      expect(result).toBe(false);
    });
  });

  describe('Daily Quests - claimQuestReward', () => {
    it('returns false if quest not found', () => {
      expect(useGameStore.getState().claimQuestReward('nonexistent')).toBe(false);
    });

    it('returns false if quest not completed', () => {
      const quest = mockDailyQuest({ completed: false });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      expect(useGameStore.getState().claimQuestReward('quest_1')).toBe(false);
    });

    it('returns false if quest already claimed', () => {
      const quest = mockDailyQuest({ completed: true, claimed: true });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      expect(useGameStore.getState().claimQuestReward('quest_1')).toBe(false);
    });

    it('claims reward, marks as claimed, adds essence', () => {
      mockBattleState.elementEssence = 0;
      const quest = mockDailyQuest({ completed: true, claimed: false, reward: 50 });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      const result = useGameStore.getState().claimQuestReward('quest_1');
      expect(result).toBe(true);
      expect(useGameStore.getState().dailyQuests.quests[0].claimed).toBe(true);
      expect(useBattleStore.setState).toHaveBeenCalled();
    });
  });

  describe('Daily Quests - updateQuestProgress', () => {
    it('updates progress for matching quest type', () => {
      const quest = mockDailyQuest({ type: 'win_battle', target: 3, progress: 0 });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('win_battle', 1);
      expect(useGameStore.getState().dailyQuests.quests[0].progress).toBe(1);
    });

    it('marks quest completed when progress reaches target', () => {
      const quest = mockDailyQuest({ type: 'win_battle', target: 1, progress: 0 });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('win_battle', 1);
      expect(useGameStore.getState().dailyQuests.quests[0].completed).toBe(true);
    });

    it('does not update already completed quests', () => {
      const quest = mockDailyQuest({ type: 'win_battle', target: 1, progress: 1, completed: true });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('win_battle', 1);
      expect(useGameStore.getState().dailyQuests.quests[0].progress).toBe(1);
    });

    it('does not update claimed quests', () => {
      const quest = mockDailyQuest({ type: 'win_battle', target: 1, progress: 1, completed: true, claimed: true });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('win_battle', 1);
      expect(useGameStore.getState().dailyQuests.quests[0].progress).toBe(1);
    });

    it('caps progress at target', () => {
      const quest = mockDailyQuest({ type: 'total_damage', target: 5, progress: 3 });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('total_damage', 10);
      expect(useGameStore.getState().dailyQuests.quests[0].progress).toBe(5);
      expect(useGameStore.getState().dailyQuests.quests[0].completed).toBe(true);
    });

    it('updates use_combo only if targetComboId matches', () => {
      const quest = mockDailyQuest({ type: 'use_combo', targetComboId: 'combo_fire_water', target: 1, progress: 0 });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('use_combo', 1, 'combo_fire_water');
      expect(useGameStore.getState().dailyQuests.quests[0].progress).toBe(1);
    });

    it('does not update use_combo if targetComboId does not match', () => {
      const quest = mockDailyQuest({ type: 'use_combo', targetComboId: 'combo_fire_water', target: 1, progress: 0 });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('use_combo', 1, 'different_combo');
      expect(useGameStore.getState().dailyQuests.quests[0].progress).toBe(0);
    });

    it('updates use_combo_category if targetCategory matches', () => {
      const quest = mockDailyQuest({ type: 'use_combo_category', targetCategory: 'attack', target: 1, progress: 0 });
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, quests: [quest] } });
      useGameStore.getState().updateQuestProgress('use_combo_category', 1, undefined, 'attack');
      expect(useGameStore.getState().dailyQuests.quests[0].progress).toBe(1);
    });
  });

  describe('Daily Quests - tracking methods', () => {
    it('trackComboUse calls updateQuestProgress with combo id and category', () => {
      const spy = vi.spyOn(useGameStore.getState(), 'updateQuestProgress');
      useGameStore.getState().trackComboUse(mockCombo);
      expect(spy).toHaveBeenCalledWith('use_combo', 1, 'combo_fire_water');
      expect(spy).toHaveBeenCalledWith('use_combo_category', 1, undefined, 'attack');
      spy.mockRestore();
    });

    it('trackDamage does nothing for zero or negative', () => {
      const spy = vi.spyOn(useGameStore.getState(), 'updateQuestProgress');
      useGameStore.getState().trackDamage(0);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('trackDamage updates sessionDamage and quest progress', () => {
      useGameStore.getState().trackDamage(50);
      expect(useGameStore.getState().dailyQuests.sessionDamage).toBe(50);
    });

    it('trackWin increments sessionWins', () => {
      useGameStore.getState().trackWin();
      expect(useGameStore.getState().dailyQuests.sessionWins).toBe(1);
    });

    it('trackWave updates sessionMaxWave only if higher', () => {
      useGameStore.setState({ dailyQuests: { ...useGameStore.getState().dailyQuests, sessionMaxWave: 5 } });
      useGameStore.getState().trackWave(3);
      expect(useGameStore.getState().dailyQuests.sessionMaxWave).toBe(5);
      useGameStore.getState().trackWave(10);
      expect(useGameStore.getState().dailyQuests.sessionMaxWave).toBe(10);
    });
  });

  describe('Tutorial', () => {
    it('startTutorial sets showTutorial true and step to welcome', () => {
      useGameStore.getState().startTutorial();
      expect(useGameStore.getState().tutorial.showTutorial).toBe(true);
      expect(useGameStore.getState().tutorial.currentStep).toBe('welcome');
    });

    it('nextTutorialStep advances to next step', () => {
      useGameStore.getState().startTutorial();
      useGameStore.getState().nextTutorialStep();
      expect(useGameStore.getState().tutorial.currentStep).toBe('cards');
    });

    it('nextTutorialStep does not go past complete', () => {
      useGameStore.setState({ tutorial: { ...useGameStore.getState().tutorial, currentStep: 'complete', showTutorial: true } });
      useGameStore.getState().nextTutorialStep();
      expect(useGameStore.getState().tutorial.currentStep).toBe('complete');
    });

    it('prevTutorialStep goes back one step', () => {
      useGameStore.setState({ tutorial: { ...useGameStore.getState().tutorial, currentStep: 'combo', showTutorial: true } });
      useGameStore.getState().prevTutorialStep();
      expect(useGameStore.getState().tutorial.currentStep).toBe('cards');
    });

    it('prevTutorialStep does not go before welcome', () => {
      useGameStore.setState({ tutorial: { ...useGameStore.getState().tutorial, currentStep: 'welcome', showTutorial: true } });
      useGameStore.getState().prevTutorialStep();
      expect(useGameStore.getState().tutorial.currentStep).toBe('welcome');
    });

    it('setTutorialStep sets arbitrary step', () => {
      useGameStore.getState().setTutorialStep('turn_based');
      expect(useGameStore.getState().tutorial.currentStep).toBe('turn_based');
    });

    it('skipTutorial marks completed and hides', () => {
      useGameStore.getState().startTutorial();
      useGameStore.getState().skipTutorial();
      expect(useGameStore.getState().tutorial.tutorialCompleted).toBe(true);
      expect(useGameStore.getState().tutorial.showTutorial).toBe(false);
      expect(gameSave.savePermanentData).toHaveBeenCalled();
    });

    it('completeTutorial marks completed and hides', () => {
      useGameStore.getState().startTutorial();
      useGameStore.getState().completeTutorial();
      expect(useGameStore.getState().tutorial.tutorialCompleted).toBe(true);
      expect(useGameStore.getState().tutorial.showTutorial).toBe(false);
    });

    it('isTutorialCompleted returns correct state', () => {
      expect(useGameStore.getState().isTutorialCompleted()).toBe(false);
      useGameStore.getState().completeTutorial();
      expect(useGameStore.getState().isTutorialCompleted()).toBe(true);
    });
  });

  describe('Account', () => {
    it('createNewAccount creates account and sets as current', () => {
      const account = useGameStore.getState().createNewAccount('TestUser', '🗡️');
      expect(account.name).toBe('TestUser');
      expect(useGameStore.getState().currentAccount).toEqual(account);
      expect(useGameStore.getState().showAccountManager).toBe(false);
      expect(gameSave.setCurrentAccountId).toHaveBeenCalledWith('acc1');
    });

    it('removeAccount deletes and updates accounts list', () => {
      const { getAccounts, getCurrentAccount } = gameSave;
      gameSave.getAccounts.mockReturnValue([]);
      gameSave.getCurrentAccount.mockReturnValue(null);
      useGameStore.setState({ accounts: [{ id: 'acc1', name: 'Test', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() }], currentAccount: { id: 'acc1', name: 'Test', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() } });
      useGameStore.getState().removeAccount('acc1');
      expect(gameSave.deleteAccount).toHaveBeenCalledWith('acc1');
      expect(useGameStore.getState().accounts).toEqual([]);
      expect(useGameStore.getState().currentAccount).toBeNull();
    });

    it('switchAccount sets current account and reloads state', () => {
      const { getAccounts, getCurrentAccount } = gameSave;
      const acc = { id: 'acc2', name: 'Switched', avatar: '⚔️', createdAt: Date.now(), lastPlayedAt: Date.now() };
      gameSave.getAccounts.mockReturnValue([acc]);
      gameSave.getCurrentAccount.mockReturnValue(acc);
      useGameStore.getState().switchAccount('acc2');
      expect(gameSave.setCurrentAccountId).toHaveBeenCalledWith('acc2');
      expect(gameSave.migrateLegacySavesToAccount).toHaveBeenCalledWith('acc2');
      expect(useGameStore.getState().showAccountManager).toBe(false);
    });

    it('modifyAccount does nothing if no currentAccount', () => {
      useGameStore.setState({ currentAccount: null });
      useGameStore.getState().modifyAccount({ name: 'New' });
      expect(gameSave.updateAccount).not.toHaveBeenCalled();
    });

    it('modifyAccount updates current account', () => {
      const acc = { id: 'acc1', name: 'Old', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() };
      const { getCurrentAccount, getAccounts } = gameSave;
      gameSave.getCurrentAccount.mockReturnValue({ ...acc, name: 'New' });
      gameSave.getAccounts.mockReturnValue([{ ...acc, name: 'New' }]);
      useGameStore.setState({ currentAccount: acc, accounts: [acc] });
      useGameStore.getState().modifyAccount({ name: 'New' });
      expect(gameSave.updateAccount).toHaveBeenCalledWith('acc1', { name: 'New' });
    });

    it('toggleAccountManager toggles state', () => {
      const initial = useGameStore.getState().showAccountManager;
      useGameStore.getState().toggleAccountManager();
      expect(useGameStore.getState().showAccountManager).toBe(!initial);
    });

    it('setShowAccountManager sets value directly', () => {
      useGameStore.getState().setShowAccountManager(false);
      expect(useGameStore.getState().showAccountManager).toBe(false);
      useGameStore.getState().setShowAccountManager(true);
      expect(useGameStore.getState().showAccountManager).toBe(true);
    });

    it('toggleSaveManager toggles state', () => {
      expect(useGameStore.getState().showSaveManager).toBe(false);
      useGameStore.getState().toggleSaveManager();
      expect(useGameStore.getState().showSaveManager).toBe(true);
    });

    it('setShowSaveManager sets value directly', () => {
      useGameStore.getState().setShowSaveManager(true);
      expect(useGameStore.getState().showSaveManager).toBe(true);
    });

    it('pauseGame and resumeGame toggle isPaused', () => {
      useGameStore.getState().pauseGame();
      expect(useGameStore.getState().isPaused).toBe(true);
      useGameStore.getState().resumeGame();
      expect(useGameStore.getState().isPaused).toBe(false);
    });

    it('initAccountSystem loads accounts', () => {
      const { getAccounts, getCurrentAccount } = gameSave;
      gameSave.getAccounts.mockReturnValue([]);
      gameSave.getCurrentAccount.mockReturnValue(null);
      useGameStore.getState().initAccountSystem();
      expect(useGameStore.getState().showAccountManager).toBe(true);
    });
  });

  describe('Account - Save Slots', () => {
    it('saveGameToSlot saves and returns slot', () => {
      const acc = { id: 'acc1', name: 'Test', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() };
      useGameStore.setState({ currentAccount: acc });
      const { getAccounts } = gameSave;
      gameSave.getAccounts.mockReturnValue([acc]);
      const slot = useGameStore.getState().saveGameToSlot(1, 'My Save');
      expect(slot).toBeDefined();
      expect(slot.slotId).toBe(1);
      expect(gameSave.saveToSlot).toHaveBeenCalled();
    });

    it('loadGameFromSlot returns false if no slot found', () => {
      const acc = { id: 'acc1', name: 'Test', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() };
      useGameStore.setState({ currentAccount: acc });
      expect(useGameStore.getState().loadGameFromSlot(1)).toBe(false);
    });

    it('removeSaveSlot deletes the slot', () => {
      const acc = { id: 'acc1', name: 'Test', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() };
      useGameStore.setState({ currentAccount: acc });
      const { getAccounts } = gameSave;
      gameSave.getAccounts.mockReturnValue([acc]);
      useGameStore.getState().removeSaveSlot(2);
      expect(gameSave.deleteSaveSlot).toHaveBeenCalledWith('acc1', 2);
    });

    it('getAccountSaveSlots returns slots for current account', () => {
      const acc = { id: 'acc1', name: 'Test', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() };
      useGameStore.setState({ currentAccount: acc });
      useGameStore.getState().getAccountSaveSlots();
      expect(gameSave.getSaveSlots).toHaveBeenCalledWith('acc1');
    });

    it('getAccountSaveSlot returns slot for current account', () => {
      const acc = { id: 'acc1', name: 'Test', avatar: '🗡️', createdAt: Date.now(), lastPlayedAt: Date.now() };
      useGameStore.setState({ currentAccount: acc });
      useGameStore.getState().getAccountSaveSlot(1);
      expect(gameSave.getSaveSlot).toHaveBeenCalledWith('acc1', 1);
    });
  });

  describe('Game Flow Delegation', () => {
    it('selectCard delegates to playerStore if not animating and enemy alive', () => {
      mockUIState.isAnimating = false;
      mockEnemyState.enemy = { hp: 10 };
      const card = { id: 'c1', element: 'fire', name: 'Fire', description: '', power: 4, rarity: 'common', manaCost: 1 };
      useGameStore.getState().selectCard(card);
      expect(usePlayerStore.getState().selectCard).toHaveBeenCalledWith(card);
    });

    it('selectCard does nothing if animating', () => {
      mockUIState.isAnimating = true;
      const card = { id: 'c1', element: 'fire', name: 'Fire', description: '', power: 4, rarity: 'common', manaCost: 1 };
      useGameStore.getState().selectCard(card);
      expect(usePlayerStore.getState().selectCard).not.toHaveBeenCalled();
    });

    it('selectCard does nothing if no enemy', () => {
      mockUIState.isAnimating = false;
      mockEnemyState.enemy = null;
      const card = { id: 'c1', element: 'fire', name: 'Fire', description: '', power: 4, rarity: 'common', manaCost: 1 };
      useGameStore.getState().selectCard(card);
      expect(usePlayerStore.getState().selectCard).not.toHaveBeenCalled();
    });

    it('deselectCard delegates to playerStore', () => {
      mockUIState.isAnimating = false;
      mockEnemyState.enemy = { hp: 10 };
      useGameStore.getState().deselectCard('c1');
      expect(usePlayerStore.getState().deselectCard).toHaveBeenCalledWith('c1');
    });

    it('deselectCard does nothing if animating', () => {
      mockUIState.isAnimating = true;
      useGameStore.getState().deselectCard('c1');
      expect(usePlayerStore.getState().deselectCard).not.toHaveBeenCalled();
    });

    it('playSelectedCards delegates to battleStore', () => {
      useGameStore.getState().playSelectedCards();
      expect(useBattleStore.getState().playSelectedCards).toHaveBeenCalled();
    });

    it('enemyTurn delegates to battleStore', () => {
      useGameStore.getState().enemyTurn();
      expect(useBattleStore.getState().enemyTurn).toHaveBeenCalled();
    });

    it('nextTurn delegates to battleStore', () => {
      useGameStore.getState().nextTurn();
      expect(useBattleStore.getState().nextTurn).toHaveBeenCalled();
    });

    it('drawCards delegates to playerStore', () => {
      useGameStore.getState().drawCards(3);
      expect(usePlayerStore.getState().drawCards).toHaveBeenCalledWith(3);
    });

    it('takeDamage on player delegates to playerStore', () => {
      useGameStore.getState().takeDamage('player', 10);
      expect(usePlayerStore.getState().takeDamage).toHaveBeenCalledWith(10);
    });

    it('takeDamage on enemy calls updateEnemyHp', () => {
      mockEnemyState.enemy = { hp: 20 };
      useGameStore.getState().takeDamage('enemy', 10);
      expect(useEnemyStore.getState().updateEnemyHp).toHaveBeenCalledWith(10);
    });

    it('heal delegates to playerStore', () => {
      useGameStore.getState().heal(15);
      expect(usePlayerStore.getState().heal).toHaveBeenCalledWith(15);
    });

    it('addShield delegates to playerStore', () => {
      useGameStore.getState().addShield(10);
      expect(usePlayerStore.getState().addShield).toHaveBeenCalledWith(10);
    });

    it('startBattle delegates to battleStore', () => {
      useGameStore.getState().startBattle('classic', 'normal');
      expect(useBattleStore.getState().startBattle).toHaveBeenCalledWith('classic', 'normal');
    });

    it('startChallenge calls startBattle with challenge mode', () => {
      const spy = vi.spyOn(useGameStore.getState(), 'startBattle');
      useGameStore.getState().startChallenge('hard');
      expect(spy).toHaveBeenCalledWith('challenge', 'hard');
      spy.mockRestore();
    });

    it('startEndless calls startBattle with endless mode', () => {
      const spy = vi.spyOn(useGameStore.getState(), 'startBattle');
      useGameStore.getState().startEndless('normal');
      expect(spy).toHaveBeenCalledWith('endless', 'normal');
      spy.mockRestore();
    });

    it('startQuick calls startBattle with quick mode', () => {
      const spy = vi.spyOn(useGameStore.getState(), 'startBattle');
      useGameStore.getState().startQuick('normal');
      expect(spy).toHaveBeenCalledWith('quick', 'normal');
      spy.mockRestore();
    });

    it('goToMenu saves game then delegates to battleStore', () => {
      useGameStore.getState().goToMenu();
      expect(gameSave.savePermanentData).toHaveBeenCalled();
      expect(useBattleStore.getState().goToMenu).toHaveBeenCalled();
    });

    it('hasSave delegates to hasBattleSave', () => {
      expect(useGameStore.getState().hasSave()).toBe(false);
    });

    it('hasPermanent delegates to hasPermanentSave', () => {
      expect(useGameStore.getState().hasPermanent()).toBe(false);
    });

    it('setAnimating delegates to uiStore', () => {
      useGameStore.getState().setAnimating(true);
      expect(useUIStore.getState().setAnimating).toHaveBeenCalledWith(true);
    });

    it('addFloatingText delegates to uiStore', () => {
      useGameStore.getState().addFloatingText('damage', 10, 'enemy');
      expect(useUIStore.getState().addFloatingText).toHaveBeenCalledWith('damage', 10, 'enemy');
    });

    it('removeFloatingText delegates to uiStore', () => {
      useGameStore.getState().removeFloatingText('ft1');
      expect(useUIStore.getState().removeFloatingText).toHaveBeenCalledWith('ft1');
    });

    it('addScore delegates to battleStore', () => {
      useGameStore.getState().addScore(100);
      expect(useBattleStore.getState().addScore).toHaveBeenCalledWith(100);
    });

    it('incrementStreak delegates to battleStore', () => {
      useGameStore.getState().incrementStreak();
      expect(useBattleStore.getState().incrementStreak).toHaveBeenCalled();
    });

    it('resetStreak delegates to battleStore', () => {
      useGameStore.getState().resetStreak();
      expect(useBattleStore.getState().resetStreak).toHaveBeenCalled();
    });

    it('nextWave delegates to battleStore', () => {
      useGameStore.getState().nextWave();
      expect(useBattleStore.getState().nextWave).toHaveBeenCalled();
    });

    it('nextLevel delegates to battleStore', () => {
      useGameStore.getState().nextLevel();
      expect(useBattleStore.getState().nextLevel).toHaveBeenCalled();
    });
  });
});
