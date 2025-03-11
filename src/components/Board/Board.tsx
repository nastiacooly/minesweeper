import { initNewGameBoard } from "../../utils/board";
import { BoardCell } from "../BoardCell/BoardCell";

import styles from "./Board.module.scss";

export const Board = () => {
	const board = initNewGameBoard();

	return (
		<div className={styles.root}>
			<div className={styles["board-wrapper"]}>
				{board.map((row, i) => {
					return (
						<div key={`row-${i}`} className={styles.row}>
							{row.map(({ content, state }, j) => {
								return (
									<BoardCell
										key={`cell-${i}-${j}`}
										content={content}
										state={state}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};
