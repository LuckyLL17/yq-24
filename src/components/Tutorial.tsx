import { useGameStore } from '@/store/gameStore';
import { ELEMENTS, COMBOS } from '@/data/gameData';
import { cn } from '@/lib/utils';
import type { TutorialStep } from '@/types/game';

interface TutorialContent {
  title: string;
  description: string;
  tips?: string[];
  highlightArea?: 'hand' | 'combo_preview' | 'release_button' | 'enemy' | 'player' | 'status_effects' | 'none';
  position: 'top' | 'center' | 'bottom';
  icon?: string;
}

const tutorialContents: Record<TutorialStep, TutorialContent> = {
  welcome: {
    title: '欢迎来到元素对战！',
    description: '这是一款以元素组合为核心的策略卡牌游戏。你将使用火、水、土、风等元素卡牌，通过两两组合释放强力技能，击败对手！',
    tips: [
      '选择两张不同元素的卡牌可以触发组合技',
      '不同的元素组合有不同的效果',
      '合理利用状态效果可以事半功倍',
    ],
    highlightArea: 'none',
    position: 'center',
    icon: '🎮',
  },
  cards: {
    title: '选择你的卡牌',
    description: '底部是你的手牌区，每张卡牌代表一种元素。点击卡牌可以将其选中，你需要选择两张卡牌来释放组合技。',
    tips: [
      '点击卡牌选中，再次点击取消选中',
      '每次最多选中两张卡牌',
      '选中的卡牌会显示在上方的槽位中',
    ],
    highlightArea: 'hand',
    position: 'top',
    icon: '🃏',
  },
  combo: {
    title: '元素组合技',
    description: '当你选中两张卡牌后，系统会自动预览组合技效果。不同的元素组合会产生不同的强力技能！',
    tips: [
      '火 + 风 = 火焰风暴：大量伤害 + 灼烧',
      '水 + 土 = 藤蔓缠绕：伤害 + 眩晕',
      '火 + 水 = 蒸汽爆发：伤害 + 治疗',
      '共有6种基础组合，快去发现吧！',
    ],
    highlightArea: 'combo_preview',
    position: 'top',
    icon: '✨',
  },
  release: {
    title: '释放组合技',
    description: '选中两张有效卡牌后，点击"释放"按钮即可发动组合技，对敌人造成伤害或施加各种效果！',
    tips: [
      '强力组合技有冷却时间，使用后需要等待几回合',
      '观察冷却时间，合理规划出牌顺序',
      '你可以在技能升级面板强化组合技',
    ],
    highlightArea: 'release_button',
    position: 'top',
    icon: '💥',
  },
  status_effects: {
    title: '状态效果说明',
    description: '组合技会附带各种状态效果，善用它们可以大幅提升战斗效率！状态效果会显示在角色头像下方。',
    tips: [
      '🔥 灼烧：每回合造成持续伤害',
      '❄️ 冻结：使敌人无法行动',
      '💫 眩晕：使敌人跳过回合',
      '☠️ 中毒：每回合造成毒素伤害',
      '🛡️ 护盾：吸收伤害的保护层',
      '💪 力量：提升攻击力',
    ],
    highlightArea: 'enemy',
    position: 'bottom',
    icon: '🔮',
  },
  turn_based: {
    title: '回合制战斗',
    description: '战斗采用回合制，你先出牌，然后是敌人的回合。每回合开始会自动抽取新的卡牌。',
    tips: [
      '每回合开始抽2张牌',
      '敌人头上会显示下一回合的行动意图',
      '根据敌人意图调整你的策略',
    ],
    highlightArea: 'none',
    position: 'center',
    icon: '⏱️',
  },
  hp_shield: {
    title: '生命值与护盾',
    description: '将敌人的生命值降为0即可获胜！护盾可以吸收伤害，玩家护盾每回合开始时会重置。',
    tips: [
      '红色条是生命值，归零则失败',
      '护盾会优先吸收伤害',
      '玩家护盾每回合开始时重置',
      '合理使用治疗和护盾技能保持续航',
    ],
    highlightArea: 'player',
    position: 'top',
    icon: '❤️',
  },
  complete: {
    title: '教程完成！',
    description: '恭喜你完成了新手教程！现在你已经掌握了游戏的基本玩法，快去迎接挑战吧！',
    tips: [
      '挑战模式有更多强力Boss等你征服',
      '用元素精华升级你的组合技',
      '完成每日任务获取丰厚奖励',
      '祝你游戏愉快！',
    ],
    highlightArea: 'none',
    position: 'center',
    icon: '🎉',
  },
};

const stepOrder: TutorialStep[] = ['welcome', 'cards', 'combo', 'release', 'status_effects', 'turn_based', 'hp_shield', 'complete'];

export default function Tutorial() {
  const { tutorial, nextTutorialStep, prevTutorialStep, skipTutorial, completeTutorial } = useGameStore();

  if (!tutorial.showTutorial) return null;

  const currentContent = tutorialContents[tutorial.currentStep];
  const currentIndex = stepOrder.indexOf(tutorial.currentStep);
  const totalSteps = stepOrder.length;
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextTutorialStep();
    }
  };

  const handleSkip = () => {
    skipTutorial();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/70 pointer-events-auto" />

      {/* 高亮区域 - 使用inset-0确保定位正确 */}
      {currentContent.highlightArea !== 'none' && (
        <div className="absolute inset-0 pointer-events-none">
          {currentContent.highlightArea === 'hand' && (
            <div className="absolute bottom-0 left-0 right-0 h-80 border-2 border-amber-400/80 rounded-t-3xl animate-pulse z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent rounded-t-3xl" />
              <div className="absolute -inset-1 bg-amber-400/30 rounded-t-3xl blur-md -z-10" />
            </div>
          )}
          {currentContent.highlightArea === 'combo_preview' && (
            <div className="absolute left-1/2 -translate-x-1/2 w-[420px] h-24 border-2 border-amber-400/80 rounded-full animate-pulse z-10" style={{ bottom: '20rem' }}>
              <div className="absolute inset-0 bg-amber-400/20 rounded-full" />
              <div className="absolute -inset-1 bg-amber-400/30 rounded-full blur-md -z-10" />
            </div>
          )}
          {currentContent.highlightArea === 'release_button' && (
            <div className="absolute left-1/2 -translate-x-1/2 w-80 h-16 border-2 border-amber-400/80 rounded-xl animate-pulse z-10" style={{ bottom: '3rem' }}>
              <div className="absolute inset-0 bg-amber-400/20 rounded-xl" />
              <div className="absolute -inset-1 bg-amber-400/30 rounded-xl blur-md -z-10" />
            </div>
          )}
          {currentContent.highlightArea === 'enemy' && (
            <div className="absolute left-1/2 -translate-x-1/2 w-96 h-44 border-2 border-amber-400/80 rounded-2xl animate-pulse z-10" style={{ top: '6rem' }}>
              <div className="absolute inset-0 bg-amber-400/15 rounded-2xl" />
              <div className="absolute -inset-1 bg-amber-400/25 rounded-2xl blur-md -z-10" />
            </div>
          )}
          {currentContent.highlightArea === 'player' && (
            <div className="absolute left-1/2 -translate-x-1/2 w-96 h-44 border-2 border-amber-400/80 rounded-2xl animate-pulse z-10" style={{ bottom: '22rem' }}>
              <div className="absolute inset-0 bg-amber-400/15 rounded-2xl" />
              <div className="absolute -inset-1 bg-amber-400/25 rounded-2xl blur-md -z-10" />
            </div>
          )}
        </div>
      )}

      {/* 教程弹窗 - 使用更安全的定位防止被截断 */}
      <div className={cn(
        'absolute left-1/2 -translate-x-1/2 pointer-events-auto z-20',
        currentContent.position === 'top' && 'top-20',
        currentContent.position === 'center' && 'top-1/2 -translate-y-1/2',
        currentContent.position === 'bottom' && 'top-1/2 -translate-y-1/2',
      )}>
        <div className="relative w-[480px] max-w-[90vw]">
          {/* 装饰光效 */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-amber-500/30 rounded-2xl blur-lg" />
          
          {/* 主卡片 */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* 顶部装饰条 */}
            <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 flex-shrink-0" />
            
            {/* 内容区 */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* 标题 */}
              <div className="flex items-center gap-3 mb-4">
                {currentContent.icon && (
                  <span className="text-4xl animate-bounce-slow">{currentContent.icon}</span>
                )}
                <h2 
                  className="text-2xl font-bold text-gradient-gold"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  {currentContent.title}
                </h2>
              </div>

              {/* 描述 */}
              <p className="text-white/80 leading-relaxed mb-4">
                {currentContent.description}
              </p>

              {/* 提示列表 */}
              {currentContent.tips && currentContent.tips.length > 0 && (
                <div className="space-y-2 mb-6">
                  {currentContent.tips.map((tip, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 text-sm text-white/70"
                    >
                      <span className="text-amber-400 mt-0.5">✦</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 状态效果展示 - 特殊处理 */}
              {tutorial.currentStep === 'status_effects' && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['burn', 'freeze', 'poison', 'stun', 'heal', 'shield'].map((effect) => {
                    const effectInfo: Record<string, { icon: string; name: string; color: string }> = {
                      burn: { icon: '🔥', name: '灼烧', color: 'text-orange-400' },
                      freeze: { icon: '❄️', name: '冻结', color: 'text-cyan-400' },
                      poison: { icon: '☠️', name: '中毒', color: 'text-green-500' },
                      stun: { icon: '💫', name: '眩晕', color: 'text-yellow-400' },
                      heal: { icon: '💚', name: '治疗', color: 'text-emerald-400' },
                      shield: { icon: '🛡️', name: '护盾', color: 'text-amber-400' },
                    };
                    const info = effectInfo[effect];
                    return (
                      <div 
                        key={effect}
                        className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <span className="text-2xl mb-1">{info.icon}</span>
                        <span className={cn('text-xs font-medium', info.color)}>{info.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 组合展示 - 特殊处理 */}
              {tutorial.currentStep === 'combo' && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {COMBOS.slice(0, 4).map((combo) => (
                    <div 
                      key={combo.id}
                      className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10"
                    >
                      <span className="text-lg">{ELEMENTS[combo.elements[0]].icon}</span>
                      <span className="text-amber-400 text-xs">+</span>
                      <span className="text-lg">{ELEMENTS[combo.elements[1]].icon}</span>
                      <span className="text-xs text-white/70 ml-1 truncate">{combo.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 步骤指示器 */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {stepOrder.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-amber-400 to-orange-500'
                        : index < currentIndex
                        ? 'w-4 bg-amber-500/50'
                        : 'w-4 bg-white/20'
                    )}
                  />
                ))}
              </div>

              {/* 按钮区 */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-white/50 hover:text-white/80 text-sm transition-colors"
                >
                  跳过教程
                </button>

                <div className="flex items-center gap-3">
                  {!isFirstStep && (
                    <button
                      onClick={prevTutorialStep}
                      className="px-5 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/60 text-white/80 border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      上一步
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className={cn(
                      'px-6 py-2.5 rounded-lg font-bold transition-all duration-200 border-2',
                      isLastStep
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:scale-105 border-amber-300/50 shadow-lg shadow-orange-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 border-purple-400/50 shadow-lg shadow-purple-500/30'
                    )}
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                  >
                    {isLastStep ? '开始游戏！' : '下一步 →'}
                  </button>
                </div>
              </div>
            </div>

            {/* 步骤计数 */}
            <div className="absolute top-3 right-4 text-xs text-white/40 font-medium">
              {currentIndex + 1} / {totalSteps}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
