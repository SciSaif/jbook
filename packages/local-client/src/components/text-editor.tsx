import MDEditor from "@uiw/react-md-editor";
import {useState, useEffect, useRef} from "react";
import "./text-editor.css";
import {useActions} from "../hooks/use-actions";
import {Cell} from "../redux/cells/cellsSlice";

interface TextEditorProps {
	cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({cell}) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [editing, setEditing] = useState(false);
	const {update_cell} = useActions();

	useEffect(() => {
		const listener = (event: MouseEvent) => {
			if (ref.current && event.target && ref.current.contains(event.target as Node)) {
				// console.log("element clicked on is inside editor");
				return;
			}
			// console.log("element clicked on is outside editor");

			setEditing(false);
		};

		document.addEventListener("click", listener, {capture: true});

		return () => {
			document.removeEventListener("click", listener, {capture: true});
		};
	}, []);

	if (editing) {
		return (
			<div ref={ref} className="text-editor">
				<MDEditor value={cell.content} onChange={(v) => update_cell({id: cell.id, content: v || ""})} />
			</div>
		);
	}

	return (
		<div onClick={() => setEditing(true)} className="text-editor card">
			<div className="card-content">
				<MDEditor.Markdown source={cell.content || "Click to Edit"} style={{whiteSpace: "pre-wrap"}} />
			</div>
		</div>
	);
};

export default TextEditor;
