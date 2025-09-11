import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        books: booksReducer,
    },
});