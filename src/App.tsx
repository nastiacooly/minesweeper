import { Board } from "./components/Board/Board";
import { GameControls } from "./components/GameControls/GameControls";
import { Header } from "./components/Header/Header";
import { GameContextProvider } from "./context/GameContextProvider";

const App = () => {
	return (
		<>
			<Header />
			<GameContextProvider>
				<Board />
				<GameControls />
			</GameContextProvider>
		</>
	);
};

export default App;
