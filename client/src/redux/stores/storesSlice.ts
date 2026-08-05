import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/axiosInstance';
import type { Store } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const fetchNearestStores = createAsyncThunk<Store[], void, { rejectValue: string }>(
  'stores/fetchNearest',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<{ stores: Store[] }>('/stores/nearest');
      return data.stores;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load nearby stores'));
    }
  },
);

export const fetchStores = createAsyncThunk<Store[], void, { rejectValue: string }>(
  'stores/fetchAll',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<{ stores: Store[] }>('/stores');
      return data.stores;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load stores'));
    }
  },
);

type StoresState = {
  nearest: Store[];
  all: Store[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: StoresState = {
  nearest: [],
  all: [],
  status: 'idle',
  error: null,
};

const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearestStores.fulfilled, (state, action) => {
        state.nearest = action.payload;
      })
      .addCase(fetchStores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.all = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load stores';
      });
  },
});

export default storesSlice.reducer;
