import { create } from 'zustand';
import type { ComboSkill, BattleRating, DamageTier, ElementType, FloatingText } from '@/types/game';
import type { UIState, UIActions, BattleStore } from '@/types/store';
import { useBattleStore } from './battleStore';

const getStores = () => ({
  battleStore: useBattleStore.getState() as BattleStore,
});

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  isAnimating: false,
  currentCombo: null,
  showComboEffect: false,
  showUpgradePanel: false,
  showLevelComplete: false,
  levelEssenceReward: 0,
  floatingTexts: [],
  enemyShaking: false,
  playerShaking: false,
  player2Shaking: false,
  showDailyQuests: false,
  showShop: false,
  showMyCards: false,
  showCollection: false,
  showStreakBonus: false,
  lastStreakBonus: 0,
  showBattleRating: false,
  showAccountManager: false,
  showSaveManager: false,
  isPaused: false,
  selectedMyCardId: null,

  setAnimating: (value: boolean) => {
    set({ isAnimating: value });
  },

  showCombo: (combo: ComboSkill) => {
    set({ currentCombo: combo, showComboEffect: true });
  },

  hideCombo: () => {
    set({ showComboEffect: false, currentCombo: null });
  },

  toggleUpgradePanel: () => {
    set((state) => ({ showUpgradePanel: !state.showUpgradePanel }));
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

  addFloatingText: (type: 'damage' | 'heal' | 'shield', value: number, target: 'player' | 'enemy') => {
    const id = `ft_${Date.now()}_${Math.random()}`;
    set((state) => ({
      floatingTexts: [...state.floatingTexts, {
        id,
        value,
        type,
        x: target === 'enemy' ? 50 : 50,
        y: target === 'enemy' ? 25 : 65,
      } as FloatingText],
    }));
    setTimeout(() => {
      get().removeFloatingText(id);
    }, 1000);
  },

  addDamageFloatingText: (damage: number, target: 'player' | 'enemy', element?: ElementType) => {
    const calculateDamageTier = (d: number): DamageTier => {
      if (d >= 50) return 'devastating';
      if (d >= 35) return 'critical';
      if (d >= 20) return 'heavy';
      if (d >= 10) return 'normal';
      return 'light';
    };
    const tier = calculateDamageTier(damage);
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
      } as FloatingText],
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
      } as FloatingText],
      showStreakBonus: true,
      lastStreakBonus: damageBonus,
    }));
    
    setTimeout(() => {
      get().removeFloatingText(id);
      set({ showStreakBonus: false });
    }, 1500);
  },

  addRatingFloatingText: (rating: BattleRating) => {
    const id = `ft_rating_${Date.now()}_${Math.random()}`;
    const { battleStore } = getStores();
    battleStore.setBattleRating(rating);
    set((state) => ({
      showBattleRating: true,
      floatingTexts: [...state.floatingTexts, {
        id,
        value: 0,
        type: 'rating',
        x: 50,
        y: 40,
        rating,
      } as FloatingText],
    }));
    
    setTimeout(() => {
      get().removeFloatingText(id);
    }, 3000);
  },

  removeFloatingText: (id: string) => {
    set((state) => ({
      floatingTexts: state.floatingTexts.filter((t) => t.id !== id),
    }));
  },

  setShaking: (target: 'player' | 'enemy' | 'player2', value: boolean) => {
    if (target === 'player') {
      set({ playerShaking: value });
    } else if (target === 'enemy') {
      set({ enemyShaking: value });
    } else {
      set({ player2Shaking: value });
    }
  },

  toggleDailyQuests: () => {
    set((state) => ({ showDailyQuests: !state.showDailyQuests }));
  },

  setShowDailyQuests: (show: boolean) => {
    set({ showDailyQuests: show });
  },

  toggleShop: () => {
    set((state) => ({ showShop: !state.showShop }));
  },

  setShowShop: (show: boolean) => {
    set({ showShop: show });
  },

  toggleMyCards: () => {
    set((state) => ({ showMyCards: !state.showMyCards }));
  },

  setShowMyCards: (show: boolean) => {
    set({ showMyCards: show });
  },

  toggleCollection: () => {
    set((state) => ({ showCollection: !state.showCollection }));
  },

  setShowCollection: (show: boolean) => {
    set({ showCollection: show });
  },

  showBattleRatingEffect: () => {
    const calculateBattleRating = (): BattleRating => {
      const battleStore = (window as any).__battleStore;
      if (!battleStore) return 'D';
      const state = battleStore.getState();
      const { maxStreak, totalDamageDealt, turn, difficulty, highestHitDamage } = state;
      
      const DIFFICULTY_CONFIG: Record<string, { essenceMultiplier: number }> = {
        easy: { essenceMultiplier: 0.8 },
        normal: { essenceMultiplier: 1.0 },
        hard: { essenceMultiplier: 1.3 },
        nightmare: { essenceMultiplier: 1.6 },
      };
      
      let score = 0;
      score += Math.min(maxStreak * 10, 100);
      score += Math.min(totalDamageDealt / 10, 100);
      score += Math.min(highestHitDamage, 50);
      const turnBonus = Math.max(0, 50 - turn * 2);
      score += turnBonus;
      const difficultyMultiplier = DIFFICULTY_CONFIG[difficulty]?.essenceMultiplier ?? 1;
      score = Math.floor(score * difficultyMultiplier);
      
      if (score >= 220) return 'S';
      if (score >= 170) return 'A';
      if (score >= 120) return 'B';
      if (score >= 70) return 'C';
      return 'D';
    };
    
    const rating = calculateBattleRating();
    get().addRatingFloatingText(rating);
  },

  hideBattleRating: () => {
    const { battleStore } = getStores();
    battleStore.setBattleRating(null);
    set({ showBattleRating: false });
  },

  toggleAccountManager: () => {
    set((state) => ({ showAccountManager: !state.showAccountManager }));
  },

  setShowAccountManager: (show: boolean) => {
    set({ showAccountManager: show });
  },

  toggleSaveManager: () => {
    set((state) => ({ showSaveManager: !state.showSaveManager }));
  },

  setShowSaveManager: (show: boolean) => {
    set({ showSaveManager: show });
  },

  pauseGame: () => {
    const battleStore = (window as any).__battleStore;
    if (battleStore?.getState?.()?.phase !== 'battle') return;
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  selectMyCard: (cardId: string | null) => {
    set({ selectedMyCardId: cardId });
  },
}));
