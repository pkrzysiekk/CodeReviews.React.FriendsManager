import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
  addCategoryAsync,
  deleteCategoryAsync,
  fetchCategoriesAsync,
  selectCategories,
  updateCategoryAsync,
} from "./categoriesSlice";
import type { category } from "../../types/category";

function CategoriesComponent() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    const cat: category = {
      id: 2,
      name: "friendsWithPenises",
    };
    dispatch(updateCategoryAsync({ category: cat }));
  }, []);
  useEffect(() => {
    console.log(categories);
  }, [categories]);

  return <></>;
}

export default CategoriesComponent;
