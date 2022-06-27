import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import bundle from "../../bundler";

type CellTypes = "code" | "text";

export interface Cell {
	id: string;
	type: CellTypes;
	content: string;
}

interface BundlesState {
	[key: string]:
		| {
				loading: boolean;
				code: string;
				err: string;
		  }
		| undefined;
}

const initiaState: BundlesState = {};

// create a new bundle?
const createBundle = createAsyncThunk<
	{cellID: string; bundle: {code: string; err: string}},
	{cellID: string; input: string},
	{
		rejectValue: string;
	}
>("bundles/createBundle", async ({cellID, input}, thunkAPI) => {
	try {
		const result = await bundle(input);
		return {
			cellID,
			bundle: result,
		};
	} catch (error) {
		// in builder, for rejected , action payload will carry this message
		return thunkAPI.rejectWithValue("Error while bundling code");
	}
});

export const bundlesSlice = createSlice({
	name: "cells",
	initialState: initiaState,
	//if we are not dealing with async stuff then we handle them here
	reducers: {},

	extraReducers: (builder) => {
		builder
			.addCase(createBundle.pending, (state, action) => {
				state[action.meta.arg.cellID] = {
					loading: true,
					code: "",
					err: "",
				};
			})
			.addCase(createBundle.fulfilled, (state, action) => {
				state[action.payload.cellID] = {
					loading: false,
					code: action.payload.bundle.code,
					err: action.payload.bundle.err,
				};
			});
	},
});

export const bundlesActions = {createBundle, ...bundlesSlice.actions};

export default bundlesSlice.reducer;
