import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAxios } from '../../helpers/axiosInstances';

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
  const response = await chatAxios.get('/chats');
  console.log("CHATS FECHING -----> ", response.data);
  return response.data.data;
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (conversationId) => {
  const response = await chatAxios.get(`/conversations/${conversationId}/messages`);
  console.log("RESPONSE FETCHMESSAGES", response.data);
  return response.data.data;
});

export const createConversation = createAsyncThunk('chat/createConversation', async (followerId) => {
  const response = await chatAxios.post('/conversations', { participantId: followerId });
  console.log("CHATS ----> ", response.data);
  return response.data.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    messages: [],
    selectedChat: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => { state.loading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => { state.loading = false; state.chats = action.payload; })
      .addCase(fetchChats.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => { state.loading = false; state.messages = action.payload; })
      .addCase(fetchMessages.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createConversation.fulfilled, (state, action) => { state.chats.push(action.payload); });
  },
});

export const { selectChat, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
