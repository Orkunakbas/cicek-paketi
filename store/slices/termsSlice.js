import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// API'den sözleşmeleri getir
export const fetchTerms = createAsyncThunk(
  'terms/fetchTerms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/terms/list`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sözleşmeler yüklenirken bir hata oluştu')
    }
  }
)

const termsSlice = createSlice({
  name: 'terms',
  initialState: {
    terms: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.loading = false
        state.terms = action.payload
      })
      .addCase(fetchTerms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default termsSlice.reducer

