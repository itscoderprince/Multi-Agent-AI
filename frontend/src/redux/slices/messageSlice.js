import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messageData: [],
  },
  reducers: {
    setMessageData: (state, action) => {
      state.messageData = action.payload;
    },
    addMessageData: (state, action) => {
      state.messageData.push(action.payload);
    },
    clearMessageData: (state) => {
      state.messageData = [];
    },
  },
});

export const { setMessageData, addMessageData, clearMessageData } =
  messageSlice.actions;

// Aliases for convenience
export const setMessage = setMessageData;
export const addMessage = addMessageData;

export default messageSlice.reducer;
