import ReactDOM from "react-dom/client";
import React from "react";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {store} from "./redux/store";
import {Provider} from "react-redux";
import CellList from "./components/cell-list";

const App = () => {
	return (
		<div>
			<CellList />
		</div>
	);
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<App />
	</Provider>
	// </React.StrictMode>
);
