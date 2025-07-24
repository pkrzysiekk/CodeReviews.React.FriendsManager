import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store";
import type { friend } from "../../types/friend";
import { fetchFriendAsync, selectFriends } from "./friendsSlice";

function FriendsComponent() {
  const dispatch = useAppDispatch();
  const friends = useAppSelector(selectFriends);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    dispatch(fetchFriendAsync({ pageNumber: pageNumber, pageSize: pageSize }));
  }, []);

  return (
    <div className="friends-container">
      <FriendsTable friends={friends} />
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
      </tr>
    );
  });
  return (
    <table>
      <caption>Table of your friends!</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Last Contact Date</th>
          <th>Last Contact Type</th>
          <th>Desired Contact Frequency (weekly)</th>
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </table>
  );
}
interface friendsTableProps {
  friends: friend[];
}
export default FriendsComponent;
