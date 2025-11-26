import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSession } from 'next-auth/react'

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
  actionSuccess: false
}

// Get All Addresses (from profile)
export const getAddresses = createAsyncThunk(
  'address/getAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession()
      
      if (!session?.accessToken) {
        return rejectWithValue('Lütfen giriş yapın')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Adresler alınamadı')
      }

      // Backend nested response: { success, data: { user: { addresses: [...] } } }
      const addresses = data.data?.user?.addresses || data.data?.addresses || data.addresses || []
      return addresses
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

// Get Single Address
export const getAddress = createAsyncThunk(
  'address/getAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const session = await getSession()
      
      if (!session?.accessToken) {
        return rejectWithValue('Lütfen giriş yapın')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/${addressId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Adres alınamadı')
      }

      return data.data?.address || data.data || data
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

// Add Address
export const addAddress = createAsyncThunk(
  'address/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const session = await getSession()
      
      if (!session?.accessToken) {
        return rejectWithValue('Lütfen giriş yapın')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(addressData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Adres eklenemedi')
      }

      return data.data?.address || data.data || data
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

// Delete Address
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const session = await getSession()
      
      if (!session?.accessToken) {
        return rejectWithValue('Lütfen giriş yapın')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/delete/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Adres silinemedi')
      }

      return addressId
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

// Set Default Address
export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const session = await getSession()
      
      if (!session?.accessToken) {
        return rejectWithValue('Lütfen giriş yapın')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/set-default/${addressId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Varsayılan adres ayarlanamadı')
      }

      return addressId
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu')
    }
  }
)

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearActionSuccess: (state) => {
      state.actionSuccess = false
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null
    }
  },
  extraReducers: (builder) => {
    // Get All Addresses
    builder
      .addCase(getAddresses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
        state.error = null
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Get Single Address
    builder
      .addCase(getAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loading = false
        state.selectedAddress = action.payload
        state.error = null
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Add Address
    builder
      .addCase(addAddress.pending, (state) => {
        state.loading = true
        state.error = null
        state.actionSuccess = false
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses.push(action.payload)
        state.error = null
        state.actionSuccess = true
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.actionSuccess = false
      })

    // Delete Address
    builder
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true
        state.error = null
        state.actionSuccess = false
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload)
        state.error = null
        state.actionSuccess = true
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.actionSuccess = false
      })

    // Set Default Address
    builder
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true
        state.error = null
        state.actionSuccess = false
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false
        // Tüm adresleri non-default yap, seçileni default yap
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          is_default: addr.id === action.payload
        }))
        state.error = null
        state.actionSuccess = true
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.actionSuccess = false
      })
  }
})

export const { clearError, clearActionSuccess, clearSelectedAddress } = addressSlice.actions
export default addressSlice.reducer





