import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import chatReducer from "./slices/chatSlice.js";
import messageReducer from "./slices/messageSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatReducer,
    messages: messageReducer,
  },
});

export default store;