import { createSlice } from "@reduxjs/toolkit";

/**
 * Normalizes an artifact object from message payload.
 */
const extractArtifact = (msg) => {
  if (msg?.artifact && Array.isArray(msg.artifact.files) && msg.artifact.files.length > 0) {
    return {
      id: msg.artifact.id || msg._id || Date.now(),
      type: msg.artifact.type || "application/code",
      title: msg.artifact.title || msg.artifact.files[0]?.name || "Web Application",
      files: msg.artifact.files,
      createdAt: msg.createdAt || new Date().toISOString(),
    };
  }
  if (Array.isArray(msg?.uiFiles) && msg.uiFiles.length > 0) {
    return {
      id: msg._id || Date.now(),
      type: "application/code",
      title: msg.uiFiles[0]?.name || "Web Application",
      files: msg.uiFiles,
      createdAt: msg.createdAt || new Date().toISOString(),
    };
  }
  return null;
};

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messageData: [],
    artifacts: [],
    activeArtifact: null,
    isArtifactOpen: false,
  },
  reducers: {
    setMessageData: (state, action) => {
      const messages = Array.isArray(action.payload) ? action.payload : [];
      state.messageData = messages;

      // Extract all artifacts from messages
      const foundArtifacts = [];
      messages.forEach((msg) => {
        const art = extractArtifact(msg);
        if (art) {
          foundArtifacts.push(art);
        }
      });
      state.artifacts = foundArtifacts;

      // Set the latest artifact as active if available
      if (foundArtifacts.length > 0) {
        state.activeArtifact = foundArtifacts[foundArtifacts.length - 1];
      } else {
        state.activeArtifact = null;
      }
    },

    addMessageData: (state, action) => {
      const msg = action.payload;
      state.messageData.push(msg);

      // Check if message contains an artifact
      const newArtifact = extractArtifact(msg);
      if (newArtifact) {
        state.artifacts.push(newArtifact);
        state.activeArtifact = newArtifact;
        state.isArtifactOpen = true; // Auto-open artifact canvas on new generation
      }
    },

    clearMessageData: (state) => {
      state.messageData = [];
      state.artifacts = [];
      state.activeArtifact = null;
      state.isArtifactOpen = false;
    },

    setArtifacts: (state, action) => {
      state.artifacts = Array.isArray(action.payload) ? action.payload : [];
    },

    setActiveArtifact: (state, action) => {
      state.activeArtifact = action.payload;
      if (action.payload) {
        state.isArtifactOpen = true;
      }
    },

    setArtifact: (state, action) => {
      state.activeArtifact = action.payload;
      if (action.payload) {
        state.isArtifactOpen = true;
      }
    },

    toggleArtifactOpen: (state) => {
      state.isArtifactOpen = !state.isArtifactOpen;
    },

    openArtifact: (state) => {
      state.isArtifactOpen = true;
    },

    closeArtifact: (state) => {
      state.isArtifactOpen = false;
    },
  },
});

export const {
  setMessageData,
  addMessageData,
  clearMessageData,
  setArtifacts,
  setActiveArtifact,
  setArtifact,
  toggleArtifactOpen,
  openArtifact,
  closeArtifact,
} = messageSlice.actions;

// Aliases for convenience
export const setMessage = setMessageData;
export const addMessage = addMessageData;

export default messageSlice.reducer;
