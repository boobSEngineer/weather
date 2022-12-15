import {useDispatch, useSelector, TypedUseSelectorHook} from "react-redux";
import type {RootState, AppDispatch} from "./Redux/redux-store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () : AppDispatch => useDispatch<AppDispatch>();
