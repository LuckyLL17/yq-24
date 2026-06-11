import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUIStore } from '../uiStore';
import { useBattleStore } from '../battleStore';
import type { ComboSkill, ElementType } from '@/types/game';

vi.mock('./battleStore', () => ({
  useBattleStore: { getState: () => ({ setBattleRating: vi.fn() }) },
}));

const mockCombo: ComboSkill = {
  id: 'test_combo',
  elements: ['fire', 'water'] as [ElementType, ElementType],
  name: 'Test Combo',
  description: '',
  damage: 20,
  rarity: 'common',
  effectType: 'steamburst',
  category: 'attack',
  cooldown: 1,
  canUpgrade: false,
};

const initialState = useUIStore.getState();

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState(initialState, true);
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('has correct default values', () => {
      const state = useUIStore.getState();
      expect(state.isAnimating).toBe(false);
      expect(state.currentCombo).toBeNull();
      expect(state.showComboEffect).toBe(false);
      expect(state.showUpgradePanel).toBe(false);
      expect(state.showLevelComplete).toBe(false);
      expect(state.levelEssenceReward).toBe(0);
      expect(state.floatingTexts).toEqual([]);
      expect(state.enemyShaking).toBe(false);
      expect(state.playerShaking).toBe(false);
      expect(state.player2Shaking).toBe(false);
      expect(state.showDailyQuests).toBe(false);
      expect(state.showShop).toBe(false);
      expect(state.showMyCards).toBe(false);
      expect(state.showCollection).toBe(false);
      expect(state.showStreakBonus).toBe(false);
      expect(state.lastStreakBonus).toBe(0);
      expect(state.showBattleRating).toBe(false);
      expect(state.showAccountManager).toBe(false);
      expect(state.showSaveManager).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.selectedMyCardId).toBeNull();
    });
  });

  describe('setAnimating', () => {
    it('sets isAnimating to true', () => {
      useUIStore.getState().setAnimating(true);
      expect(useUIStore.getState().isAnimating).toBe(true);
    });

    it('sets isAnimating to false', () => {
      useUIStore.getState().setAnimating(true);
      useUIStore.getState().setAnimating(false);
      expect(useUIStore.getState().isAnimating).toBe(false);
    });
  });

  describe('showCombo / hideCombo', () => {
    it('showCombo sets currentCombo and showComboEffect', () => {
      useUIStore.getState().showCombo(mockCombo);
      const state = useUIStore.getState();
      expect(state.currentCombo).toEqual(mockCombo);
      expect(state.showComboEffect).toBe(true);
    });

    it('hideCombo clears currentCombo and showComboEffect', () => {
      useUIStore.getState().showCombo(mockCombo);
      useUIStore.getState().hideCombo();
      const state = useUIStore.getState();
      expect(state.currentCombo).toBeNull();
      expect(state.showComboEffect).toBe(false);
    });
  });

  describe('toggleUpgradePanel', () => {
    it('toggles showUpgradePanel from false to true', () => {
      useUIStore.getState().toggleUpgradePanel();
      expect(useUIStore.getState().showUpgradePanel).toBe(true);
    });

    it('toggles showUpgradePanel from true to false', () => {
      useUIStore.getState().toggleUpgradePanel();
      useUIStore.getState().toggleUpgradePanel();
      expect(useUIStore.getState().showUpgradePanel).toBe(false);
    });
  });

  describe('showLevelCompleteScreen / hideLevelCompleteScreen', () => {
    it('showLevelCompleteScreen sets showLevelComplete and levelEssenceReward', () => {
      useUIStore.getState().showLevelCompleteScreen(150);
      const state = useUIStore.getState();
      expect(state.showLevelComplete).toBe(true);
      expect(state.levelEssenceReward).toBe(150);
    });

    it('hideLevelCompleteScreen sets showLevelComplete to false', () => {
      useUIStore.getState().showLevelCompleteScreen(100);
      useUIStore.getState().hideLevelCompleteScreen();
      expect(useUIStore.getState().showLevelComplete).toBe(false);
    });
  });

  describe('addFloatingText / removeFloatingText', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('adds a floating text with correct type and value', () => {
      useUIStore.getState().addFloatingText('damage', 42, 'enemy');
      const texts = useUIStore.getState().floatingTexts;
      expect(texts).toHaveLength(1);
      expect(texts[0].type).toBe('damage');
      expect(texts[0].value).toBe(42);
    });

    it('positions enemy text correctly', () => {
      useUIStore.getState().addFloatingText('damage', 10, 'enemy');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.x).toBe(50);
      expect(text.y).toBe(25);
    });

    it('positions player text correctly', () => {
      useUIStore.getState().addFloatingText('heal', 5, 'player');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.x).toBe(50);
      expect(text.y).toBe(65);
    });

    it('removes floating text after timeout', () => {
      useUIStore.getState().addFloatingText('shield', 10, 'player');
      expect(useUIStore.getState().floatingTexts).toHaveLength(1);
      vi.advanceTimersByTime(1000);
      expect(useUIStore.getState().floatingTexts).toHaveLength(0);
    });

    it('removeFloatingText removes specific text by id', () => {
      useUIStore.getState().addFloatingText('damage', 10, 'enemy');
      useUIStore.getState().addFloatingText('heal', 5, 'player');
      const texts = useUIStore.getState().floatingTexts;
      expect(texts).toHaveLength(2);
      useUIStore.getState().removeFloatingText(texts[0].id);
      expect(useUIStore.getState().floatingTexts).toHaveLength(1);
      expect(useUIStore.getState().floatingTexts[0].type).toBe('heal');
    });
  });

  describe('addDamageFloatingText', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('adds light damage tier for damage < 10', () => {
      useUIStore.getState().addDamageFloatingText(5, 'enemy');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.tier).toBe('light');
      expect(text.isCrit).toBe(false);
    });

    it('adds normal damage tier for damage 10-19', () => {
      useUIStore.getState().addDamageFloatingText(15, 'enemy');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.tier).toBe('normal');
      expect(text.isCrit).toBe(false);
    });

    it('adds heavy damage tier for damage 20-34', () => {
      useUIStore.getState().addDamageFloatingText(25, 'enemy');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.tier).toBe('heavy');
      expect(text.isCrit).toBe(false);
    });

    it('adds critical damage tier for damage 35-49', () => {
      useUIStore.getState().addDamageFloatingText(40, 'enemy');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.tier).toBe('critical');
      expect(text.isCrit).toBe(true);
    });

    it('adds devastating damage tier for damage >= 50', () => {
      useUIStore.getState().addDamageFloatingText(55, 'enemy');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.tier).toBe('devastating');
      expect(text.isCrit).toBe(true);
    });

    it('includes element when provided', () => {
      useUIStore.getState().addDamageFloatingText(10, 'enemy', 'fire');
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.element).toBe('fire');
    });

    it('removes light damage text after 1200ms', () => {
      useUIStore.getState().addDamageFloatingText(5, 'enemy');
      vi.advanceTimersByTime(1199);
      expect(useUIStore.getState().floatingTexts).toHaveLength(1);
      vi.advanceTimersByTime(1);
      expect(useUIStore.getState().floatingTexts).toHaveLength(0);
    });

    it('removes critical damage text after 1500ms', () => {
      useUIStore.getState().addDamageFloatingText(35, 'enemy');
      vi.advanceTimersByTime(1499);
      expect(useUIStore.getState().floatingTexts).toHaveLength(1);
      vi.advanceTimersByTime(1);
      expect(useUIStore.getState().floatingTexts).toHaveLength(0);
    });

    it('removes devastating damage text after 1800ms', () => {
      useUIStore.getState().addDamageFloatingText(50, 'enemy');
      vi.advanceTimersByTime(1799);
      expect(useUIStore.getState().floatingTexts).toHaveLength(1);
      vi.advanceTimersByTime(1);
      expect(useUIStore.getState().floatingTexts).toHaveLength(0);
    });
  });

  describe('addComboFloatingText', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('adds combo floating text with correct values', () => {
      useUIStore.getState().addComboFloatingText(3, 1.5);
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.type).toBe('combo');
      expect(text.comboCount).toBe(3);
      expect(text.damageBonus).toBe(1.5);
    });

    it('sets showStreakBonus and lastStreakBonus', () => {
      useUIStore.getState().addComboFloatingText(5, 2.0);
      const state = useUIStore.getState();
      expect(state.showStreakBonus).toBe(true);
      expect(state.lastStreakBonus).toBe(2.0);
    });

    it('removes combo text and resets showStreakBonus after 1500ms', () => {
      useUIStore.getState().addComboFloatingText(2, 1.0);
      vi.advanceTimersByTime(1500);
      expect(useUIStore.getState().floatingTexts).toHaveLength(0);
      expect(useUIStore.getState().showStreakBonus).toBe(false);
    });
  });

  describe('addRatingFloatingText', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('adds rating floating text and sets showBattleRating', () => {
      useUIStore.getState().addRatingFloatingText('A');
      const state = useUIStore.getState();
      expect(state.showBattleRating).toBe(true);
      expect(state.floatingTexts[0].type).toBe('rating');
      expect(state.floatingTexts[0].rating).toBe('A');
    });

    it('calls battleStore.setBattleRating', () => {
      const setBattleRating = vi.fn();
      vi.mocked(useBattleStore).getState = () => ({ setBattleRating });
      useUIStore.getState().addRatingFloatingText('S');
      expect(setBattleRating).toHaveBeenCalledWith('S');
    });

    it('removes rating text after 3000ms', () => {
      useUIStore.getState().addRatingFloatingText('B');
      vi.advanceTimersByTime(3000);
      expect(useUIStore.getState().floatingTexts).toHaveLength(0);
    });
  });

  describe('setShaking', () => {
    it('sets playerShaking for player target', () => {
      useUIStore.getState().setShaking('player', true);
      expect(useUIStore.getState().playerShaking).toBe(true);
      expect(useUIStore.getState().enemyShaking).toBe(false);
      expect(useUIStore.getState().player2Shaking).toBe(false);
    });

    it('sets enemyShaking for enemy target', () => {
      useUIStore.getState().setShaking('enemy', true);
      expect(useUIStore.getState().enemyShaking).toBe(true);
      expect(useUIStore.getState().playerShaking).toBe(false);
      expect(useUIStore.getState().player2Shaking).toBe(false);
    });

    it('sets player2Shaking for player2 target', () => {
      useUIStore.getState().setShaking('player2', true);
      expect(useUIStore.getState().player2Shaking).toBe(true);
      expect(useUIStore.getState().playerShaking).toBe(false);
      expect(useUIStore.getState().enemyShaking).toBe(false);
    });

    it('can set shaking back to false', () => {
      useUIStore.getState().setShaking('player', true);
      expect(useUIStore.getState().playerShaking).toBe(true);
      useUIStore.getState().setShaking('player', false);
      expect(useUIStore.getState().playerShaking).toBe(false);
    });
  });

  describe('toggleDailyQuests / setShowDailyQuests', () => {
    it('toggles showDailyQuests', () => {
      useUIStore.getState().toggleDailyQuests();
      expect(useUIStore.getState().showDailyQuests).toBe(true);
      useUIStore.getState().toggleDailyQuests();
      expect(useUIStore.getState().showDailyQuests).toBe(false);
    });

    it('setShowDailyQuests sets directly', () => {
      useUIStore.getState().setShowDailyQuests(true);
      expect(useUIStore.getState().showDailyQuests).toBe(true);
      useUIStore.getState().setShowDailyQuests(false);
      expect(useUIStore.getState().showDailyQuests).toBe(false);
    });
  });

  describe('toggleShop / setShowShop', () => {
    it('toggles showShop', () => {
      useUIStore.getState().toggleShop();
      expect(useUIStore.getState().showShop).toBe(true);
      useUIStore.getState().toggleShop();
      expect(useUIStore.getState().showShop).toBe(false);
    });

    it('setShowShop sets directly', () => {
      useUIStore.getState().setShowShop(true);
      expect(useUIStore.getState().showShop).toBe(true);
      useUIStore.getState().setShowShop(false);
      expect(useUIStore.getState().showShop).toBe(false);
    });
  });

  describe('toggleMyCards / setShowMyCards', () => {
    it('toggles showMyCards', () => {
      useUIStore.getState().toggleMyCards();
      expect(useUIStore.getState().showMyCards).toBe(true);
      useUIStore.getState().toggleMyCards();
      expect(useUIStore.getState().showMyCards).toBe(false);
    });

    it('setShowMyCards sets directly', () => {
      useUIStore.getState().setShowMyCards(true);
      expect(useUIStore.getState().showMyCards).toBe(true);
      useUIStore.getState().setShowMyCards(false);
      expect(useUIStore.getState().showMyCards).toBe(false);
    });
  });

  describe('toggleCollection / setShowCollection', () => {
    it('toggles showCollection', () => {
      useUIStore.getState().toggleCollection();
      expect(useUIStore.getState().showCollection).toBe(true);
      useUIStore.getState().toggleCollection();
      expect(useUIStore.getState().showCollection).toBe(false);
    });

    it('setShowCollection sets directly', () => {
      useUIStore.getState().setShowCollection(true);
      expect(useUIStore.getState().showCollection).toBe(true);
      useUIStore.getState().setShowCollection(false);
      expect(useUIStore.getState().showCollection).toBe(false);
    });
  });

  describe('toggleAccountManager / setShowAccountManager', () => {
    it('toggles showAccountManager', () => {
      useUIStore.getState().toggleAccountManager();
      expect(useUIStore.getState().showAccountManager).toBe(true);
      useUIStore.getState().toggleAccountManager();
      expect(useUIStore.getState().showAccountManager).toBe(false);
    });

    it('setShowAccountManager sets directly', () => {
      useUIStore.getState().setShowAccountManager(true);
      expect(useUIStore.getState().showAccountManager).toBe(true);
      useUIStore.getState().setShowAccountManager(false);
      expect(useUIStore.getState().showAccountManager).toBe(false);
    });
  });

  describe('toggleSaveManager / setShowSaveManager', () => {
    it('toggles showSaveManager', () => {
      useUIStore.getState().toggleSaveManager();
      expect(useUIStore.getState().showSaveManager).toBe(true);
      useUIStore.getState().toggleSaveManager();
      expect(useUIStore.getState().showSaveManager).toBe(false);
    });

    it('setShowSaveManager sets directly', () => {
      useUIStore.getState().setShowSaveManager(true);
      expect(useUIStore.getState().showSaveManager).toBe(true);
      useUIStore.getState().setShowSaveManager(false);
      expect(useUIStore.getState().showSaveManager).toBe(false);
    });
  });

  describe('showBattleRatingEffect', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      delete (window as any).__battleStore;
    });

    it('returns D rating when no __battleStore', () => {
      useUIStore.getState().showBattleRatingEffect();
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.rating).toBe('D');
    });

    it('calculates S rating for high stats', () => {
      (window as any).__battleStore = {
        getState: () => ({
          maxStreak: 10,
          totalDamageDealt: 1000,
          turn: 1,
          difficulty: 'normal',
          highestHitDamage: 50,
        }),
      };
      useUIStore.getState().showBattleRatingEffect();
      const text = useUIStore.getState().floatingTexts[0];
      expect(text.rating).toBe('S');
    });

    it('calculates rating with difficulty multiplier', () => {
      (window as any).__battleStore = {
        getState: () => ({
          maxStreak: 5,
          totalDamageDealt: 500,
          turn: 5,
          difficulty: 'easy',
          highestHitDamage: 30,
        }),
      };
      useUIStore.getState().showBattleRatingEffect();
      const text = useUIStore.getState().floatingTexts[0];
      expect(['S', 'A', 'B', 'C', 'D']).toContain(text.rating);
    });

    it('shows battle rating and adds floating text', () => {
      useUIStore.getState().showBattleRatingEffect();
      const state = useUIStore.getState();
      expect(state.showBattleRating).toBe(true);
      expect(state.floatingTexts).toHaveLength(1);
      expect(state.floatingTexts[0].type).toBe('rating');
    });
  });

  describe('hideBattleRating', () => {
    it('hides battle rating and calls setBattleRating with null', () => {
      const setBattleRating = vi.fn();
      vi.mocked(useBattleStore).getState = () => ({ setBattleRating });
      useUIStore.setState({ showBattleRating: true });
      useUIStore.getState().hideBattleRating();
      expect(useUIStore.getState().showBattleRating).toBe(false);
      expect(setBattleRating).toHaveBeenCalledWith(null);
    });
  });

  describe('pauseGame / resumeGame', () => {
    afterEach(() => {
      delete (window as any).__battleStore;
    });

    it('pauseGame does not pause when phase is not battle', () => {
      (window as any).__battleStore = {
        getState: () => ({ phase: 'idle' }),
      };
      useUIStore.getState().pauseGame();
      expect(useUIStore.getState().isPaused).toBe(false);
    });

    it('pauseGame pauses when phase is battle', () => {
      (window as any).__battleStore = {
        getState: () => ({ phase: 'battle' }),
      };
      useUIStore.getState().pauseGame();
      expect(useUIStore.getState().isPaused).toBe(true);
    });

    it('pauseGame does not pause when __battleStore is missing', () => {
      useUIStore.getState().pauseGame();
      expect(useUIStore.getState().isPaused).toBe(false);
    });

    it('resumeGame sets isPaused to false', () => {
      useUIStore.setState({ isPaused: true });
      useUIStore.getState().resumeGame();
      expect(useUIStore.getState().isPaused).toBe(false);
    });
  });

  describe('selectMyCard', () => {
    it('sets selectedMyCardId to a card id', () => {
      useUIStore.getState().selectMyCard('card_1');
      expect(useUIStore.getState().selectedMyCardId).toBe('card_1');
    });

    it('sets selectedMyCardId to null', () => {
      useUIStore.getState().selectMyCard('card_1');
      useUIStore.getState().selectMyCard(null);
      expect(useUIStore.getState().selectedMyCardId).toBeNull();
    });
  });
});
