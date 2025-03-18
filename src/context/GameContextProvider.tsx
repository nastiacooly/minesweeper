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
	openSafeCell: (row: number, col: number) => void;
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
	}, []);

	const openSafeCell = useCallback(
		(x: number, y: number) => {
			if (result !== undefined) {
				return;
			}
			setOpenedSafeCells((prevOpenedCells) => {
				return openCellAndNeighbours(board, x, y, new Set(prevOpenedCells));
			});
		},
		[board, result]
	);

	const gameContextValue = useMemo(
		() => ({ board, difficulty, result, openedSafeCells }),
		[board, difficulty, result, openedSafeCells]
	);

	return (
		<GameStateContext.Provider value={gameContextValue}>
			<GameActionsContext.Provider
				value={{ openSafeCell, setGameResult: setResult, startNewGame }}
			>
				{children}
			</GameActionsContext.Provider>
		</GameStateContext.Provider>
	);
};

export { GameStateContext, GameActionsContext };
