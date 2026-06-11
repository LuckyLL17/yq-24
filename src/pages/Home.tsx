import { useGameStore } from '@/store/gameStore';
import { lazy, Suspense, useCallback } from 'react';
import MainMenu from '@/components/MainMenu';
import { useEffect } from 'react';
import LoadingFallback from '@/components/LoadingFallback';

const BattleScene = lazy(() => import('@/components/BattleScene'));
const DuoBattleScene = lazy(() => import('@/components/DuoBattleScene'));
const GameOverScreen = lazy(() => import('@/components/GameOverScreen'));
const LevelCompleteModal = lazy(() => import('@/components/LevelCompleteModal'));
const DailyQuests = lazy(() => import('@/components/DailyQuests'));
const Shop = lazy(() => import('@/components/Shop'));
const MyCards = lazy(() => import('@/components/MyCards'));
const CardCollection = lazy(() => import('@/components/CardCollection'));
const AccountManager = lazy(() => import('@/components/AccountManager'));
const SaveManager = lazy(() => import('@/components/SaveManager'));
const PauseMenu = lazy(() => import('@/components/PauseMenu'));

export default function Home() {
  const { 
    phase, 
    mode, 
    showLevelComplete, 
    showShop, 
    showMyCards, 
    showCollection, 
    checkDailyRefresh, 
    saveGame,
    showAccountManager,
    showSaveManager,
    isPaused,
    initAccountSystem,
    resumeGame,
    setShowSaveManager,
  } = useGameStore();

  useEffect(() => {
    initAccountSystem();
    checkDailyRefresh();
  }, [initAccountSystem, checkDailyRefresh]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveGame();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'battle' && !isPaused) {
        useGameStore.getState().pauseGame();
      } else if (e.key === 'Escape' && isPaused) {
        resumeGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isPaused, resumeGame]);

  const isDuoMode = mode === 'duo';

  const onCloseSaveManager = useCallback(() => setShowSaveManager(false), [setShowSaveManager]);
  const onClosePauseMenu = useCallback(() => resumeGame(), [resumeGame]);

  return (
    <div className="min-h-screen w-full">
      {phase === 'menu' && <MainMenu />}
      
      {(phase === 'battle' || phase === 'victory' || phase === 'defeat') && (
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      )}

      {!isDuoMode && (
        <Suspense fallback={null}>
          <DailyQuests />
        </Suspense>
      )}
      {showShop && (
        <Suspense fallback={null}>
          <Shop />
        </Suspense>
      )}
      {showMyCards && (
        <Suspense fallback={null}>
          <MyCards />
        </Suspense>
      )}
      {showCollection && (
        <Suspense fallback={null}>
          <CardCollection />
        </Suspense>
      )}
      {showAccountManager && (
        <Suspense fallback={null}>
          <AccountManager />
        </Suspense>
      )}
      {showSaveManager && (
        <Suspense fallback={null}>
          <SaveManager onClose={onCloseSaveManager} />
        </Suspense>
      )}
      {isPaused && (
        <Suspense fallback={null}>
          <PauseMenu onClose={onClosePauseMenu} />
        </Suspense>
      )}
    </div>
  );
}
