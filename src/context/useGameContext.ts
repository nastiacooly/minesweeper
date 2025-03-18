import { useContext } from "react";
import { GameActionsContext, GameStateContext } from "./GameContextProvider";

export const useGameState = () => {
	const gameContext = useContext(GameStateContext);

	if (gameContext === null) {
		throw new Error("useGameState must be used within a GameContextProvider");
	}
	return gameContext;
};

export const useGameActions = () => {
	const setGameContext = useContext(GameActionsContext);

	if (setGameContext === null) {
		throw new Error("useGameActions must be used within a GameContextProvider");
	}
	return setGameContext;
};
