import {useRef, useEffect} from "react";
import "./preview.css";

interface PreviewProps {
	code: string;
	err: string;
}

const html = `
<html>
    <head>
    <style>html{background-color: white;}</style>
    </head>
    <body>
        <div id="root"></div>
        <script>
            const handleError = (err) => {
                const root = document.querySelector("#root");
                root.innerHTML = '<div Style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                console.error(err);
            }

            window.addEventListener('error',(event) => {
                event.preventDefault(); // prevent default error printout
                handleError(event.error);
            })

            window.addEventListener('message', (e) => {
                try{
                    root.innerHTML = '';
                    eval(e.data); 
                }catch(err) {
                    handleError(err);
                }
            }, false);
        </script>

    </body>
</html>`;

const Preview: React.FC<PreviewProps> = ({code, err}) => {
	const iframe = useRef<any>();

	// console.log(code);

	useEffect(() => {
		iframe.current.srcDoc = html;
		setTimeout(() => {
			iframe.current.contentWindow.postMessage(code, "*");
		}, 50);
	}, [code]);

	return (
		<div className="preview-wrapper">
			<iframe title="preview" ref={iframe} srcDoc={html} sandbox="allow-scripts" />
			{err && <div className="preview-error">{err}</div>}
		</div>
	);
};

export default Preview;
