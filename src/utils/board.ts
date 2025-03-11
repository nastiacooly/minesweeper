export interface Cell {
	// bomb is minus 1;
	content: number;
	state: "open" | "blank" | "flagged" | "questionMarked";
}

type Board = Cell[][];

const ROWS = 9;
const COLUMNS = 9;
const BOMBS = 10;

const createEmptyBoard = (): Board => {
	const board: Board = Array.from({ length: ROWS }, () =>
		Array.from({ length: COLUMNS }, () => ({ content: 0, state: "blank" }))
	);

	return board;
};

type Row = number;
type Col = number;

const generateBombs = (quantity: number): Array<[Row, Col]> => {
	const bombsCoordinates = new Set<string>();

	while (bombsCoordinates.size < quantity) {
		const x = Math.floor(Math.random() * ROWS);
		const y = Math.floor(Math.random() * COLUMNS);
		bombsCoordinates.add(`${x}, ${y}`);
	}

	return [...bombsCoordinates].map((coordinate) => {
		const coordinateTulip = coordinate.split(",");
		const bombRow = +coordinateTulip[0];
		const bombCol = +coordinateTulip[1];
		return [bombRow, bombCol];
	});
};

export const initNewGameBoard = (): Board => {
	const board = createEmptyBoard();
	const bombsCoordinates = generateBombs(BOMBS);

	bombsCoordinates.forEach((coordinate) => {
		// place bomb
		const bombRow = coordinate[0];
		const bombCol = coordinate[1];
		board[bombRow][bombCol].content = -1;
	});

	bombsCoordinates.forEach((coordinate) => {
		const bombRow = coordinate[0];
		const bombCol = coordinate[1];

		// place numbers around bomb
		const rowAbove = bombRow - 1;
		const rowBelow = bombRow + 1;
		const colLeft = bombCol - 1;
		const colRight = bombCol + 1;

		const startCol = colLeft >= 0 ? colLeft : bombCol;
		const endCol = colRight < COLUMNS ? colRight : bombCol;
		const startRow = rowAbove >= 0 ? rowAbove : bombRow;
		const endRow = rowBelow < ROWS ? rowBelow : bombRow;

		for (let r = startRow; r <= endRow; r++) {
			for (let c = startCol; c <= endCol; c++) {
				if (board[r][c].content !== -1) {
					board[r][c].content += 1;
				}
			}
		}
	});

	return board;
};
