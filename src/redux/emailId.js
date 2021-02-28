import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("aboo")
  ? JSON.parse(atob(localStorage.getItem("aboo")))
  : null;

export const emailIdSlice = createSlice({
  name: "emailId",
  initialState: {
    datapulled: initialState?.datapulled || false,
    data: initialState?.data || [],
  },
  reducers: {
    carpetHasBeenPulled: (state, action) => {
      state.datapulled = true;
      state.data = action.payload;
      localStorage.setItem("aboo", btoa(JSON.stringify(state)));
    },
    carpetCrashed: (state) => {
      state.datapulled = false;
      state.data = [];
      localStorage.removeItem("aboo");
    },
  },
});

export const {
  carpetCrashed,
  carpetHasBeenPulled
} = emailIdSlice.actions;

export default emailIdSlice.reducer;
