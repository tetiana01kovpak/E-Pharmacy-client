import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/axiosInstance';
import type { Product } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

export type ProductsQuery = {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  minDiscount?: number;
};

type ProductsResponse = {
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
};

export const fetchProducts = createAsyncThunk<ProductsResponse, ProductsQuery, { rejectValue: string }>(
  'products/fetchAll',
  async (query, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<ProductsResponse>('/products', { params: query });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load products'));
    }
  },
);

export const fetchCategories = createAsyncThunk<string[], void, { rejectValue: string }>(
  'products/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<{ categories: string[] }>('/products/categories');
      return data.categories;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load categories'));
    }
  },
);

type ProductsState = {
  items: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  page: 1,
  totalPages: 1,
  totalItems: 0,
  categories: [],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load products';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default productsSlice.reducer;
