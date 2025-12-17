import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  friends: [],
  rqFriends: [],
  isLoading: false,
  isError: false,
};

// fetch friends list
export const fetchFriends = createAsyncThunk(
  "user/fetchFriends",
  async ({ token, backendUrl }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${backendUrl}/api/friend/listfriend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.friends;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);
// check RQ friend
export const checkRQfriend = createAsyncThunk(
  "user/checkRQfriend",
  async ({ token, backendUrl }, { rejectWithValue }) => {
    try {
      let res = await axios.get(backendUrl + "/api/friend/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.requests;
    } catch (e) {
      console.log(e.message);
      return rejectWithValue(e.response.data);
    }
  }
);
// accept friend
export const FHandleAccept = createAsyncThunk(
  "user/FHandleAccept",
  async ({ token, backendUrl, senderId }, { rejectWithValue }) => {
    try {
      const payload = {
        senderId,
        action: "accept",
      };
      let res = await axios.put(backendUrl + "/api/friend/response", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return senderId;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const FHandleReject = createAsyncThunk(
  "user/FHandleReject",
  async ({ token, backendUrl, senderId }, { rejectWithValue }) => {
    try {
      let payload = {
        senderId,
        action: "reject",
      };
      let { data } = await axios.put(
        backendUrl + "/api/friend/response",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return senderId;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const friendSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      //fetch friends
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      //check RQ friend
      .addCase(checkRQfriend.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(checkRQfriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.rqFriends = action.payload;
      })
      .addCase(checkRQfriend.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      // accept friend
      .addCase(FHandleAccept.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(FHandleAccept.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const acceptedId = action.payload;
        const newFriendInfo = state.rqFriends.find(
          (user) => user.sender_id === acceptedId
        );

        if (newFriendInfo) {
          const newFriend = {
            friend_id: newFriendInfo.sender_id,
            firstname: newFriendInfo.firstname,
            lastname: newFriendInfo.lastname,
            image_url: newFriendInfo.image_url,
          };

          state.friends.push(newFriend);
          state.rqFriends = state.rqFriends.filter(
            (item) => item.sender_id !== acceptedId
          );
        }
      })
      .addCase(FHandleAccept.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      // reject friend
      .addCase(FHandleReject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(FHandleReject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const deletedId = action.payload;
        state.rqFriends = state.rqFriends.filter(
          (item) => item.sender_id !== deletedId
        );
      })
      .addCase(FHandleReject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default friendSlice.reducer;
