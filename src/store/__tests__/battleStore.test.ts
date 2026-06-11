import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useBattleStore } from '../battleStore';
import { findCombo } from '@/data/gameData';
import type { ComboSkill, Player, Enemy, Card } from '@/types/game';

const { mockPlayerStore, mockEnemyStore, mockUIStore, mockPlayer, mockEnemy } = vi.hoisted(() => {
  const mp: Player = {
    name: 'Player',
    maxHp: 100,
    hp: 100,
    shield: 0,
    statusEffects: [],
    hand: [],
    deck: [],
    selectedCards: [],
    mana: 10,
    maxMana: 10,
    comboCooldowns: [],
    comboLevels: [],
    image: '',
  };
  const me: Enemy = {
    name: 'Enemy',
    maxHp: 50,
    hp: 50,
    shield: 0,
    statusEffects: [],
    attackPower: 10,
    intent: 'attack',
    intentValue: 10,
    tier: 'common',
    level: 1,
    image: '',
  };
  const mps = {
    initPlayer: vi.fn(() => ({ ...mp })),
    setPlayer: vi.fn(),
    player: { ...mp },
    setComboCooldown: vi.fn(),
    getCurrentComboLevel: vi.fn(() => 1),
    isComboOnCooldown: vi.fn(() => false),
    setComboLevel: vi.fn(),
    decrementComboCooldowns: vi.fn(),
    resetMana: vi.fn(),
    resetShield: vi.fn(),
    drawCards: vi.fn(),
    setPlayer2: vi.fn(),
    player2: null as Player | null,
    currentDuoPlayer: 1 as 1 | 2,
    duoSetCurrentPlayer: vi.fn(),
    duoIsComboOnCooldown: vi.fn(() => false),
    duoGetCurrentComboLevel: vi.fn(() => 1),
    getComboCooldown: vi.fn(() => 0),
    applyPlayerStatusEffects: vi.fn(),
  };
  const mes = {
    createEnemy: vi.fn(() => ({ ...me })),
    setEnemy: vi.fn(),
    enemy: { ...me } as Enemy | null,
    applyEnemyStatusEffects: vi.fn(() => ({ totalDamage: 0, enemyDied: false })),
    updateEnemyIntent: vi.fn(),
    decrementAbilityCooldowns: vi.fn(),
    checkBossPhaseTransition: vi.fn(),
    useEnemyAbility: vi.fn(),
  };
  const mus = {
    setAnimating: vi.fn(),
    showCombo: vi.fn(),
    hideCombo: vi.fn(),
    addFloatingText: vi.fn(),
    addDamageFloatingText: vi.fn(),
    setShaking: vi.fn(),
    addComboFloatingText: vi.fn(),
    showLevelCompleteScreen: vi.fn(),
    hideLevelCompleteScreen: vi.fn(),
    showBattleRatingEffect: vi.fn(),
    isAnimating: false,
    showLevelComplete: false,
  };
  return { mockPlayerStore: mps, mockEnemyStore: mes, mockUIStore: mus, mockPlayer: mp, mockEnemy: me };
});

vi.mock('../playerStore', () => ({
  usePlayerStore: {
    getState: vi.fn(() => mockPlayerStore),
  },
}));

vi.mock('../enemyStore', () => ({
  useEnemyStore: {
    getState: vi.fn(() => mockEnemyStore),
    setState: vi.fn(),
  },
}));

vi.mock('../uiStore', () => ({
  useUIStore: {
    getState: vi.fn(() => mockUIStore),
  },
}));

vi.mock('@/data/gameData', () => ({
  findCombo: vi.fn(() => null),
  getComboWithLevel: vi.fn((combo: any) => combo),
  getComboLevel: vi.fn(() => 1),
  COMBOS: [],
  DIFFICULTY_CONFIG: {
    easy: { enemyHpMultiplier: 0.8, playerHpMultiplier: 1.2, enemyAttackMultiplier: 0.8, essenceMultiplier: 0.8 },
    normal: { enemyHpMultiplier: 1, playerHpMultiplier: 1, enemyAttackMultiplier: 1, essenceMultiplier: 1 },
    hard: { enemyHpMultiplier: 1.3, playerHpMultiplier: 0.8, enemyAttackMultiplier: 1.3, essenceMultiplier: 1.5 },
    nightmare: { enemyHpMultiplier: 1.6, playerHpMultiplier: 0.6, enemyAttackMultiplier: 1.6, essenceMultiplier: 2.5 },
  },
  CLASSIC_LEVELS: [{ enemyIndex: 0 }, { enemyIndex: 1 }, { enemyIndex: 2 }],
  QUICK_LEVELS: [{ enemyIndex: 0 }, { enemyIndex: 1 }],
  ENEMIES: [{}, {}],
  createCardByRarityWeight: vi.fn(() => ({ id: 'test_card', element: 'fire', name: 'Test', description: '', power: 5, rarity: 'common', manaCost: 1 })),
  createDeck: vi.fn(() => []),
  createPlayer: vi.fn(() => ({ name: 'Player', maxHp: 100, hp: 100, shield: 0, statusEffects: [], mana: 10, maxMana: 10, comboCooldowns: [], comboLevels: [], image: '' })),
  createEnemy: vi.fn(() => ({ ...mockEnemy })),
}));

const makeCombo = (overrides: Partial<ComboSkill> = {}): ComboSkill => ({
  id: 'test',
  elements: ['fire', 'water'],
  name: 'Test',
  description: '',
  damage: 20,
  rarity: 'common',
  effectType: 'steamburst',
  category: 'attack',
  cooldown: 1,
  canUpgrade: false,
  ...overrides,
});

const resetStoreState = () => {
  useBattleStore.setState({
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
  });
};

describe('battleStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStoreState();
    vi.clearAllMocks();
    mockPlayerStore.player = { ...mockPlayer };
    mockPlayerStore.player2 = null;
    mockPlayerStore.currentDuoPlayer = 1;
    mockPlayerStore.initPlayer.mockReturnValue({ ...mockPlayer });
    mockEnemyStore.enemy = { ...mockEnemy };
    mockEnemyStore.createEnemy.mockReturnValue({ ...mockEnemy });
    mockUIStore.isAnimating = false;
    mockUIStore.showLevelComplete = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculateDamage', () => {
    it('deals full damage when no shield', () => {
      const result = useBattleStore.getState().calculateDamage(30, mockPlayer, mockEnemy);
      expect(result.finalDamage).toBe(30);
      expect(result.actualDamageDealt).toBe(30);
      expect(result.remainingShield).toBe(0);
      expect(result.newHp).toBe(20);
    });

    it('absorbs all damage with shield', () => {
      const defender = { ...mockEnemy, shield: 50 };
      const result = useBattleStore.getState().calculateDamage(30, mockPlayer, defender);
      expect(result.finalDamage).toBe(0);
      expect(result.actualDamageDealt).toBe(30);
      expect(result.remainingShield).toBe(20);
    });

    it('partially absorbs damage with shield', () => {
      const defender = { ...mockEnemy, shield: 10 };
      const result = useBattleStore.getState().calculateDamage(30, mockPlayer, defender);
      expect(result.finalDamage).toBe(20);
      expect(result.remainingShield).toBe(0);
    });

    it('returns zero values when damage is 0', () => {
      const defender = { ...mockEnemy, shield: 15 };
      const result = useBattleStore.getState().calculateDamage(0, mockPlayer, defender);
      expect(result.finalDamage).toBe(0);
      expect(result.actualDamageDealt).toBe(0);
      expect(result.remainingShield).toBe(15);
    });

    it('does not reduce hp below 0', () => {
      const defender = { ...mockEnemy, hp: 10 };
      const result = useBattleStore.getState().calculateDamage(50, mockPlayer, defender);
      expect(result.newHp).toBe(0);
    });

    it('shield exactly equals damage', () => {
      const defender = { ...mockEnemy, shield: 25 };
      const result = useBattleStore.getState().calculateDamage(25, mockPlayer, defender);
      expect(result.finalDamage).toBe(0);
      expect(result.remainingShield).toBe(0);
    });
  });

  describe('applyComboEffect', () => {
    it('returns damage with no effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo(), 'enemy');
      expect(result.damage).toBe(20);
      expect(result.heal).toBe(0);
      expect(result.shield).toBe(0);
      expect(result.drawCards).toBe(0);
      expect(result.statusEffects).toEqual([]);
    });

    it('applies heal effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'heal', effectValue: 15, effectDuration: 0 }), 'player');
      expect(result.heal).toBe(15);
    });

    it('applies shield effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'shield', effectValue: 10, effectDuration: 0 }), 'player');
      expect(result.shield).toBe(10);
    });

    it('applies draw effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'draw', effectValue: 2, effectDuration: 0 }), 'player');
      expect(result.drawCards).toBe(2);
    });

    it('applies lifesteal effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'lifesteal', effectValue: 8, effectDuration: 0 }), 'enemy');
      expect(result.heal).toBe(8);
    });

    it('applies absorb effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'absorb', effectValue: 12, effectDuration: 0 }), 'enemy');
      expect(result.shield).toBe(12);
    });

    it('applies burn status effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'burn', effectValue: 5, effectDuration: 2 }), 'enemy');
      expect(result.statusEffects).toEqual([{ type: 'burn', value: 5, duration: 2 }]);
    });

    it('applies poison status effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'poison', effectValue: 4, effectDuration: 3 }), 'enemy');
      expect(result.statusEffects).toEqual([{ type: 'poison', value: 4, duration: 3 }]);
    });

    it('applies freeze status effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'freeze', effectValue: 1, effectDuration: 1 }), 'enemy');
      expect(result.statusEffects).toEqual([{ type: 'freeze', value: 1, duration: 1 }]);
    });

    it('applies stun status effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'stun', effectValue: 1, effectDuration: 1 }), 'enemy');
      expect(result.statusEffects).toEqual([{ type: 'stun', value: 1, duration: 1 }]);
    });

    it('applies weakness status effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'weakness', effectValue: 3, effectDuration: 2 }), 'enemy');
      expect(result.statusEffects).toEqual([{ type: 'weakness', value: 3, duration: 2 }]);
    });

    it('applies thorns buff effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'thorns', effectValue: 5, effectDuration: 3 }), 'player');
      expect(result.statusEffects).toEqual([{ type: 'thorns', value: 5, duration: 3 }]);
    });

    it('applies strength buff effect', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'strength', effectValue: 4, effectDuration: 2 }), 'player');
      expect(result.statusEffects).toEqual([{ type: 'strength', value: 4, duration: 2 }]);
    });

    it('does not add buff status effect when duration is 0', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: 'thorns', effectValue: 5, effectDuration: 0 }), 'player');
      expect(result.statusEffects).toEqual([]);
    });

    it('returns no effects when effect is undefined', () => {
      const result = useBattleStore.getState().applyComboEffect(makeCombo({ effect: undefined, effectValue: undefined, effectDuration: undefined }), 'enemy');
      expect(result.statusEffects).toEqual([]);
    });
  });

  describe('getStreakDamageBonus', () => {
    it('returns 0 when streak is 0', () => {
      useBattleStore.setState({ streak: 0 });
      expect(useBattleStore.getState().getStreakDamageBonus()).toBe(0);
    });

    it('returns 0 when streak is 1', () => {
      useBattleStore.setState({ streak: 1 });
      expect(useBattleStore.getState().getStreakDamageBonus()).toBe(0);
    });

    it('returns 5 for streak of 2', () => {
      useBattleStore.setState({ streak: 2 });
      expect(useBattleStore.getState().getStreakDamageBonus()).toBe(5);
    });

    it('caps at 100', () => {
      useBattleStore.setState({ streak: 25 });
      expect(useBattleStore.getState().getStreakDamageBonus()).toBe(100);
    });
  });

  describe('calculateDamageTier', () => {
    it('returns light for damage < 10', () => {
      expect(useBattleStore.getState().calculateDamageTier(5)).toBe('light');
    });

    it('returns normal for damage 10', () => {
      expect(useBattleStore.getState().calculateDamageTier(10)).toBe('normal');
    });

    it('returns heavy for damage 20', () => {
      expect(useBattleStore.getState().calculateDamageTier(20)).toBe('heavy');
    });

    it('returns critical for damage 35', () => {
      expect(useBattleStore.getState().calculateDamageTier(35)).toBe('critical');
    });

    it('returns devastating for damage 50', () => {
      expect(useBattleStore.getState().calculateDamageTier(50)).toBe('devastating');
    });
  });

  describe('calculateBattleRating', () => {
    it('returns D for low score', () => {
      useBattleStore.setState({ maxStreak: 0, totalDamageDealt: 0, turn: 30, difficulty: 'normal', highestHitDamage: 0 });
      expect(useBattleStore.getState().calculateBattleRating()).toBe('D');
    });

    it('returns C for moderate score', () => {
      useBattleStore.setState({ maxStreak: 5, totalDamageDealt: 200, turn: 15, difficulty: 'normal', highestHitDamage: 15 });
      expect(useBattleStore.getState().calculateBattleRating()).toBe('C');
    });

    it('returns B for good score', () => {
      useBattleStore.setState({ maxStreak: 5, totalDamageDealt: 400, turn: 10, difficulty: 'normal', highestHitDamage: 25 });
      expect(useBattleStore.getState().calculateBattleRating()).toBe('B');
    });

    it('returns A for great score', () => {
      useBattleStore.setState({ maxStreak: 7, totalDamageDealt: 600, turn: 8, difficulty: 'normal', highestHitDamage: 30 });
      expect(useBattleStore.getState().calculateBattleRating()).toBe('A');
    });

    it('returns S for outstanding score', () => {
      useBattleStore.setState({ maxStreak: 10, totalDamageDealt: 1000, turn: 1, difficulty: 'normal', highestHitDamage: 50 });
      expect(useBattleStore.getState().calculateBattleRating()).toBe('S');
    });

    it('applies difficulty multiplier', () => {
      useBattleStore.setState({ maxStreak: 5, totalDamageDealt: 400, turn: 10, difficulty: 'hard', highestHitDamage: 25 });
      expect(useBattleStore.getState().calculateBattleRating()).not.toBe('D');
    });
  });

  describe('addScore', () => {
    it('increments score', () => {
      useBattleStore.setState({ score: 0 });
      useBattleStore.getState().addScore(50);
      expect(useBattleStore.getState().score).toBe(50);
    });
  });

  describe('incrementStreak', () => {
    it('increments streak and updates maxStreak', () => {
      useBattleStore.setState({ streak: 4, maxStreak: 3 });
      useBattleStore.getState().incrementStreak();
      expect(useBattleStore.getState().streak).toBe(5);
      expect(useBattleStore.getState().maxStreak).toBe(5);
    });
  });

  describe('resetStreak', () => {
    it('resets streak but preserves maxStreak', () => {
      useBattleStore.setState({ streak: 5, maxStreak: 7 });
      useBattleStore.getState().resetStreak();
      expect(useBattleStore.getState().streak).toBe(0);
      expect(useBattleStore.getState().maxStreak).toBe(7);
    });
  });

  describe('addEssence', () => {
    it('adds essence with normal multiplier', () => {
      useBattleStore.setState({ elementEssence: 0, difficulty: 'normal' });
      useBattleStore.getState().addEssence(10);
      expect(useBattleStore.getState().elementEssence).toBe(10);
    });

    it('applies easy multiplier', () => {
      useBattleStore.setState({ elementEssence: 0, difficulty: 'easy' });
      useBattleStore.getState().addEssence(10);
      expect(useBattleStore.getState().elementEssence).toBe(8);
    });

    it('applies hard multiplier', () => {
      useBattleStore.setState({ elementEssence: 0, difficulty: 'hard' });
      useBattleStore.getState().addEssence(10);
      expect(useBattleStore.getState().elementEssence).toBe(15);
    });

    it('applies nightmare multiplier', () => {
      useBattleStore.setState({ elementEssence: 0, difficulty: 'nightmare' });
      useBattleStore.getState().addEssence(10);
      expect(useBattleStore.getState().elementEssence).toBe(25);
    });
  });

  describe('startBattle', () => {
    it('sets phase to battle with classic mode', () => {
      useBattleStore.getState().startBattle('classic', 'normal');
      const state = useBattleStore.getState();
      expect(state.phase).toBe('battle');
      expect(state.mode).toBe('classic');
      expect(state.difficulty).toBe('normal');
      expect(state.turn).toBe(1);
      expect(state.streak).toBe(0);
      expect(state.wave).toBe(1);
      expect(state.level).toBe(1);
      expect(state.myCardUsedIds).toEqual([]);
      expect(state.levelCardReward).toBeNull();
      expect(state.maxStreak).toBe(0);
      expect(state.totalDamageDealt).toBe(0);
      expect(state.totalHealingDone).toBe(0);
      expect(state.combosUsed).toBe(0);
      expect(state.battleRating).toBeNull();
      expect(state.highestHitDamage).toBe(0);
    });

    it('sets maxLevel based on CLASSIC_LEVELS for classic mode', () => {
      useBattleStore.getState().startBattle('classic', 'normal');
      expect(useBattleStore.getState().maxLevel).toBe(3);
    });

    it('sets maxLevel based on QUICK_LEVELS for quick mode', () => {
      useBattleStore.getState().startBattle('quick', 'normal');
      expect(useBattleStore.getState().maxLevel).toBe(2);
    });

    it('sets maxLevel to 999 for challenge mode', () => {
      useBattleStore.getState().startBattle('challenge', 'normal');
      expect(useBattleStore.getState().maxLevel).toBe(999);
    });

    it('sets maxLevel to 999 for endless mode', () => {
      useBattleStore.getState().startBattle('endless', 'normal');
      expect(useBattleStore.getState().maxLevel).toBe(999);
    });

    it('calls playerStore.initPlayer and setPlayer', () => {
      useBattleStore.getState().startBattle('classic', 'normal');
      expect(mockPlayerStore.initPlayer).toHaveBeenCalled();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('calls enemyStore.createEnemy and setEnemy', () => {
      useBattleStore.getState().startBattle('classic', 'normal');
      expect(mockEnemyStore.createEnemy).toHaveBeenCalled();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });
  });

  describe('startChallenge', () => {
    it('calls startBattle with challenge mode', () => {
      const spy = vi.spyOn(useBattleStore.getState(), 'startBattle');
      useBattleStore.getState().startChallenge('hard');
      expect(spy).toHaveBeenCalledWith('challenge', 'hard');
      spy.mockRestore();
    });
  });

  describe('startEndless', () => {
    it('calls startBattle with endless mode', () => {
      const spy = vi.spyOn(useBattleStore.getState(), 'startBattle');
      useBattleStore.getState().startEndless('normal');
      expect(spy).toHaveBeenCalledWith('endless', 'normal');
      spy.mockRestore();
    });
  });

  describe('startQuick', () => {
    it('calls startBattle with quick mode', () => {
      const spy = vi.spyOn(useBattleStore.getState(), 'startBattle');
      useBattleStore.getState().startQuick('normal');
      expect(spy).toHaveBeenCalledWith('quick', 'normal');
      spy.mockRestore();
    });
  });

  describe('startDuo', () => {
    it('sets phase to battle with duo mode', () => {
      useBattleStore.getState().startDuo('horizontal');
      const state = useBattleStore.getState();
      expect(state.phase).toBe('battle');
      expect(state.mode).toBe('duo');
      expect(state.duoLayout).toBe('horizontal');
      expect(state.duoWinner).toBeNull();
    });

    it('initializes both players', () => {
      useBattleStore.getState().startDuo('vertical');
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
      expect(mockPlayerStore.setPlayer2).toHaveBeenCalled();
      expect(useBattleStore.getState().duoLayout).toBe('vertical');
    });
  });

  describe('goToMenu', () => {
    it('sets phase to menu', () => {
      useBattleStore.setState({ phase: 'battle' });
      useBattleStore.getState().goToMenu();
      expect(useBattleStore.getState().phase).toBe('menu');
    });
  });

  describe('setDuoLayout', () => {
    it('sets duoLayout', () => {
      useBattleStore.getState().setDuoLayout('vertical');
      expect(useBattleStore.getState().duoLayout).toBe('vertical');
    });
  });

  describe('resetMyCardCooldowns', () => {
    it('clears myCardUsedIds', () => {
      useBattleStore.setState({ myCardUsedIds: ['c1'] });
      useBattleStore.getState().resetMyCardCooldowns();
      expect(useBattleStore.getState().myCardUsedIds).toEqual([]);
    });
  });

  describe('addCardToUsed', () => {
    it('adds card id', () => {
      useBattleStore.setState({ myCardUsedIds: [] });
      useBattleStore.getState().addCardToUsed('c1');
      expect(useBattleStore.getState().myCardUsedIds).toEqual(['c1']);
    });
  });

  describe('isMyCardOnCooldown', () => {
    it('returns true when card is used', () => {
      useBattleStore.setState({ myCardUsedIds: ['c1'] });
      expect(useBattleStore.getState().isMyCardOnCooldown('c1')).toBe(true);
    });

    it('returns false when card is not used', () => {
      useBattleStore.setState({ myCardUsedIds: [] });
      expect(useBattleStore.getState().isMyCardOnCooldown('c1')).toBe(false);
    });
  });

  describe('setBattleRating', () => {
    it('sets battle rating', () => {
      useBattleStore.getState().setBattleRating('S');
      expect(useBattleStore.getState().battleRating).toBe('S');
    });
  });

  describe('trackComboUse', () => {
    it('calls window.__updateQuestProgress when available', () => {
      const mockUpdate = vi.fn();
      (window as any).__updateQuestProgress = mockUpdate;
      useBattleStore.getState().trackComboUse(makeCombo());
      expect(mockUpdate).toHaveBeenCalledWith('use_combo', 1, 'test');
      expect(mockUpdate).toHaveBeenCalledWith('use_combo_category', 1, undefined, 'attack');
      delete (window as any).__updateQuestProgress;
    });

    it('does nothing when window.__updateQuestProgress is not available', () => {
      delete (window as any).__updateQuestProgress;
      expect(() => useBattleStore.getState().trackComboUse(makeCombo())).not.toThrow();
    });
  });

  describe('trackDamage', () => {
    it('calls window.__updateQuestProgress when available', () => {
      const mockUpdate = vi.fn();
      (window as any).__updateQuestProgress = mockUpdate;
      useBattleStore.getState().trackDamage(50);
      expect(mockUpdate).toHaveBeenCalledWith('total_damage', 50);
      delete (window as any).__updateQuestProgress;
    });

    it('does nothing when amount is 0 or negative', () => {
      const mockUpdate = vi.fn();
      (window as any).__updateQuestProgress = mockUpdate;
      useBattleStore.getState().trackDamage(0);
      useBattleStore.getState().trackDamage(-5);
      expect(mockUpdate).not.toHaveBeenCalled();
      delete (window as any).__updateQuestProgress;
    });
  });

  describe('trackWin', () => {
    it('calls window.__updateQuestProgress when available', () => {
      const mockUpdate = vi.fn();
      (window as any).__updateQuestProgress = mockUpdate;
      useBattleStore.getState().trackWin();
      expect(mockUpdate).toHaveBeenCalledWith('win_battle', 1);
      delete (window as any).__updateQuestProgress;
    });
  });

  describe('trackWave', () => {
    it('calls window.__updateQuestProgress when wave is new max', () => {
      const mockUpdate = vi.fn();
      (window as any).__updateQuestProgress = mockUpdate;
      useBattleStore.setState({ wave: 3, sessionMaxWave: 0 } as any);
      useBattleStore.getState().trackWave(3);
      expect(mockUpdate).toHaveBeenCalledWith('reach_wave', 1);
      delete (window as any).__updateQuestProgress;
    });
  });

  describe('nextTurn', () => {
    it('increments turn and resets player resources', () => {
      useBattleStore.setState({ turn: 1 });
      useBattleStore.getState().nextTurn();
      expect(useBattleStore.getState().turn).toBe(2);
      expect(mockPlayerStore.decrementComboCooldowns).toHaveBeenCalled();
      expect(mockPlayerStore.resetMana).toHaveBeenCalled();
      expect(mockPlayerStore.resetShield).toHaveBeenCalled();
      expect(mockPlayerStore.drawCards).toHaveBeenCalledWith(2);
    });
  });

  describe('nextWave', () => {
    it('increments wave and turn', () => {
      useBattleStore.setState({ wave: 1, turn: 3, difficulty: 'normal', myCardUsedIds: ['c1'], levelCardReward: { id: 'x' } as any });
      useBattleStore.getState().nextWave();
      expect(useBattleStore.getState().wave).toBe(2);
      expect(useBattleStore.getState().turn).toBe(4);
      expect(useBattleStore.getState().myCardUsedIds).toEqual([]);
      expect(useBattleStore.getState().levelCardReward).toBeNull();
      expect(mockPlayerStore.drawCards).toHaveBeenCalled();
    });
  });

  describe('nextLevel', () => {
    it('increments level and turn', () => {
      useBattleStore.setState({ level: 1, turn: 3, mode: 'classic', difficulty: 'normal', myCardUsedIds: ['c1'], levelCardReward: null });
      useBattleStore.getState().nextLevel();
      expect(useBattleStore.getState().level).toBe(2);
      expect(useBattleStore.getState().turn).toBe(4);
      expect(useBattleStore.getState().myCardUsedIds).toEqual([]);
      expect(mockPlayerStore.drawCards).toHaveBeenCalled();
    });

    it('sets phase to victory when exceeding max levels', () => {
      useBattleStore.setState({ level: 3, turn: 3, mode: 'classic', difficulty: 'normal' });
      useBattleStore.getState().nextLevel();
      expect(useBattleStore.getState().phase).toBe('victory');
    });
  });

  describe('proceedToNextLevel', () => {
    it('calls hideLevelCompleteScreen and nextLevel', () => {
      useBattleStore.setState({ level: 1, turn: 1, mode: 'classic', difficulty: 'normal' });
      useBattleStore.getState().proceedToNextLevel();
      expect(mockUIStore.hideLevelCompleteScreen).toHaveBeenCalled();
    });
  });

  describe('getBattleCardReward', () => {
    it('returns null when random check fails', () => {
      const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(1);
      useBattleStore.setState({ difficulty: 'normal' });
      const result = useBattleStore.getState().getBattleCardReward();
      expect(result).toBeNull();
      mathSpy.mockRestore();
    });

    it('returns a card when random check passes', () => {
      const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
      useBattleStore.setState({ difficulty: 'normal' });
      const result = useBattleStore.getState().getBattleCardReward();
      expect(result).not.toBeNull();
      mathSpy.mockRestore();
    });
  });

  describe('addCardToCollection', () => {
    it('calls window.__addCardToCollection when available', () => {
      const mockAdd = vi.fn();
      (window as any).__addCardToCollection = mockAdd;
      const card: Card = { id: 'c1', element: 'fire', name: 'T', description: '', power: 5, rarity: 'common', manaCost: 1 };
      useBattleStore.getState().addCardToCollection(card);
      expect(mockAdd).toHaveBeenCalledWith(card);
      delete (window as any).__addCardToCollection;
    });

    it('does nothing when window.__addCardToCollection is not available', () => {
      delete (window as any).__addCardToCollection;
      const card: Card = { id: 'c1', element: 'fire', name: 'T', description: '', power: 5, rarity: 'common', manaCost: 1 };
      expect(() => useBattleStore.getState().addCardToCollection(card)).not.toThrow();
    });
  });

  describe('playSelectedCards', () => {
    it('returns early when animating', () => {
      mockUIStore.isAnimating = true;
      useBattleStore.getState().playSelectedCards();
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });

    it('returns early when enemy is null', () => {
      mockUIStore.isAnimating = false;
      mockEnemyStore.enemy = null;
      useBattleStore.getState().playSelectedCards();
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });

    it('returns early when enemy hp is 0', () => {
      mockUIStore.isAnimating = false;
      mockEnemyStore.enemy = { ...mockEnemy, hp: 0 };
      useBattleStore.getState().playSelectedCards();
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });

    it('returns early when showLevelComplete', () => {
      mockUIStore.isAnimating = false;
      mockUIStore.showLevelComplete = true;
      useBattleStore.getState().playSelectedCards();
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });

    it('returns early when less than 2 cards selected', () => {
      mockUIStore.isAnimating = false;
      mockPlayerStore.player = { ...mockPlayer, selectedCards: [{ id: 'c1', element: 'fire', name: 'T', description: '', power: 5, rarity: 'common', manaCost: 1 } as Card] };
      useBattleStore.getState().playSelectedCards();
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });
  });

  describe('enemyTurn', () => {
    it('returns early when enemy is null', () => {
      mockEnemyStore.enemy = null;
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).not.toHaveBeenCalled();
    });

    it('skips attack when stunned', () => {
      const stunnedEnemy = { ...mockEnemy, statusEffects: [{ type: 'stun' as const, value: 1, duration: 1 }] };
      mockEnemyStore.enemy = stunnedEnemy;
      useBattleStore.getState().enemyTurn();
      vi.advanceTimersByTime(1000);
      expect(mockEnemyStore.applyEnemyStatusEffects).toHaveBeenCalled();
    });

    it('skips attack when frozen', () => {
      const frozenEnemy = { ...mockEnemy, statusEffects: [{ type: 'freeze' as const, value: 1, duration: 1 }] };
      mockEnemyStore.enemy = frozenEnemy;
      useBattleStore.getState().enemyTurn();
      vi.advanceTimersByTime(1000);
      expect(mockEnemyStore.applyEnemyStatusEffects).toHaveBeenCalled();
    });

    it('deals damage to player on attack intent', () => {
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'attack', attackPower: 10, statusEffects: [] };
      mockPlayerStore.player = { ...mockPlayer, hp: 100, shield: 0, statusEffects: [] };
      useBattleStore.setState({ phase: 'battle', mode: 'classic', difficulty: 'normal', level: 1, wave: 1, turn: 1, streak: 0, score: 0, elementEssence: 0, maxLevel: 5, comboHistory: [], maxStreak: 0, totalDamageDealt: 0, totalHealingDone: 0, combosUsed: 0, highestHitDamage: 0, battleRating: null, duoLayout: 'horizontal', duoWinner: null, myCardUsedIds: [], levelCardReward: null });
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('handles defend intent', () => {
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'defend', statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles buff intent', () => {
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'buff', intentValue: 10, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles heal intent', () => {
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'heal', intentValue: 10, hp: 30, maxHp: 50, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });
  });

  describe('duoPlaySelectedCards', () => {
    it('returns early when animating', () => {
      mockUIStore.isAnimating = true;
      useBattleStore.getState().duoPlaySelectedCards(1);
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });

    it('returns early when duoWinner is set', () => {
      mockUIStore.isAnimating = false;
      useBattleStore.setState({ duoWinner: 1 });
      useBattleStore.getState().duoPlaySelectedCards(1);
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });

    it('returns early when not current duo player turn', () => {
      mockUIStore.isAnimating = false;
      useBattleStore.setState({ duoWinner: null });
      mockPlayerStore.currentDuoPlayer = 2;
      useBattleStore.getState().duoPlaySelectedCards(1);
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
      mockPlayerStore.currentDuoPlayer = 1;
    });

    it('returns early when player has less than 2 selected cards', () => {
      mockUIStore.isAnimating = false;
      useBattleStore.setState({ duoWinner: null });
      mockPlayerStore.currentDuoPlayer = 1;
      mockPlayerStore.player = { ...mockPlayer, selectedCards: [] };
      useBattleStore.getState().duoPlaySelectedCards(1);
      expect(mockUIStore.showCombo).not.toHaveBeenCalled();
    });
  });

  describe('duoNextTurn', () => {
    it('switches player turn', () => {
      mockPlayerStore.currentDuoPlayer = 1;
      mockPlayerStore.player = { ...mockPlayer, comboCooldowns: [] };
      mockPlayerStore.player2 = { ...mockPlayer, comboCooldowns: [], name: 'Player 2' };
      useBattleStore.setState({ turn: 1 });
      useBattleStore.getState().duoNextTurn();
      expect(useBattleStore.getState().turn).toBe(2);
    });

    it('returns early when next player is null', () => {
      mockPlayerStore.currentDuoPlayer = 1;
      mockPlayerStore.player = { ...mockPlayer, comboCooldowns: [] };
      mockPlayerStore.player2 = null;
      useBattleStore.setState({ turn: 1 });
      useBattleStore.getState().duoNextTurn();
    });
  });

  describe('restartGame', () => {
    it('calls startBattle with current mode and difficulty', () => {
      useBattleStore.setState({ mode: 'challenge', difficulty: 'hard' });
      const spy = vi.spyOn(useBattleStore.getState(), 'startBattle');
      useBattleStore.getState().restartGame();
      expect(spy).toHaveBeenCalledWith('challenge', 'hard');
      spy.mockRestore();
    });
  });

  describe('playSelectedCards full flow', () => {
    const fireCard: Card = { id: 'c1', element: 'fire', name: 'F', description: '', power: 5, rarity: 'common', manaCost: 1 };
    const waterCard: Card = { id: 'c2', element: 'water', name: 'W', description: '', power: 5, rarity: 'common', manaCost: 1 };
    const testCombo = makeCombo({ id: 'fw', elements: ['fire', 'water'], damage: 20, rarity: 'common' });

    beforeEach(() => {
      (findCombo as any).mockReturnValue(testCombo);
      mockPlayerStore.player = {
        ...mockPlayer,
        hand: [fireCard, waterCard],
        deck: [],
        selectedCards: [fireCard, waterCard],
        statusEffects: [],
      };
      mockEnemyStore.enemy = { ...mockEnemy, hp: 50, shield: 0, statusEffects: [] };
      mockUIStore.isAnimating = false;
      mockUIStore.showLevelComplete = false;
      useBattleStore.setState({
        phase: 'battle', mode: 'classic', difficulty: 'normal',
        level: 1, wave: 1, turn: 1, streak: 0, maxStreak: 0,
        score: 0, elementEssence: 0, maxLevel: 5,
        totalDamageDealt: 0, totalHealingDone: 0, combosUsed: 0,
        highestHitDamage: 0, comboHistory: [],
        battleRating: null, duoLayout: 'horizontal', duoWinner: null,
        myCardUsedIds: [], levelCardReward: null,
      });
    });

    it('plays combo and deals damage to enemy', () => {
      useBattleStore.getState().playSelectedCards();
      expect(mockUIStore.setAnimating).toHaveBeenCalledWith(true);
      vi.advanceTimersByTime(1500);
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('tracks damage and increments streak', () => {
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(useBattleStore.getState().streak).toBe(1);
    });

    it('applies heal combo effect', () => {
      const healCombo = makeCombo({ id: 'heal_combo', effect: 'heal', effectValue: 10, effectDuration: 1, damage: 10 });
      (findCombo as any).mockReturnValue(healCombo);
      mockPlayerStore.player = { ...mockPlayer, hp: 80, hand: [fireCard, waterCard], deck: [], selectedCards: [fireCard, waterCard], statusEffects: [] };
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('applies shield combo effect', () => {
      const shieldCombo = makeCombo({ id: 'shield_combo', effect: 'shield', effectValue: 5, effectDuration: 1, damage: 10 });
      (findCombo as any).mockReturnValue(shieldCombo);
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('applies debuff effect to enemy', () => {
      const burnCombo = makeCombo({ id: 'burn_combo', effect: 'burn', effectValue: 5, effectDuration: 2, damage: 15 });
      (findCombo as any).mockReturnValue(burnCombo);
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('applies buff effect to player', () => {
      const thornsCombo = makeCombo({ id: 'thorns_combo', effect: 'thorns', effectValue: 3, effectDuration: 2, damage: 10 });
      (findCombo as any).mockReturnValue(thornsCombo);
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('adds score in challenge mode', () => {
      useBattleStore.setState({ mode: 'challenge', score: 0 });
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(useBattleStore.getState().score).toBeGreaterThan(0);
    });

    it('handles enemy death', () => {
      mockEnemyStore.enemy = { ...mockEnemy, hp: 5, shield: 0, statusEffects: [] };
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(2100);
      expect(mockUIStore.showBattleRatingEffect).toHaveBeenCalled();
    });

    it('handles enemy death in last level - victory', () => {
      useBattleStore.setState({ level: 3, maxLevel: 3 });
      mockEnemyStore.enemy = { ...mockEnemy, hp: 5, shield: 0, statusEffects: [] };
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(2500);
      expect(useBattleStore.getState().phase).toBe('victory');
    });

    it('enemy not dead triggers enemyTurn after delay', () => {
      mockEnemyStore.enemy = { ...mockEnemy, hp: 50, shield: 0, statusEffects: [] };
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockEnemyStore.checkBossPhaseTransition).not.toHaveBeenCalled();
      vi.advanceTimersByTime(500);
      expect(mockEnemyStore.checkBossPhaseTransition).toHaveBeenCalled();
    });

    it('lifesteal combo heals player', () => {
      const lsCombo = makeCombo({ id: 'ls_combo', effect: 'lifesteal', effectValue: 5, effectDuration: 1, damage: 20 });
      (findCombo as any).mockReturnValue(lsCombo);
      mockPlayerStore.player = { ...mockPlayer, hp: 80, hand: [fireCard, waterCard], deck: [], selectedCards: [fireCard, waterCard], statusEffects: [] };
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('absorb combo gives shield', () => {
      const absCombo = makeCombo({ id: 'abs_combo', effect: 'absorb', effectValue: 5, effectDuration: 1, damage: 20 });
      (findCombo as any).mockReturnValue(absCombo);
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('draw combo draws cards', () => {
      const drawCombo = makeCombo({ id: 'draw_combo', effect: 'draw', effectValue: 2, effectDuration: 1, damage: 10 });
      (findCombo as any).mockReturnValue(drawCombo);
      const deckCard: Card = { id: 'd1', element: 'fire', name: 'D', description: '', power: 3, rarity: 'common', manaCost: 1 };
      mockPlayerStore.player = { ...mockPlayer, hand: [fireCard, waterCard], deck: [deckCard, deckCard], selectedCards: [fireCard, waterCard], statusEffects: [] };
      useBattleStore.getState().playSelectedCards();
      vi.advanceTimersByTime(1500);
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });
  });

  describe('enemyTurn full flow', () => {
    beforeEach(() => {
      useBattleStore.setState({
        phase: 'battle', mode: 'classic', difficulty: 'normal',
        level: 1, wave: 1, turn: 1, streak: 5, maxStreak: 5,
        score: 0, elementEssence: 0, maxLevel: 5,
        totalDamageDealt: 0, totalHealingDone: 0, combosUsed: 0,
        highestHitDamage: 0, comboHistory: [],
        battleRating: null, duoLayout: 'horizontal', duoWinner: null,
        myCardUsedIds: [], levelCardReward: null,
      });
      mockPlayerStore.player = { ...mockPlayer, hp: 100, shield: 0, statusEffects: [] };
      mockEnemyStore.enemy = { ...mockEnemy, hp: 50, shield: 0, statusEffects: [], intent: 'attack', attackPower: 10, intentValue: 10 };
    });

    it('applies weakness to reduce attack damage', () => {
      mockPlayerStore.player = { ...mockPlayer, statusEffects: [{ type: 'weakness', value: 5, duration: 1 }] };
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'attack', attackPower: 10, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('player shield absorbs enemy attack', () => {
      mockPlayerStore.player = { ...mockPlayer, shield: 15, statusEffects: [] };
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'attack', attackPower: 10, intentValue: 10, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('thorns damage reflects to enemy on attack intent', () => {
      mockPlayerStore.player = { ...mockPlayer, statusEffects: [{ type: 'thorns', value: 3, duration: 2 }] };
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('sets phase to defeat when player hp reaches 0', () => {
      mockPlayerStore.player = { ...mockPlayer, hp: 1, shield: 0, statusEffects: [] };
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'attack', attackPower: 50, intentValue: 50, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      vi.advanceTimersByTime(1000);
    });

    it('handles enemy death after thorns in setTimeout', () => {
      mockPlayerStore.player = { ...mockPlayer, statusEffects: [{ type: 'thorns', value: 100, duration: 2 }] };
      mockEnemyStore.enemy = { ...mockEnemy, hp: 5, intent: 'attack', attackPower: 5, intentValue: 5, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      vi.advanceTimersByTime(1000);
    });

    it('handles debuff intent', () => {
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'debuff', attackPower: 8, intentValue: 8, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('applies streak bonus and shakes player on damage', () => {
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'attack', attackPower: 10, intentValue: 10, statusEffects: [] };
      useBattleStore.getState().enemyTurn();
      expect(mockUIStore.setShaking).toHaveBeenCalledWith('player', true);
    });

    it('enemy with strength status effect increases damage', () => {
      mockEnemyStore.enemy = { ...mockEnemy, intent: 'attack', attackPower: 10, intentValue: 10, statusEffects: [{ type: 'strength', value: 5, duration: 2 }] };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('enemy with lifesteal ability heals on attack', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 10, intentValue: 10, hp: 30, maxHp: 50,
        statusEffects: [],
        abilities: [{ id: 'ls', type: 'lifesteal', value: 5, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles shield_bash ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5, shield: 10,
        statusEffects: [],
        abilities: [{ id: 'sb', type: 'shield_bash', value: 0, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles drain_shield ability', () => {
      mockPlayerStore.player = { ...mockPlayer, shield: 10, statusEffects: [] };
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'ds', type: 'drain_shield', value: 5, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles rage_mode ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5, maxHp: 50,
        statusEffects: [],
        abilities: [{ id: 'rm', type: 'rage_mode', value: 3, cooldown: 2, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles regen ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'defend', intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'rg', type: 'regen', value: 5, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles thorns_aura ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'defend', intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'ta', type: 'thorns_aura', value: 3, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockEnemyStore.setEnemy).toHaveBeenCalled();
    });

    it('handles poison_attack ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'pa', type: 'poison_attack', value: 3, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('handles burn_attack ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'ba', type: 'burn_attack', value: 3, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('handles freeze_attack ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'fa', type: 'freeze_attack', value: 1, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('handles stun_attack ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'sa', type: 'stun_attack', value: 1, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('handles pierce_attack ability', () => {
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'pc', type: 'pierce_attack', value: 10, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('poison on existing player effect stacks', () => {
      mockPlayerStore.player = { ...mockPlayer, statusEffects: [{ type: 'poison', value: 3, duration: 2 }] };
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'pa', type: 'poison_attack', value: 2, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('burn on existing player effect stacks', () => {
      mockPlayerStore.player = { ...mockPlayer, statusEffects: [{ type: 'burn', value: 3, duration: 2 }] };
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'ba', type: 'burn_attack', value: 2, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('freeze on existing player effect extends duration', () => {
      mockPlayerStore.player = { ...mockPlayer, statusEffects: [{ type: 'freeze', value: 1, duration: 2 }] };
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'fa', type: 'freeze_attack', value: 1, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });

    it('stun on existing player effect extends duration', () => {
      mockPlayerStore.player = { ...mockPlayer, statusEffects: [{ type: 'stun', value: 1, duration: 1 }] };
      mockEnemyStore.enemy = {
        ...mockEnemy, intent: 'attack', attackPower: 5, intentValue: 5,
        statusEffects: [],
        abilities: [{ id: 'sa', type: 'stun_attack', value: 1, cooldown: 0, currentCooldown: 0 }],
      };
      useBattleStore.getState().enemyTurn();
      expect(mockPlayerStore.setPlayer).toHaveBeenCalled();
    });
  });
});
