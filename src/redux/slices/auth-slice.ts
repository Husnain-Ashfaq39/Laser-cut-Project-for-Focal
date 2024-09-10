import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  profileImage: "",
  creditAccount:""
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.profileImage=action.payload.profileImage
      state.creditAccount=action.payload.creditAccount
    },
    clearUser: (state) => {
      state.id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.profileImage = "";
      state.creditAccount="";
    },
  },
});

export const { saveUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
