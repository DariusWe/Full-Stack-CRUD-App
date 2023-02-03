import { createSlice } from "@reduxjs/toolkit";

export const tweetsSlice = createSlice({
  name: "tweets",
  initialState: {
    tweets: [],
    currentlyEditedId: null,
    popUpEffectForId: null,
  },
  reducers: {
    setTweets: (state, { payload }) => {
      state.tweets = payload;
    },
    setCurrentlyEditedId: (state, { payload }) => {
      state.currentlyEditedId = payload;
    },
    setPopUpEffectForId: (state, { payload }) => {
        state.popUpEffectForId = payload;
      },
  },
});

export const { setTweets, setCurrentlyEditedId, setPopUpEffectForId } = tweetsSlice.actions;

export default tweetsSlice.reducer;
