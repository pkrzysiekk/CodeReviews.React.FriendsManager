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
import LoadingComponent from "../LoadingComponent/LoadingComponent";

function CategoriesComponent() {
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const categories = useAppSelector(selectCategories);
  const [isAddComponentVisible, setIsAddComponentVisible] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadData = async () => {
      await dispatch(
        fetchCategoriesAsync({ pageNumber: pageNumber, pageSize: pageSize })
      );
      setIsTableLoading(false);
    };
    loadData();
  }, []);

  const handleDeleteButtonClick = async (id: number) => {
    await dispatch(deleteCategoryAsync({ categoryId: id }));
    setIsTableLoading(true);
    await dispatch(
      fetchCategoriesAsync({ pageSize: pageSize, pageNumber: pageNumber })
    );
    setIsTableLoading(false);
  };
  const handlePrevButtonClick = () => {
    if (pageNumber > 1) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      dispatch(
        fetchCategoriesAsync({ pageNumber: newPageNumber, pageSize: pageSize })
      );
    }
  };
  const incrementPageSizeIfNeeded = () => {
    if (pageSize == categories.length) {
      const newPageNumber = pageNumber + 1;
      dispatch(
        fetchCategoriesAsync({ pageNumber: newPageNumber, pageSize: pageSize })
      );
    }
  };
  const handleNextButtonClick = () => {
    if (categories.length == pageSize) {
      const newPageNumber = pageNumber + 1;
      setPageNumber(newPageNumber);
      dispatch(
        fetchCategoriesAsync({ pageNumber: newPageNumber, pageSize: pageSize })
      );
    }
  };

  const handleAddFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    category: category
  ) => {
    e.preventDefault();

    await dispatch(addCategoryAsync({ category: category }));
    setIsTableLoading(true);
    await dispatch(
      fetchCategoriesAsync({ pageNumber: pageNumber, pageSize: pageSize })
    );
    setIsTableLoading(false);
    setIsAddComponentVisible(false);
    incrementPageSizeIfNeeded();
  };

  const handleAddButtonClick = () => {
    setIsAddComponentVisible(true);
  };
  return (
    <div className="categories-container offset-3 col-6 h-75">
      {isTableLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {" "}
          <CategoriesTable
            categories={categories}
            handleDeleteButtonCLick={handleDeleteButtonClick}
          />
          <TableNav
            handlePrevButtonClick={handlePrevButtonClick}
            handleNextButtonClick={handleNextButtonClick}
            handleAddButtonClick={handleAddButtonClick}
          />
        </>
      )}
      {isAddComponentVisible ? (
        <AddComponent handleAddFormSubmit={handleAddFormSubmit} />
      ) : (
        ""
      )}
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

interface TableNavProps {
  handlePrevButtonClick: () => void;
  handleNextButtonClick: () => void;
  handleAddButtonClick: () => void;
}
function TableNav({
  handleNextButtonClick,
  handlePrevButtonClick,
  handleAddButtonClick,
}: TableNavProps) {
  return (
    <div className="table-buttons d-flex justify-content-end">
      <button onClick={handleAddButtonClick} className="btn btn-success me-3">
        Add
      </button>

      <div className="btn-group ">
        <button
          className="btn btn-outline-primary"
          onClick={handlePrevButtonClick}
        >
          Prev
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={handleNextButtonClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}
interface AddComponentProps {
  handleAddFormSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    category: category
  ) => Promise<void>;
}
function AddComponent({ handleAddFormSubmit }: AddComponentProps) {
  const initialCategory: category = {
    name: "",
  };
  const [categoryToAdd, setCategoryToAdd] = useState(initialCategory);
  const onCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCategoryToAdd((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleAddFormSubmit(e, categoryToAdd);
  };

  return (
    <div className="alert alert-success mt-3 mb-5">
      <form onSubmit={handleFormSubmit}>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter category name"
            name="name"
            onChange={onCategoryNameChange}
          />
          <button
            type="submit"
            className="form-control btn btn-secondary hover-shadow"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
export default CategoriesComponent;
