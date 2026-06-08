import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/MainMenu';
import BattleScene from '@/components/BattleScene';
import DuoBattleScene from '@/components/DuoBattleScene';
import GameOverScreen from '@/components/GameOverScreen';
import LevelCompleteModal from '@/components/LevelCompleteModal';
import DailyQuests from '@/components/DailyQuests';
import Shop from '@/components/Shop';
import MyCards from '@/components/MyCards';
import CardCollection from '@/components/CardCollection';
import { useEffect } from 'react';

export default function Home() {
  const { phase, mode, showLevelComplete, showShop, showMyCards, showCollection, checkDailyRefresh, saveGame } = useGameStore();

  useEffect(() => {
    checkDailyRefresh();
  }, [checkDailyRefresh]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveGame]);

  const isDuoMode = mode === 'duo';

  return (
    <div className="min-h-screen w-full">
      {phase === 'menu' && <MainMenu />}
      
      {(phase === 'battle' || phase === 'victory' || phase === 'defeat') && (
        <>
          {isDuoMode ? (
            <DuoBattleScene />
          ) : (
            <>
              <BattleScene />
              {phase === 'victory' && <GameOverScreen type="victory" />}
              {phase === 'defeat' && <GameOverScreen type="defeat" />}
              {showLevelComplete && phase === 'battle' && <LevelCompleteModal />}
            </>
          )}
        </>
      )}

      {!isDuoMode && <DailyQuests />}
      {showShop && <Shop />}
      {showMyCards && <MyCards />}
      {showCollection && <CardCollection />}
    </div>
  );
}
