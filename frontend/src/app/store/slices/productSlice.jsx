import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/index"

export const fetchProducts = createAsyncThunk(
    "product/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await productService.fetchAll();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    "product/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await productService.fetchById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addProduct = createAsyncThunk(
    "product/add",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await productService.create(productData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await productService.update(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/delete",
    async (id, { rejectWithValue }) => {
        try {
            await productService.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.map((prod) =>
                    prod.id === action.payload.id ? action.payload : prod
                );
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.map((prod) =>
                    prod.id === action.payload.id ? action.payload : prod
                );
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter((prod) => prod.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default productSlice.reducer;
