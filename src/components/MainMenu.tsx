import { useGameStore } from '@/store/gameStore';
import { ELEMENTS, COMBOS } from '@/data/gameData';

export default function MainMenu() {
  const { startBattle, startChallenge } = useGameStore();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950" />

      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="absolute top-20 left-20 text-6xl animate-float opacity-30">🔥</div>
      <div className="absolute top-40 right-32 text-5xl animate-float opacity-30" style={{ animationDelay: '1s' }}>💧</div>
      <div className="absolute bottom-32 left-32 text-7xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>🌍</div>
      <div className="absolute bottom-20 right-20 text-6xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>🌪️</div>

      <div className="relative z-10 text-center mb-12">
        <div className="flex justify-center gap-4 mb-4">
          {Object.values(ELEMENTS).map((el, i) => (
            <span
              key={i}
              className="text-5xl animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {el.icon}
            </span>
          ))}
        </div>

        <h1
          className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow-2xl mb-4"
          style={{ textShadow: '0 0 40px rgba(251, 191, 36, 0.5)' }}
        >
          元素对决
        </h1>
        <p className="text-xl text-white/60 tracking-widest">ELEMENTAL DUELS</p>
        <p className="text-white/40 mt-2">两两搭配，释放组合技</p>
      </div>

      <div className="relative z-10 flex flex-col gap-4 w-72">
        <button
          onClick={startBattle}
          className="group relative px-8 py-4 rounded-xl font-bold text-xl text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            ⚔️ 对战模式
          </span>
        </button>

        <button
          onClick={startChallenge}
          className="group relative px-8 py-4 rounded-xl font-bold text-xl text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber-300/30 to-red-300/30 blur-xl" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            🔥 连击挑战
          </span>
        </button>
      </div>

      <div className="relative z-10 mt-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 max-w-2xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4 text-center">组合技图鉴</h3>
        <div className="grid grid-cols-5 gap-3">
          {COMBOS.map((combo) => (
            <div
              key={combo.id}
              className="flex flex-col items-center p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors cursor-default"
              title={combo.description}
            >
              <div className="text-2xl mb-1">
                {ELEMENTS[combo.elements[0]].icon}+{ELEMENTS[combo.elements[1]].icon}
              </div>
              <div className="text-xs text-white/70 text-center font-medium">{combo.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-8 text-white/30 text-sm">
        选择两张元素卡牌 → 组合释放强力技能
      </div>
    </div>
  );
}
