import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
    },
  },
});

export const { saveUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
