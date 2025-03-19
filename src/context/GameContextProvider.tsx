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
	hasWon,
	initNewGameBoard,
	openCellAndNeighbours,
} from "./utils";

type GameResult = "win" | "loss" | undefined;
type DifficultyLevel = "novice" | "amateur" | "master";

interface GameState {
	board: Board;
	difficulty: DifficultyLevel;
	openedSafeCells: Set<string>;
	result: GameResult;
}

interface GameActions {
	openCell: (row: number, col: number) => void;
	setGameResult: Dispatch<SetStateAction<GameResult>>;
	startNewGame: () => void;
}

const GameStateContext = createContext<GameState | null>(null);
const GameActionsContext = createContext<GameActions | null>(null);

export const GameContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [difficulty, setDifficulty] = useState<DifficultyLevel>("novice");
	const [board, setBoard] = useState<Board>(initNewGameBoard());
	const [openedSafeCells, setOpenedSafeCells] = useState<Set<string>>(
		new Set()
	);
	const [result, setResult] = useState<GameResult>();

	useEffect(() => {
		if (hasWon(openedSafeCells)) {
			setResult("win");
		}
	}, [openedSafeCells]);

	const startNewGame = useCallback(() => {
		setDifficulty("novice");
		setResult(undefined);
		setBoard(initNewGameBoard());
		setOpenedSafeCells(new Set());
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
		() => ({ board, difficulty, result, openedSafeCells }),
		[board, difficulty, result, openedSafeCells]
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
