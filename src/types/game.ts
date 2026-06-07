export type ElementType = 'fire' | 'water' | 'earth' | 'wind' | 'lightning' | 'light' | 'dark';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ComboCategory = 
  | 'attack' 
  | 'defense' 
  | 'heal' 
  | 'control' 
  | 'lifesteal' 
  | 'thorns' 
  | 'absorb' 
  | 'utility';

export type EffectType = 
  | 'burn' 
  | 'freeze' 
  | 'poison' 
  | 'stun' 
  | 'heal' 
  | 'shield' 
  | 'draw'
  | 'lifesteal'
  | 'thorns'
  | 'absorb'
  | 'weakness'
  | 'strength';

export interface Card {
  id: string;
  element: ElementType;
  name: string;
  description: string;
  power: number;
  rarity: Rarity;
}

export interface ComboUpgrade {
  level: number;
  damageBonus: number;
  effectValueBonus?: number;
  effectDurationBonus?: number;
  description: string;
}

export interface ComboSkill {
  id: string;
  elements: [ElementType, ElementType];
  name: string;
  description: string;
  damage: number;
  effect?: EffectType;
  effectValue?: number;
  effectDuration?: number;
  rarity: Rarity;
  effectType: 'firestorm' | 'vinewrap' | 'steamburst' | 'sandstorm' | 'lavaeruption' | 'icestorm' | 'thunderstrike' | 'holylight' | 'shadowflame' | 'thundercloud' | 'prismbeam' | 'voidstorm' | 'earthquake' | 'divineguard' | 'shadowbind' | 'galeforce' | 'blessing' | 'darkwhisper' | 'thunderbolt' | 'solarflare' | 'abyssalvoid';
  category: ComboCategory;
  cooldown: number;
  canUpgrade: boolean;
  upgrades?: ComboUpgrade[];
}

export interface StatusEffect {
  type: EffectType;
  value: number;
  duration: number;
}

export interface ComboCooldown {
  comboId: string;
  remaining: number;
}

export interface PlayerComboState {
  comboId: string;
  level: number;
}

export type AvatarType = 
  | 'flame_imp' 
  | 'water_sprite' 
  | 'earth_golem' 
  | 'wind_spirit' 
  | 'boss_dragon'
  | 'boss_dragon_phase2'
  | 'boss_dragon_phase3'
  | 'fire_elemental'
  | 'water_elemental'
  | 'earth_elemental'
  | 'lightning_elemental'
  | 'light_elemental'
  | 'dark_elemental'
  | 'shadow_assassin'
  | 'crystal_guardian'
  | 'thunder_lord'
  | 'void_walker'
  | 'phoenix_lord'
  | 'ice_queen'
  | 'storm_titan'
  | 'boss_crystal_phase2'
  | 'boss_crystal_phase3'
  | 'boss_void_phase2'
  | 'boss_void_phase3';

export type EnemyTier = 'common' | 'elite' | 'boss';

export type BossPhase = 1 | 2 | 3;

export type SpecialAbilityType = 
  | 'enrage' 
  | 'summon_minions' 
  | 'shield_wall' 
  | 'heal_self' 
  | 'multi_attack'
  | 'element_absorb'
  | 'counter_strike'
  | 'damage_boost'
  | 'weaken_player'
  | 'lifesteal';

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  type: SpecialAbilityType;
  value: number;
  cooldown: number;
  currentCooldown?: number;
}

export type BossIntentType = 'attack' | 'defend' | 'buff' | 'debuff';

export interface BossPhaseData {
  phase: BossPhase;
  name: string;
  maxHp: number;
  attackPower: number;
  avatarType: AvatarType;
  abilities: SpecialAbility[];
  intentPattern?: BossIntentType[];
}

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
  comboCooldowns: ComboCooldown[];
  comboLevels: PlayerComboState[];
}

export interface Enemy extends Combatant {
  attackPower: number;
  intent: BossIntentType;
  intentValue: number;
  tier: EnemyTier;
  level: number;
  isBoss?: boolean;
  bossPhase?: BossPhase;
  bossMaxPhases?: number;
  bossPhases?: BossPhaseData[];
  abilities?: SpecialAbility[];
  phaseTransitionTriggered?: boolean;
  intentPatternIndex?: number;
}

export type GameMode = 'classic' | 'challenge' | 'endless' | 'quick';
export type GamePhase = 'menu' | 'battle' | 'victory' | 'defeat';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'nightmare';

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
  difficulty: Difficulty;
  turn: number;
  player: Player;
  enemy: Enemy | null;
  comboHistory: ComboSkill[];
  streak: number;
  score: number;
  elementEssence: number;
  isAnimating: boolean;
  currentCombo: ComboSkill | null;
  showComboEffect: boolean;
  showUpgradePanel: boolean;
  wave: number;
  level: number;
  maxLevel: number;
  floatingTexts: FloatingText[];
  enemyShaking: boolean;
  playerShaking: boolean;
}
