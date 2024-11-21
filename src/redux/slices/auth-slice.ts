import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  profileImage: "",
  creditAccount: "",
  role: "",
  company: "",
  address: "", // Add address property
  clientID: "", // Add clientID property
  contactID: "", // Add contactID property
  mobile: '', // Add mobile property
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
      state.profileImage = action.payload.profileImage;
      state.creditAccount = action.payload.creditAccount;
      state.role = action.payload.role;
      state.company = action.payload.company;
      state.address = action.payload.address; // Save address property
      state.clientID = action.payload.clientID; // Save clientID property
      state.contactID = action.payload.contactID; // Save contactID property
      state.mobile = action.payload.mobile; // Save mobile property
    },
    clearUser: (state) => {
      state.id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.profileImage = "";
      state.creditAccount = "";
      state.role = "";
      state.company = "";
      state.address = ""; // Clear address property
      state.clientID = ""; // Clear clientID property
      state.contactID = ""; // Clear contactID property
      state.mobile = ""; // Clear mobile property
    },
  },
});

export const { saveUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
