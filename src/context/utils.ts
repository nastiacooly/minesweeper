// mine is minus 1
export type Board = number[][];

const ALL_DIFFICULTIES = ["novice", "amateur", "master"] as const;
type DifficultyLevels = typeof ALL_DIFFICULTIES;
export type DifficultyLevel = DifficultyLevels[number];

export const isDifficultyLevel = (value: string): value is DifficultyLevel => {
	return ALL_DIFFICULTIES.includes(value as DifficultyLevel);
};

type Row = number;
type Col = number;

type BoardParams = {
	rows: number;
	cols: number;
	mines: number;
};

const BOARD_PARAMS_BY_DIFFICULTY: Map<DifficultyLevel, BoardParams> = new Map([
	["novice", { rows: 9, cols: 9, mines: 10 }],
	["amateur", { rows: 16, cols: 16, mines: 40 }],
	["master", { rows: 16, cols: 32, mines: 99 }],
]);

const getBoardParamsByDifficulty = (
	difficulty: DifficultyLevel
): BoardParams => {
	const boardParams = BOARD_PARAMS_BY_DIFFICULTY.get(difficulty);
	if (!boardParams) {
		throw new Error("No board params found for provided difficulty level");
	}
	return boardParams;
};

const createEmptyBoard = ({
	rows,
	cols,
}: Pick<BoardParams, "rows" | "cols">): Board => {
	return Array.from({ length: rows }, () => Array(cols).fill(0));
};

export const createCoordinateString = (row: Row, col: Col): string => {
	return `${row}, ${col}`;
};

const getCoordinatesFromString = (coordinateString: string): [Row, Col] => {
	const coordinateTulip = coordinateString.split(",");
	const mineRow = +coordinateTulip[0];
	const mineCol = +coordinateTulip[1];
	return [mineRow, mineCol];
};

const generateMines = ({
	rows,
	cols,
	mines,
}: BoardParams): Array<[Row, Col]> => {
	const minesCoordinates = new Set<string>();

	while (minesCoordinates.size < mines) {
		const x = Math.floor(Math.random() * rows);
		const y = Math.floor(Math.random() * cols);
		minesCoordinates.add(createCoordinateString(x, y));
	}

	return [...minesCoordinates].map((coordinate) => {
		return getCoordinatesFromString(coordinate);
	});
};

const getNeighboursLimits = (
	row: Row,
	col: Col,
	{ rows, cols }: Pick<BoardParams, "rows" | "cols">
) => {
	const rowAbove = row - 1;
	const rowBelow = row + 1;
	const colLeft = col - 1;
	const colRight = col + 1;

	const startCol = colLeft >= 0 ? colLeft : col;
	const endCol = colRight < cols ? colRight : col;
	const startRow = rowAbove >= 0 ? rowAbove : row;
	const endRow = rowBelow < rows ? rowBelow : row;

	return { startCol, endCol, startRow, endRow };
};

export const initNewGameBoard = (difficulty: DifficultyLevel): Board => {
	const boardParams = getBoardParamsByDifficulty(difficulty);
	const board = createEmptyBoard(boardParams);
	const minesCoordinates = generateMines(boardParams);

	minesCoordinates.forEach((coordinate) => {
		// place mine
		const mineRow = coordinate[0];
		const mineCol = coordinate[1];
		board[mineRow][mineCol] = -1;
	});

	minesCoordinates.forEach((coordinate) => {
		const mineRow = coordinate[0];
		const mineCol = coordinate[1];

		// place numbers around mine
		const { startRow, endRow, startCol, endCol } = getNeighboursLimits(
			mineRow,
			mineCol,
			boardParams
		);

		for (let r = startRow; r <= endRow; r++) {
			for (let c = startCol; c <= endCol; c++) {
				if (board[r][c] !== -1) {
					board[r][c] += 1;
				}
			}
		}
	});

	return board;
};

const openCell = (
	row: Row,
	col: Col,
	openedCellsSet: Set<string>
): Set<string> => {
	const coordinateString = createCoordinateString(row, col);
	const updated = new Set([...openedCellsSet, coordinateString]);
	return updated;
};

export const openCellAndNeighbours = (
	board: Board,
	row: Row,
	col: Col,
	openedCellsSet: Set<string>
): Set<string> => {
	let updated = new Set(openedCellsSet);

	updated = openCell(row, col, updated);

	if (board[row][col] > 0) {
		return updated;
	}

	const { startRow, endRow, startCol, endCol } = getNeighboursLimits(row, col, {
		rows: board.length,
		cols: board[0].length,
	});

	for (let r = startRow; r <= endRow; r++) {
		for (let c = startCol; c <= endCol; c++) {
			const coordinateString = createCoordinateString(r, c);
			if (!updated.has(coordinateString)) {
				updated = openCellAndNeighbours(board, r, c, updated);
			}
		}
	}

	return updated;
};

export const hasWon = (
	openedSafeCells: Set<string>,
	difficulty: DifficultyLevel
): boolean => {
	const { rows, cols, mines } = getBoardParamsByDifficulty(difficulty);
	return openedSafeCells.size === rows * cols - mines;
};

export const generateGameId = () => {
	return new Date().getTime();
};
