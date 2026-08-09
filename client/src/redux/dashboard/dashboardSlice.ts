import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/axiosInstance';
import type { FinanceEntry, Supplier } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const fetchSuppliers = createAsyncThunk<Supplier[], void, { rejectValue: string }>(
  'dashboard/fetchSuppliers',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<{ suppliers: Supplier[] }>('/dashboard/suppliers');
      return data.suppliers;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load suppliers'));
    }
  },
);

export const fetchFinanceEntries = createAsyncThunk<FinanceEntry[], void, { rejectValue: string }>(
  'dashboard/fetchFinanceEntries',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<{ entries: FinanceEntry[] }>('/dashboard/finance');
      return data.entries;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load finance entries'));
    }
  },
);

type DashboardState = {
  suppliers: Supplier[];
  financeEntries: FinanceEntry[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: DashboardState = {
  suppliers: [],
  financeEntries: [],
  status: 'idle',
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load suppliers';
      })
      .addCase(fetchFinanceEntries.fulfilled, (state, action) => {
        state.financeEntries = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
