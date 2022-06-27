import React from "react";
import {useActions} from "../hooks/use-actions";
import "./action-bar.css";

interface ActionBarProps {
	id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({id}) => {
	const {move_cell, delete_cell} = useActions();

	return (
		<div className="action-bar">
			<button onClick={() => move_cell({id: id, direction: "up"})} className="button is-primary is-small">
				<span className="icon">
					<i className="fas fa-arrow-up"></i>
				</span>
			</button>
			<button onClick={() => move_cell({id: id, direction: "down"})} className="button is-primary is-small">
				<span className="icon">
					<i className="fas fa-arrow-down"></i>
				</span>
			</button>
			<button onClick={() => delete_cell(id)} className="button is-primary is-small">
				<span className="icon">
					<i className="fas fa-times"></i>
				</span>
			</button>
		</div>
	);
};

export default ActionBar;
