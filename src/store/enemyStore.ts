import { create } from 'zustand';
import type { Enemy, StatusEffect, BossIntentType, SpecialAbility, BossPhaseData, Player } from '@/types/game';
import type { EnemyState, EnemyActions } from '@/types/store';
import { createEnemy as createEnemyFromData, ENEMIES, DIFFICULTY_CONFIG } from '@/data/gameData';

export const useEnemyStore = create<EnemyState & EnemyActions>((set, get) => ({
  enemy: null,

  createEnemy: (enemyIndex: number, difficultyMultiplier: number = 1): Enemy => {
    const enemy = createEnemyFromData(enemyIndex);
    enemy.maxHp = Math.floor(enemy.maxHp * difficultyMultiplier);
    enemy.hp = enemy.maxHp;
    enemy.attackPower = Math.floor(enemy.attackPower * difficultyMultiplier);
    enemy.intentValue = Math.floor(enemy.intentValue * difficultyMultiplier);
    
    if (enemy.abilities && enemy.abilities.length > 0) {
      enemy.abilities = enemy.abilities.map(a => ({
        ...a,
        value: Math.floor(a.value * difficultyMultiplier),
      }));
    }
    
    return enemy;
  },

  setEnemy: (enemy: Enemy | null) => {
    set({ enemy });
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
      const player = (window as any).__playerStore?.getState?.()?.player;
      if (!player) return state;

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

  updateEnemyHp: (hp: number) => {
    set((state) => {
      if (!state.enemy) return state;
      return {
        enemy: {
          ...state.enemy,
          hp: Math.max(0, hp),
        },
      };
    });
  },

  updateEnemyShield: (shield: number) => {
    set((state) => {
      if (!state.enemy) return state;
      return {
        enemy: {
          ...state.enemy,
          shield: Math.max(0, shield),
        },
      };
    });
  },

  addEnemyStatusEffect: (effect: StatusEffect) => {
    set((state) => {
      if (!state.enemy) return state;
      const newEffects = [...state.enemy.statusEffects];
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
        enemy: {
          ...state.enemy,
          statusEffects: newEffects,
        },
      };
    });
  },

  applyEnemyStatusEffects: (): { totalDamage: number; enemyDied: boolean } => {
    let totalDamage = 0;
    let enemyDied = false;
    const previousHp = get().enemy?.hp ?? 0;

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
      }

      if (newEnemyHp <= 0 && previousHp > 0) {
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

    return { totalDamage, enemyDied };
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

  useEnemyAbility: (abilityId: string) => {
    set((state) => {
      if (!state.enemy) return state;

      const ability = state.enemy.abilities?.find(a => a.id === abilityId);
      if (!ability || (ability.currentCooldown ?? 0) > 0) return state;

      const updatedAbilities = state.enemy.abilities?.map(a => 
        a.id === abilityId ? { ...a, currentCooldown: a.cooldown } : a
      );

      return {
        enemy: {
          ...state.enemy,
          abilities: updatedAbilities,
        },
      };
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
      };
    });

    setTimeout(() => {
      set((state) => ({
        enemy: state.enemy ? { ...state.enemy, phaseTransitionTriggered: false } : state.enemy,
      }));
    }, 2000);
  },

  getAvailableAbilities: (): SpecialAbility[] => {
    const { enemy } = get();
    return enemy?.abilities?.filter(a => (a.currentCooldown ?? 0) <= 0) || [];
  },

  getEnemyIntent: (): BossIntentType | null => {
    return get().enemy?.intent || null;
  },

  getEnemyIntentValue: (): number => {
    return get().enemy?.intentValue || 0;
  },

  isBoss: (): boolean => {
    return get().enemy?.isBoss ?? false;
  },

  getBossPhase: (): number | null => {
    return get().enemy?.bossPhase ?? null;
  },

  getBossPhases: (): BossPhaseData[] | null => {
    return get().enemy?.bossPhases ?? null;
  },
}));
