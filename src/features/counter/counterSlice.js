import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // actions that change the state
    increment: (state) => {
      state.count = state.count + 1;
    },
    decrement: (state) => {
      state.count = state.count - 1;
    },
    reset: (state) => {
      state.count = 0;
    },
    incrementByValue: (state, action) => {
      state.count = state.count + action.payload;
    },
  },
});

// export the actions created
export const { increment, decrement, reset, incrementByValue } =
  counterSlice.actions;

// export the reducer
export default counterSlice.reducer;
