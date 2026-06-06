import type { Card, ComboSkill, Enemy, ElementType, Player } from '@/types/game';

export const ELEMENTS: Record<ElementType, { name: string; color: string; gradient: string; icon: string }> = {
  fire: {
    name: '火',
    color: '#ff6b35',
    gradient: 'from-orange-500 via-red-500 to-rose-600',
    icon: '🔥',
  },
  water: {
    name: '水',
    color: '#4ecdc4',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    icon: '💧',
  },
  earth: {
    name: '土',
    color: '#8b5a2b',
    gradient: 'from-amber-600 via-orange-700 to-stone-700',
    icon: '🌍',
  },
  wind: {
    name: '风',
    color: '#98d8aa',
    gradient: 'from-emerald-300 via-teal-400 to-cyan-500',
    icon: '🌪️',
  },
};

let cardIdCounter = 0;
export const generateCardId = () => `card_${++cardIdCounter}`;

export const createCard = (element: ElementType): Card => {
  const elementData = ELEMENTS[element];
  return {
    id: generateCardId(),
    element,
    name: elementData.name,
    description: `${elementData.name}元素卡牌`,
    power: 3,
  };
};

export const COMBOS: ComboSkill[] = [
  {
    id: 'fire_fire',
    elements: ['fire', 'fire'],
    name: '烈焰冲击',
    description: '两道火焰汇聚，造成高额伤害并点燃敌人',
    damage: 18,
    effect: 'burn',
    effectValue: 4,
    effectDuration: 3,
    rarity: 'rare',
  },
  {
    id: 'water_water',
    elements: ['water', 'water'],
    name: '治愈之泉',
    description: '清泉涌动，恢复自身生命值',
    damage: 6,
    effect: 'heal',
    effectValue: 12,
    rarity: 'rare',
  },
  {
    id: 'earth_earth',
    elements: ['earth', 'earth'],
    name: '岩石护盾',
    description: '召唤岩石壁垒，获得护盾值',
    damage: 8,
    effect: 'shield',
    effectValue: 15,
    rarity: 'rare',
  },
  {
    id: 'wind_wind',
    elements: ['wind', 'wind'],
    name: '疾风连斩',
    description: '风刃交错，造成多次伤害并抽牌',
    damage: 14,
    effect: 'draw',
    effectValue: 2,
    rarity: 'rare',
  },
  {
    id: 'fire_wind',
    elements: ['fire', 'wind'],
    name: '火焰风暴',
    description: '狂风助燃，火焰席卷战场造成毁灭性伤害',
    damage: 28,
    effect: 'burn',
    effectValue: 6,
    effectDuration: 2,
    rarity: 'epic',
  },
  {
    id: 'water_earth',
    elements: ['water', 'earth'],
    name: '藤蔓缠绕',
    description: '大地之力与水结合，藤蔓束缚敌人',
    damage: 12,
    effect: 'stun',
    effectValue: 1,
    effectDuration: 1,
    rarity: 'epic',
  },
  {
    id: 'fire_earth',
    elements: ['fire', 'earth'],
    name: '熔岩爆发',
    description: '地底熔岩喷涌，灼烧一切',
    damage: 22,
    effect: 'burn',
    effectValue: 8,
    effectDuration: 2,
    rarity: 'epic',
  },
  {
    id: 'water_wind',
    elements: ['water', 'wind'],
    name: '冰霜新星',
    description: '寒风凛冽，冻结敌人并造成伤害',
    damage: 16,
    effect: 'freeze',
    effectValue: 2,
    effectDuration: 1,
    rarity: 'epic',
  },
  {
    id: 'fire_water',
    elements: ['fire', 'water'],
    name: '蒸汽爆发',
    description: '水火交融，蒸汽弥漫造成混乱',
    damage: 20,
    rarity: 'common',
  },
  {
    id: 'earth_wind',
    elements: ['earth', 'wind'],
    name: '沙尘暴',
    description: '漫天风沙，削弱敌人并造成伤害',
    damage: 14,
    effect: 'poison',
    effectValue: 3,
    effectDuration: 3,
    rarity: 'common',
  },
];

export const findCombo = (e1: ElementType, e2: ElementType): ComboSkill | undefined => {
  return COMBOS.find(
    (combo) =>
      (combo.elements[0] === e1 && combo.elements[1] === e2) ||
      (combo.elements[0] === e2 && combo.elements[1] === e1)
  );
};

export const ENEMIES: Omit<Enemy, 'hp' | 'shield' | 'statusEffects'>[] = [
  {
    name: '火焰史莱姆',
    maxHp: 40,
    attackPower: 8,
    intent: 'attack',
    intentValue: 8,
    image: '🔴',
  },
  {
    name: '水晶守卫',
    maxHp: 60,
    attackPower: 6,
    intent: 'defend',
    intentValue: 12,
    image: '💎',
  },
  {
    name: '岩石巨人',
    maxHp: 80,
    attackPower: 12,
    intent: 'attack',
    intentValue: 15,
    image: '🗿',
  },
  {
    name: '风暴精灵',
    maxHp: 50,
    attackPower: 10,
    intent: 'attack',
    intentValue: 12,
    image: '⚡',
  },
  {
    name: '元素领主',
    maxHp: 120,
    attackPower: 18,
    intent: 'attack',
    intentValue: 20,
    image: '👹',
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
  image: '🧙',
  mana: 3,
  maxMana: 3,
});

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const elements: ElementType[] = ['fire', 'water', 'earth', 'wind'];
  for (let i = 0; i < 5; i++) {
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
