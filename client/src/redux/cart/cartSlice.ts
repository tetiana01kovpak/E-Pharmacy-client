import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/axiosInstance';
import type { CartState, PaymentMethod, ShippingInfo } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const fetchCart = createAsyncThunk<CartState, void, { rejectValue: string }>(
  'cart/fetch',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<CartState>('/cart');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load cart'));
    }
  },
);

export const addToCart = createAsyncThunk<
  CartState,
  { productId: string; quantity?: number },
  { rejectValue: string }
>('cart/add', async (payload, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post<CartState>('/cart/add', payload);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to add item to cart'));
  }
});

export const updateCartItem = createAsyncThunk<
  CartState,
  { productId: string; quantity: number },
  { rejectValue: string }
>('cart/update', async (payload, thunkAPI) => {
  try {
    const { data } = await axiosInstance.put<CartState>('/cart/update', payload);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to update cart'));
  }
});

export const removeCartItem = createAsyncThunk<CartState, string, { rejectValue: string }>(
  'cart/remove',
  async (productId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete<CartState>(`/cart/item/${productId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to remove item'));
    }
  },
);

export const checkout = createAsyncThunk<
  { order: unknown },
  { shipping: ShippingInfo; paymentMethod: PaymentMethod },
  { rejectValue: string }
>('cart/checkout', async (payload, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/cart/checkout', payload);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Checkout failed'));
  }
});

type CartSliceState = CartState & {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isMutating: boolean;
  error: string | null;
  lastOrder: unknown;
};

const initialState: CartSliceState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  status: 'idle',
  isMutating: false,
  error: null,
  lastOrder: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load cart';
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.items = [];
        state.totalPrice = 0;
        state.totalItems = 0;
        state.lastOrder = action.payload.order;
      });

    builder.addMatcher(isAnyOf(addToCart.pending, updateCartItem.pending, removeCartItem.pending), (state) => {
      state.isMutating = true;
      state.error = null;
    });

    builder.addMatcher(
      isAnyOf(addToCart.fulfilled, updateCartItem.fulfilled, removeCartItem.fulfilled),
      (state, action) => {
        state.isMutating = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.totalItems = action.payload.totalItems;
      },
    );

    builder.addMatcher(
      isAnyOf(addToCart.rejected, updateCartItem.rejected, removeCartItem.rejected),
      (state, action) => {
        state.isMutating = false;
        state.error = action.payload ?? 'Cart action failed';
      },
    );
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
