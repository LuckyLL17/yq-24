export default function LoadingFallback() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center battle-ground">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl animate-pulse">✨</span>
          </div>
        </div>
        <p className="text-amber-400/80 text-sm tracking-widest animate-pulse" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          加载中...
        </p>
      </div>
    </div>
  );
}
