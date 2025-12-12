import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loveDate: "",
  totalDate: 0,
  isLoading: false,
  isError: false,
};

//fetch love date thunk
export const fetchLoveDate = createAsyncThunk(
  "counter/fetchLoveDate",
  async ({ token, partnerId, backendUrl }, { rejectWithValue }) => {
    try {
      let res = await axios.get(
        backendUrl + `/api/partner/loaddate/${partnerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

// set date thunk
export const setDate = createAsyncThunk(
  "counter/setDate",
  async ({ token, newDate, backendUrl }, { rejectWithValue }) => {
    try {
      if (!newDate) {
        return;
      }
      const payload = {
        loveDate: newDate,
      };
      let res = await axios.put(backendUrl + "/api/partner/setdate", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return newDate;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoveDate.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchLoveDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.loveDate = action.payload.date[0]?.love_date;
        state.totalDate = action.payload.date[0]?.loveDay;
      })
      .addCase(fetchLoveDate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(setDate.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(setDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.loveDate = action.payload;
      })
      .addCase(setDate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default counterSlice.reducer;
