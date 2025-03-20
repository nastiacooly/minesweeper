import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	Board,
	DifficultyLevel,
	generateGameId,
	hasWon,
	initNewGameBoard,
	openCellAndNeighbours,
} from "./utils";

type GameResult = "win" | "loss" | undefined;

interface GameState {
	board: Board;
	difficulty: DifficultyLevel;
	openedSafeCells: Set<string>;
	result: GameResult;
	gameId: number;
}

interface GameActions {
	openCell: (row: number, col: number) => void;
	setGameResult: Dispatch<SetStateAction<GameResult>>;
	startNewGame: (difficulty: DifficultyLevel) => void;
}

const GameStateContext = createContext<GameState | null>(null);
const GameActionsContext = createContext<GameActions | null>(null);

export const GameContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [difficulty, setDifficulty] = useState<DifficultyLevel>("novice");
	const [board, setBoard] = useState<Board>(
		initNewGameBoard(difficulty ?? "novice")
	);
	const [openedSafeCells, setOpenedSafeCells] = useState<Set<string>>(
		new Set()
	);
	const [result, setResult] = useState<GameResult>();
	const [gameId, setGameId] = useState<number>(generateGameId());

	useEffect(() => {
		if (hasWon(openedSafeCells, difficulty)) {
			setResult("win");
		}
	}, [openedSafeCells, difficulty]);

	const startNewGame = useCallback((difficulty: DifficultyLevel) => {
		setDifficulty(difficulty);
		setResult(undefined);
		setBoard(initNewGameBoard(difficulty));
		setOpenedSafeCells(new Set());
		setGameId(generateGameId());
	}, []);

	const openCell = useCallback(
		(x: number, y: number) => {
			if (result !== undefined) {
				return;
			}

			if (board[x][y] === -1) {
				setResult("loss");
				return;
			}

			setOpenedSafeCells((prevOpenedCells) => {
				return openCellAndNeighbours(board, x, y, new Set(prevOpenedCells));
			});
		},
		[board, result]
	);

	const gameStateContextValue = useMemo(
		() => ({ board, difficulty, result, openedSafeCells, gameId }),
		[board, difficulty, result, openedSafeCells, gameId]
	);

	const gameActionsContextValue = useMemo(
		() => ({ openCell, setGameResult: setResult, startNewGame }),
		[openCell, startNewGame]
	);

	return (
		<GameStateContext.Provider value={gameStateContextValue}>
			<GameActionsContext.Provider value={gameActionsContextValue}>
				{children}
			</GameActionsContext.Provider>
		</GameStateContext.Provider>
	);
};

export { GameStateContext, GameActionsContext };
