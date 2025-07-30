import { useEffect, useState } from "react";
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
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchCategoriesAsync({ pageNumber: pageNumber, pageSize: pageSize })
    );
  }, []);

  return (
    <div className="categories-container offset-3 col-6 h-75">
      <CategoriesTable categories={categories} />
    </div>
  );
}

interface CategoriesTableProps {
  categories: category[];
}
function CategoriesTable({ categories }: CategoriesTableProps) {
  const tableContent = categories.map((cat, index) => {
    return (
      <tr key={cat.id}>
        <td>{index + 1}</td>
        <td>{cat.name}</td>
      </tr>
    );
  });
  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped">
        <caption>Table of your friends' categories!</caption>
        <thead>
          <tr>
            <th>Number</th>
            <th>Category Name</th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    </div>
  );
}

export default CategoriesComponent;
