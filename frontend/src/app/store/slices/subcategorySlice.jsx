import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subcategoryService } from "../../services/index"

export const fetchSubcategories = createAsyncThunk(
    "subcategory/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await subcategoryService.fetchAll();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchSubcategoryById = createAsyncThunk(
    "subcategory/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await subcategoryService.fetchById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addSubcategory = createAsyncThunk(
    "subcategory/add",
    async (subcategoryData, { rejectWithValue }) => {
        try {
            const response = await subcategoryService.create(subcategoryData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateSubcategory = createAsyncThunk(
    "subcategory/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await subcategoryService.update(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteSubcategory = createAsyncThunk(
    "subcategory/delete",
    async (id, { rejectWithValue }) => {
        try {
            await subcategoryService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const subcategorySlice = createSlice({
    name: "subcategory",
    initialState: {
        subcategories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubcategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubcategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSubcategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubcategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = state.subcategories.map((cat) =>
                    cat.id === action.payload.id ? action.payload : cat
                );
            })
            .addCase(fetchSubcategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories.push(action.payload);
            })
            .addCase(addSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = state.subcategories.map((cat) =>
                    cat.id === action.payload.id ? action.payload : cat
                );
            })
            .addCase(updateSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = state.subcategories.filter((cat) => cat.id !== action.payload);
            })
            .addCase(deleteSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default subcategorySlice.reducer;
