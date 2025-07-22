import { configureStore } from "@reduxjs/toolkit";
import { categoriesSlice } from "../components/categories/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    categories: categoriesSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppStore = typeof store;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
