import type {
  Player,
  Enemy,
  Card,
  ComboSkill,
  StatusEffect,
  FloatingText,
  BattleRating,
  DamageTier,
  ElementType,
  BossIntentType,
  SpecialAbility,
  BossPhaseData,
} from './game';

export interface PlayerState {
  player: Player;
  player2: Player | null;
  currentDuoPlayer: 1 | 2;
}

export interface PlayerActions {
  initPlayer: () => Player;
  resetPlayerState: () => void;
  setPlayer: (player: Player) => void;
  setPlayer2: (player: Player | null) => void;
  selectCard: (card: Card) => void;
  deselectCard: (cardId: string) => void;
  clearSelectedCards: () => void;
  drawCards: (count: number) => void;
  takeDamage: (damage: number) => void;
  heal: (amount: number) => void;
  addShield: (amount: number) => void;
  addStatusEffect: (effect: StatusEffect) => void;
  applyPlayerStatusEffects: () => void;
  consumeMana: (amount: number) => void;
  resetMana: () => void;
  resetShield: () => void;
  setComboCooldown: (comboId: string, cooldown: number) => void;
  decrementComboCooldowns: () => void;
  getComboCooldown: (comboId: string) => number;
  isComboOnCooldown: (comboId: string) => boolean;
  setComboLevel: (comboId: string, level: number) => void;
  getCurrentComboLevel: (comboId: string) => number;
  duoSelectCard: (playerNum: 1 | 2, card: Card) => void;
  duoDeselectCard: (playerNum: 1 | 2, cardId: string) => void;
  duoClearSelectedCards: (playerNum: 1 | 2) => void;
  duoIsComboOnCooldown: (playerNum: 1 | 2, comboId: string) => boolean;
  duoGetComboCooldown: (playerNum: 1 | 2, comboId: string) => number;
  duoGetCurrentComboLevel: (playerNum: 1 | 2, comboId: string) => number;
  duoSetCurrentPlayer: (playerNum: 1 | 2) => void;
  duoResetPlayerState: (playerNum: 1 | 2) => void;
  setCurrentDuoPlayer: (playerNum: 1 | 2) => void;
  setComboCooldowns: (cooldowns: { comboId: string; remaining: number }[]) => void;
}

export interface EnemyState {
  enemy: Enemy | null;
}

export interface EnemyActions {
  createEnemy: (enemyIndex: number, difficultyMultiplier?: number) => Enemy;
  setEnemy: (enemy: Enemy | null) => void;
  updateEnemyIntent: () => void;
  updateEnemyHp: (hp: number) => void;
  updateEnemyShield: (shield: number) => void;
  addEnemyStatusEffect: (effect: StatusEffect) => void;
  applyEnemyStatusEffects: () => { totalDamage: number; enemyDied: boolean };
  decrementAbilityCooldowns: () => void;
  useEnemyAbility: (abilityId: string) => void;
  checkBossPhaseTransition: () => void;
  transitionBossPhase: () => void;
  getAvailableAbilities: () => SpecialAbility[];
  getEnemyIntent: () => BossIntentType | null;
  getEnemyIntentValue: () => number;
  isBoss: () => boolean;
  getBossPhase: () => number | null;
  getBossPhases: () => BossPhaseData[] | null;
}

export interface BattleState {
  phase: 'menu' | 'battle' | 'victory' | 'defeat';
  mode: 'classic' | 'challenge' | 'endless' | 'quick' | 'duo';
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  turn: number;
  wave: number;
  level: number;
  maxLevel: number;
  comboHistory: ComboSkill[];
  streak: number;
  maxStreak: number;
  score: number;
  elementEssence: number;
  totalDamageDealt: number;
  totalHealingDone: number;
  combosUsed: number;
  highestHitDamage: number;
  battleRating: BattleRating | null;
  duoLayout: 'horizontal' | 'vertical';
  duoWinner: 1 | 2 | null;
  myCardUsedIds: string[];
  levelCardReward: Card | null;
}

export interface BattleActions {
  startBattle: (mode?: BattleState['mode'], difficulty?: BattleState['difficulty']) => void;
  startChallenge: (difficulty?: BattleState['difficulty']) => void;
  startEndless: (difficulty?: BattleState['difficulty']) => void;
  startQuick: (difficulty?: BattleState['difficulty']) => void;
  startDuo: (layout?: 'horizontal' | 'vertical') => void;
  playSelectedCards: () => void;
  duoPlaySelectedCards: (playerNum: 1 | 2) => void;
  enemyTurn: () => void;
  nextTurn: () => void;
  duoNextTurn: () => void;
  nextWave: () => void;
  nextLevel: () => void;
  proceedToNextLevel: () => void;
  calculateDamage: (baseDamage: number, attacker: Player | Enemy, defender: Player | Enemy) => {
    finalDamage: number;
    actualDamageDealt: number;
    remainingShield: number;
    newHp: number;
  };
  applyComboEffect: (combo: ComboSkill, target: 'player' | 'enemy') => {
    damage: number;
    heal: number;
    shield: number;
    drawCards: number;
    statusEffects: StatusEffect[];
  };
  getStreakDamageBonus: () => number;
  calculateDamageTier: (damage: number) => DamageTier;
  calculateBattleRating: () => BattleRating;
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addEssence: (amount: number) => void;
  trackComboUse: (combo: ComboSkill) => void;
  trackDamage: (amount: number) => void;
  trackWin: () => void;
  trackWave: (wave: number) => void;
  restartGame: () => void;
  goToMenu: () => void;
  setDuoLayout: (layout: 'horizontal' | 'vertical') => void;
  resetMyCardCooldowns: () => void;
  addCardToUsed: (cardId: string) => void;
  isMyCardOnCooldown: (cardId: string) => boolean;
  getBattleCardReward: () => Card | null;
  addCardToCollection: (card: Card) => void;
  setBattleRating: (rating: BattleRating | null) => void;
}

export interface UIState {
  isAnimating: boolean;
  currentCombo: ComboSkill | null;
  showComboEffect: boolean;
  showUpgradePanel: boolean;
  showLevelComplete: boolean;
  levelEssenceReward: number;
  floatingTexts: FloatingText[];
  enemyShaking: boolean;
  playerShaking: boolean;
  player2Shaking: boolean;
  showDailyQuests: boolean;
  showShop: boolean;
  showMyCards: boolean;
  showCollection: boolean;
  showStreakBonus: boolean;
  lastStreakBonus: number;
  showBattleRating: boolean;
  showAccountManager: boolean;
  showSaveManager: boolean;
  isPaused: boolean;
  selectedMyCardId: string | null;
}

export interface UIActions {
  setAnimating: (value: boolean) => void;
  showCombo: (combo: ComboSkill) => void;
  hideCombo: () => void;
  toggleUpgradePanel: () => void;
  showLevelCompleteScreen: (essenceReward: number) => void;
  hideLevelCompleteScreen: () => void;
  addFloatingText: (type: 'damage' | 'heal' | 'shield', value: number, target: 'player' | 'enemy') => void;
  addDamageFloatingText: (damage: number, target: 'player' | 'enemy', element?: ElementType) => void;
  addComboFloatingText: (comboCount: number, damageBonus: number) => void;
  addRatingFloatingText: (rating: BattleRating) => void;
  removeFloatingText: (id: string) => void;
  setShaking: (target: 'player' | 'enemy' | 'player2', value: boolean) => void;
  toggleDailyQuests: () => void;
  setShowDailyQuests: (show: boolean) => void;
  toggleShop: () => void;
  setShowShop: (show: boolean) => void;
  toggleMyCards: () => void;
  setShowMyCards: (show: boolean) => void;
  toggleCollection: () => void;
  setShowCollection: (show: boolean) => void;
  showBattleRatingEffect: () => void;
  hideBattleRating: () => void;
  toggleAccountManager: () => void;
  setShowAccountManager: (show: boolean) => void;
  toggleSaveManager: () => void;
  setShowSaveManager: (show: boolean) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  selectMyCard: (cardId: string | null) => void;
}

export type PlayerStore = PlayerState & PlayerActions;
export type EnemyStore = EnemyState & EnemyActions;
export type BattleStore = BattleState & BattleActions;
export type UIStore = UIState & UIActions;
