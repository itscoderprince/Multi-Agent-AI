import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chatData: [],
    selectedChat: null,
  },
  reducers: {
    setChatData: (state, action) => {
      state.chatData = action.payload;
    },
    addChatData: (state, action) => {
      state.chatData.unshift(action.payload);
    }, 
    setSelectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setChatData, addChatData,setSelectChat } = chatSlice.actions;
export default chatSlice.reducer;
