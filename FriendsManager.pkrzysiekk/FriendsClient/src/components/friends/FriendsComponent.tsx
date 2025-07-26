import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import type { friend } from "../../types/friend";
import {
  deleteFriendAsync,
  fetchFriendAsync,
  selectFriends,
} from "./friendsSlice";
import type { category } from "../../types/category";
import {
  fetchCategoriesAsync,
  selectCategories,
} from "../categories/categoriesSlice";

function FriendsComponent() {
  const dispatch = useAppDispatch();
  const friends = useAppSelector(selectFriends);
  const categories = useAppSelector(selectCategories);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [updateComponentVisible, setUpdateComponentVisible] = useState(false);
  const [friendToUpdate, setFriendToUpdate] = useState<null | friend>(null);

  useEffect(() => {
    dispatch(fetchFriendAsync({ pageNumber: pageNumber, pageSize: pageSize }));
    dispatch(fetchCategoriesAsync({ pageNumber: 1, pageSize: 5 }));
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
    setFriendToUpdate(friend);
    setUpdateComponentVisible(true);
  };

  return (
    <div className="friends-container offset-3 col-6">
      <FriendsTable
        friends={friends}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleUpdateButtonClick={handleUpdateButtonClick}
      />
      <TableNavButtons
        handleNextButtonClick={handleNextButtonClick}
        handlePrevButtonClick={handlePrevButtonClick}
      />
      {updateComponentVisible && friendToUpdate ? (
        <UpdateComponent friend={friendToUpdate} categories={categories} />
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
}

function TableNavButtons({
  handlePrevButtonClick,
  handleNextButtonClick,
}: TableNavProps) {
  return (
    <div className="d-flex justify-content-end">
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
          <button onClick={handleDeleteButtonClick}>Delete</button>
        </li>
        <li>
          <button onClick={handleUpdateButtonClick}>Update</button>
        </li>
      </ul>
    </div>
  );
}
interface UpdateComponentProps {
  friend: friend;
  categories: category[];
}
function UpdateComponent({ friend, categories }: UpdateComponentProps) {
  return (
    <div className="alert alert-success mt-3">
      <form>
        <div className="row pb-2">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              name="name"
              value={friend.name}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter last contact type"
              name="lastContactType"
              value={friend.lastContactType}
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
              value={friend.desiredContactFrequency}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter category"
              name="categoryName"
              value={friend.categoryName}
            />
          </div>
        </div>
        <div className="row pb-3">
          <div className="col">
            <input
              type="datetime-local"
              className="form-control"
              name="lastContactDate"
              value={friend.lastContactDate}
            />
          </div>
        </div>

        <div className="row pb-3">
          <div className="col">
            <CategorySelectDropdown categories={categories} />
          </div>
        </div>
      </form>
    </div>
  );
}

interface CategorySelectDropdownProps {
  categories: category[];
}

function CategorySelectDropdown({ categories }: CategorySelectDropdownProps) {
  const [categoryName, setCategoryName] = useState("");

  const handleButtonClick = (e: React.MouseEvent, categoryName: string) => {
    e.preventDefault();
    setCategoryName(categoryName);
  };

  const categoriesList = categories.map((c) => {
    return (
      <li key={c.id}>
        <button
          onClick={(e) => {
            handleButtonClick(e, c.name);
          }}
        >
          {c.name}
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="dropdown dropend">
        <button
          className="btn btn-primary dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          Select friend category
        </button>
        <ul className="dropdown-menu text-center">
          {categoriesList}

          <hr />
          <button className="btn btn-outline-primary ">Prev</button>
          <button className="btn btn-outline-primary ">Next</button>
        </ul>
      </div>
      <input type="text" value={categoryName} name="categoryName" disabled />
    </>
  );
}
export default FriendsComponent;
