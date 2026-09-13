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
    updateChatData: (state, action) => {
      const updated = action.payload;
      if (!updated?._id) return;
      const index = state.chatData.findIndex((c) => c._id === updated._id);
      if (index !== -1) {
        state.chatData[index] = { ...state.chatData[index], ...updated };
      }
      if (state.selectedChat?._id === updated._id) {
        state.selectedChat = { ...state.selectedChat, ...updated };
      }
    },
  },
});

export const {
  setChatData,
  addChatData,
  setSelectChat,
  deleteChatData,
  updateChatData,
} = chatSlice.actions;
export default chatSlice.reducer;
