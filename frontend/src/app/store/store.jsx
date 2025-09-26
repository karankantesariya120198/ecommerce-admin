import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import subcategoryReducer from "./slices/subcategorySlice";
import productReducer from "./slices/productSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        subcategory: subcategoryReducer,
        product: productReducer,
    },
});

export default store;