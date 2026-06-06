import type { Card, ComboSkill, Enemy, ElementType, Player } from '@/types/game';

export const ELEMENTS: Record<ElementType, { 
  name: string; 
  color: string; 
  gradient: string; 
  icon: string;
  glowClass: string;
  bgGradient: string;
}> = {
  fire: {
    name: '火',
    color: '#ff6b35',
    gradient: 'from-orange-400 via-red-500 to-rose-600',
    icon: '🔥',
    glowClass: 'shadow-glow-fire',
    bgGradient: 'from-orange-500/20 via-red-500/20 to-rose-600/20',
  },
  water: {
    name: '水',
    color: '#4ecdc4',
    gradient: 'from-cyan-300 via-blue-500 to-indigo-600',
    icon: '💧',
    glowClass: 'shadow-glow-water',
    bgGradient: 'from-cyan-400/20 via-blue-500/20 to-indigo-600/20',
  },
  earth: {
    name: '土',
    color: '#8b5a2b',
    gradient: 'from-amber-500 via-orange-700 to-stone-700',
    icon: '🌍',
    glowClass: 'shadow-glow-earth',
    bgGradient: 'from-amber-500/20 via-orange-700/20 to-stone-700/20',
  },
  wind: {
    name: '风',
    color: '#98d8aa',
    gradient: 'from-emerald-300 via-teal-400 to-cyan-500',
    icon: '🌪️',
    glowClass: 'shadow-glow-wind',
    bgGradient: 'from-emerald-300/20 via-teal-400/20 to-cyan-500/20',
  },
};

const RARITY_BG = {
  common: 'from-gray-600 to-gray-800',
  rare: 'from-blue-500 to-blue-700',
  epic: 'from-purple-500 to-purple-700',
  legendary: 'from-amber-400 to-orange-600',
};

let cardIdCounter = 0;
export const generateCardId = () => `card_${++cardIdCounter}`;

export const CARD_VARIANTS: Record<ElementType, Array<{ name: string; description: string; power: number; rarity: Card['rarity'] }>> = {
  fire: [
    { name: '火焰弹', description: '发射一颗火球，造成伤害', power: 4, rarity: 'common' },
    { name: '烈焰冲击', description: '强力的火焰攻击', power: 6, rarity: 'rare' },
    { name: '炎爆术', description: '爆发性的火焰伤害', power: 8, rarity: 'epic' },
  ],
  water: [
    { name: '水流弹', description: '发射水弹攻击敌人', power: 3, rarity: 'common' },
    { name: '治愈之泉', description: '清澈的泉水带来治愈', power: 5, rarity: 'rare' },
    { name: '潮汐之力', description: '海洋的力量涌动', power: 7, rarity: 'epic' },
  ],
  earth: [
    { name: '岩石弹', description: '投掷坚硬的岩石', power: 4, rarity: 'common' },
    { name: '大地护盾', description: '召唤岩石保护自己', power: 5, rarity: 'rare' },
    { name: '山崩地裂', description: '大地的愤怒', power: 7, rarity: 'epic' },
  ],
  wind: [
    { name: '风刃', description: '锋利的风之刃', power: 3, rarity: 'common' },
    { name: '疾风步', description: '风之速度', power: 4, rarity: 'rare' },
    { name: '龙卷风暴', description: '毁灭性的风暴', power: 6, rarity: 'epic' },
  ],
};

export const createCard = (element: ElementType): Card => {
  const variants = CARD_VARIANTS[element];
  const variant = variants[Math.floor(Math.random() * variants.length)];
  const elementData = ELEMENTS[element];
  return {
    id: generateCardId(),
    element,
    name: variant.name,
    description: variant.description,
    power: variant.power,
    rarity: variant.rarity,
  };
};

export const COMBOS: ComboSkill[] = [
  {
    id: 'fire_wind',
    elements: ['fire', 'wind'],
    name: '火焰风暴',
    description: '狂风助燃，火焰龙卷席卷战场，造成毁灭性伤害并有几率灼烧敌人',
    damage: 30,
    effect: 'burn',
    effectValue: 8,
    effectDuration: 3,
    rarity: 'legendary',
    effectType: 'firestorm',
  },
  {
    id: 'water_earth',
    elements: ['water', 'earth'],
    name: '藤蔓缠绕',
    description: '大地之力与水元素结合，藤蔓从地下涌出束缚敌人',
    damage: 15,
    effect: 'stun',
    effectValue: 1,
    effectDuration: 1,
    rarity: 'epic',
    effectType: 'vinewrap',
  },
  {
    id: 'fire_water',
    elements: ['fire', 'water'],
    name: '蒸汽爆发',
    description: '水火交融产生剧烈蒸汽爆炸，造成伤害并恢复自身生命',
    damage: 22,
    effect: 'heal',
    effectValue: 15,
    effectDuration: 0,
    rarity: 'epic',
    effectType: 'steamburst',
  },
  {
    id: 'earth_wind',
    elements: ['earth', 'wind'],
    name: '沙尘暴',
    description: '漫天风沙遮蔽视野，削弱敌人并造成持续伤害',
    damage: 18,
    effect: 'poison',
    effectValue: 5,
    effectDuration: 3,
    rarity: 'epic',
    effectType: 'sandstorm',
  },
  {
    id: 'fire_earth',
    elements: ['fire', 'earth'],
    name: '熔岩喷发',
    description: '地底熔岩喷涌而出，造成超高额伤害并提升自身防御',
    damage: 35,
    effect: 'shield',
    effectValue: 10,
    effectDuration: 0,
    rarity: 'legendary',
    effectType: 'lavaeruption',
  },
  {
    id: 'water_wind',
    elements: ['water', 'wind'],
    name: '寒冰风暴',
    description: '寒风与冰雪交织，冻结敌人并造成持续冰霜伤害',
    damage: 20,
    effect: 'freeze',
    effectValue: 1,
    effectDuration: 1,
    rarity: 'epic',
    effectType: 'icestorm',
  },
  {
    id: 'fire_fire',
    elements: ['fire', 'fire'],
    name: '烈焰冲击',
    description: '两道火焰汇聚成更强力的烈焰，点燃敌人持续灼烧',
    damage: 20,
    effect: 'burn',
    effectValue: 5,
    effectDuration: 2,
    rarity: 'rare',
    effectType: 'firestorm',
  },
  {
    id: 'water_water',
    elements: ['water', 'water'],
    name: '治愈之泉',
    description: '双重水元素汇聚，大量恢复生命值',
    damage: 8,
    effect: 'heal',
    effectValue: 20,
    effectDuration: 0,
    rarity: 'rare',
    effectType: 'vinewrap',
  },
  {
    id: 'earth_earth',
    elements: ['earth', 'earth'],
    name: '岩石壁垒',
    description: '双重土元素召唤坚固岩石壁垒，获得大量护盾',
    damage: 10,
    effect: 'shield',
    effectValue: 20,
    effectDuration: 0,
    rarity: 'rare',
    effectType: 'sandstorm',
  },
  {
    id: 'wind_wind',
    elements: ['wind', 'wind'],
    name: '疾风连斩',
    description: '双重风元素交错攻击，造成伤害并抽取更多卡牌',
    damage: 16,
    effect: 'draw',
    effectValue: 2,
    effectDuration: 0,
    rarity: 'rare',
    effectType: 'icestorm',
  },
];

export const findCombo = (e1: ElementType, e2: ElementType): ComboSkill | undefined => {
  return COMBOS.find(
    (combo) =>
      (combo.elements[0] === e1 && combo.elements[1] === e2) ||
      (combo.elements[0] === e2 && combo.elements[1] === e1)
  );
};

export const ENEMIES: Array<Omit<Enemy, 'hp' | 'shield' | 'statusEffects'> & { level: number }> = [
  {
    name: '火焰小鬼',
    maxHp: 45,
    attackPower: 7,
    intent: 'attack',
    intentValue: 7,
    image: '🔥',
    avatarType: 'flame_imp',
    level: 1,
  },
  {
    name: '水晶精灵',
    maxHp: 60,
    attackPower: 5,
    intent: 'defend',
    intentValue: 10,
    image: '💧',
    avatarType: 'water_sprite',
    level: 2,
  },
  {
    name: '风之精灵',
    maxHp: 40,
    attackPower: 9,
    intent: 'attack',
    intentValue: 11,
    image: '🌪️',
    avatarType: 'wind_spirit',
    level: 2,
  },
  {
    name: '岩石傀儡',
    maxHp: 90,
    attackPower: 12,
    intent: 'attack',
    intentValue: 14,
    image: '🗿',
    avatarType: 'earth_golem',
    level: 3,
  },
  {
    name: '冰霜水灵',
    maxHp: 70,
    attackPower: 10,
    intent: 'attack',
    intentValue: 12,
    image: '❄️',
    avatarType: 'water_elemental',
    level: 3,
  },
  {
    name: '熔岩巨兽',
    maxHp: 110,
    attackPower: 16,
    intent: 'attack',
    intentValue: 18,
    image: '🌋',
    avatarType: 'fire_elemental',
    level: 4,
  },
  {
    name: '风暴领主',
    maxHp: 100,
    attackPower: 14,
    intent: 'buff',
    intentValue: 8,
    image: '⚡',
    avatarType: 'wind_spirit',
    level: 4,
  },
  {
    name: '暗晶龙王',
    maxHp: 150,
    attackPower: 20,
    intent: 'attack',
    intentValue: 22,
    image: '🐉',
    avatarType: 'boss_dragon',
    level: 5,
  },
];

export const createEnemy = (index: number): Enemy => {
  const enemyData = ENEMIES[index % ENEMIES.length];
  return {
    ...enemyData,
    hp: enemyData.maxHp,
    shield: 0,
    statusEffects: [],
  };
};

export const createPlayer = (): Omit<Player, 'hand' | 'deck' | 'selectedCards'> => ({
  name: '元素法师',
  maxHp: 100,
  hp: 100,
  shield: 0,
  statusEffects: [],
  image: '🧙‍♂️',
  mana: 3,
  maxMana: 3,
});

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const elements: ElementType[] = ['fire', 'water', 'earth', 'wind'];
  for (let i = 0; i < 6; i++) {
    elements.forEach((element) => {
      deck.push(createCard(element));
    });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export { RARITY_BG };
