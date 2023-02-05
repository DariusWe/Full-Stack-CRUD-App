import { createSlice } from "@reduxjs/toolkit";

export const tweetsSlice = createSlice({
  name: "tweets",
  initialState: {
    currentlyEditedId: null,
    popUpEffectForId: null,
  },
  reducers: {
    setCurrentlyEditedId: (state, { payload }) => {
      state.currentlyEditedId = payload;
    },
    setPopUpEffectForId: (state, { payload }) => {
        state.popUpEffectForId = payload;
      },
  },
});

export const { setCurrentlyEditedId, setPopUpEffectForId } = tweetsSlice.actions;

export default tweetsSlice.reducer;
