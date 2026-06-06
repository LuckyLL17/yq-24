import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/MainMenu';
import BattleScene from '@/components/BattleScene';
import GameOverScreen from '@/components/GameOverScreen';

export default function Home() {
  const { phase, mode } = useGameStore();

  return (
    <div className="min-h-screen w-full">
      {phase === 'menu' && <MainMenu />}

      {phase === 'battle' && (
        <>
          <BattleScene mode="battle" />
        </>
      )}

      {phase === 'challenge' && (
        <>
          <BattleScene mode="challenge" />
        </>
      )}

      {phase === 'victory' && <GameOverScreen type="victory" />}
      {phase === 'defeat' && <GameOverScreen type="defeat" />}
    </div>
  );
}
