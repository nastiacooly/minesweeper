import { FC, ReactNode, useState } from "react";
import { Mine } from "./Mine.svg";
import { useGameActions } from "../../context/useGameContext";

import styles from "./BoardCell.module.scss";

interface Props {
	content: number;
	isOpen: boolean;
	row: number;
	col: number;
}

export const BoardCell: FC<Props> = ({ content, isOpen, row, col }) => {
	const { openSafeCell, setGameResult } = useGameActions();
	const [open, setOpen] = useState<boolean>(isOpen);

	const getContent = (): ReactNode => {
		switch (content) {
			case -1:
				return <Mine />;
			case 0:
				return "";
			default:
				return <span data-content={content}>{content}</span>;
		}
	};

	const contentDisplay = getContent();

	const handleLeftClick = () => {
		if (content === -1) {
			setOpen(true);
			setGameResult("loss");
		} else {
			openSafeCell(row, col);
		}
	};

	return (
		<button onClick={handleLeftClick} disabled={isOpen} className={styles.root}>
			{(isOpen || open) && contentDisplay}
		</button>
	);
};
