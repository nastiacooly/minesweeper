import { ChangeEventHandler, useState } from "react";
import { useGameActions } from "../../context/useGameContext";
import { DifficultyLevel, isDifficultyLevel } from "../../context/utils";

export const GameControls = () => {
	const [chosenDifficulty, setChosenDifficulty] =
		useState<DifficultyLevel>("novice");

	const { startNewGame } = useGameActions();

	const handleDifficultyChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = e.currentTarget.value;
		if (isDifficultyLevel(value)) {
			setChosenDifficulty(value);
		}
	};

	return (
		<div>
			<fieldset>
				<legend>Please select game difficulty:</legend>
				<div>
					<input
						type="radio"
						id="difficultyNovice"
						name="difficulty"
						value="novice"
						checked={chosenDifficulty === "novice"}
						onChange={handleDifficultyChange}
					/>
					<label htmlFor="difficultyNovice">Novice</label>

					<input
						type="radio"
						id="difficultyAmateur"
						name="difficulty"
						value="amateur"
						checked={chosenDifficulty === "amateur"}
						onChange={handleDifficultyChange}
					/>
					<label htmlFor="difficultyAmateur">Amateur</label>

					<input
						type="radio"
						id="difficultyMaster"
						name="difficulty"
						value="master"
						checked={chosenDifficulty === "master"}
						onChange={handleDifficultyChange}
					/>
					<label htmlFor="difficultyMaster">Master</label>
				</div>
			</fieldset>
			<button onClick={() => startNewGame(chosenDifficulty)}>New Game</button>
		</div>
	);
};
