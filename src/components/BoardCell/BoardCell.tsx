import { FC } from "react";
import { Cell } from "../../utils/board";

import styles from "./BoardCell.module.scss";

type Props = Cell;

export const BoardCell: FC<Props> = ({ content }) => {
	return <button className={styles.root}>{content || ""}</button>;
};
