import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services/axiosInstance';
import type { CustomerReview, ProductReview } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';

export const fetchCustomerReviews = createAsyncThunk<CustomerReview[], number | void, { rejectValue: string }>(
  'reviews/fetchCustomerReviews',
  async (limit, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get<{ reviews: CustomerReview[] }>('/customer-reviews', {
        params: limit ? { limit } : undefined,
      });
      return data.reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load reviews'));
    }
  },
);

type ProductReviewsResult = {
  productId: string;
  reviews: ProductReview[];
  page: number;
  totalPages: number;
  totalItems: number;
};

export const fetchProductReviews = createAsyncThunk<
  ProductReviewsResult,
  { productId: string; page?: number; limit?: number },
  { rejectValue: string }
>('reviews/fetchProductReviews', async ({ productId, page = 1, limit = 5 }, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get<{
      reviews: ProductReview[];
      page: number;
      totalPages: number;
      totalItems: number;
    }>(`/products/${productId}/reviews`, { params: { page, limit } });
    return { productId, ...data };
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, 'Failed to load product reviews'));
  }
});

type ProductReviewsState = Record<string, { items: ProductReview[]; page: number; totalPages: number; totalItems: number }>;

type ReviewsState = {
  customerReviews: CustomerReview[];
  productReviews: ProductReviewsState;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: ReviewsState = {
  customerReviews: [],
  productReviews: {},
  status: 'idle',
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomerReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customerReviews = action.payload;
      })
      .addCase(fetchCustomerReviews.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.productReviews[action.payload.productId] = {
          items: action.payload.reviews,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
        };
      });
  },
});

export default reviewsSlice.reducer;
