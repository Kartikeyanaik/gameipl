"use client";

import HomeScreen from "@/components/HomeScreen";
import GameScreen from "@/components/GameScreen";
import ResultScreen from "@/components/ResultScreen";
import { useGameState } from "@/hooks/useGameState";
import { calculateTeamScore } from "@/data/gameLogic";

export default function Page() {
  const gameState = useGameState();
  const { state, startGame, toggleBudget } = gameState;

  if (state.phase === "home") {
    return (
      <HomeScreen
        onStart={startGame}
        budgetEnabled={state.config.budgetEnabled}
        onToggleBudget={toggleBudget}
      />
    );
  }

  if (state.phase === "complete") {
    const score = calculateTeamScore(state.picks, state.requirements);
    return (
      <ResultScreen
        picks={state.picks}
        score={score}
        onPlayAgain={startGame}
      />
    );
  }

  return <GameScreen gameState={gameState} />;
}
