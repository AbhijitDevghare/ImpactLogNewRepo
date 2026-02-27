import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { verificationAxios } from "../../helpers/axiosInstances";

export const getQr = createAsyncThunk("verification/getQr", async (eventId, thunkAPI) => {
  try {
    const res = await verificationAxios.post("/getQr", { eventId });
    console.log("res.data -=== qr ",res.data)
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || "QR generation failed");
  }
});

export const checkIn = createAsyncThunk("verification/checkIn", async ({ userId, eventId, token }, thunkAPI) => {
  try {
    const res = await verificationAxios.post("/checkin", { userId, eventId, token });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Check-in failed");
  }
});

const verificationSlice = createSlice({
  name: "verification",
  initialState: { qrImage: null, loading: false, error: null, success: false },
  reducers: {
    resetVerification: (state) => {
      state.qrImage = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQr.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQr.fulfilled, (state, action) => {
        state.loading = false;
        state.qrImage = action.payload.qrImage;
        state.success = true;
      })
      .addCase(getQr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVerification } = verificationSlice.actions;
export default verificationSlice.reducer;