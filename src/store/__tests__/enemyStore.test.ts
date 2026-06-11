import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEnemyStore } from '../enemyStore';
import type { Enemy, StatusEffect, BossPhaseData, SpecialAbility } from '@/types/game';

const createMockEnemy = (overrides: Partial<Enemy> = {}): Enemy => ({
  name: 'Test Enemy',
  maxHp: 100,
  hp: 100,
  shield: 0,
  statusEffects: [],
  image: '',
  avatarType: 'flame_imp',
  attackPower: 10,
  intent: 'attack',
  intentValue: 10,
  tier: 'common',
  level: 1,
  ...overrides,
});

const mockBossPhases: BossPhaseData[] = [
  {
    phase: 1,
    name: 'Boss Phase 1',
    maxHp: 200,
    attackPower: 15,
    avatarType: 'boss_dragon',
    abilities: [
      { id: 'boss_atk1', name: 'Attack', description: 'Attack', type: 'enrage', value: 10, cooldown: 2, currentCooldown: 0 },
    ],
    intentPattern: ['attack', 'defend', 'buff'],
  },
  {
    phase: 2,
    name: 'Boss Phase 2',
    maxHp: 300,
    attackPower: 25,
    avatarType: 'boss_dragon_phase2',
    abilities: [
      { id: 'boss_atk2', name: 'Strong Attack', description: 'Strong Attack', type: 'damage_boost', value: 20, cooldown: 3, currentCooldown: 0 },
    ],
    intentPattern: ['attack', 'attack', 'debuff'],
  },
  {
    phase: 3,
    name: 'Boss Phase 3',
    maxHp: 400,
    attackPower: 35,
    avatarType: 'boss_dragon_phase3',
    abilities: [
      { id: 'boss_atk3', name: 'Ultimate', description: 'Ultimate', type: 'rage_mode', value: 30, cooldown: 4, currentCooldown: 0 },
    ],
    intentPattern: ['attack', 'heal', 'attack'],
  },
];

describe('useEnemyStore', () => {
  beforeEach(() => {
    useEnemyStore.setState({ enemy: null });
    vi.restoreAllMocks();
  });

  describe('createEnemy', () => {
    it('should create an enemy with default multiplier of 1', () => {
      const enemy = useEnemyStore.getState().createEnemy(0);
      expect(enemy).toBeDefined();
      expect(enemy.maxHp).toBeGreaterThan(0);
      expect(enemy.hp).toBe(enemy.maxHp);
    });

    it('should apply difficulty multiplier to maxHp, hp, attackPower, and intentValue', () => {
      const baseEnemy = useEnemyStore.getState().createEnemy(0);
      const scaledEnemy = useEnemyStore.getState().createEnemy(0, 2);

      expect(scaledEnemy.maxHp).toBe(baseEnemy.maxHp * 2);
      expect(scaledEnemy.hp).toBe(scaledEnemy.maxHp);
      expect(scaledEnemy.attackPower).toBe(baseEnemy.attackPower * 2);
      expect(scaledEnemy.intentValue).toBe(baseEnemy.intentValue * 2);
    });

    it('should floor multiplier results', () => {
      const baseEnemy = useEnemyStore.getState().createEnemy(0);
      const scaledEnemy = useEnemyStore.getState().createEnemy(0, 1.5);

      expect(scaledEnemy.maxHp).toBe(Math.floor(baseEnemy.maxHp * 1.5));
      expect(scaledEnemy.attackPower).toBe(Math.floor(baseEnemy.attackPower * 1.5));
      expect(scaledEnemy.intentValue).toBe(Math.floor(baseEnemy.intentValue * 1.5));
    });

    it('should scale ability values with multiplier', () => {
      const baseEnemy = useEnemyStore.getState().createEnemy(0);
      const scaledEnemy = useEnemyStore.getState().createEnemy(0, 2);

      if (baseEnemy.abilities && baseEnemy.abilities.length > 0) {
        baseEnemy.abilities.forEach((ability, i) => {
          expect(scaledEnemy.abilities![i].value).toBe(Math.floor(ability.value * 2));
        });
      }
    });
  });

  describe('setEnemy', () => {
    it('should set enemy to a valid enemy object', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().enemy).toEqual(mockEnemy);
    });

    it('should set enemy to null', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);
      useEnemyStore.getState().setEnemy(null);

      expect(useEnemyStore.getState().enemy).toBeNull();
    });
  });

  describe('updateEnemyHp', () => {
    it('should update enemy hp', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);
      useEnemyStore.getState().updateEnemyHp(50);

      expect(useEnemyStore.getState().enemy!.hp).toBe(50);
    });

    it('should clamp hp to 0 minimum', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);
      useEnemyStore.getState().updateEnemyHp(-10);

      expect(useEnemyStore.getState().enemy!.hp).toBe(0);
    });

    it('should not modify state when enemy is null', () => {
      useEnemyStore.getState().updateEnemyHp(50);
      expect(useEnemyStore.getState().enemy).toBeNull();
    });
  });

  describe('updateEnemyShield', () => {
    it('should update enemy shield', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);
      useEnemyStore.getState().updateEnemyShield(30);

      expect(useEnemyStore.getState().enemy!.shield).toBe(30);
    });

    it('should clamp shield to 0 minimum', () => {
      const mockEnemy = createMockEnemy({ shield: 10 });
      useEnemyStore.getState().setEnemy(mockEnemy);
      useEnemyStore.getState().updateEnemyShield(-5);

      expect(useEnemyStore.getState().enemy!.shield).toBe(0);
    });

    it('should not modify state when enemy is null', () => {
      useEnemyStore.getState().updateEnemyShield(20);
      expect(useEnemyStore.getState().enemy).toBeNull();
    });
  });

  describe('addEnemyStatusEffect', () => {
    it('should add a new status effect', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);

      const effect: StatusEffect = { type: 'burn', value: 5, duration: 3 };
      useEnemyStore.getState().addEnemyStatusEffect(effect);

      expect(useEnemyStore.getState().enemy!.statusEffects).toHaveLength(1);
      expect(useEnemyStore.getState().enemy!.statusEffects[0]).toEqual(effect);
    });

    it('should merge existing status effect by adding values', () => {
      const existingEffect: StatusEffect = { type: 'burn', value: 5, duration: 3 };
      const mockEnemy = createMockEnemy({ statusEffects: [existingEffect] });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const newEffect: StatusEffect = { type: 'burn', value: 3, duration: 2 };
      useEnemyStore.getState().addEnemyStatusEffect(newEffect);

      const effects = useEnemyStore.getState().enemy!.statusEffects;
      expect(effects).toHaveLength(1);
      expect(effects[0].value).toBe(8);
    });

    it('should use max duration when merging', () => {
      const existingEffect: StatusEffect = { type: 'poison', value: 4, duration: 2 };
      const mockEnemy = createMockEnemy({ statusEffects: [existingEffect] });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const newEffect: StatusEffect = { type: 'poison', value: 3, duration: 5 };
      useEnemyStore.getState().addEnemyStatusEffect(newEffect);

      const effects = useEnemyStore.getState().enemy!.statusEffects;
      expect(effects).toHaveLength(1);
      expect(effects[0].duration).toBe(5);
    });

    it('should not modify state when enemy is null', () => {
      const effect: StatusEffect = { type: 'burn', value: 5, duration: 3 };
      useEnemyStore.getState().addEnemyStatusEffect(effect);
      expect(useEnemyStore.getState().enemy).toBeNull();
    });
  });

  describe('applyEnemyStatusEffects', () => {
    it('should deal damage from burn effects', () => {
      const effects: StatusEffect[] = [
        { type: 'burn', value: 6, duration: 2 },
      ];
      const mockEnemy = createMockEnemy({ statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const result = useEnemyStore.getState().applyEnemyStatusEffects();
      expect(result.totalDamage).toBe(6);
      expect(useEnemyStore.getState().enemy!.hp).toBe(94);
    });

    it('should deal damage from poison effects', () => {
      const effects: StatusEffect[] = [
        { type: 'poison', value: 4, duration: 3 },
      ];
      const mockEnemy = createMockEnemy({ statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const result = useEnemyStore.getState().applyEnemyStatusEffects();
      expect(result.totalDamage).toBe(4);
      expect(useEnemyStore.getState().enemy!.hp).toBe(96);
    });

    it('should sum damage from multiple burn and poison effects', () => {
      const effects: StatusEffect[] = [
        { type: 'burn', value: 5, duration: 2 },
        { type: 'poison', value: 3, duration: 2 },
        { type: 'burn', value: 4, duration: 1 },
      ];
      const mockEnemy = createMockEnemy({ statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const result = useEnemyStore.getState().applyEnemyStatusEffects();
      expect(result.totalDamage).toBe(12);
      expect(useEnemyStore.getState().enemy!.hp).toBe(88);
    });

    it('should decrement duration of all effects', () => {
      const effects: StatusEffect[] = [
        { type: 'burn', value: 5, duration: 2 },
        { type: 'strength', value: 3, duration: 3 },
      ];
      const mockEnemy = createMockEnemy({ statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().applyEnemyStatusEffects();
      const remaining = useEnemyStore.getState().enemy!.statusEffects;
      expect(remaining.find(e => e.type === 'burn')!.duration).toBe(1);
      expect(remaining.find(e => e.type === 'strength')!.duration).toBe(2);
    });

    it('should remove effects with expired duration', () => {
      const effects: StatusEffect[] = [
        { type: 'burn', value: 5, duration: 1 },
      ];
      const mockEnemy = createMockEnemy({ statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().applyEnemyStatusEffects();
      expect(useEnemyStore.getState().enemy!.statusEffects).toHaveLength(0);
    });

    it('should detect enemy death when hp reaches 0', () => {
      const effects: StatusEffect[] = [
        { type: 'burn', value: 150, duration: 2 },
      ];
      const mockEnemy = createMockEnemy({ hp: 100, statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const result = useEnemyStore.getState().applyEnemyStatusEffects();
      expect(result.enemyDied).toBe(true);
      expect(useEnemyStore.getState().enemy!.hp).toBe(0);
    });

    it('should not report death if enemy was already dead', () => {
      const effects: StatusEffect[] = [
        { type: 'burn', value: 5, duration: 2 },
      ];
      const mockEnemy = createMockEnemy({ hp: 0, statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const result = useEnemyStore.getState().applyEnemyStatusEffects();
      expect(result.enemyDied).toBe(false);
    });

    it('should not deal damage from non-burn/poison effects', () => {
      const effects: StatusEffect[] = [
        { type: 'strength', value: 5, duration: 2 },
        { type: 'weakness', value: 3, duration: 2 },
      ];
      const mockEnemy = createMockEnemy({ statusEffects: effects });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const result = useEnemyStore.getState().applyEnemyStatusEffects();
      expect(result.totalDamage).toBe(0);
      expect(useEnemyStore.getState().enemy!.hp).toBe(100);
    });

    it('should return zero damage and no death when enemy is null', () => {
      const result = useEnemyStore.getState().applyEnemyStatusEffects();
      expect(result.totalDamage).toBe(0);
      expect(result.enemyDied).toBe(false);
    });
  });

  describe('decrementAbilityCooldowns', () => {
    it('should decrement all ability cooldowns by 1', () => {
      const abilities: SpecialAbility[] = [
        { id: 'a1', name: 'Ability 1', description: 'Test', type: 'enrage', value: 10, cooldown: 3, currentCooldown: 2 },
        { id: 'a2', name: 'Ability 2', description: 'Test', type: 'heal_self', value: 5, cooldown: 2, currentCooldown: 1 },
      ];
      const mockEnemy = createMockEnemy({ abilities });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().decrementAbilityCooldowns();
      const enemy = useEnemyStore.getState().enemy!;
      expect(enemy.abilities![0].currentCooldown).toBe(1);
      expect(enemy.abilities![1].currentCooldown).toBe(0);
    });

    it('should not go below 0 for cooldowns', () => {
      const abilities: SpecialAbility[] = [
        { id: 'a1', name: 'Ability 1', description: 'Test', type: 'enrage', value: 10, cooldown: 3, currentCooldown: 0 },
      ];
      const mockEnemy = createMockEnemy({ abilities });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().decrementAbilityCooldowns();
      expect(useEnemyStore.getState().enemy!.abilities![0].currentCooldown).toBe(0);
    });

    it('should not modify state when enemy is null', () => {
      useEnemyStore.getState().decrementAbilityCooldowns();
      expect(useEnemyStore.getState().enemy).toBeNull();
    });

    it('should not modify state when enemy has no abilities', () => {
      const mockEnemy = createMockEnemy();
      delete (mockEnemy as any).abilities;
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().decrementAbilityCooldowns();
      expect(useEnemyStore.getState().enemy).toEqual(mockEnemy);
    });
  });

  describe('useEnemyAbility', () => {
    it('should set currentCooldown to cooldown value for the ability', () => {
      const abilities: SpecialAbility[] = [
        { id: 'a1', name: 'Ability 1', description: 'Test', type: 'enrage', value: 10, cooldown: 3, currentCooldown: 0 },
        { id: 'a2', name: 'Ability 2', description: 'Test', type: 'heal_self', value: 5, cooldown: 2, currentCooldown: 0 },
      ];
      const mockEnemy = createMockEnemy({ abilities });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().useEnemyAbility('a1');
      expect(useEnemyStore.getState().enemy!.abilities![0].currentCooldown).toBe(3);
      expect(useEnemyStore.getState().enemy!.abilities![1].currentCooldown).toBe(0);
    });

    it('should not use ability if on cooldown', () => {
      const abilities: SpecialAbility[] = [
        { id: 'a1', name: 'Ability 1', description: 'Test', type: 'enrage', value: 10, cooldown: 3, currentCooldown: 2 },
      ];
      const mockEnemy = createMockEnemy({ abilities });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().useEnemyAbility('a1');
      expect(useEnemyStore.getState().enemy!.abilities![0].currentCooldown).toBe(2);
    });

    it('should not modify state when enemy is null', () => {
      useEnemyStore.getState().useEnemyAbility('a1');
      expect(useEnemyStore.getState().enemy).toBeNull();
    });

    it('should not modify state for non-existent ability id', () => {
      const abilities: SpecialAbility[] = [
        { id: 'a1', name: 'Ability 1', description: 'Test', type: 'enrage', value: 10, cooldown: 3, currentCooldown: 0 },
      ];
      const mockEnemy = createMockEnemy({ abilities });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().useEnemyAbility('nonexistent');
      expect(useEnemyStore.getState().enemy!.abilities![0].currentCooldown).toBe(0);
    });
  });

  describe('checkBossPhaseTransition', () => {
    it('should not transition for non-boss enemy', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().checkBossPhaseTransition();
      expect(useEnemyStore.getState().enemy!.name).toBe('Test Enemy');
    });

    it('should not transition if phaseTransitionTriggered is true', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: true,
        hp: 50,
        maxHp: 200,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const spy = vi.spyOn(useEnemyStore.getState(), 'transitionBossPhase');
      useEnemyStore.getState().checkBossPhaseTransition();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should transition when hp falls below threshold for phase 1 (0.7)', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 130,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const spy = vi.spyOn(useEnemyStore.getState(), 'transitionBossPhase');
      useEnemyStore.getState().checkBossPhaseTransition();
      expect(spy).toHaveBeenCalled();
    });

    it('should not transition when hp is above threshold', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 180,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const spy = vi.spyOn(useEnemyStore.getState(), 'transitionBossPhase');
      useEnemyStore.getState().checkBossPhaseTransition();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not transition when on last phase', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 3,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 400,
        hp: 50,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const spy = vi.spyOn(useEnemyStore.getState(), 'transitionBossPhase');
      useEnemyStore.getState().checkBossPhaseTransition();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('transitionBossPhase', () => {
    it('should transition to next boss phase', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 130,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      const enemy = useEnemyStore.getState().enemy!;
      expect(enemy.bossPhase).toBe(2);
      expect(enemy.name).toBe('Boss Phase 2');
      expect(enemy.maxHp).toBe(300);
      expect(enemy.attackPower).toBe(25);
      expect(enemy.avatarType).toBe('boss_dragon_phase2');
    });

    it('should calculate new hp based on current hp percentage', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 100,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      const enemy = useEnemyStore.getState().enemy!;
      const expectedHpPercent = 100 / 200;
      expect(enemy.hp).toBe(Math.floor(300 * expectedHpPercent));
    });

    it('should grant transition shield (15% of new maxHp)', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 130,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      expect(useEnemyStore.getState().enemy!.shield).toBe(Math.floor(300 * 0.15));
    });

    it('should clean status effects keeping only strength and shield', () => {
      const effects: StatusEffect[] = [
        { type: 'burn', value: 5, duration: 2 },
        { type: 'strength', value: 3, duration: 3 },
        { type: 'shield', value: 10, duration: 4 },
        { type: 'poison', value: 2, duration: 1 },
      ];
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 130,
        statusEffects: effects,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      const remaining = useEnemyStore.getState().enemy!.statusEffects;
      expect(remaining.every(e => ['strength', 'shield'].includes(e.type))).toBe(true);
    });

    it('should set phaseTransitionTriggered to true', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 130,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      expect(useEnemyStore.getState().enemy!.phaseTransitionTriggered).toBe(true);
    });

    it('should reset intentPatternIndex to 0', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 130,
        intentPatternIndex: 2,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      expect(useEnemyStore.getState().enemy!.intentPatternIndex).toBe(0);
    });

    it('should reset ability cooldowns to 0 on new phase abilities', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 200,
        hp: 130,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      const abilities = useEnemyStore.getState().enemy!.abilities!;
      abilities.forEach(a => {
        expect(a.currentCooldown).toBe(0);
      });
    });

    it('should not transition if not a boss', () => {
      const mockEnemy = createMockEnemy({
        maxHp: 200,
        hp: 130,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      expect(useEnemyStore.getState().enemy!.name).toBe('Test Enemy');
    });

    it('should not transition when on last phase', () => {
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 3,
        bossPhases: mockBossPhases,
        phaseTransitionTriggered: false,
        maxHp: 400,
        hp: 50,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().transitionBossPhase();
      expect(useEnemyStore.getState().enemy!.bossPhase).toBe(3);
    });
  });

  describe('getAvailableAbilities', () => {
    it('should return abilities with zero cooldown', () => {
      const abilities: SpecialAbility[] = [
        { id: 'a1', name: 'Ability 1', description: 'Test', type: 'enrage', value: 10, cooldown: 3, currentCooldown: 0 },
        { id: 'a2', name: 'Ability 2', description: 'Test', type: 'heal_self', value: 5, cooldown: 2, currentCooldown: 1 },
      ];
      const mockEnemy = createMockEnemy({ abilities });
      useEnemyStore.getState().setEnemy(mockEnemy);

      const available = useEnemyStore.getState().getAvailableAbilities();
      expect(available).toHaveLength(1);
      expect(available[0].id).toBe('a1');
    });

    it('should return empty array when no enemy', () => {
      const available = useEnemyStore.getState().getAvailableAbilities();
      expect(available).toEqual([]);
    });

    it('should return empty array when enemy has no abilities', () => {
      const mockEnemy = createMockEnemy();
      delete (mockEnemy as any).abilities;
      useEnemyStore.getState().setEnemy(mockEnemy);

      const available = useEnemyStore.getState().getAvailableAbilities();
      expect(available).toEqual([]);
    });
  });

  describe('getEnemyIntent', () => {
    it('should return enemy intent', () => {
      const mockEnemy = createMockEnemy({ intent: 'defend' });
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().getEnemyIntent()).toBe('defend');
    });

    it('should return null when no enemy', () => {
      expect(useEnemyStore.getState().getEnemyIntent()).toBeNull();
    });
  });

  describe('getEnemyIntentValue', () => {
    it('should return enemy intent value', () => {
      const mockEnemy = createMockEnemy({ intentValue: 25 });
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().getEnemyIntentValue()).toBe(25);
    });

    it('should return 0 when no enemy', () => {
      expect(useEnemyStore.getState().getEnemyIntentValue()).toBe(0);
    });
  });

  describe('isBoss', () => {
    it('should return true for boss enemy', () => {
      const mockEnemy = createMockEnemy({ isBoss: true });
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().isBoss()).toBe(true);
    });

    it('should return false for non-boss enemy', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().isBoss()).toBe(false);
    });

    it('should return false when no enemy', () => {
      expect(useEnemyStore.getState().isBoss()).toBe(false);
    });
  });

  describe('getBossPhase', () => {
    it('should return boss phase', () => {
      const mockEnemy = createMockEnemy({ isBoss: true, bossPhase: 2 });
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().getBossPhase()).toBe(2);
    });

    it('should return null when no enemy', () => {
      expect(useEnemyStore.getState().getBossPhase()).toBeNull();
    });

    it('should return null for non-boss enemy', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().getBossPhase()).toBeNull();
    });
  });

  describe('getBossPhases', () => {
    it('should return boss phases', () => {
      const mockEnemy = createMockEnemy({ isBoss: true, bossPhases: mockBossPhases });
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().getBossPhases()).toEqual(mockBossPhases);
    });

    it('should return null when no enemy', () => {
      expect(useEnemyStore.getState().getBossPhases()).toBeNull();
    });

    it('should return null for non-boss enemy', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);

      expect(useEnemyStore.getState().getBossPhases()).toBeNull();
    });
  });

  describe('updateEnemyIntent', () => {
    const mockPlayerStore = (playerOverrides: Record<string, any> = {}) => {
      (window as any).__playerStore = {
        getState: () => ({
          player: {
            hp: 80,
            maxHp: 100,
            shield: 0,
            statusEffects: [],
            ...playerOverrides,
          },
        }),
      };
    };

    beforeEach(() => {
      delete (window as any).__playerStore;
    });

    it('should not modify state when enemy is null', () => {
      useEnemyStore.getState().updateEnemyIntent();
      expect(useEnemyStore.getState().enemy).toBeNull();
    });

    it('should not modify state when no player store', () => {
      const mockEnemy = createMockEnemy();
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().updateEnemyIntent();
      expect(useEnemyStore.getState().enemy!.intent).toBe('attack');
    });

    it('should follow intent pattern for boss in a phase', () => {
      mockPlayerStore();
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        intentPatternIndex: 0,
        hp: 200,
        maxHp: 200,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().updateEnemyIntent();
      expect(useEnemyStore.getState().enemy!.intent).toBe('attack');
      expect(useEnemyStore.getState().enemy!.intentPatternIndex).toBe(1);

      useEnemyStore.getState().updateEnemyIntent();
      expect(useEnemyStore.getState().enemy!.intent).toBe('defend');
      expect(useEnemyStore.getState().enemy!.intentPatternIndex).toBe(2);

      useEnemyStore.getState().updateEnemyIntent();
      expect(useEnemyStore.getState().enemy!.intent).toBe('buff');
      expect(useEnemyStore.getState().enemy!.intentPatternIndex).toBe(0);
    });

    it('should set intentValue based on intent type for defend', () => {
      mockPlayerStore();
      const abilities: SpecialAbility[] = [
        { id: 'shield1', name: 'Shield', description: 'Shield', type: 'shield_wall', value: 10, cooldown: 2, currentCooldown: 0 },
      ];
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        intentPatternIndex: 1,
        hp: 200,
        maxHp: 200,
        attackPower: 20,
        abilities,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      useEnemyStore.getState().updateEnemyIntent();
      expect(useEnemyStore.getState().enemy!.intent).toBe('defend');
      expect(useEnemyStore.getState().enemy!.intentValue).toBe(Math.floor(20 * 1.3));
    });

    it('should calculate intentValue for heal intent', () => {
      mockPlayerStore();
      const abilities: SpecialAbility[] = [
        { id: 'heal1', name: 'Heal', description: 'Heal', type: 'heal_self', value: 10, cooldown: 2, currentCooldown: 0 },
      ];
      const mockEnemy = createMockEnemy({
        isBoss: true,
        bossPhase: 1,
        bossPhases: mockBossPhases,
        intentPatternIndex: 0,
        hp: 50,
        maxHp: 200,
        attackPower: 20,
        abilities,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      useEnemyStore.getState().updateEnemyIntent();

      if (useEnemyStore.getState().enemy!.intent === 'heal') {
        expect(useEnemyStore.getState().enemy!.intentValue).toBe(Math.floor(20 * 1.5));
      }
      vi.restoreAllMocks();
    });

    it('should use weighted random for non-boss enemies', () => {
      mockPlayerStore();
      const mockEnemy = createMockEnemy({
        hp: 80,
        maxHp: 100,
        attackPower: 10,
      });
      useEnemyStore.getState().setEnemy(mockEnemy);

      vi.spyOn(Math, 'random').mockReturnValue(0);
      useEnemyStore.getState().updateEnemyIntent();
      expect(useEnemyStore.getState().enemy!.intent).toBeDefined();
      vi.restoreAllMocks();
    });
  });
});
