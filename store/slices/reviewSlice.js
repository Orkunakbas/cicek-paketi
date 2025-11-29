import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Değerlendirilebilir ürünleri getir
export const getReviewableProducts = createAsyncThunk(
  'review/getReviewableProducts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/user/${userId}/reviewable`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ürünler yüklenemedi');
    }
  }
);

// Yorum ekle
export const addReview = createAsyncThunk(
  'review/addReview',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/reviews/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Değerlendirme eklenemedi');
    }
  }
);

// Ürün yorumlarını getir
export const getProductReviews = createAsyncThunk(
  'review/getProductReviews',
  async ({ productId, sort = 'newest' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/product/${productId}?sort=${sort}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Yorumlar yüklenemedi');
    }
  }
);

// Yorumu faydalı bul
export const markHelpful = createAsyncThunk(
  'review/markHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/reviews/${reviewId}/helpful`);
      return { reviewId, helpfulCount: response.data.data.helpful_count };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'İşlem başarısız');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    reviewableProducts: [],
    productReviews: [],
    reviewStats: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Değerlendirilebilir ürünleri getir
      .addCase(getReviewableProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewableProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewableProducts = action.payload;
      })
      .addCase(getReviewableProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Yorum ekle
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Ürün yorumlarını getir
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload.reviews;
        state.reviewStats = action.payload.stats;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Yorumu faydalı bul
      .addCase(markHelpful.fulfilled, (state, action) => {
        const review = state.productReviews.find(r => r.id === action.payload.reviewId);
        if (review) {
          review.helpful_count = action.payload.helpfulCount;
        }
      });
  }
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;


