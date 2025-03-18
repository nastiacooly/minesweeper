// mine is minus 1
export type Board = number[][];

const ROWS = 9;
const COLUMNS = 9;
const MINES = 10;

const createEmptyBoard = (): Board => {
	return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
};

type Row = number;
type Col = number;

export const createCoordinateString = (row: Row, col: Col): string => {
	return `${row}, ${col}`;
};

const getCoordinatesFromString = (coordinateString: string): [Row, Col] => {
	const coordinateTulip = coordinateString.split(",");
	const mineRow = +coordinateTulip[0];
	const mineCol = +coordinateTulip[1];
	return [mineRow, mineCol];
};

const generateMines = (quantity: number): Array<[Row, Col]> => {
	const minesCoordinates = new Set<string>();

	while (minesCoordinates.size < quantity) {
		const x = Math.floor(Math.random() * ROWS);
		const y = Math.floor(Math.random() * COLUMNS);
		minesCoordinates.add(createCoordinateString(x, y));
	}

	return [...minesCoordinates].map((coordinate) => {
		return getCoordinatesFromString(coordinate);
	});
};

const getNeighboursLimits = (row: Row, col: Col) => {
	const rowAbove = row - 1;
	const rowBelow = row + 1;
	const colLeft = col - 1;
	const colRight = col + 1;

	const startCol = colLeft >= 0 ? colLeft : col;
	const endCol = colRight < COLUMNS ? colRight : col;
	const startRow = rowAbove >= 0 ? rowAbove : row;
	const endRow = rowBelow < ROWS ? rowBelow : row;

	return { startCol, endCol, startRow, endRow };
};

export const initNewGameBoard = (): Board => {
	const board = createEmptyBoard();
	const minesCoordinates = generateMines(MINES);

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
			mineCol
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

	if (board[row][col] === -1) {
		return updated;
	}

	updated = openCell(row, col, updated);

	if (board[row][col] > 0) {
		return updated;
	}

	const { startRow, endRow, startCol, endCol } = getNeighboursLimits(row, col);

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

export const hasWon = (openedSafeCells: Set<string>): boolean => {
	return openedSafeCells.size === ROWS * COLUMNS - MINES;
};
