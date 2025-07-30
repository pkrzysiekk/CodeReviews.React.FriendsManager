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

  const handleDeleteButtonClick = async (id: number) => {
    await dispatch(deleteCategoryAsync({ categoryId: id }));
    dispatch(
      fetchCategoriesAsync({ pageSize: pageSize, pageNumber: pageNumber })
    );
  };

  return (
    <div className="categories-container offset-3 col-6 h-75">
      <CategoriesTable
        categories={categories}
        handleDeleteButtonCLick={handleDeleteButtonClick}
      />
    </div>
  );
}

interface CategoriesTableProps {
  categories: category[];
  handleDeleteButtonCLick: (id: number) => Promise<void>;
}
function CategoriesTable({
  categories,
  handleDeleteButtonCLick,
}: CategoriesTableProps) {
  const tableContent = categories.map((cat, index) => {
    return (
      <tr key={cat.id}>
        <td>{index + 1}</td>
        <td>{cat.name}</td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleDeleteButtonCLick(cat.id as number);
            }}
          >
            X
          </button>
        </td>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    </div>
  );
}

export default CategoriesComponent;
