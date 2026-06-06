export type ElementType = 'fire' | 'water' | 'earth' | 'wind';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  element: ElementType;
  name: string;
  description: string;
  power: number;
  rarity: Rarity;
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
  rarity: Rarity;
  effectType: 'firestorm' | 'vinewrap' | 'steamburst' | 'sandstorm' | 'lavaeruption' | 'icestorm';
}

export interface StatusEffect {
  type: 'burn' | 'freeze' | 'poison' | 'stun' | 'shield';
  value: number;
  duration: number;
}

export type AvatarType = 
  | 'flame_imp' 
  | 'water_sprite' 
  | 'earth_golem' 
  | 'wind_spirit' 
  | 'boss_dragon'
  | 'fire_elemental'
  | 'water_elemental'
  | 'earth_elemental';

export interface Combatant {
  name: string;
  maxHp: number;
  hp: number;
  shield: number;
  statusEffects: StatusEffect[];
  image: string;
  avatarType?: AvatarType;
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

export type GameMode = 'classic' | 'challenge' | 'endless' | 'quick';
export type GamePhase = 'menu' | 'battle' | 'victory' | 'defeat';

export interface FloatingText {
  id: string;
  value: number;
  type: 'damage' | 'heal' | 'shield';
  x: number;
  y: number;
}

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
  wave: number;
  floatingTexts: FloatingText[];
  enemyShaking: boolean;
  playerShaking: boolean;
}
