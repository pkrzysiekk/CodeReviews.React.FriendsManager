import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { friend } from "../../types/friend";
import type { RootState } from "../../app/store";

export const selectFriends = (state: RootState) => state.friends.friends;

const API_URL = "http://localhost:5026/Friends";

export interface friendsState {
  friends: friend[];
  status: "idle" | "loading" | "failed";
}

const initialState: friendsState = {
  friends: [],
  status: "idle",
};

export const friendsSlice = createSlice({
  name: "Friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFriendAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchFriendAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.friends = action.payload;
    });
    builder.addCase(fetchFriendAsync.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const fetchFriendAsync = createAsyncThunk<
  friend[],
  { pageSize: Number; pageNumber: Number }
>("friends/fetch", async ({ pageSize, pageNumber }, thunkAPI) => {
  const response = await fetch(
    `${API_URL}?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  if (!response.ok) {
    return thunkAPI.rejectWithValue("Error while fetching");
  }
  const data = await response.json();
  return data;
});

export const addFriendAsync = createAsyncThunk<void, { friend: friend }>(
  "friends/add",
  async ({ friend }, thunkAPI) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(friend),
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue("Network error or incorrect data");
      }
    } catch {
      return thunkAPI.rejectWithValue("Error while adding");
    }
  }
);

export const updateFriendAsync = createAsyncThunk<void, { friend: friend }>(
  "friends/update",
  async ({ friend }, thunkAPI) => {
    try {
      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(friend),
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue("Network error or incorrect data");
      }
    } catch {
      return thunkAPI.rejectWithValue("Error while updating");
    }
  }
);

export const deleteFriendAsync = createAsyncThunk<void, { friendId: Number }>(
  "friends/delete",
  async ({ friendId }, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/${friendId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue("Network error or incorrect data");
      }
    } catch {
      return thunkAPI.rejectWithValue("Error while deleting");
    }
  }
);
