import { useGameActions } from "../../context/useGameContext";

export const GameControls = () => {
	const { startNewGame } = useGameActions();

	return (
		<div>
			<button onClick={startNewGame}>New Game</button>
		</div>
	);
};
