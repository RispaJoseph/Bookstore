import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "books",
    initialState: { list: [], page: 1, total: 0 },
    reducers: {
        setBooks(state, action) {
            state.list = action.payload;
        }
    }
});

export const { setBooks } = slice.actions;
export default slice.reducer;