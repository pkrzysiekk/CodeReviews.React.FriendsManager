import type { RootState } from "../../app/store";
import type { category } from "../../types/category";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const selectCategories = (state: RootState) =>
  state.categories.categories;

export interface CategoriesState {
  categories: category[];
  status: "loading" | "idle" | "failed";
}

const initialState: CategoriesState = {
  categories: [],
  status: "idle",
};

export const categoriesSlice = createSlice({
  name: "Category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategoriesAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.categories = action.payload;
    });
    builder.addCase(fetchCategoriesAsync.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const fetchCategoriesAsync = createAsyncThunk<
  category[],
  { pageSize: Number; pageNumber: Number }
>("categories/fetch", async ({ pageSize, pageNumber }, thunkAPI) => {
  const response = await fetch(
    `http://localhost:5026/Category?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  if (!response.ok) {
    return thunkAPI.rejectWithValue("Error while fetching");
  }
  const data = await response.json();
  return data;
});

export const addCategoryAsync = createAsyncThunk<void, { category: category }>(
  "categories/add",
  async ({ category }, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:5026/Category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        return thunkAPI.rejectWithValue("Network error or incorrect data");
      }
    } catch {
      return thunkAPI.rejectWithValue("Error while adding");
    }
  }
);

export const updateCategoryAsync = createAsyncThunk<
  void,
  { category: category }
>("categories/update", async ({ category }, thunkAPI) => {
  try {
    const response = await fetch("http://localhost:5026/Category", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      return thunkAPI.rejectWithValue("Network error or incorrect data");
    }
  } catch {
    return thunkAPI.rejectWithValue("Error while adding");
  }
});

export const deleteCategoryAsync = createAsyncThunk<
  void,
  { categoryId: Number }
>("categories/delete", async ({ categoryId }, thunkAPI) => {
  try {
    const response = await fetch(
      `http://localhost:5026/Category/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      return thunkAPI.rejectWithValue("Network error or incorrect data");
    }
  } catch {
    return thunkAPI.rejectWithValue("Error while adding");
  }
});
