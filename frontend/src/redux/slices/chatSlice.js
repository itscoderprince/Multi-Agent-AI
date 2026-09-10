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
    deleteChatData: (state, action) => {
      const chatId = action.payload;
      state.chatData = state.chatData.filter((chat) => chat._id !== chatId);
      if (state.selectedChat?._id === chatId) {
        state.selectedChat = null;
      }
    },
  },
});

export const { setChatData, addChatData, setSelectChat, deleteChatData } =
  chatSlice.actions;
export default chatSlice.reducer;
