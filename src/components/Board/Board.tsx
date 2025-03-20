import { useGameState } from "../../context/useGameContext";
import { createCoordinateString } from "../../context/utils";
import { BoardCell } from "../BoardCell/BoardCell";

import styles from "./Board.module.scss";

export const Board = () => {
	const { board, difficulty, result, openedSafeCells, gameId } = useGameState();

	return (
		<div className={styles.root}>
			<div className={styles["board-wrapper"]}>
				<p>Current game difficulty: {difficulty.toUpperCase()}</p>
				{board.map((row, r) => {
					return (
						<div key={`${gameId}-row-${r}`} className={styles.row}>
							{row.map((content, c) => {
								const cellIsOpened = openedSafeCells.has(
									createCoordinateString(r, c)
								);
								return (
									<BoardCell
										key={`${gameId}-cell-${r}-${c}`}
										content={content}
										row={r}
										col={c}
										isOpen={
											result === "loss"
												? content === -1 || cellIsOpened
												: cellIsOpened
										}
										disabledClicks={result !== undefined}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
			<div>{result && <p>{result}</p>}</div>
		</div>
	);
};
