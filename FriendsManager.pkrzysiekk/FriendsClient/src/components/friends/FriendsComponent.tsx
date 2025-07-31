import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import type { friend } from "../../types/friend";
import {
  addFriendAsync,
  deleteFriendAsync,
  fetchFriendAsync,
  selectFriends,
  selectFriendsStatus,
  updateFriendAsync,
} from "./friendsSlice";
import type { category } from "../../types/category";
import {
  fetchCategoriesAsync,
  selectCategories,
} from "../categories/categoriesSlice";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

function FriendsComponent() {
  const dispatch = useAppDispatch();
  const friends = useAppSelector(selectFriends);
  const categories = useAppSelector(selectCategories);
  const friendsStatus = useAppSelector(selectFriendsStatus);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [updateComponentVisible, setUpdateComponentVisible] = useState(false);
  const [addComponentVisible, setAddComponentVisible] = useState(false);
  const [friendToModify, setFriendToModify] = useState<null | friend>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(
        fetchFriendAsync({ pageNumber: pageNumber, pageSize: pageSize })
      );
      await dispatch(fetchCategoriesAsync({ pageNumber: 1, pageSize: 4 }));
      setIsTableLoading(false);
    };
    loadData();
  }, []);

  const handlePrevButtonClick = () => {
    if (pageNumber > 1) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      dispatch(
        fetchFriendAsync({ pageNumber: newPageNumber, pageSize: pageSize })
      );
    }
  };

  const handleNextButtonClick = () => {
    if (friends.length == pageSize) {
      const newPageNumber = pageNumber + 1;
      setPageNumber(newPageNumber);
      dispatch(
        fetchFriendAsync({ pageNumber: newPageNumber, pageSize: pageSize })
      );
    }
  };

  const handleDeleteButtonClick = async (id: number) => {
    await dispatch(deleteFriendAsync({ friendId: id }));
    await dispatch(
      fetchFriendAsync({ pageNumber: pageNumber, pageSize: pageSize })
    );
  };

  const handleUpdateButtonClick = (friend: friend) => {
    setFriendToModify(friend);
    setUpdateComponentVisible(true);
    setAddComponentVisible(false);
  };

  const handleAddButtonClick = () => {
    setUpdateComponentVisible(false);
    setAddComponentVisible(true);
  };

  const handleUpdateFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    updatedFriend: friend
  ) => {
    e.preventDefault();

    await dispatch(updateFriendAsync({ friend: updatedFriend }));
    await dispatch(fetchFriendAsync({ pageNumber, pageSize }));
    setUpdateComponentVisible(false);
    incrementPageSizeIfNeeded();
  };

  const handleAddFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    updatedFriend: friend
  ) => {
    e.preventDefault();

    await dispatch(addFriendAsync({ friend: updatedFriend }));
    await dispatch(fetchFriendAsync({ pageNumber, pageSize }));
    setAddComponentVisible(false);
  };
  const incrementPageSizeIfNeeded = () => {
    if (pageSize == friends.length) {
      const newPageNumber = pageNumber + 1;
      dispatch(
        fetchFriendAsync({ pageNumber: newPageNumber, pageSize: pageSize })
      );
    }
  };
  return (
    <div className="friends-container offset-3 col-6">
      {isTableLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {" "}
          <FriendsTable
            friends={friends}
            handleDeleteButtonClick={handleDeleteButtonClick}
            handleUpdateButtonClick={handleUpdateButtonClick}
          />
          <TableNavButtons
            handleNextButtonClick={handleNextButtonClick}
            handlePrevButtonClick={handlePrevButtonClick}
            handleAddButtonClick={handleAddButtonClick}
          />
        </>
      )}
      {updateComponentVisible && friendToModify ? (
        <UpdateComponent
          friend={friendToModify}
          categories={categories}
          handleUpdateFormSubmit={handleUpdateFormSubmit}
        />
      ) : (
        ""
      )}

      {addComponentVisible ? (
        <AddComponent handleAddFormSubmit={handleAddFormSubmit} />
      ) : (
        ""
      )}
    </div>
  );
}

function FriendsTable({
  friends,
  handleDeleteButtonClick,
  handleUpdateButtonClick,
}: friendsTableProps) {
  const tableContent = friends.map((f) => {
    return (
      <tr key={f.id}>
        <td>{f.name}</td>
        <td>{new Date(f.lastContactDate).toUTCString()}</td>
        <td>{f.lastContactType}</td>
        <td>{f.desiredContactFrequency}</td>
        <td>{f.categoryName}</td>
        <td>
          <ActionsDropdown
            handleDeleteButtonClick={() => {
              handleDeleteButtonClick(f.id as number);
            }}
            handleUpdateButtonClick={() => {
              handleUpdateButtonClick(f);
            }}
          />
        </td>
      </tr>
    );
  });
  return (
    <div className="table-responsive">
      {" "}
      <table className="table table-hover table-striped">
        <caption>Table of your friends!</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Contact Date</th>
            <th>Last Contact Type</th>
            <th>Desired Contact Frequency (weekly)</th>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    </div>
  );
}
interface friendsTableProps {
  friends: friend[];
  handleDeleteButtonClick: (id: number) => void;
  handleUpdateButtonClick: (friend: friend) => void;
}

interface TableNavProps {
  handlePrevButtonClick: () => void;
  handleNextButtonClick: () => void;
  handleAddButtonClick: () => void;
}

function TableNavButtons({
  handlePrevButtonClick,
  handleNextButtonClick,
  handleAddButtonClick,
}: TableNavProps) {
  return (
    <div className="d-flex justify-content-end mb-5">
      <div>
        <button
          onClick={handleAddButtonClick}
          className="btn btn-success me-3 "
        >
          Add
        </button>
      </div>
      <div className="table-buttons btn-group">
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

interface ActionsDropdownProps {
  handleDeleteButtonClick: () => void;
  handleUpdateButtonClick: () => void;
}

function ActionsDropdown({
  handleDeleteButtonClick,
  handleUpdateButtonClick,
}: ActionsDropdownProps) {
  return (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        Actions
      </button>
      <ul className="dropdown-menu text-center">
        <li>
          <button className="btn btn-danger" onClick={handleDeleteButtonClick}>
            Delete
          </button>
        </li>
        <li>
          <button
            className="btn btn-info mt-2"
            onClick={handleUpdateButtonClick}
          >
            Update
          </button>
        </li>
      </ul>
    </div>
  );
}
interface UpdateComponentProps {
  friend: friend;
  categories: category[];
  handleUpdateFormSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    updatedFriend: friend
  ) => Promise<void>;
}

function UpdateComponent({
  friend,
  categories,
  handleUpdateFormSubmit,
}: UpdateComponentProps) {
  const [updatedFriend, setUpdatedFriend] = useState(friend);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setUpdatedFriend((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleUpdateFormSubmit(e, updatedFriend);
  };

  return (
    <div className="alert alert-success mt-3 mb-5">
      <form onSubmit={handleFormSubmit}>
        <div className="row pb-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              value={updatedFriend.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter last contact type"
              name="lastContactType"
              value={updatedFriend.lastContactType}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row pb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter desired contact frequency (weekly)"
              name="desiredContactFrequency"
              value={updatedFriend.desiredContactFrequency}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row pb-3">
          <div className="col">
            <input
              type="datetime-local"
              className="form-control"
              name="lastContactDate"
              value={updatedFriend.lastContactDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row pb-3">
          <div className="col mt-3 mb-3">
            <CategorySelectDropdown
              categories={categories}
              onCategoryChange={(name, id) =>
                setUpdatedFriend((prev) => ({
                  ...prev,
                  categoryName: name,
                  categoryId: id,
                }))
              }
            />
            <button
              className="form-control btn btn-secondary hover-shadow"
              type="submit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

interface CategorySelectDropdownProps {
  categories: category[];
  onCategoryChange: (name: string, id: number) => void;
}

function CategorySelectDropdown({
  categories,
  onCategoryChange,
}: CategorySelectDropdownProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryPageNumber, setCategoryPageNumber] = useState(1);
  const [categoryPageSize, setCategoryPageSize] = useState(4);
  const [categoryId, setCategoryId] = useState(-1);
  const dispatch = useAppDispatch();

  const handlePrevButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryPageNumber > 1) {
      const newPageNumber = categoryPageNumber - 1;
      setCategoryPageNumber(newPageNumber);
      dispatch(
        fetchCategoriesAsync({
          pageSize: categoryPageSize,
          pageNumber: newPageNumber,
        })
      );
    }
  };

  const handleNextButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === categoryPageSize) {
      const newPageNumber = categoryPageNumber + 1;
      setCategoryPageNumber(newPageNumber);
      dispatch(
        fetchCategoriesAsync({
          pageSize: categoryPageSize,
          pageNumber: newPageNumber,
        })
      );
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent,
    categoryName: string,
    categoryId: number
  ) => {
    e.preventDefault();
    setCategoryName(categoryName);
    setCategoryId(categoryId);
    onCategoryChange(categoryName, categoryId);
  };

  const categoriesList = categories.map((c) => (
    <li key={c.id}>
      <button
        className="dropdown-item"
        onClick={(e) => handleButtonClick(e, c.name, c.id as number)}
      >
        {c.name}
      </button>
    </li>
  ));

  return (
    <>
      <div className="dropdown dropend">
        <button
          className="btn btn-primary dropdown-toggle mb-3"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
        >
          Select friend category
        </button>
        <ul className="dropdown-menu text-center">
          {categoriesList}
          <hr />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevButtonClick(e);
            }}
            className="btn btn-outline-primary"
          >
            Prev
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextButtonClick(e);
            }}
            className="btn btn-outline-primary"
          >
            Next
          </button>
        </ul>
      </div>

      <input
        className="form-control mb-3"
        type="text"
        value={categoryName}
        name="categoryName"
        disabled
      />
      <input type="hidden" value={categoryId} name="categoryId" />
    </>
  );
}
interface AddComponentProps {
  handleAddFormSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    friend: friend
  ) => Promise<void>;
}
function AddComponent({ handleAddFormSubmit }: AddComponentProps) {
  const emptyFriend: friend = {
    name: "",
    lastContactDate: "",
    lastContactType: "",
    desiredContactFrequency: "",
    categoryName: "",
  };

  const [updatedFriend, setUpdatedFriend] = useState(emptyFriend);
  const categories = useAppSelector(selectCategories);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setUpdatedFriend((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleAddFormSubmit(e, updatedFriend);
  };
  return (
    <div className="alert alert-success mt-3 mb-5">
      <form onSubmit={handleFormSubmit}>
        <div className="row pb-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter last contact type"
              name="lastContactType"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row pb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter desired contact frequency (weekly)"
              name="desiredContactFrequency"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row pb-3">
          <div className="col">
            <input
              type="datetime-local"
              className="form-control"
              name="lastContactDate"
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row pb-3">
          <div className="col mt-3 mb-3">
            <CategorySelectDropdown
              categories={categories}
              onCategoryChange={(name, id) =>
                setUpdatedFriend((prev) => ({
                  ...prev,
                  categoryName: name,
                  categoryId: id,
                }))
              }
            />
            <button
              className="form-control btn btn-secondary hover-shadow"
              type="submit"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FriendsComponent;
