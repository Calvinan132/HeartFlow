import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userData: null,
  isLoading: false,
  isError: false,
};

// check RQ partner
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async ({ token, backendUrl }, { rejectWithValue }) => {
    try {
      let { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        return data.profile[0][0];
      } else {
        console.log("Lỗi gì đó !", data.message);
      }
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      //check RQ partner
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default userSlice.reducer;
