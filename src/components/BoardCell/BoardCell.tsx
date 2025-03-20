import { FC, MouseEventHandler, ReactNode, useState } from "react";
import { useGameActions } from "../../context/useGameContext";

import styles from "./BoardCell.module.scss";

interface Props {
	content: number;
	isOpen: boolean;
	row: number;
	col: number;
	disabledClicks: boolean;
}

export const BoardCell: FC<Props> = ({
	content,
	isOpen,
	row,
	col,
	disabledClicks,
}) => {
	const { openCell } = useGameActions();
	const [mark, setMark] = useState<"flag" | "questionMark">();

	const getContent = (): ReactNode => {
		switch (content) {
			case -1:
				return <span data-content={content}>X</span>;
			case 0:
				return "";
			default:
				return <span data-content={content}>{content}</span>;
		}
	};

	const contentDisplay = getContent();

	const handleLeftClick = () => {
		if (disabledClicks) return;
		openCell(row, col);
	};

	const handleRightClick: MouseEventHandler = (e) => {
		e.preventDefault();
		if (disabledClicks || isOpen) return;

		switch (mark) {
			case "flag":
				setMark("questionMark");
				break;
			case "questionMark":
				setMark(undefined);
				break;
			default:
				setMark("flag");
				return;
		}
	};

	return (
		<button
			onClick={handleLeftClick}
			onContextMenu={handleRightClick}
			disabled={isOpen}
			className={styles.root}
		>
			{isOpen && contentDisplay}
			{!isOpen &&
				(mark === "flag" ? (
					<span>!</span>
				) : mark === "questionMark" ? (
					<span>?</span>
				) : (
					""
				))}
		</button>
	);
};
