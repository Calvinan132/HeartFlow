import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  partnerData: [],
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
export const fetchPartner = createAsyncThunk(
  "user/fetchPartner",
  async ({ token, backendUrl }, { rejectWithValue }) => {
    try {
      let res = await axios.get(backendUrl + "/api/partner/fetchPartner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (e) {
      console.log("Lỗi từ frontend (fetchPartner):", e.message);
      return rejectWithValue(e.response.data);
    }
  }
);

export const handleRQpartner = createAsyncThunk(
  "user/handleRQpartner",
  async ({ token, backendUrl, senderId, action }, { rejectWithValue }) => {
    if (action === "accept" || action === "reject") {
      try {
        const payload = {
          senderId,
          action: action,
        };
        let { data } = await axios.put(
          backendUrl + "/api/partner/response",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return senderId;
      } catch (e) {
        console.log(e);
      }
    }
  }
);

export const partnerSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartner.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPartner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.partnerData = action.payload;
      })
      .addCase(fetchPartner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
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
      })
      .addCase(handleRQpartner.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(handleRQpartner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const senderId = action.payload;
        state.rqPartner = state.rqPartner.filter(
          (userId) => userId.sender_id !== senderId
        );
      })
      .addCase(handleRQpartner.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default partnerSlice.reducer;
