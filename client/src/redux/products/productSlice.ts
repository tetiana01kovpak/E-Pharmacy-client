import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/axiosInstance';
import type { Product } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'product/fetchById',
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<{ product: Product }>(`/products/${id}`);
      return data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load product'));
    }
  },
);

type ProductState = {
  current: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ProductState = {
  current: null,
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.current = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load product';
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
