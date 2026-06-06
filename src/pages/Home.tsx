import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/MainMenu';
import BattleScene from '@/components/BattleScene';
import GameOverScreen from '@/components/GameOverScreen';

export default function Home() {
  const { phase } = useGameStore();

  return (
    <div className="min-h-screen w-full">
      {phase === 'menu' && <MainMenu />}
      
      {(phase === 'battle' || phase === 'victory' || phase === 'defeat') && (
        <>
          <BattleScene />
          {phase === 'victory' && <GameOverScreen type="victory" />}
          {phase === 'defeat' && <GameOverScreen type="defeat" />}
        </>
      )}
    </div>
  );
}
