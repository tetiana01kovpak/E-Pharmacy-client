import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance, setAuthHeader } from '../../services/axiosInstance';
import type { User } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

type RegisterPayload = { name: string; email: string; phone: string; password: string };
type LoginPayload = { email: string; password: string };
type AuthResponse = { user: User; accessToken: string };

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  'auth/register',
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>('/user/register', payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Registration failed'));
    }
  },
);

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>('/user/login', payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Login failed'));
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await axiosInstance.get('/user/logout');
  } catch {
    // best-effort — clear client state regardless of server response
  }
});

export const refreshUser = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>('/user/refresh');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Session expired'));
    }
  },
);

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  isSubmitting: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
  isRefreshing: true,
  isSubmitting: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      setAuthHeader(action.payload);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        setAuthHeader(action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload ?? 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        setAuthHeader(action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isLoggedIn = false;
        setAuthHeader(null);
      })
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        setAuthHeader(action.payload.accessToken);
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isRefreshing = false;
        state.user = null;
        state.accessToken = null;
        state.isLoggedIn = false;
        setAuthHeader(null);
      });
  },
});

export const { setAccessToken, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
