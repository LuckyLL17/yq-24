import type { GameState, Player, Enemy, DailyQuestState, GameMode, Difficulty, PlayerCosmetics } from '@/types/game';

const STORAGE_KEY_PERMANENT = 'elemental_duels_permanent_save';
const STORAGE_KEY_BATTLE = 'elemental_duels_battle_save';

export interface PermanentSaveData {
  elementEssence: number;
  comboLevels: Player['comboLevels'];
  dailyQuests: DailyQuestState;
  cosmetics: PlayerCosmetics;
  tutorialCompleted?: boolean;
  savedAt: number;
}

export interface BattleSaveData {
  phase: GameState['phase'];
  mode: GameMode;
  difficulty: Difficulty;
  turn: number;
  player: Player;
  enemy: Enemy | null;
  wave: number;
  level: number;
  maxLevel: number;
  score: number;
  streak: number;
  comboHistory: GameState['comboHistory'];
  savedAt: number;
}

export const hasPermanentSave = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY_PERMANENT) !== null;
  } catch {
    return false;
  }
};

export const hasBattleSave = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY_BATTLE) !== null;
  } catch {
    return false;
  }
};

export const savePermanentData = (data: Omit<PermanentSaveData, 'savedAt'>): void => {
  try {
    const saveData: PermanentSaveData = {
      ...data,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY_PERMANENT, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save permanent data:', e);
  }
};

export const loadPermanentData = (): PermanentSaveData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERMANENT);
    if (!raw) return null;
    return JSON.parse(raw) as PermanentSaveData;
  } catch (e) {
    console.error('Failed to load permanent data:', e);
    return null;
  }
};

export const saveBattleData = (data: Omit<BattleSaveData, 'savedAt'>): void => {
  try {
    const saveData: BattleSaveData = {
      ...data,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY_BATTLE, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save battle data:', e);
  }
};

export const loadBattleData = (): BattleSaveData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BATTLE);
    if (!raw) return null;
    return JSON.parse(raw) as BattleSaveData;
  } catch (e) {
    console.error('Failed to load battle data:', e);
    return null;
  }
};

export const clearBattleSave = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_BATTLE);
  } catch (e) {
    console.error('Failed to clear battle save:', e);
  }
};

export const clearAllSaves = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_PERMANENT);
    localStorage.removeItem(STORAGE_KEY_BATTLE);
  } catch (e) {
    console.error('Failed to clear saves:', e);
  }
};

export const getBattleSaveInfo = (): { mode: GameMode; level: number; wave: number; savedAt: number } | null => {
  const data = loadBattleData();
  if (!data) return null;
  return {
    mode: data.mode,
    level: data.level,
    wave: data.wave,
    savedAt: data.savedAt,
  };
};
