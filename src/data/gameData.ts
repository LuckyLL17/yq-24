import type { Card, ComboSkill, Enemy, ElementType, Player, Difficulty, Rarity } from '@/types/game';

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
  lightning: {
    name: '雷',
    color: '#9d4edd',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    icon: '⚡',
    glowClass: 'shadow-glow-lightning',
    bgGradient: 'from-violet-400/20 via-purple-500/20 to-fuchsia-600/20',
  },
  light: {
    name: '光',
    color: '#ffd93d',
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
    icon: '✨',
    glowClass: 'shadow-glow-light',
    bgGradient: 'from-yellow-300/20 via-amber-400/20 to-orange-500/20',
  },
  dark: {
    name: '暗',
    color: '#7b2cbf',
    gradient: 'from-indigo-700 via-purple-800 to-slate-900',
    icon: '🌑',
    glowClass: 'shadow-glow-dark',
    bgGradient: 'from-indigo-700/20 via-purple-800/20 to-slate-900/20',
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

export const CARD_VARIANTS: Record<ElementType, Array<{ name: string; description: string; power: number; rarity: Card['rarity']; skillType?: string; skillValue?: number }>> = {
  fire: [
    { name: '火焰弹', description: '发射一颗火球，造成伤害', power: 4, rarity: 'common' },
    { name: '烈焰冲击', description: '强力的火焰攻击', power: 6, rarity: 'rare' },
    { name: '炎爆术', description: '爆发性的火焰伤害', power: 8, rarity: 'epic' },
    { name: '凤凰涅槃', description: '传说之火，浴火重生，造成大量伤害并恢复生命', power: 15, rarity: 'legendary', skillType: 'damage_heal', skillValue: 20 },
  ],
  water: [
    { name: '水流弹', description: '发射水弹攻击敌人', power: 3, rarity: 'common' },
    { name: '治愈之泉', description: '清澈的泉水带来治愈', power: 5, rarity: 'rare' },
    { name: '潮汐之力', description: '海洋的力量涌动', power: 7, rarity: 'epic' },
    { name: '海神之怒', description: '海神的愤怒席卷战场，造成伤害并冰冻敌人', power: 12, rarity: 'legendary', skillType: 'damage_freeze', skillValue: 2 },
  ],
  earth: [
    { name: '岩石弹', description: '投掷坚硬的岩石', power: 4, rarity: 'common' },
    { name: '大地护盾', description: '召唤岩石保护自己', power: 5, rarity: 'rare' },
    { name: '山崩地裂', description: '大地的愤怒', power: 7, rarity: 'epic' },
    { name: '泰坦降临', description: '泰坦巨人降世，造成毁灭伤害并获得护盾', power: 14, rarity: 'legendary', skillType: 'damage_shield', skillValue: 25 },
  ],
  wind: [
    { name: '风刃', description: '锋利的风之刃', power: 3, rarity: 'common' },
    { name: '疾风步', description: '风之速度', power: 4, rarity: 'rare' },
    { name: '龙卷风暴', description: '毁灭性的风暴', power: 6, rarity: 'epic' },
    { name: '风暴之翼', description: '化身风暴，造成多次风刃伤害', power: 10, rarity: 'legendary', skillType: 'multi_hit', skillValue: 4 },
  ],
  lightning: [
    { name: '闪电箭', description: '发射一道闪电攻击敌人', power: 5, rarity: 'common' },
    { name: '雷电链', description: '连锁闪电攻击多个目标', power: 7, rarity: 'rare' },
    { name: '雷神之怒', description: '召唤天雷毁灭一切', power: 9, rarity: 'epic' },
    { name: '雷霆万钧', description: '万雷齐发，造成巨额雷系伤害', power: 18, rarity: 'legendary', skillType: 'heavy_damage', skillValue: 0 },
  ],
  light: [
    { name: '圣光弹', description: '发射神圣光芒', power: 4, rarity: 'common' },
    { name: '祝福之光', description: '神圣的祝福治愈伤痛', power: 6, rarity: 'rare' },
    { name: '神圣审判', description: '以圣光审判邪恶', power: 8, rarity: 'epic' },
    { name: '天使降临', description: '神圣天使降临，大量恢复生命并获得祝福', power: 10, rarity: 'legendary', skillType: 'big_heal', skillValue: 35 },
  ],
  dark: [
    { name: '暗影箭', description: '发射暗影能量', power: 4, rarity: 'common' },
    { name: '暗影侵蚀', description: '暗影腐蚀敌人', power: 6, rarity: 'rare' },
    { name: '深渊吞噬', description: '召唤深渊吞噬一切', power: 8, rarity: 'epic' },
    { name: '深渊领主', description: '深渊之主现身，造成巨大伤害并吸取生命', power: 16, rarity: 'legendary', skillType: 'life_drain', skillValue: 15 },
  ],
};

export const createCard = (element: ElementType): Card => {
  const variants = CARD_VARIANTS[element];
  const variant = variants[Math.floor(Math.random() * variants.length)];
  return {
    id: generateCardId(),
    element,
    name: variant.name,
    description: variant.description,
    power: variant.power,
    rarity: variant.rarity,
    skillType: variant.skillType as Card['skillType'],
    skillValue: variant.skillValue,
  };
};

export const createCardByName = (element: ElementType, name: string): Card | null => {
  const variants = CARD_VARIANTS[element];
  const variant = variants.find(v => v.name === name);
  if (!variant) return null;
  return {
    id: generateCardId(),
    element,
    name: variant.name,
    description: variant.description,
    power: variant.power,
    rarity: variant.rarity,
    skillType: variant.skillType as Card['skillType'],
    skillValue: variant.skillValue,
  };
};

export const createCardByRarityWeight = (rarityWeights?: Partial<Record<Rarity, number>>): Card => {
  const weights: Record<Rarity, number> = {
    common: rarityWeights?.common ?? 60,
    rare: rarityWeights?.rare ?? 25,
    epic: rarityWeights?.epic ?? 12,
    legendary: rarityWeights?.legendary ?? 3,
  };
  
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  let selectedRarity: Rarity = 'common';
  
  for (const [rarity, weight] of Object.entries(weights) as [Rarity, number][]) {
    random -= weight;
    if (random <= 0) {
      selectedRarity = rarity;
      break;
    }
  }
  
  const elements: ElementType[] = ['fire', 'water', 'earth', 'wind', 'lightning', 'light', 'dark'];
  const element = elements[Math.floor(Math.random() * elements.length)];
  const variants = CARD_VARIANTS[element].filter(v => v.rarity === selectedRarity);
  const variant = variants[Math.floor(Math.random() * variants.length)];
  
  return {
    id: generateCardId(),
    element,
    name: variant.name,
    description: variant.description,
    power: variant.power,
    rarity: variant.rarity,
    skillType: variant.skillType as Card['skillType'],
    skillValue: variant.skillValue,
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
    category: 'attack',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 8, effectValueBonus: 3, description: '伤害+8，灼烧+3' },
      { level: 3, damageBonus: 15, effectValueBonus: 5, effectDurationBonus: 1, description: '伤害+15，灼烧+5，持续+1回合' },
    ],
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
    category: 'control',
    cooldown: 2,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 5, effectDurationBonus: 1, description: '伤害+5，眩晕+1回合' },
      { level: 3, damageBonus: 10, effectDurationBonus: 1, description: '伤害+10，眩晕再+1回合' },
    ],
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
    category: 'heal',
    cooldown: 2,
    canUpgrade: false,
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
    category: 'attack',
    cooldown: 2,
    canUpgrade: false,
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
    category: 'defense',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 10, effectValueBonus: 5, description: '伤害+10，护盾+5' },
      { level: 3, damageBonus: 20, effectValueBonus: 10, description: '伤害+20，护盾+10' },
    ],
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
    category: 'control',
    cooldown: 2,
    canUpgrade: false,
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
    category: 'attack',
    cooldown: 1,
    canUpgrade: false,
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
    category: 'heal',
    cooldown: 1,
    canUpgrade: false,
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
    category: 'defense',
    cooldown: 1,
    canUpgrade: false,
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
    category: 'utility',
    cooldown: 1,
    canUpgrade: false,
  },
  {
    id: 'fire_lightning',
    elements: ['fire', 'lightning'],
    name: '雷火轰击',
    description: '火焰与雷电交织，雷火从天而降，造成高额伤害并有几率眩晕敌人',
    damage: 32,
    effect: 'stun',
    effectValue: 1,
    effectDuration: 1,
    rarity: 'legendary',
    effectType: 'thunderstrike',
    category: 'attack',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 8, effectDurationBonus: 1, description: '伤害+8，眩晕+1回合' },
      { level: 3, damageBonus: 15, effectDurationBonus: 1, description: '伤害+15，眩晕再+1回合' },
    ],
  },
  {
    id: 'water_lightning',
    elements: ['water', 'lightning'],
    name: '雷云风暴',
    description: '雷云笼罩战场，雷电在雨水中传导，造成伤害并使敌人麻痹',
    damage: 25,
    effect: 'stun',
    effectValue: 1,
    effectDuration: 2,
    rarity: 'epic',
    effectType: 'thundercloud',
    category: 'control',
    cooldown: 2,
    canUpgrade: false,
  },
  {
    id: 'earth_lightning',
    elements: ['earth', 'lightning'],
    name: '地震雷击',
    description: '雷电击中大地引发地震，地裂与雷暴同时降临',
    damage: 28,
    effect: 'shield',
    effectValue: 12,
    effectDuration: 0,
    rarity: 'epic',
    effectType: 'earthquake',
    category: 'defense',
    cooldown: 2,
    canUpgrade: false,
  },
  {
    id: 'wind_lightning',
    elements: ['wind', 'lightning'],
    name: '雷暴',
    description: '狂风裹挟雷电，雷暴席卷战场，快速打击敌人',
    damage: 26,
    effect: 'draw',
    effectValue: 2,
    effectDuration: 0,
    rarity: 'epic',
    effectType: 'galeforce',
    category: 'utility',
    cooldown: 2,
    canUpgrade: false,
  },
  {
    id: 'fire_light',
    elements: ['fire', 'light'],
    name: '圣焰',
    description: '神圣与火焰交融，圣焰燃烧邪恶，造成伤害并吸取生命治愈自身',
    damage: 24,
    effect: 'lifesteal',
    effectValue: 12,
    effectDuration: 0,
    rarity: 'epic',
    effectType: 'holylight',
    category: 'lifesteal',
    cooldown: 2,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 6, effectValueBonus: 4, description: '伤害+6，吸血+4' },
      { level: 3, damageBonus: 12, effectValueBonus: 8, description: '伤害+12，吸血+8' },
    ],
  },
  {
    id: 'water_light',
    elements: ['water', 'light'],
    name: '棱镜光束',
    description: '水光折射形成棱镜光束，穿透敌人并提供护盾',
    damage: 20,
    effect: 'shield',
    effectValue: 15,
    effectDuration: 0,
    rarity: 'epic',
    effectType: 'prismbeam',
    category: 'defense',
    cooldown: 2,
    canUpgrade: false,
  },
  {
    id: 'earth_light',
    elements: ['earth', 'light'],
    name: '神圣守护',
    description: '圣光与大地之力结合，形成坚不可摧的神圣护盾',
    damage: 12,
    effect: 'shield',
    effectValue: 25,
    effectDuration: 0,
    rarity: 'epic',
    effectType: 'divineguard',
    category: 'defense',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 5, effectValueBonus: 10, description: '伤害+5，护盾+10' },
      { level: 3, damageBonus: 10, effectValueBonus: 20, description: '伤害+10，护盾+20' },
    ],
  },
  {
    id: 'wind_light',
    elements: ['wind', 'light'],
    name: '祝福之风',
    description: '神圣的清风拂过，治愈伤痛并带来更多机遇',
    damage: 14,
    effect: 'heal',
    effectValue: 10,
    effectDuration: 0,
    rarity: 'rare',
    effectType: 'blessing',
    category: 'heal',
    cooldown: 1,
    canUpgrade: false,
  },
  {
    id: 'fire_dark',
    elements: ['fire', 'dark'],
    name: '暗影烈焰',
    description: '黑暗与烈焰融合，暗影之火焚烧灵魂，吸取敌人生命',
    damage: 28,
    effect: 'lifesteal',
    effectValue: 15,
    effectDuration: 0,
    rarity: 'legendary',
    effectType: 'shadowflame',
    category: 'lifesteal',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 8, effectValueBonus: 5, description: '伤害+8，吸血+5' },
      { level: 3, damageBonus: 15, effectValueBonus: 10, description: '伤害+15，吸血+10' },
    ],
  },
  {
    id: 'water_dark',
    elements: ['water', 'dark'],
    name: '腐蚀之水',
    description: '黑暗毒水腐蚀一切，造成持续毒素伤害并削弱敌人',
    damage: 22,
    effect: 'poison',
    effectValue: 7,
    effectDuration: 4,
    rarity: 'epic',
    effectType: 'voidstorm',
    category: 'attack',
    cooldown: 2,
    canUpgrade: false,
  },
  {
    id: 'earth_dark',
    elements: ['earth', 'dark'],
    name: '暗影束缚',
    description: '黑暗从地底涌出，束缚敌人行动并反弹伤害',
    damage: 18,
    effect: 'thorns',
    effectValue: 8,
    effectDuration: 2,
    rarity: 'epic',
    effectType: 'shadowbind',
    category: 'thorns',
    cooldown: 2,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 5, effectValueBonus: 4, description: '伤害+5，反伤+4' },
      { level: 3, damageBonus: 10, effectValueBonus: 8, effectDurationBonus: 1, description: '伤害+10，反伤+8，持续+1回合' },
    ],
  },
  {
    id: 'wind_dark',
    elements: ['wind', 'dark'],
    name: '暗影低语',
    description: '黑暗之风低语而过，窃取敌人的力量',
    damage: 20,
    effect: 'draw',
    effectValue: 3,
    effectDuration: 0,
    rarity: 'epic',
    effectType: 'darkwhisper',
    category: 'utility',
    cooldown: 2,
    canUpgrade: false,
  },
  {
    id: 'lightning_lightning',
    elements: ['lightning', 'lightning'],
    name: '连环雷击',
    description: '双重雷电汇聚，连续雷击造成毁灭性伤害',
    damage: 28,
    effect: 'stun',
    effectValue: 1,
    effectDuration: 1,
    rarity: 'rare',
    effectType: 'thunderbolt',
    category: 'attack',
    cooldown: 1,
    canUpgrade: false,
  },
  {
    id: 'light_light',
    elements: ['light', 'light'],
    name: '太阳耀斑',
    description: '双重圣光汇聚，太阳耀斑绽放，造成伤害并大量治疗',
    damage: 18,
    effect: 'heal',
    effectValue: 25,
    effectDuration: 0,
    rarity: 'rare',
    effectType: 'solarflare',
    category: 'heal',
    cooldown: 1,
    canUpgrade: false,
  },
  {
    id: 'dark_dark',
    elements: ['dark', 'dark'],
    name: '深渊虚空',
    description: '双重暗影汇聚，深渊降临吞噬一切，伤害转化为护盾',
    damage: 22,
    effect: 'absorb',
    effectValue: 15,
    effectDuration: 0,
    rarity: 'rare',
    effectType: 'abyssalvoid',
    category: 'absorb',
    cooldown: 1,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 5, effectValueBonus: 5, description: '伤害+5，吸收+5' },
      { level: 3, damageBonus: 10, effectValueBonus: 10, description: '伤害+10，吸收+10' },
    ],
  },
  {
    id: 'lightning_light',
    elements: ['lightning', 'light'],
    name: '神圣制裁',
    description: '雷霆与圣光结合，神圣制裁降临，审判一切邪恶',
    damage: 30,
    effect: 'stun',
    effectValue: 1,
    effectDuration: 1,
    rarity: 'legendary',
    effectType: 'holylight',
    category: 'attack',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 10, effectDurationBonus: 1, description: '伤害+10，眩晕+1回合' },
      { level: 3, damageBonus: 20, effectDurationBonus: 1, description: '伤害+20，眩晕再+1回合' },
    ],
  },
  {
    id: 'lightning_dark',
    elements: ['lightning', 'dark'],
    name: '混沌雷暴',
    description: '光明与黑暗的雷电交织，混沌之力撕裂苍穹，造成持续伤害',
    damage: 35,
    effect: 'poison',
    effectValue: 6,
    effectDuration: 3,
    rarity: 'legendary',
    effectType: 'voidstorm',
    category: 'attack',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 10, effectValueBonus: 3, description: '伤害+10，毒素+3' },
      { level: 3, damageBonus: 20, effectValueBonus: 6, effectDurationBonus: 1, description: '伤害+20，毒素+6，持续+1回合' },
    ],
  },
  {
    id: 'light_dark',
    elements: ['light', 'dark'],
    name: '阴阳轮回',
    description: '光与暗的极致融合，阴阳相生相克，造成伤害并回复生命与护盾',
    damage: 26,
    effect: 'heal',
    effectValue: 18,
    effectDuration: 0,
    rarity: 'legendary',
    effectType: 'prismbeam',
    category: 'heal',
    cooldown: 3,
    canUpgrade: true,
    upgrades: [
      { level: 2, damageBonus: 6, effectValueBonus: 8, description: '伤害+6，治疗+8' },
      { level: 3, damageBonus: 12, effectValueBonus: 15, description: '伤害+12，治疗+15' },
    ],
  },
];

export const findCombo = (e1: ElementType, e2: ElementType): ComboSkill | undefined => {
  return COMBOS.find(
    (combo) =>
      (combo.elements[0] === e1 && combo.elements[1] === e2) ||
      (combo.elements[0] === e2 && combo.elements[1] === e1)
  );
};

export const getComboLevel = (comboId: string, comboLevels: { comboId: string; level: number }[]): number => {
  const found = comboLevels.find((c) => c.comboId === comboId);
  return found ? found.level : 1;
};

export const getComboWithLevel = (combo: ComboSkill, level: number): ComboSkill => {
  if (level <= 1 || !combo.upgrades || combo.upgrades.length === 0) {
    return combo;
  }

  let totalDamageBonus = 0;
  let totalEffectValueBonus = 0;
  let totalEffectDurationBonus = 0;

  for (let i = 0; i < level - 1 && i < combo.upgrades.length; i++) {
    const upgrade = combo.upgrades[i];
    totalDamageBonus += upgrade.damageBonus;
    if (upgrade.effectValueBonus !== undefined) {
      totalEffectValueBonus += upgrade.effectValueBonus;
    }
    if (upgrade.effectDurationBonus !== undefined) {
      totalEffectDurationBonus += upgrade.effectDurationBonus;
    }
  }

  return {
    ...combo,
    damage: combo.damage + totalDamageBonus,
    effectValue: combo.effectValue !== undefined ? combo.effectValue + totalEffectValueBonus : undefined,
    effectDuration: combo.effectDuration !== undefined ? combo.effectDuration + totalEffectDurationBonus : undefined,
  };
};

export const BOSS_PHASES: Record<string, import('@/types/game').BossPhaseData[]> = {
  boss_dragon: [
    {
      phase: 1,
      name: '暗晶龙王',
      maxHp: 180,
      attackPower: 18,
      avatarType: 'boss_dragon',
      abilities: [
        { id: 'dragon_breath', name: '龙息', description: '喷射龙焰造成额外伤害', type: 'damage_boost', value: 8, cooldown: 2 },
        { id: 'dragon_shield', name: '龙鳞护盾', description: '召唤龙鳞护盾保护自己', type: 'shield_wall', value: 20, cooldown: 3 },
        { id: 'dragon_heal', name: '龙血恢复', description: '回复少量生命值', type: 'heal_self', value: 15, cooldown: 4 },
      ],
      intentPattern: ['attack', 'attack', 'defend', 'buff', 'attack'],
    },
    {
      phase: 2,
      name: '暗晶龙王·觉醒',
      maxHp: 220,
      attackPower: 24,
      avatarType: 'boss_dragon_phase2',
      abilities: [
        { id: 'dragon_breath', name: '龙息', description: '喷射龙焰造成额外伤害', type: 'damage_boost', value: 12, cooldown: 2 },
        { id: 'dragon_rage', name: '龙之怒', description: '进入狂暴状态，攻击力大幅提升', type: 'enrage', value: 10, cooldown: 3 },
        { id: 'tail_sweep', name: '横扫', description: '连续攻击两次', type: 'multi_attack', value: 2, cooldown: 2 },
        { id: 'dragon_fire', name: '龙焰灼烧', description: '攻击附带灼烧效果', type: 'burn_attack', value: 6, cooldown: 3 },
      ],
      intentPattern: ['attack', 'attack', 'attack', 'defend', 'buff', 'debuff'],
    },
    {
      phase: 3,
      name: '暗晶龙王·终焉',
      maxHp: 280,
      attackPower: 30,
      avatarType: 'boss_dragon_phase3',
      abilities: [
        { id: 'apocalypse_breath', name: '毁灭龙息', description: '释放毁灭性龙焰', type: 'damage_boost', value: 15, cooldown: 2 },
        { id: 'dragon_rage', name: '狂暴之怒', description: '进入狂暴状态', type: 'enrage', value: 12, cooldown: 2 },
        { id: 'tail_sweep', name: '毁灭横扫', description: '连续攻击三次', type: 'multi_attack', value: 3, cooldown: 2 },
        { id: 'dark_curse', name: '黑暗诅咒', description: '削弱玩家', type: 'weaken_player', value: 5, cooldown: 4 },
        { id: 'dragon_regen', name: '龙血再生', description: '回复大量生命', type: 'heal_self', value: 25, cooldown: 4 },
        { id: 'inferno', name: '地狱烈焰', description: '强力灼烧', type: 'burn_attack', value: 10, cooldown: 3 },
      ],
      intentPattern: ['attack', 'attack', 'buff', 'attack', 'defend', 'attack', 'heal', 'debuff'],
    },
  ],
  boss_crystal: [
    {
      phase: 1,
      name: '晶岩长老',
      maxHp: 200,
      attackPower: 14,
      avatarType: 'crystal_guardian',
      abilities: [
        { id: 'crystal_shield', name: '晶岩护盾', description: '获得大量护盾', type: 'shield_wall', value: 25, cooldown: 2 },
        { id: 'crystal_heal', name: '晶核修复', description: '回复生命值', type: 'heal_self', value: 20, cooldown: 3 },
        { id: 'crystal_thorns', name: '晶刺护体', description: '获得反伤效果', type: 'thorns_aura', value: 6, cooldown: 4 },
      ],
      intentPattern: ['defend', 'attack', 'defend', 'heal', 'attack'],
    },
    {
      phase: 2,
      name: '晶岩长老·共鸣',
      maxHp: 260,
      attackPower: 18,
      avatarType: 'boss_crystal_phase2',
      abilities: [
        { id: 'crystal_shield', name: '晶岩护盾', description: '获得大量护盾', type: 'shield_wall', value: 35, cooldown: 2 },
        { id: 'crystal_heal', name: '晶核修复', description: '回复生命值', type: 'heal_self', value: 28, cooldown: 3 },
        { id: 'prism_armor', name: '棱镜护甲', description: '强化自身防御', type: 'enrage', value: 6, cooldown: 3 },
        { id: 'shield_smash', name: '盾击', description: '消耗护盾造成额外伤害', type: 'shield_bash', value: 0, cooldown: 3 },
      ],
      intentPattern: ['defend', 'defend', 'attack', 'buff', 'attack', 'heal'],
    },
    {
      phase: 3,
      name: '晶岩长老·不灭',
      maxHp: 320,
      attackPower: 22,
      avatarType: 'boss_crystal_phase3',
      abilities: [
        { id: 'diamond_shield', name: '钻石壁垒', description: '获得巨额护盾', type: 'shield_wall', value: 50, cooldown: 2 },
        { id: 'crystal_heal', name: '晶核重组', description: '回复大量生命值', type: 'heal_self', value: 40, cooldown: 3 },
        { id: 'prism_armor', name: '棱镜护甲', description: '大幅强化自身', type: 'enrage', value: 10, cooldown: 2 },
        { id: 'shatter', name: '晶爆术', description: '爆发性多段伤害', type: 'multi_attack', value: 3, cooldown: 3 },
        { id: 'diamond_thorns', name: '钻石反伤', description: '强力反伤效果', type: 'thorns_aura', value: 10, cooldown: 4 },
        { id: 'shield_barrier', name: '吸能护盾', description: '吸取玩家护盾', type: 'drain_shield', value: 20, cooldown: 4 },
      ],
      intentPattern: ['defend', 'attack', 'defend', 'heal', 'attack', 'attack', 'defend', 'buff'],
    },
  ],
  boss_void: [
    {
      phase: 1,
      name: '虚空使者',
      maxHp: 160,
      attackPower: 16,
      avatarType: 'void_walker',
      abilities: [
        { id: 'void_drain', name: '虚空汲取', description: '攻击时回复生命', type: 'lifesteal', value: 8, cooldown: 2 },
        { id: 'weakening_curse', name: '虚弱诅咒', description: '削弱玩家攻击力', type: 'weaken_player', value: 4, cooldown: 3 },
        { id: 'void_poison', name: '虚空之毒', description: '使玩家中毒', type: 'poison_attack', value: 5, cooldown: 3 },
      ],
      intentPattern: ['attack', 'debuff', 'attack', 'heal', 'debuff'],
    },
    {
      phase: 2,
      name: '虚空使者·深渊',
      maxHp: 200,
      attackPower: 22,
      avatarType: 'boss_void_phase2',
      abilities: [
        { id: 'void_drain', name: '虚空汲取', description: '攻击时回复生命', type: 'lifesteal', value: 12, cooldown: 2 },
        { id: 'weakening_curse', name: '虚弱诅咒', description: '削弱玩家攻击力', type: 'weaken_player', value: 6, cooldown: 2 },
        { id: 'shadow_strike', name: '暗影突袭', description: '连续攻击两次', type: 'multi_attack', value: 2, cooldown: 2 },
        { id: 'abyss_poison', name: '深渊之毒', description: '强力毒素', type: 'poison_attack', value: 8, cooldown: 3 },
      ],
      intentPattern: ['attack', 'attack', 'debuff', 'attack', 'heal', 'debuff'],
    },
    {
      phase: 3,
      name: '虚空使者·湮灭',
      maxHp: 240,
      attackPower: 28,
      avatarType: 'boss_void_phase3',
      abilities: [
        { id: 'soul_drain', name: '灵魂抽取', description: '攻击时大量回复生命', type: 'lifesteal', value: 18, cooldown: 2 },
        { id: 'abyss_curse', name: '深渊诅咒', description: '大幅削弱玩家', type: 'weaken_player', value: 8, cooldown: 2 },
        { id: 'void_barrage', name: '虚空弹幕', description: '连续攻击三次', type: 'multi_attack', value: 3, cooldown: 2 },
        { id: 'dark_regen', name: '黑暗再生', description: '回复大量生命', type: 'heal_self', value: 30, cooldown: 4 },
        { id: 'void_burn', name: '虚空灼烧', description: '使玩家灼烧', type: 'burn_attack', value: 8, cooldown: 3 },
        { id: 'void_freeze', name: '虚空冻结', description: '有几率冻结玩家', type: 'freeze_attack', value: 1, cooldown: 4 },
      ],
      intentPattern: ['attack', 'attack', 'debuff', 'attack', 'heal', 'attack', 'debuff'],
    },
  ],
};

export const ENEMIES: Array<Omit<Enemy, 'hp' | 'shield' | 'statusEffects' | 'tier' | 'level'> & { level: number; tier?: import('@/types/game').EnemyTier }> = [
  {
    name: '火焰小鬼',
    maxHp: 45,
    attackPower: 7,
    intent: 'attack',
    intentValue: 7,
    image: '🔥',
    avatarType: 'flame_imp',
    level: 1,
    tier: 'common',
    abilities: [
      { id: 'flame_burn', name: '烈焰灼烧', description: '攻击附带灼烧效果', type: 'burn_attack', value: 3, cooldown: 2 },
    ],
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
    tier: 'common',
    abilities: [
      { id: 'water_heal', name: '水之治愈', description: '回复少量生命', type: 'heal_self', value: 8, cooldown: 3 },
    ],
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
    tier: 'common',
  },
  {
    name: '暗影刺客',
    maxHp: 50,
    attackPower: 12,
    intent: 'attack',
    intentValue: 14,
    image: '🗡️',
    avatarType: 'shadow_assassin',
    level: 2,
    tier: 'elite',
    abilities: [
      { id: 'backstab', name: '背刺', description: '造成额外伤害', type: 'damage_boost', value: 5, cooldown: 2 },
    ],
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
    tier: 'common',
  },
  {
    name: '水晶守卫',
    maxHp: 100,
    attackPower: 8,
    intent: 'defend',
    intentValue: 20,
    image: '💎',
    avatarType: 'crystal_guardian',
    level: 3,
    tier: 'elite',
    abilities: [
      { id: 'crystal_shield', name: '水晶护盾', description: '获得大量护盾', type: 'shield_wall', value: 25, cooldown: 3 },
      { id: 'crystal_thorns', name: '晶刺', description: '获得反伤效果', type: 'thorns_aura', value: 5, cooldown: 4 },
    ],
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
    tier: 'common',
    abilities: [
      { id: 'frost_bite', name: '寒霜之咬', description: '攻击有几率冰冻敌人', type: 'freeze_attack', value: 1, cooldown: 3 },
    ],
  },
  {
    name: '雷霆领主',
    maxHp: 85,
    attackPower: 14,
    intent: 'attack',
    intentValue: 16,
    image: '⚡',
    avatarType: 'thunder_lord',
    level: 4,
    tier: 'elite',
    abilities: [
      { id: 'chain_lightning', name: '连锁闪电', description: '连续攻击', type: 'multi_attack', value: 2, cooldown: 2 },
    ],
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
    tier: 'common',
  },
  {
    name: '虚空行者',
    maxHp: 95,
    attackPower: 13,
    intent: 'debuff',
    intentValue: 10,
    image: '🌑',
    avatarType: 'void_walker',
    level: 4,
    tier: 'elite',
    abilities: [
      { id: 'void_drain', name: '虚空汲取', description: '回复生命值', type: 'heal_self', value: 15, cooldown: 3 },
      { id: 'void_poison', name: '虚空之毒', description: '使玩家中毒', type: 'poison_attack', value: 5, cooldown: 2 },
      { id: 'weaken_curse', name: '虚弱诅咒', description: '削弱玩家攻击力', type: 'weaken_player', value: 3, cooldown: 3 },
    ],
  },
  {
    name: '风暴领主',
    maxHp: 100,
    attackPower: 14,
    intent: 'buff',
    intentValue: 8,
    image: '🌪️',
    avatarType: 'wind_spirit',
    level: 4,
    tier: 'common',
  },
  {
    name: '凤凰君主',
    maxHp: 130,
    attackPower: 18,
    intent: 'attack',
    intentValue: 20,
    image: '🔥',
    avatarType: 'phoenix_lord',
    level: 5,
    tier: 'elite',
    abilities: [
      { id: 'rebirth', name: '浴火重生', description: '回复大量生命', type: 'heal_self', value: 25, cooldown: 4 },
      { id: 'inferno', name: '烈焰风暴', description: '造成额外伤害', type: 'damage_boost', value: 10, cooldown: 2 },
    ],
  },
  {
    name: '冰霜女王',
    maxHp: 120,
    attackPower: 16,
    intent: 'defend',
    intentValue: 22,
    image: '❄️',
    avatarType: 'ice_queen',
    level: 5,
    tier: 'elite',
    abilities: [
      { id: 'frozen_armor', name: '冰霜护甲', description: '获得护盾', type: 'shield_wall', value: 30, cooldown: 3 },
      { id: 'chilling_touch', name: '寒冰之触', description: '削弱玩家', type: 'weaken_player', value: 3, cooldown: 3 },
      { id: 'frost_breath', name: '霜息', description: '有几率冻结玩家', type: 'freeze_attack', value: 1, cooldown: 4 },
      { id: 'ice_regen', name: '冰晶治愈', description: '回复生命', type: 'heal_self', value: 18, cooldown: 4 },
    ],
  },
  {
    name: '风暴泰坦',
    maxHp: 140,
    attackPower: 20,
    intent: 'attack',
    intentValue: 22,
    image: '⛈️',
    avatarType: 'storm_titan',
    level: 5,
    tier: 'elite',
    abilities: [
      { id: 'thunder_strike', name: '雷霆一击', description: '造成大量额外伤害', type: 'damage_boost', value: 12, cooldown: 2 },
      { id: 'storm_shield', name: '风暴护盾', description: '获得护盾', type: 'shield_wall', value: 20, cooldown: 3 },
      { id: 'lightning_stun', name: '雷击眩晕', description: '有几率眩晕玩家', type: 'stun_attack', value: 1, cooldown: 4 },
      { id: 'thunder_chain', name: '连锁闪电', description: '连续攻击两次', type: 'multi_attack', value: 2, cooldown: 3 },
    ],
  },
  {
    name: '暗晶龙王',
    maxHp: 180,
    attackPower: 18,
    intent: 'attack',
    intentValue: 20,
    image: '🐉',
    avatarType: 'boss_dragon',
    level: 6,
    tier: 'boss',
    isBoss: true,
    bossPhase: 1,
    bossMaxPhases: 3,
    bossPhases: BOSS_PHASES.boss_dragon,
    abilities: BOSS_PHASES.boss_dragon[0].abilities,
  },
  {
    name: '晶岩长老',
    maxHp: 200,
    attackPower: 14,
    intent: 'defend',
    intentValue: 25,
    image: '💎',
    avatarType: 'crystal_guardian',
    level: 7,
    tier: 'boss',
    isBoss: true,
    bossPhase: 1,
    bossMaxPhases: 3,
    bossPhases: BOSS_PHASES.boss_crystal,
    abilities: BOSS_PHASES.boss_crystal[0].abilities,
  },
  {
    name: '虚空使者',
    maxHp: 160,
    attackPower: 16,
    intent: 'attack',
    intentValue: 18,
    image: '🌑',
    avatarType: 'void_walker',
    level: 8,
    tier: 'boss',
    isBoss: true,
    bossPhase: 1,
    bossMaxPhases: 3,
    bossPhases: BOSS_PHASES.boss_void,
    abilities: BOSS_PHASES.boss_void[0].abilities,
  },
];

export const createEnemy = (index: number): Enemy => {
  const enemyData = ENEMIES[index % ENEMIES.length];
  const tier = enemyData.tier || 'common';
  
  const enemy: Enemy = {
    ...enemyData,
    tier,
    hp: enemyData.maxHp,
    shield: 0,
    statusEffects: [],
    abilities: enemyData.abilities ? enemyData.abilities.map(a => ({ ...a, currentCooldown: 0 })) : [],
    phaseTransitionTriggered: false,
  };

  if (enemyData.isBoss && enemyData.bossPhases && enemyData.bossPhases.length > 0) {
    const firstPhase = enemyData.bossPhases[0];
    enemy.maxHp = firstPhase.maxHp;
    enemy.hp = firstPhase.maxHp;
    enemy.attackPower = firstPhase.attackPower;
    enemy.avatarType = firstPhase.avatarType;
    enemy.name = firstPhase.name;
    enemy.abilities = firstPhase.abilities.map(a => ({ ...a, currentCooldown: 0 }));
    enemy.bossPhase = firstPhase.phase;
    enemy.bossMaxPhases = enemyData.bossPhases.length;
  }

  return enemy;
};

export const CATEGORY_NAMES: Record<string, string> = {
  attack: '攻击',
  defense: '防御',
  heal: '治疗',
  control: '控制',
  lifesteal: '吸血',
  thorns: '反伤',
  absorb: '吸收',
  utility: '辅助',
};

export const CATEGORY_COLORS: Record<string, string> = {
  attack: 'text-red-400',
  defense: 'text-blue-400',
  heal: 'text-green-400',
  control: 'text-purple-400',
  lifesteal: 'text-pink-400',
  thorns: 'text-orange-400',
  absorb: 'text-cyan-400',
  utility: 'text-yellow-400',
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
  comboCooldowns: [],
  comboLevels: [],
});

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const elements: ElementType[] = ['fire', 'water', 'earth', 'wind', 'lightning', 'light', 'dark'];
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

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  name: string;
  description: string;
  icon: string;
  color: string;
  enemyHpMultiplier: number;
  enemyAttackMultiplier: number;
  playerHpMultiplier: number;
  essenceMultiplier: number;
}> = {
  easy: {
    name: '简单',
    description: '适合新手，敌人较弱',
    icon: '🌱',
    color: 'from-green-500 via-emerald-500 to-teal-500',
    enemyHpMultiplier: 0.7,
    enemyAttackMultiplier: 0.7,
    playerHpMultiplier: 1.2,
    essenceMultiplier: 0.8,
  },
  normal: {
    name: '普通',
    description: '标准难度，平衡的挑战',
    icon: '⚔️',
    color: 'from-blue-500 via-indigo-500 to-purple-500',
    enemyHpMultiplier: 1,
    enemyAttackMultiplier: 1,
    playerHpMultiplier: 1,
    essenceMultiplier: 1,
  },
  hard: {
    name: '困难',
    description: '高阶挑战，敌人强化',
    icon: '🔥',
    color: 'from-orange-500 via-red-500 to-rose-500',
    enemyHpMultiplier: 1.4,
    enemyAttackMultiplier: 1.3,
    playerHpMultiplier: 0.9,
    essenceMultiplier: 1.5,
  },
  nightmare: {
    name: '噩梦',
    description: '极限挑战，只有强者能生存',
    icon: '💀',
    color: 'from-purple-700 via-fuchsia-700 to-rose-700',
    enemyHpMultiplier: 2,
    enemyAttackMultiplier: 1.8,
    playerHpMultiplier: 0.8,
    essenceMultiplier: 2.5,
  },
};

export const CLASSIC_LEVELS = [
  { enemyIndex: 0, bossLevel: false },
  { enemyIndex: 2, bossLevel: false },
  { enemyIndex: 4, bossLevel: false },
  { enemyIndex: 7, bossLevel: false },
  { enemyIndex: 14, bossLevel: true },
];

export const QUICK_LEVELS = [
  { enemyIndex: 0, bossLevel: false },
  { enemyIndex: 3, bossLevel: false },
  { enemyIndex: 14, bossLevel: true },
];

interface QuestTemplate {
  type: import('@/types/game').QuestType;
  titles: string[];
  descriptions: string[];
  targets: Record<import('@/types/game').QuestRarity, number>;
  rewards: Record<import('@/types/game').QuestRarity, number>;
}

const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    type: 'use_combo',
    titles: ['组合大师', '元素共鸣', '连击挑战'],
    descriptions: ['使用指定组合技能 {count} 次', '施放 {comboName} {count} 次'],
    targets: { common: 3, rare: 5, epic: 8 },
    rewards: { common: 20, rare: 40, epic: 80 },
  },
  {
    type: 'use_combo_category',
    titles: ['攻击专家', '防御大师', '治疗者', '控制能手'],
    descriptions: ['使用{categoryName}类组合技能 {count} 次'],
    targets: { common: 3, rare: 6, epic: 10 },
    rewards: { common: 15, rare: 35, epic: 70 },
  },
  {
    type: 'win_battle',
    titles: ['胜利者', '战场之王', '连胜达人'],
    descriptions: ['赢得 {count} 场对局'],
    targets: { common: 1, rare: 3, epic: 5 },
    rewards: { common: 30, rare: 60, epic: 120 },
  },
  {
    type: 'total_damage',
    titles: ['伤害输出', '毁灭打击', 'DPS之王'],
    descriptions: ['累计造成 {count} 点伤害'],
    targets: { common: 100, rare: 250, epic: 500 },
    rewards: { common: 25, rare: 50, epic: 100 },
  },
  {
    type: 'reach_wave',
    titles: ['挑战者', '坚韧不拔', '深渊探索者'],
    descriptions: ['到达第 {count} 波'],
    targets: { common: 5, rare: 10, epic: 20 },
    rewards: { common: 20, rare: 45, epic: 90 },
  },
];

const RARITY_WEIGHTS: Record<import('@/types/game').QuestRarity, number> = {
  common: 60,
  rare: 30,
  epic: 10,
};

const pickRandomRarity = (): import('@/types/game').QuestRarity => {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    rand -= weight;
    if (rand <= 0) return rarity as import('@/types/game').QuestRarity;
  }
  return 'common';
};

const generateQuestId = () => `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getRandomCombo = (): ComboSkill => {
  return COMBOS[Math.floor(Math.random() * COMBOS.length)];
};

const getRandomCategory = (): import('@/types/game').ComboCategory => {
  const categories: import('@/types/game').ComboCategory[] = [
    'attack', 'defense', 'heal', 'control', 'lifesteal', 'thorns', 'absorb', 'utility'
  ];
  return categories[Math.floor(Math.random() * categories.length)];
};

const generateSingleQuest = (): import('@/types/game').DailyQuest => {
  const template = QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
  const rarity = pickRandomRarity();
  const target = template.targets[rarity];
  const reward = template.rewards[rarity];
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];
  const descTemplate = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];

  let description = descTemplate.replace('{count}', target.toString());
  let targetComboId: string | undefined;
  let targetCategory: import('@/types/game').ComboCategory | undefined;

  if (template.type === 'use_combo') {
    const combo = getRandomCombo();
    targetComboId = combo.id;
    description = description.replace('{comboName}', combo.name);
  } else if (template.type === 'use_combo_category') {
    const category = getRandomCategory();
    targetCategory = category;
    description = description.replace('{categoryName}', CATEGORY_NAMES[category] || category);
  }

  return {
    id: generateQuestId(),
    type: template.type,
    title,
    description,
    target,
    progress: 0,
    reward,
    rarity,
    completed: false,
    claimed: false,
    targetComboId,
    targetCategory,
  };
};

export const generateDailyQuests = (count: number = 3): import('@/types/game').DailyQuest[] => {
  const quests: import('@/types/game').DailyQuest[] = [];
  const usedTypes = new Set<import('@/types/game').QuestType>();

  for (let i = 0; i < count; i++) {
    let quest: import('@/types/game').DailyQuest;
    let attempts = 0;
    do {
      quest = generateSingleQuest();
      attempts++;
    } while (usedTypes.has(quest.type) && attempts < 10);
    
    usedTypes.add(quest.type);
    quests.push(quest);
  }

  return quests;
};

export const getTodayString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const QUEST_RARITY_COLORS: Record<import('@/types/game').QuestRarity, string> = {
  common: 'from-gray-500 to-gray-700',
  rare: 'from-blue-500 to-blue-700',
  epic: 'from-purple-500 to-purple-700',
};

export const QUEST_RARITY_BG: Record<import('@/types/game').QuestRarity, string> = {
  common: 'bg-gray-500/20 border-gray-500/50',
  rare: 'bg-blue-500/20 border-blue-500/50',
  epic: 'bg-purple-500/20 border-purple-500/50',
};

export const REFRESH_COST = 50;

export const CARD_PACKS: import('@/types/game').CardPack[] = [
  {
    id: 'basic_pack',
    name: '基础卡包',
    description: '包含3张随机卡牌，开启你的元素之旅',
    price: 50,
    rarity: 'common',
    cardCount: 3,
    icon: '📦',
    gradient: 'from-gray-500 to-gray-700',
  },
  {
    id: 'rare_pack',
    name: '稀有卡包',
    description: '包含5张卡牌，保底1张稀有',
    price: 120,
    rarity: 'rare',
    cardCount: 5,
    guaranteedRarity: 'rare',
    icon: '🎁',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    id: 'epic_pack',
    name: '史诗卡包',
    description: '包含5张卡牌，保底1张史诗',
    price: 300,
    rarity: 'epic',
    cardCount: 5,
    guaranteedRarity: 'epic',
    icon: '💎',
    gradient: 'from-purple-500 to-purple-700',
  },
  {
    id: 'legendary_pack',
    name: '传说卡包',
    description: '包含5张卡牌，保底1张传说',
    price: 800,
    rarity: 'legendary',
    cardCount: 5,
    guaranteedRarity: 'legendary',
    icon: '👑',
    gradient: 'from-amber-400 to-orange-600',
  },
];

export const CARD_BORDERS: import('@/types/game').CardBorder[] = [
  {
    id: 'bronze_border',
    name: '青铜边框',
    description: '朴素的青铜边框，新手的象征',
    price: 80,
    rarity: 'common',
    borderStyle: 'border-4 border-amber-700',
    glowColor: 'rgba(146, 64, 14, 0.5)',
    icon: '🟤',
  },
  {
    id: 'silver_border',
    name: '白银边框',
    description: '闪耀的白银边框，进阶的证明',
    price: 200,
    rarity: 'rare',
    borderStyle: 'border-4 border-slate-300',
    glowColor: 'rgba(203, 213, 225, 0.5)',
    icon: '⚪',
  },
  {
    id: 'gold_border',
    name: '黄金边框',
    description: '璀璨的黄金边框，荣耀的象征',
    price: 500,
    rarity: 'epic',
    borderStyle: 'border-4 border-yellow-400',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    icon: '🟡',
  },
  {
    id: 'diamond_border',
    name: '钻石边框',
    description: '璀璨夺目的钻石边框，传奇的象征',
    price: 1200,
    rarity: 'legendary',
    borderStyle: 'border-4 border-cyan-300',
    glowColor: 'rgba(103, 232, 249, 0.7)',
    icon: '💎',
  },
  {
    id: 'fire_border',
    name: '烈焰边框',
    description: '燃烧着火焰的边框，火之意志',
    price: 350,
    rarity: 'epic',
    borderStyle: 'border-4 border-orange-500',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    icon: '🔥',
  },
  {
    id: 'ice_border',
    name: '冰霜边框',
    description: '散发寒气的冰霜边框，冰之纯净',
    price: 350,
    rarity: 'epic',
    borderStyle: 'border-4 border-cyan-400',
    glowColor: 'rgba(34, 211, 238, 0.6)',
    icon: '❄️',
  },
  {
    id: 'nature_border',
    name: '自然边框',
    description: '生机盎然的自然边框，大地之力',
    price: 350,
    rarity: 'epic',
    borderStyle: 'border-4 border-green-500',
    glowColor: 'rgba(34, 197, 94, 0.6)',
    icon: '🌿',
  },
  {
    id: 'void_border',
    name: '虚空边框',
    description: '深邃神秘的虚空边框，暗之力量',
    price: 600,
    rarity: 'legendary',
    borderStyle: 'border-4 border-purple-600',
    glowColor: 'rgba(147, 51, 234, 0.7)',
    icon: '🌑',
  },
];

export const SHOP_AVATARS: import('@/types/game').ShopAvatar[] = [
  {
    id: 'avatar_flame_imp',
    name: '火焰小鬼',
    description: '调皮的火焰元素生物',
    price: 100,
    rarity: 'common',
    avatarType: 'flame_imp',
    icon: '🔥',
  },
  {
    id: 'avatar_water_sprite',
    name: '水晶精灵',
    description: '清澈的水之精灵',
    price: 100,
    rarity: 'common',
    avatarType: 'water_sprite',
    icon: '💧',
  },
  {
    id: 'avatar_earth_golem',
    name: '岩石傀儡',
    description: '坚不可摧的岩石巨人',
    price: 100,
    rarity: 'common',
    avatarType: 'earth_golem',
    icon: '🗿',
  },
  {
    id: 'avatar_wind_spirit',
    name: '风之精灵',
    description: '自由飘荡的风元素',
    price: 100,
    rarity: 'common',
    avatarType: 'wind_spirit',
    icon: '🌪️',
  },
  {
    id: 'avatar_fire_elemental',
    name: '火焰元素',
    description: '强大的火焰元素生物',
    price: 250,
    rarity: 'rare',
    avatarType: 'fire_elemental',
    icon: '🔥',
  },
  {
    id: 'avatar_water_elemental',
    name: '水灵元素',
    description: '浩瀚的水之化身',
    price: 250,
    rarity: 'rare',
    avatarType: 'water_elemental',
    icon: '🌊',
  },
  {
    id: 'avatar_earth_elemental',
    name: '土灵元素',
    description: '厚重的大地元素',
    price: 250,
    rarity: 'rare',
    avatarType: 'earth_elemental',
    icon: '🏔️',
  },
  {
    id: 'avatar_lightning_elemental',
    name: '雷霆元素',
    description: '雷霆万钧的闪电化身',
    price: 350,
    rarity: 'epic',
    avatarType: 'lightning_elemental',
    icon: '⚡',
  },
  {
    id: 'avatar_light_elemental',
    name: '圣光元素',
    description: '神圣的光明之灵',
    price: 350,
    rarity: 'epic',
    avatarType: 'light_elemental',
    icon: '✨',
  },
  {
    id: 'avatar_dark_elemental',
    name: '暗影元素',
    description: '深邃的黑暗之灵',
    price: 350,
    rarity: 'epic',
    avatarType: 'dark_elemental',
    icon: '🌑',
  },
  {
    id: 'avatar_phoenix_lord',
    name: '凤凰君主',
    description: '浴火重生的不死鸟',
    price: 600,
    rarity: 'legendary',
    avatarType: 'phoenix_lord',
    icon: '🦅',
  },
  {
    id: 'avatar_ice_queen',
    name: '冰霜女王',
    description: '寒冰国度的统治者',
    price: 600,
    rarity: 'legendary',
    avatarType: 'ice_queen',
    icon: '👑',
  },
  {
    id: 'avatar_storm_titan',
    name: '风暴泰坦',
    description: '掌控风暴的远古巨人',
    price: 600,
    rarity: 'legendary',
    avatarType: 'storm_titan',
    icon: '⛈️',
  },
];

export const SHOP_CATEGORY_NAMES: Record<string, string> = {
  card_pack: '卡包',
  card_border: '卡背边框',
  avatar: '头像',
};

export const SHOP_CATEGORY_ICONS: Record<string, string> = {
  card_pack: '📦',
  card_border: '🖼️',
  avatar: '👤',
};

export const DISASSEMBLE_ESSENCE: Record<Rarity, number> = {
  common: 5,
  rare: 20,
  epic: 100,
  legendary: 500,
};

export const SYNTHESIZE_ESSENCE: Record<Rarity, number> = {
  common: 20,
  rare: 80,
  epic: 400,
  legendary: 2000,
};

export const RARITY_NAMES: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};
