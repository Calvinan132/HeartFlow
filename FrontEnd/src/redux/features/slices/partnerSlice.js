import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  rqPartner: [],
  isLoading: false,
  isError: false,
};

// check RQ partner
export const checkRQpartner = createAsyncThunk(
  "user/checkRQpartner",
  async ({ token, backendUrl }, { rejectWithValue }) => {
    try {
      let res = await axios.get(backendUrl + "/api/partner/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (e) {
      console.log("Lỗi từ frontend (checkRQpartner):", e.message);
      return rejectWithValue(e.response.data);
    }
  }
);

export const partnerSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      //check RQ partner
      .addCase(checkRQpartner.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(checkRQpartner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.rqPartner = action.payload;
      })
      .addCase(checkRQpartner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default partnerSlice.reducer;
