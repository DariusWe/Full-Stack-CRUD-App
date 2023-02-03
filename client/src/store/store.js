import { configureStore } from '@reduxjs/toolkit';
import tweetsReducer from './tweets.slice.js';

export default configureStore({
  reducer: {
    tweets: tweetsReducer,
  },
});
