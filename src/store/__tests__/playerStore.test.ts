import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '../playerStore';
import type { Card, StatusEffect, Player } from '@/types/game';

const mockCard1: Card = { id: 'c1', element: 'fire', name: 'Test1', description: '', power: 4, rarity: 'common', manaCost: 1 };
const mockCard2: Card = { id: 'c2', element: 'water', name: 'Test2', description: '', power: 3, rarity: 'common', manaCost: 2 };
const mockCard3: Card = { id: 'c3', element: 'earth', name: 'Test3', description: '', power: 5, rarity: 'rare', manaCost: 3 };
const mockCard4: Card = { id: 'c4', element: 'wind', name: 'Test4', description: '', power: 6, rarity: 'epic', manaCost: 4 };

const createMockPlayer = (overrides: Partial<Player> = {}): Player => ({
  name: '元素法师',
  maxHp: 100,
  hp: 100,
  shield: 0,
  statusEffects: [],
  image: '🧙‍♂️',
  mana: 3,
  maxMana: 3,
  hand: [mockCard1, mockCard2],
  deck: [mockCard3, mockCard4],
  selectedCards: [],
  comboCooldowns: [],
  comboLevels: [],
  ...overrides,
});

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      player: createMockPlayer(),
      player2: null,
      currentDuoPlayer: 1,
    });
  });

  describe('initial state', () => {
    it('should have player initialized', () => {
      const { player } = usePlayerStore.getState();
      expect(player).toBeDefined();
      expect(player.name).toBe('元素法师');
      expect(player.hp).toBe(100);
      expect(player.maxHp).toBe(100);
      expect(player.mana).toBe(3);
      expect(player.maxMana).toBe(3);
      expect(player.shield).toBe(0);
      expect(player.selectedCards).toEqual([]);
      expect(player.statusEffects).toEqual([]);
      expect(player.comboCooldowns).toEqual([]);
      expect(player.comboLevels).toEqual([]);
    });

    it('should have player2 as null', () => {
      expect(usePlayerStore.getState().player2).toBeNull();
    });

    it('should have currentDuoPlayer as 1', () => {
      expect(usePlayerStore.getState().currentDuoPlayer).toBe(1);
    });
  });

  describe('initPlayer', () => {
    it('should return a new Player object', () => {
      const newPlayer = usePlayerStore.getState().initPlayer();
      expect(newPlayer).toBeDefined();
      expect(newPlayer.name).toBe('元素法师');
      expect(newPlayer.hp).toBe(100);
      expect(newPlayer.maxHp).toBe(100);
      expect(newPlayer.mana).toBe(3);
      expect(newPlayer.maxMana).toBe(3);
      expect(newPlayer.hand.length).toBe(5);
      expect(newPlayer.selectedCards).toEqual([]);
      expect(newPlayer.comboCooldowns).toEqual([]);
      expect(newPlayer.comboLevels).toEqual([]);
    });

    it('should not mutate current state', () => {
      const before = usePlayerStore.getState().player;
      usePlayerStore.getState().initPlayer();
      expect(usePlayerStore.getState().player).toBe(before);
    });
  });

  describe('resetPlayerState', () => {
    it('should reset player to a fresh state', () => {
      usePlayerStore.setState({ player: createMockPlayer({ hp: 10, shield: 5, mana: 0 }) });
      usePlayerStore.getState().resetPlayerState();
      const { player } = usePlayerStore.getState();
      expect(player.hp).toBe(100);
      expect(player.shield).toBe(0);
      expect(player.mana).toBe(3);
      expect(player.selectedCards).toEqual([]);
    });
  });

  describe('setPlayer', () => {
    it('should set the player state', () => {
      const customPlayer = createMockPlayer({ hp: 50, name: 'Custom' });
      usePlayerStore.getState().setPlayer(customPlayer);
      const { player } = usePlayerStore.getState();
      expect(player.hp).toBe(50);
      expect(player.name).toBe('Custom');
    });
  });

  describe('setPlayer2', () => {
    it('should set player2', () => {
      const p2 = createMockPlayer({ name: 'Player2' });
      usePlayerStore.getState().setPlayer2(p2);
      expect(usePlayerStore.getState().player2).not.toBeNull();
      expect(usePlayerStore.getState().player2!.name).toBe('Player2');
    });

    it('should set player2 to null', () => {
      const p2 = createMockPlayer({ name: 'Player2' });
      usePlayerStore.getState().setPlayer2(p2);
      usePlayerStore.getState().setPlayer2(null);
      expect(usePlayerStore.getState().player2).toBeNull();
    });
  });

  describe('selectCard', () => {
    it('should add a card to selectedCards', () => {
      usePlayerStore.getState().selectCard(mockCard1);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(1);
      expect(usePlayerStore.getState().player.selectedCards[0].id).toBe('c1');
    });

    it('should add two cards to selectedCards', () => {
      usePlayerStore.getState().selectCard(mockCard1);
      usePlayerStore.getState().selectCard(mockCard2);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(2);
    });

    it('should not add more than 2 cards', () => {
      usePlayerStore.getState().selectCard(mockCard1);
      usePlayerStore.getState().selectCard(mockCard2);
      usePlayerStore.getState().selectCard(mockCard3);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(2);
    });

    it('should not add duplicate cards', () => {
      usePlayerStore.getState().selectCard(mockCard1);
      usePlayerStore.getState().selectCard(mockCard1);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(1);
    });

    it('should not add card if total mana cost exceeds current mana', () => {
      usePlayerStore.setState({ player: createMockPlayer({ mana: 2 }) });
      usePlayerStore.getState().selectCard(mockCard2);
      usePlayerStore.getState().selectCard(mockCard3);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(1);
    });

    it('should add card when total mana cost equals current mana', () => {
      usePlayerStore.setState({ player: createMockPlayer({ mana: 3 }) });
      usePlayerStore.getState().selectCard(mockCard1);
      usePlayerStore.getState().selectCard(mockCard2);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(2);
    });
  });

  describe('deselectCard', () => {
    it('should remove a card by id', () => {
      usePlayerStore.getState().selectCard(mockCard1);
      usePlayerStore.getState().selectCard(mockCard2);
      usePlayerStore.getState().deselectCard('c1');
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(1);
      expect(usePlayerStore.getState().player.selectedCards[0].id).toBe('c2');
    });

    it('should handle deselecting non-existent card id', () => {
      usePlayerStore.getState().selectCard(mockCard1);
      usePlayerStore.getState().deselectCard('nonexistent');
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(1);
    });

    it('should handle deselecting from empty selectedCards', () => {
      usePlayerStore.getState().deselectCard('c1');
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(0);
    });
  });

  describe('clearSelectedCards', () => {
    it('should clear all selected cards', () => {
      usePlayerStore.getState().selectCard(mockCard1);
      usePlayerStore.getState().selectCard(mockCard2);
      usePlayerStore.getState().clearSelectedCards();
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(0);
    });

    it('should handle clearing when already empty', () => {
      usePlayerStore.getState().clearSelectedCards();
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(0);
    });
  });

  describe('drawCards', () => {
    it('should draw a card from deck to hand', () => {
      const deckSize = usePlayerStore.getState().player.deck.length;
      const handSize = usePlayerStore.getState().player.hand.length;
      usePlayerStore.getState().drawCards(1);
      expect(usePlayerStore.getState().player.hand.length).toBe(handSize + 1);
      expect(usePlayerStore.getState().player.deck.length).toBe(deckSize - 1);
    });

    it('should draw multiple cards', () => {
      const handSize = usePlayerStore.getState().player.hand.length;
      usePlayerStore.getState().drawCards(2);
      expect(usePlayerStore.getState().player.hand.length).toBe(handSize + 2);
    });

    it('should handle drawing with empty deck by creating fresh deck', () => {
      usePlayerStore.setState({ player: createMockPlayer({ deck: [], hand: [] }) });
      usePlayerStore.getState().drawCards(1);
      expect(usePlayerStore.getState().player.hand.length).toBe(1);
    });

    it('should not draw when hand is at 10 cards', () => {
      const fullHand: Card[] = Array.from({ length: 10 }, (_, i) => ({
        id: `full_${i}`,
        element: 'fire',
        name: `Full${i}`,
        description: '',
        power: 1,
        rarity: 'common',
        manaCost: 1,
      }));
      usePlayerStore.setState({ player: createMockPlayer({ hand: fullHand, deck: [mockCard3] }) });
      const handSizeBefore = usePlayerStore.getState().player.hand.length;
      usePlayerStore.getState().drawCards(1);
      expect(usePlayerStore.getState().player.hand.length).toBe(handSizeBefore);
    });

    it('should draw 0 cards when count is 0', () => {
      const handSize = usePlayerStore.getState().player.hand.length;
      usePlayerStore.getState().drawCards(0);
      expect(usePlayerStore.getState().player.hand.length).toBe(handSize);
    });
  });

  describe('takeDamage', () => {
    it('should reduce hp by damage amount', () => {
      usePlayerStore.getState().takeDamage(30);
      expect(usePlayerStore.getState().player.hp).toBe(70);
    });

    it('should not reduce hp below 0', () => {
      usePlayerStore.getState().takeDamage(150);
      expect(usePlayerStore.getState().player.hp).toBe(0);
    });

    it('should handle 0 damage', () => {
      usePlayerStore.getState().takeDamage(0);
      expect(usePlayerStore.getState().player.hp).toBe(100);
    });
  });

  describe('heal', () => {
    it('should increase hp by heal amount', () => {
      usePlayerStore.setState({ player: createMockPlayer({ hp: 50 }) });
      usePlayerStore.getState().heal(20);
      expect(usePlayerStore.getState().player.hp).toBe(70);
    });

    it('should not heal past maxHp', () => {
      usePlayerStore.setState({ player: createMockPlayer({ hp: 90 }) });
      usePlayerStore.getState().heal(20);
      expect(usePlayerStore.getState().player.hp).toBe(100);
    });

    it('should heal to exactly maxHp', () => {
      usePlayerStore.setState({ player: createMockPlayer({ hp: 80 }) });
      usePlayerStore.getState().heal(20);
      expect(usePlayerStore.getState().player.hp).toBe(100);
    });
  });

  describe('addShield', () => {
    it('should add shield amount', () => {
      usePlayerStore.getState().addShield(10);
      expect(usePlayerStore.getState().player.shield).toBe(10);
    });

    it('should stack shield on existing shield', () => {
      usePlayerStore.setState({ player: createMockPlayer({ shield: 5 }) });
      usePlayerStore.getState().addShield(10);
      expect(usePlayerStore.getState().player.shield).toBe(15);
    });
  });

  describe('addStatusEffect', () => {
    it('should add a new status effect', () => {
      const effect: StatusEffect = { type: 'burn', value: 5, duration: 3 };
      usePlayerStore.getState().addStatusEffect(effect);
      expect(usePlayerStore.getState().player.statusEffects).toHaveLength(1);
      expect(usePlayerStore.getState().player.statusEffects[0].type).toBe('burn');
    });

    it('should merge existing status effect of same type', () => {
      const effect1: StatusEffect = { type: 'burn', value: 5, duration: 3 };
      const effect2: StatusEffect = { type: 'burn', value: 3, duration: 2 };
      usePlayerStore.getState().addStatusEffect(effect1);
      usePlayerStore.getState().addStatusEffect(effect2);
      const effects = usePlayerStore.getState().player.statusEffects;
      expect(effects).toHaveLength(1);
      expect(effects[0].value).toBe(8);
      expect(effects[0].duration).toBe(3);
    });

    it('should use new duration if it is greater when merging', () => {
      const effect1: StatusEffect = { type: 'burn', value: 5, duration: 2 };
      const effect2: StatusEffect = { type: 'burn', value: 3, duration: 5 };
      usePlayerStore.getState().addStatusEffect(effect1);
      usePlayerStore.getState().addStatusEffect(effect2);
      const effects = usePlayerStore.getState().player.statusEffects;
      expect(effects).toHaveLength(1);
      expect(effects[0].value).toBe(8);
      expect(effects[0].duration).toBe(5);
    });

    it('should add multiple different status effects', () => {
      const effect1: StatusEffect = { type: 'burn', value: 5, duration: 3 };
      const effect2: StatusEffect = { type: 'freeze', value: 2, duration: 1 };
      usePlayerStore.getState().addStatusEffect(effect1);
      usePlayerStore.getState().addStatusEffect(effect2);
      expect(usePlayerStore.getState().player.statusEffects).toHaveLength(2);
    });
  });

  describe('applyPlayerStatusEffects', () => {
    it('should decrement duration of all effects', () => {
      const effect1: StatusEffect = { type: 'burn', value: 5, duration: 3 };
      const effect2: StatusEffect = { type: 'freeze', value: 2, duration: 1 };
      usePlayerStore.setState({ player: createMockPlayer({ statusEffects: [effect1, effect2] }) });
      usePlayerStore.getState().applyPlayerStatusEffects();
      const effects = usePlayerStore.getState().player.statusEffects;
      expect(effects).toHaveLength(1);
      expect(effects[0].type).toBe('burn');
      expect(effects[0].duration).toBe(2);
    });

    it('should remove expired effects', () => {
      const effect: StatusEffect = { type: 'burn', value: 5, duration: 1 };
      usePlayerStore.setState({ player: createMockPlayer({ statusEffects: [effect] }) });
      usePlayerStore.getState().applyPlayerStatusEffects();
      expect(usePlayerStore.getState().player.statusEffects).toHaveLength(0);
    });

    it('should handle empty status effects', () => {
      usePlayerStore.setState({ player: createMockPlayer({ statusEffects: [] }) });
      usePlayerStore.getState().applyPlayerStatusEffects();
      expect(usePlayerStore.getState().player.statusEffects).toHaveLength(0);
    });
  });

  describe('consumeMana', () => {
    it('should reduce mana by amount', () => {
      usePlayerStore.getState().consumeMana(2);
      expect(usePlayerStore.getState().player.mana).toBe(1);
    });

    it('should allow mana to go below zero', () => {
      usePlayerStore.getState().consumeMana(5);
      expect(usePlayerStore.getState().player.mana).toBe(-2);
    });
  });

  describe('resetMana', () => {
    it('should reset mana to maxMana', () => {
      usePlayerStore.setState({ player: createMockPlayer({ mana: 0, maxMana: 3 }) });
      usePlayerStore.getState().resetMana();
      expect(usePlayerStore.getState().player.mana).toBe(3);
    });

    it('should reset to custom maxMana', () => {
      usePlayerStore.setState({ player: createMockPlayer({ mana: 0, maxMana: 5 }) });
      usePlayerStore.getState().resetMana();
      expect(usePlayerStore.getState().player.mana).toBe(5);
    });
  });

  describe('resetShield', () => {
    it('should reset shield to 0', () => {
      usePlayerStore.setState({ player: createMockPlayer({ shield: 15 }) });
      usePlayerStore.getState().resetShield();
      expect(usePlayerStore.getState().player.shield).toBe(0);
    });

    it('should handle already zero shield', () => {
      usePlayerStore.getState().resetShield();
      expect(usePlayerStore.getState().player.shield).toBe(0);
    });
  });

  describe('setComboCooldown', () => {
    it('should add a new combo cooldown', () => {
      usePlayerStore.getState().setComboCooldown('fire_wind', 3);
      const cds = usePlayerStore.getState().player.comboCooldowns;
      expect(cds).toHaveLength(1);
      expect(cds[0].comboId).toBe('fire_wind');
      expect(cds[0].remaining).toBe(3);
    });

    it('should update existing combo cooldown', () => {
      usePlayerStore.getState().setComboCooldown('fire_wind', 3);
      usePlayerStore.getState().setComboCooldown('fire_wind', 5);
      const cds = usePlayerStore.getState().player.comboCooldowns;
      expect(cds).toHaveLength(1);
      expect(cds[0].remaining).toBe(5);
    });
  });

  describe('decrementComboCooldowns', () => {
    it('should decrement remaining cooldowns', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [
            { comboId: 'fire_wind', remaining: 3 },
            { comboId: 'water_earth', remaining: 1 },
          ],
        }),
      });
      usePlayerStore.getState().decrementComboCooldowns();
      const cds = usePlayerStore.getState().player.comboCooldowns;
      expect(cds).toHaveLength(1);
      expect(cds[0].remaining).toBe(2);
      expect(cds[0].comboId).toBe('fire_wind');
    });

    it('should remove expired cooldowns', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [{ comboId: 'fire_wind', remaining: 1 }],
        }),
      });
      usePlayerStore.getState().decrementComboCooldowns();
      expect(usePlayerStore.getState().player.comboCooldowns).toHaveLength(0);
    });

    it('should handle empty cooldowns', () => {
      usePlayerStore.getState().decrementComboCooldowns();
      expect(usePlayerStore.getState().player.comboCooldowns).toHaveLength(0);
    });
  });

  describe('getComboCooldown', () => {
    it('should return remaining cooldown for existing combo', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [{ comboId: 'fire_wind', remaining: 3 }],
        }),
      });
      expect(usePlayerStore.getState().getComboCooldown('fire_wind')).toBe(3);
    });

    it('should return 0 for non-existent combo', () => {
      expect(usePlayerStore.getState().getComboCooldown('nonexistent')).toBe(0);
    });
  });

  describe('isComboOnCooldown', () => {
    it('should return true when combo is on cooldown', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [{ comboId: 'fire_wind', remaining: 2 }],
        }),
      });
      expect(usePlayerStore.getState().isComboOnCooldown('fire_wind')).toBe(true);
    });

    it('should return false when combo is not on cooldown', () => {
      expect(usePlayerStore.getState().isComboOnCooldown('fire_wind')).toBe(false);
    });
  });

  describe('setComboLevel', () => {
    it('should add a new combo level', () => {
      usePlayerStore.getState().setComboLevel('fire_wind', 2);
      const levels = usePlayerStore.getState().player.comboLevels;
      expect(levels).toHaveLength(1);
      expect(levels[0].comboId).toBe('fire_wind');
      expect(levels[0].level).toBe(2);
    });

    it('should update existing combo level', () => {
      usePlayerStore.getState().setComboLevel('fire_wind', 2);
      usePlayerStore.getState().setComboLevel('fire_wind', 3);
      const levels = usePlayerStore.getState().player.comboLevels;
      expect(levels).toHaveLength(1);
      expect(levels[0].level).toBe(3);
    });
  });

  describe('getCurrentComboLevel', () => {
    it('should return level for existing combo', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboLevels: [{ comboId: 'fire_wind', level: 3 }],
        }),
      });
      expect(usePlayerStore.getState().getCurrentComboLevel('fire_wind')).toBe(3);
    });

    it('should return 1 for non-existent combo', () => {
      expect(usePlayerStore.getState().getCurrentComboLevel('nonexistent')).toBe(1);
    });
  });

  describe('duoSelectCard', () => {
    it('should select card for player 1', () => {
      usePlayerStore.getState().duoSelectCard(1, mockCard1);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(1);
      expect(usePlayerStore.getState().player.selectedCards[0].id).toBe('c1');
    });

    it('should select card for player 2', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({ name: 'P2' }));
      usePlayerStore.getState().duoSelectCard(2, mockCard1);
      expect(usePlayerStore.getState().player2!.selectedCards).toHaveLength(1);
    });

    it('should not select for player 2 when player2 is null', () => {
      usePlayerStore.getState().duoSelectCard(2, mockCard1);
      expect(usePlayerStore.getState().player2).toBeNull();
    });

    it('should respect max 2 selected for duo player', () => {
      usePlayerStore.getState().duoSelectCard(1, mockCard1);
      usePlayerStore.getState().duoSelectCard(1, mockCard2);
      usePlayerStore.getState().duoSelectCard(1, mockCard3);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(2);
    });

    it('should not select duplicate for duo player', () => {
      usePlayerStore.getState().duoSelectCard(1, mockCard1);
      usePlayerStore.getState().duoSelectCard(1, mockCard1);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(1);
    });

    it('should respect mana limit for duo player', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({ name: 'P2', mana: 2 }));
      usePlayerStore.getState().duoSelectCard(2, mockCard2);
      usePlayerStore.getState().duoSelectCard(2, mockCard3);
      expect(usePlayerStore.getState().player2!.selectedCards).toHaveLength(1);
    });
  });

  describe('duoDeselectCard', () => {
    it('should deselect card for player 1', () => {
      usePlayerStore.getState().duoSelectCard(1, mockCard1);
      usePlayerStore.getState().duoDeselectCard(1, 'c1');
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(0);
    });

    it('should deselect card for player 2', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({ name: 'P2' }));
      usePlayerStore.getState().duoSelectCard(2, mockCard1);
      usePlayerStore.getState().duoDeselectCard(2, 'c1');
      expect(usePlayerStore.getState().player2!.selectedCards).toHaveLength(0);
    });

    it('should handle non-existent card id for player 2 when player2 is null', () => {
      usePlayerStore.getState().setPlayer2(null);
      usePlayerStore.getState().duoDeselectCard(2, 'nonexistent');
      expect(usePlayerStore.getState().player2).toBeNull();
    });
  });

  describe('duoClearSelectedCards', () => {
    it('should clear selected cards for player 1', () => {
      usePlayerStore.getState().duoSelectCard(1, mockCard1);
      usePlayerStore.getState().duoSelectCard(1, mockCard2);
      usePlayerStore.getState().duoClearSelectedCards(1);
      expect(usePlayerStore.getState().player.selectedCards).toHaveLength(0);
    });

    it('should clear selected cards for player 2', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({ name: 'P2' }));
      usePlayerStore.getState().duoSelectCard(2, mockCard1);
      usePlayerStore.getState().duoClearSelectedCards(2);
      expect(usePlayerStore.getState().player2!.selectedCards).toHaveLength(0);
    });

    it('should handle clearing for player 2 when null', () => {
      usePlayerStore.getState().duoClearSelectedCards(2);
      expect(usePlayerStore.getState().player2).toBeNull();
    });
  });

  describe('duoIsComboOnCooldown', () => {
    it('should return true when player 1 combo is on cooldown', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [{ comboId: 'fire_wind', remaining: 2 }],
        }),
      });
      expect(usePlayerStore.getState().duoIsComboOnCooldown(1, 'fire_wind')).toBe(true);
    });

    it('should return false when player 1 combo is not on cooldown', () => {
      expect(usePlayerStore.getState().duoIsComboOnCooldown(1, 'fire_wind')).toBe(false);
    });

    it('should return true when player 2 combo is on cooldown', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({
        name: 'P2',
        comboCooldowns: [{ comboId: 'fire_wind', remaining: 2 }],
      }));
      expect(usePlayerStore.getState().duoIsComboOnCooldown(2, 'fire_wind')).toBe(true);
    });

    it('should return false when player 2 is null', () => {
      expect(usePlayerStore.getState().duoIsComboOnCooldown(2, 'fire_wind')).toBe(false);
    });
  });

  describe('duoGetComboCooldown', () => {
    it('should return cooldown for player 1', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [{ comboId: 'fire_wind', remaining: 3 }],
        }),
      });
      expect(usePlayerStore.getState().duoGetComboCooldown(1, 'fire_wind')).toBe(3);
    });

    it('should return 0 for non-existent combo on player 1', () => {
      expect(usePlayerStore.getState().duoGetComboCooldown(1, 'nonexistent')).toBe(0);
    });

    it('should return cooldown for player 2', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({
        name: 'P2',
        comboCooldowns: [{ comboId: 'fire_wind', remaining: 2 }],
      }));
      expect(usePlayerStore.getState().duoGetComboCooldown(2, 'fire_wind')).toBe(2);
    });

    it('should return 0 when player 2 is null', () => {
      expect(usePlayerStore.getState().duoGetComboCooldown(2, 'fire_wind')).toBe(0);
    });
  });

  describe('duoGetCurrentComboLevel', () => {
    it('should return combo level for player 1', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboLevels: [{ comboId: 'fire_wind', level: 3 }],
        }),
      });
      expect(usePlayerStore.getState().duoGetCurrentComboLevel(1, 'fire_wind')).toBe(3);
    });

    it('should return 1 for non-existent combo on player 1', () => {
      expect(usePlayerStore.getState().duoGetCurrentComboLevel(1, 'nonexistent')).toBe(1);
    });

    it('should return combo level for player 2', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({
        name: 'P2',
        comboLevels: [{ comboId: 'fire_wind', level: 2 }],
      }));
      expect(usePlayerStore.getState().duoGetCurrentComboLevel(2, 'fire_wind')).toBe(2);
    });

    it('should return 1 when player 2 is null', () => {
      expect(usePlayerStore.getState().duoGetCurrentComboLevel(2, 'nonexistent')).toBe(1);
    });
  });

  describe('duoSetCurrentPlayer', () => {
    it('should set current duo player to 1', () => {
      usePlayerStore.getState().duoSetCurrentPlayer(1);
      expect(usePlayerStore.getState().currentDuoPlayer).toBe(1);
    });

    it('should set current duo player to 2', () => {
      usePlayerStore.getState().duoSetCurrentPlayer(2);
      expect(usePlayerStore.getState().currentDuoPlayer).toBe(2);
    });
  });

  describe('setCurrentDuoPlayer', () => {
    it('should set current duo player to 2', () => {
      usePlayerStore.getState().setCurrentDuoPlayer(2);
      expect(usePlayerStore.getState().currentDuoPlayer).toBe(2);
    });

    it('should set current duo player to 1', () => {
      usePlayerStore.getState().setCurrentDuoPlayer(2);
      usePlayerStore.getState().setCurrentDuoPlayer(1);
      expect(usePlayerStore.getState().currentDuoPlayer).toBe(1);
    });
  });

  describe('setComboCooldowns', () => {
    it('should replace all combo cooldowns', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [{ comboId: 'old', remaining: 5 }],
        }),
      });
      usePlayerStore.getState().setComboCooldowns([
        { comboId: 'fire_wind', remaining: 3 },
        { comboId: 'water_earth', remaining: 1 },
      ]);
      const cds = usePlayerStore.getState().player.comboCooldowns;
      expect(cds).toHaveLength(2);
      expect(cds[0].comboId).toBe('fire_wind');
      expect(cds[1].comboId).toBe('water_earth');
    });

    it('should set empty cooldowns', () => {
      usePlayerStore.setState({
        player: createMockPlayer({
          comboCooldowns: [{ comboId: 'old', remaining: 5 }],
        }),
      });
      usePlayerStore.getState().setComboCooldowns([]);
      expect(usePlayerStore.getState().player.comboCooldowns).toHaveLength(0);
    });
  });

  describe('duoResetPlayerState', () => {
    it('should reset player 1 state', () => {
      usePlayerStore.setState({ player: createMockPlayer({ hp: 10, shield: 5 }) });
      usePlayerStore.getState().duoResetPlayerState(1);
      const { player } = usePlayerStore.getState();
      expect(player.hp).toBe(100);
      expect(player.shield).toBe(0);
    });

    it('should reset player 2 state', () => {
      usePlayerStore.getState().setPlayer2(createMockPlayer({ name: 'P2', hp: 10 }));
      usePlayerStore.getState().duoResetPlayerState(2);
      const p2 = usePlayerStore.getState().player2!;
      expect(p2.hp).toBe(100);
    });

    it('should set player 2 when resetting player 2 that was null', () => {
      usePlayerStore.getState().duoResetPlayerState(2);
      expect(usePlayerStore.getState().player2).not.toBeNull();
      expect(usePlayerStore.getState().player2!.hp).toBe(100);
    });
  });
});
