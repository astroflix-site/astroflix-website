import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: { isAdmin: false },
    reducers: {
        loginAdmin(state, action) {
            state.isAdmin = action.payload === 'admin'; // Check if the role is 'admin'
        },
        logoutAdmin(state) {
            state.isAdmin = false; // Reset admin status
        }
    }
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;