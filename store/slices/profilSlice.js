import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSession } from 'next-auth/react'

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateSuccess: false
}

// Get Profile Thunk
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession()
      
      console.log('Profile: Session data:', session)
      
      if (!session?.accessToken) {
        return rejectWithValue('Lütfen giriş yapın')
      }

      console.log('Profile: Token:', session.accessToken)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
      })

      console.log('Profile: Response status:', response.status)

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Profil bilgileri alınamadı')
      }

      // Backend nested response yapısı: { success, data: { user } } veya doğrudan user
      return data.data?.user || data.data || data
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

// Update Profile Thunk
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const session = await getSession()
      
      console.log('Update Profile: Session data:', session)
      
      if (!session?.accessToken) {
        return rejectWithValue('Lütfen giriş yapın')
      }

      console.log('Update Profile: Sending data:', profileData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(profileData),
      })

      console.log('Update Profile: Response status:', response.status)

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Profil güncellenemedi')
      }

      // Backend nested response yapısı
      return data.data?.user || data.data || data
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

const profilSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false
    }
  },
  extraReducers: (builder) => {
    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
        state.updateSuccess = true
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.updateSuccess = false
      })
  }
})

export const { clearError, clearUpdateSuccess } = profilSlice.actions
export default profilSlice.reducer

