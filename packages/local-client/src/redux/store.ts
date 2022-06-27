import {configureStore} from "@reduxjs/toolkit";
import cellsReducer from "./cells/cellsSlice";
import bundlesReducer from "./bundles/bundlesSlice";

export const store = configureStore({
	reducer: {
		cells: cellsReducer,
		bundles: bundlesReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
