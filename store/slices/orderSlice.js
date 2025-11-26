import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';

// Helper: Session ID veya User ID'yi belirle
const getIdentifier = (getState) => {
  const { auth } = getState();
  if (auth?.user?.id) {
    return { user_id: auth.user.id };
  } else {
    const sessionId = localStorage.getItem('cart_session_id');
    return { session_id: sessionId };
  }
};

// 1. Sipariş Oluştur
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const identifier = getIdentifier(getState);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`;

      const requestBody = {
        ...identifier,
        ...orderData,
      };

      console.log('📤 Redux - Sipariş Oluşturuluyor:', requestBody);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Sipariş oluşturulamadı');
      }

      const data = await response.json();
      console.log('✅ Frontend - Sipariş Yanıtı:', data);
      return data;
    } catch (error) {
      console.error('Redux createOrder hatası:', error);
      return rejectWithValue(error.message || 'Sipariş oluşturulurken hata oluştu');
    }
  }
);

// 2. Kullanıcının Siparişlerini Getir
export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        return rejectWithValue('Giriş yapmanız gerekiyor');
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/orders`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Siparişler getirilemedi');
      }

      const data = await response.json();
      console.log('🛍️ Frontend - Siparişler:', data);
      return data.data;
    } catch (error) {
      console.error('Redux getOrders hatası:', error);
      return rejectWithValue(error.message || 'Siparişler getirilemedi');
    }
  }
);

// 3. Sipariş Detayı Getir
export const getOrderDetail = createAsyncThunk(
  'order/getOrderDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Sipariş detayı getirilemedi');
      }

      const data = await response.json();
      console.log('📦 Frontend - Sipariş Detayı:', data);
      return data;
    } catch (error) {
      console.error('Redux getOrderDetail hatası:', error);
      return rejectWithValue(error.message || 'Sipariş detayı getirilemedi');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    creating: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.currentOrder = action.payload?.data;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // Get Orders
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Order Detail
    builder
      .addCase(getOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload?.data;
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;

