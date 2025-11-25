import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signIn, signOut } from 'next-auth/react'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Login Thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        return rejectWithValue('E-posta veya şifre hatalı!')
      }

      // Session'dan user bilgilerini al
      const response = await fetch('/api/auth/session')
      const session = await response.json()
      
      if (!session?.user) {
        return rejectWithValue('Session alınamadı')
      }

      return {
        user: session.user,
        token: session.accessToken
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Giriş başarısız')
    }
  }
)

// Register Thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, surname, email, phone, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          surname,
          email,
          phone,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Kayıt başarısız!')
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu!')
    }
  }
)

// Logout Thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut({ redirect: false })
      return true
    } catch (error) {
      return rejectWithValue(error.message || 'Çıkış başarısız')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setUser, setToken, clearError } = authSlice.actions
export default authSlice.reducer

