import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";
import axios, {AxiosError} from "axios";
import {RootState} from "../store";

type CellTypes = "code" | "text";

export interface Cell {
	id: string;
	type: CellTypes;
	content: string;
}

interface CellsState {
	loading: boolean;
	error: string | null;
	order: string[];
	data: {
		[key: string]: Cell;
	};
}

const initiaState: CellsState = {
	loading: false,
	error: null,
	order: [],
	data: {},
};

// fetch cells from file
const fetchCells = createAsyncThunk<Cell[], undefined, {rejectValue: string}>("bundles/fetchCells", async (_, thunkAPI) => {
	try {
		const {data}: {data: Cell[]} = await axios.get("/cells");

		return data;
	} catch (error: unknown) {
		if (error instanceof AxiosError) {
			return thunkAPI.rejectWithValue(error.message);
		} else throw error; //something unknown, will go into `action.error` instead
	}
});

// save cells to file
const saveCells = createAsyncThunk<undefined, undefined, {rejectValue: string}>("bundles/saveCells", async (_, thunkAPI) => {
	try {
		const {data, order} = (thunkAPI.getState() as RootState).cells;

		const cells = order.map((id) => data[id]);

		await axios.post("/cells", {cells});
	} catch (error: unknown) {
		if (error instanceof AxiosError) {
			return thunkAPI.rejectWithValue(error.message);
		} else throw error; //something unknown, will go into `action.error` instead
	}
});

export const cellsSlice = createSlice({
	name: "cells",
	initialState: initiaState,
	//if we are not dealing with async stuff then we handle them here
	reducers: {
		update_cell: (state, action: PayloadAction<{id: string; content: string}>) => {
			const {id, content} = action.payload;
			state.data[id].content = content;
		},
		delete_cell: (state, action: PayloadAction<string>) => {
			delete state.data[action.payload];
			state.order = state.order.filter((id) => id !== action.payload);
		},
		move_cell: (state, action: PayloadAction<{id: string; direction: "up" | "down"}>) => {
			const {id, direction} = action.payload;
			// find index in order array of id
			const index = state.order.findIndex((id) => id === action.payload.id);
			const targetIndex = direction === "up" ? index - 1 : index + 1;

			if (targetIndex < 0 || targetIndex >= state.order.length) {
				return;
			}

			// swap order of id and targetIndex
			state.order[index] = state.order[targetIndex];
			state.order[targetIndex] = id;
		},
		insert_cell_after: (state, action: PayloadAction<{id: string | null; type: CellTypes}>) => {
			const cell: Cell = {
				content: "",
				type: action.payload.type,
				id: randomID(),
			};

			state.data[cell.id] = cell;

			const index = state.order.findIndex((id) => id === action.payload.id);

			if (index === -1) {
				state.order.unshift(cell.id); // add to start of array
			} else {
				state.order.splice(index + 1, 0, cell.id);
			}
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchCells.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCells.fulfilled, (state, action) => {
				state.loading = false;
				state.order = action.payload.map((cell) => cell.id);
				state.data = action.payload.reduce((acc, cell) => {
					acc[cell.id] = cell;
					return acc;
				}, {} as CellsState["data"]);
			})
			.addCase(fetchCells.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Error while fetching cells";
			})
			.addCase(saveCells.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(saveCells.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Error while saving cells";
			});
	},
});

const randomID = () => {
	return Math.random().toString(36).substring(2, 15);
};

export const cellsActions = {...cellsSlice.actions, fetchCells, saveCells};

export default cellsSlice.reducer;
