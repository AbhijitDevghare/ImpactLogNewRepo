import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { engagementAxios } from "../../helpers/axiosInstances";

// Like a post
export const likePost = createAsyncThunk(
  "engagement/likePost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await engagementAxios.post("/like", { postId });
      return { postId, like: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to like post");
    }
  }
);

// Remove a like
export const removeLike = createAsyncThunk(
  "engagement/removeLike",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await engagementAxios.delete(`/like/${postId}`);
      return { postId, deleted: response.data.deleted };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove like");
    }
  }
);

// Comment on a post
export const commentPost = createAsyncThunk(
  "engagement/commentPost",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await engagementAxios.post("/comment", { postId, content: comment });
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to comment on post");
    }
  }
);

// Share a post
export const sharePost = createAsyncThunk(
  "engagement/sharePost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await engagementAxios.post("/share", { postId });
      return { postId, share: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to share post");
    }
  }
);

// Get comments for a post
export const getComments = createAsyncThunk(
  "engagement/getComments",
  async ({ postId, limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await engagementAxios.get(`/comments/${postId}?limit=${limit}&offset=${offset}`);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch comments");
    }
  }
);

// Get engagement counts for a single post
export const getEngagementCounts = createAsyncThunk(
  "engagement/getEngagementCounts",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await engagementAxios.get(`/engagement/counts/${postId}`);
      return { postId, counts: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch engagement counts");
    }
  }
);

// Get engagement counts for multiple posts
export const getEngagementCountsByIds = createAsyncThunk(
  "engagement/getEngagementCountsByIds",
  async ({ postIds }, { rejectWithValue }) => {
    try {
      const response = await engagementAxios.post("/engagement/counts", { postIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch engagement counts");
    }
  }
);

const engagementSlice = createSlice({
  name: "engagement",
  initialState: {
    likes: {},
    comments: {},
    shares: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Like a post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, like } = action.payload;
        state.likes[postId] = state.likes[postId] || [];
        state.likes[postId].push(like);
      })
      // Remove like
      .addCase(removeLike.fulfilled, (state, action) => {
        const { postId, deleted } = action.payload;
        if (deleted && state.likes[postId]) {
          state.likes[postId] = state.likes[postId].filter(l => l.id !== deleted.id);
        }
      })
      // Comment
      .addCase(commentPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        state.comments[postId] = state.comments[postId] || [];
        state.comments[postId].push(comment);
      })
      // Share
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId, share } = action.payload;
        state.shares[postId] = state.shares[postId] || [];
        state.shares[postId].push(share);
      })
      // Get comments
      .addCase(getComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.comments[postId] = comments;
      })
      // Get engagement counts for a post
      .addCase(getEngagementCounts.fulfilled, (state, action) => {
        const { postId, counts } = action.payload;
        state.likes[postId] = counts.likes || [];
        state.comments[postId] = counts.comments || [];
        state.shares[postId] = counts.shares || [];
      })
      // Get engagement counts for multiple posts
      .addCase(getEngagementCountsByIds.fulfilled, (state, action) => {
        const countsByPost = action.payload;
        Object.entries(countsByPost).forEach(([postId, counts]) => {
          state.likes[postId] = counts.likes || [];
          state.comments[postId] = counts.comments || [];
          state.shares[postId] = counts.shares || [];
        });
      });
  }
});

export default engagementSlice.reducer;
