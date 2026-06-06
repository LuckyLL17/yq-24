export type ElementType = 'fire' | 'water' | 'earth' | 'wind';

export interface Card {
  id: string;
  element: ElementType;
  name: string;
  description: string;
  power: number;
}

export interface ComboSkill {
  id: string;
  elements: [ElementType, ElementType];
  name: string;
  description: string;
  damage: number;
  effect?: 'burn' | 'freeze' | 'poison' | 'stun' | 'heal' | 'shield' | 'draw';
  effectValue?: number;
  effectDuration?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface StatusEffect {
  type: 'burn' | 'freeze' | 'poison' | 'stun' | 'shield';
  value: number;
  duration: number;
}

export interface Combatant {
  name: string;
  maxHp: number;
  hp: number;
  shield: number;
  statusEffects: StatusEffect[];
  image: string;
}

export interface Player extends Combatant {
  hand: Card[];
  deck: Card[];
  selectedCards: Card[];
  mana: number;
  maxMana: number;
}

export interface Enemy extends Combatant {
  attackPower: number;
  intent: 'attack' | 'defend' | 'buff';
  intentValue: number;
}

export type GameMode = 'battle' | 'challenge';
export type GamePhase = 'menu' | 'battle' | 'victory' | 'defeat' | 'challenge';

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  turn: number;
  player: Player;
  enemy: Enemy | null;
  comboHistory: ComboSkill[];
  streak: number;
  score: number;
  isAnimating: boolean;
  currentCombo: ComboSkill | null;
  showComboEffect: boolean;
}
