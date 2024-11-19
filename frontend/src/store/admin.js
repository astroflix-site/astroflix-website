import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
name: "admin",
initialState:{isAdmin:false},
reducers:{
    loginAdmin(state){
        state.isAdmin = true;
    },
    logoutAdmin(state){
        state.isAdmin = false;
    }
}
})

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;