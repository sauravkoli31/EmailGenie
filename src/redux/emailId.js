import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("aboo")
  ? JSON.parse(atob(localStorage.getItem("aboo")))
  : null;

export const emailIdSlice = createSlice({
  name: "emailId",
  initialState: {
    datapulled: initialState?.datapulled || false,
  },
  reducers: {
    carpetHasBeenPulled: (state) => {
      state.datapulled = true;
      localStorage.setItem("aboo", btoa(JSON.stringify(state)));
    },
    carpetCrashed: (state) => {
      state.datapulled = false;
      localStorage.removeItem("aboo");
    },
  },
});

export const {
  carpetCrashed,
  carpetHasBeenPulled
} = emailIdSlice.actions;

export default emailIdSlice.reducer;
