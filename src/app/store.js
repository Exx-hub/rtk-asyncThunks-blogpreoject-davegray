import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "../features/counter/counterSlice";
import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    // counterState: counterReducer,
    postState: postsReducer,
    usersState: usersReducer,
  },
});

// pass each reducer from slices that you create
