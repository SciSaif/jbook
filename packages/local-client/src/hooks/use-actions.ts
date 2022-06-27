import {useMemo} from "react";
import {useDispatch} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import {cellsActions, bundlesActions} from "../redux";

// everytime you call useActions, you get a slightly different version of the createBundle action creator
// useMemo is used to solve this problem because it will only bind the action creator once, use memo is almost like useEffect and useState put together to make it bind only once
export const useActions = () => {
	const dispatch = useDispatch();

	return useMemo(() => {
		return bindActionCreators({...cellsActions, ...bundlesActions}, dispatch);
	}, [dispatch]);
};
