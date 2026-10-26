"use client";

import { useState } from "react";
import HomeScreen from "@/components/HomeScreen";
import GameScreen from "@/components/GameScreen";
import ResultScreen from "@/components/ResultScreen";
import DraftHistoryModal from "@/components/DraftHistoryModal";
import { useGameState } from "@/hooks/useGameState";
import { calculateTeamScore } from "@/data/gameLogic";

export default function Page() {
  const gameState = useGameState();
  const { state, startGame, resetGame, resumeDraft, toggleBudget } = gameState;
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleOpenHistory = () => setHistoryOpen(true);
  const handleCloseHistory = () => setHistoryOpen(false);

  const handleResumeFromModal = (draftId: string) => {
    resumeDraft(draftId);
  };

  return (
    <>
      {state.phase === "home" && (
        <HomeScreen
          onStart={startGame}
          budgetEnabled={state.config.budgetEnabled}
          onToggleBudget={toggleBudget}
          onOpenHistory={handleOpenHistory}
        />
      )}

      {(state.phase === "spinning" || state.phase === "picking") && (
        <GameScreen
          gameState={gameState}
          onOpenHistory={handleOpenHistory}
        />
      )}

      {state.phase === "complete" && (
        <ResultScreen
          picks={state.picks}
          score={state.serverScore || calculateTeamScore(state.picks, state.requirements)}
          onPlayAgain={startGame}
          onHome={resetGame}
          onOpenHistory={handleOpenHistory}
        />
      )}

      {/* Draft History Drawer / Modal */}
      <DraftHistoryModal
        isOpen={historyOpen}
        onClose={handleCloseHistory}
        onResumeDraft={handleResumeFromModal}
      />
    </>
  );
}
