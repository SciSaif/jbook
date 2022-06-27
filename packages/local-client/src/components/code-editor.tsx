import MonacoEditor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import {useRef} from "react";

import "./code-editor.css";

interface CodeEditorProps {
	initialValue: string;
	onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, onChange}) => {
	const editorRef = useRef<any>();

	const onEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
		editorRef.current = editor;

		editor.onDidChangeModelContent(() => {
			onChange(editor.getValue());
		});
		editor.getModel()?.updateOptions({tabSize: 2});
	};

	const onFormatClick = () => {
		// get current value from editor
		const unformatted = editorRef.current?.getModel().getValue();
		// format that value

		const formatted = prettier
			.format(unformatted, {
				parser: "babel",
				plugins: [parser],
				useTabs: false,
				semi: true,
				singleQuote: true,
			})
			.replace(/\n$/, "");
		// set the formatted value back in the editor

		editorRef.current.setValue(formatted);
	};

	return (
		<div className="editor-wrapper">
			<button onClick={onFormatClick} className="button button-format is-primary is-small">
				Format
			</button>
			<MonacoEditor
				options={{
					wordWrap: "on",
					minimap: {enabled: false},
					showUnused: false, // import statement is not faded if not used
					folding: false,
					lineNumbersMinChars: 3,
					fontSize: 16,
					scrollBeyondLastLine: false,
					automaticLayout: true,
				}}
				value={initialValue}
				onMount={onEditorMount}
				theme="vs-dark"
				language="javascript"
				height="100%"
			/>
		</div>
	);
};

export default CodeEditor;
