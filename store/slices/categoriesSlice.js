import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  stories: [],
  loading: false,
  storiesLoading: false,
  error: null
}

// Get Categories Thunk
export const getCategories = createAsyncThunk(
  'categories/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/e-commerce`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Kategoriler alınamadı')
      }

      // Backend response: { success, data: [...] }
      return data.data || data
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

// Get Stories Thunk
export const getStories = createAsyncThunk(
  'categories/getStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/e-commerce`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Hikayeler alınamadı')
      }

      // Backend response: { success, data: [...] }
      return data.data || data
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Get Categories
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false
        // Sadece category_type: "Menu" olanları filtrele
        state.categories = action.payload.filter(cat => cat.category_type === 'Menu')
        state.error = null
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
    // Get Stories
    builder
      .addCase(getStories.pending, (state) => {
        state.storiesLoading = true
        state.error = null
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.storiesLoading = false
        // Sadece category_type: "Story" olanları filtrele
        state.stories = action.payload.filter(cat => cat.category_type === 'Story')
        state.error = null
      })
      .addCase(getStories.rejected, (state, action) => {
        state.storiesLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = categoriesSlice.actions
export default categoriesSlice.reducer


