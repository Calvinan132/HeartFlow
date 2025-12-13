import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let calcCartBadge = (arr) => {
  return arr.reduce((acc, curr) => {
    const quantity = curr.quantity;
    return acc + quantity;
  }, 0);
};

const selectCartList = (state) => state.cart.cartList;

export const selectCartTotalAmount = (state) => {
  const cartList = selectCartList(state);

  return cartList.reduce((total, item) => {
    const price = item.price || 0;
    const quantity = item.quantity;
    return total + price * quantity;
  }, 0);
};

const initialState = {
  cartList: [],
  cartBadge: 0,
  isLoading: false,
  isError: false,
};

export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async ({ token, backendUrl }, { rejectWithValue }) => {
    try {
      let res = await axios.get(backendUrl + "/api/shop/getCart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.cart;
    } catch (e) {
      console.log("lỗi frontend: ", e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ token, backendUrl, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/shop/addtocart",
        {
          productId: productId,
          quantity: quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (e) {
      console.log("lỗi từ frontend: ", e.message);
      return rejectWithValue(e.response.data);
    }
  }
);

export const removeCart = createAsyncThunk(
  "cart/removeCart",
  async ({ token, backendUrl, productId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/shop/removecart/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      console.log("lỗi từ frontend: ", e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loadCart.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.cartList = action.payload;
        state.cartBadge = calcCartBadge(state.cartList);
      })
      .addCase(loadCart.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.cartList = [];
        state.cartBadge = 0;
      })

      //add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        loadCart();
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      //remove cart
      .addCase(removeCart.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        loadCart();
      })
      .addCase(removeCart.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default cartSlice.reducer;
