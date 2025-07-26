import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import type { friend } from "../../types/friend";
import { fetchFriendAsync, selectFriends } from "./friendsSlice";
import Popover from "bootstrap/js/dist/popover";

function FriendsComponent() {
  const dispatch = useAppDispatch();
  const friends = useAppSelector(selectFriends);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  useEffect(() => {
    dispatch(fetchFriendAsync({ pageNumber: pageNumber, pageSize: pageSize }));
  }, []);

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    popoverTriggerList.forEach((el) => {
      new Popover(el);
    });
  }, [friends]);

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
  return (
    <div className="friends-container offset-3 col-6">
      <FriendsTable friends={friends} />
      <TableNavButtons
        handleNextButtonClick={handleNextButtonClick}
        handlePrevButtonClick={handlePrevButtonClick}
      />
    </div>
  );
}

function FriendsTable({ friends }: friendsTableProps) {
  const tableContent = friends.map((f) => {
    return (
      <tr key={f.id}>
        <td>{f.name}</td>
        <td>{new Date(f.lastContactDate).toUTCString()}</td>
        <td>{f.lastContactType}</td>
        <td>{f.desiredContactFrequency}</td>
        <td>{f.categoryName}</td>
        <td>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="popover"
            title="Popover Header"
            data-bs-content="Some content inside the popover"
          >
            ...
          </button>
        </td>
      </tr>
    );
  });
  return (
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
  );
}
interface friendsTableProps {
  friends: friend[];
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
export default FriendsComponent;
