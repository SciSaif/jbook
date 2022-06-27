import "./cell-list.css";
import {Fragment, useEffect} from "react";
import {useTypedSelector} from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import {useActions} from "../hooks/use-actions";

const CellList: React.FC = () => {
	const cells = useTypedSelector(({cells: {order, data}}) => {
		return order.map((id) => data[id]);
	});

	const {fetchCells, saveCells} = useActions();

	useEffect(() => {
		fetchCells();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		// debouncing logic
		const timer = setTimeout(async () => {
			if (cells.length > 0) {
				saveCells();
			}
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(cells)]);

	const renderedCells = cells.map((cell) => (
		<Fragment key={cell.id}>
			<CellListItem cell={cell} />
			<AddCell previousCellId={cell.id} />
		</Fragment>
	));

	return (
		<div className="cell-list">
			<AddCell forceVisible={cells.length === 0} previousCellId={null} />
			{renderedCells}
		</div>
	);
};

export default CellList;
