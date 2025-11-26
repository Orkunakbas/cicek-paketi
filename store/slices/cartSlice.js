import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Session ID oluştur (misafir kullanıcılar için)
const generateSessionId = () => {
  const existingSessionId = localStorage.getItem('cart_session_id');
  if (existingSessionId) {
    return existingSessionId;
  }
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('cart_session_id', newSessionId);
  return newSessionId;
};

// Helper: Session ID veya User ID'yi belirle
const getIdentifier = (getState) => {
  const { auth } = getState();
  
  if (auth?.user?.id) {
    // Giriş yapmış kullanıcı
    return { user_id: auth.user.id };
  } else {
    // Misafir kullanıcı
    return { session_id: generateSessionId() };
  }
};

// 1. Sepete Ürün Ekle
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product_id, variant_id = null, quantity = 1 }, { rejectWithValue, getState }) => {
    try {
      const identifier = getIdentifier(getState);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`;
      
      const requestBody = {
        ...identifier,
        product_id,
        variant_id,
        quantity,
      };
      
      console.log('📤 Redux - Backend\'e Gönderiliyor:', requestBody);
      console.log('🔐 Identifier:', identifier);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Backend Hata:', errorData);
        return rejectWithValue(errorData.message || 'Sepete eklenirken hata oluştu');
      }

      const data = await response.json();
      console.log('✅ Frontend - Backend\'den Gelen Response:', data);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Sepete eklenirken hata oluştu');
    }
  }
);

// 2. Sepeti Getir
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const identifier = getIdentifier(getState);
      const queryParam = identifier.user_id 
        ? `user_id=${identifier.user_id}` 
        : `session_id=${identifier.session_id}`;
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/cart?${queryParam}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Sepet Getirme Hatası:', errorData);
        return rejectWithValue(errorData.message || 'Sepet getirilemedi');
      }

      const data = await response.json();
      console.log('🛒 Frontend - Sepet Verisi:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Sepet getirilemedi');
    }
  }
);

// 3. Sepetteki Ürün Miktarını Güncelle
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cart_item_id, quantity }, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/cart/update/${cart_item_id}`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Ürün güncellenemedi');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ürün güncellenemedi');
    }
  }
);

// 4. Sepetten Ürün Sil
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (cart_item_id, { rejectWithValue }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${cart_item_id}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Ürün silinemedi');
      }

      const data = await response.json();
      return { ...data, cart_item_id };
    } catch (error) {
      return rejectWithValue(error.message || 'Ürün silinemedi');
    }
  }
);

// 5. Sepeti Temizle
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const identifier = getIdentifier(getState);
      const queryParam = identifier.user_id 
        ? `user_id=${identifier.user_id}` 
        : `session_id=${identifier.session_id}`;
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear?${queryParam}`;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Sepet temizlenemedi');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Sepet temizlenemedi');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    discount: 0,
    shippingCost: 0,
    freeShippingThreshold: 0,
    totalQuantity: 0,
    grandTotal: 0,
    loading: false,
    error: null,
    isCartOpen: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Sepeti yeniden getir
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Cart
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        const responseData = action.payload?.data || {};
        const summary = responseData.summary || {};
        const items = responseData.items || [];
        
        // Toplam ürün adedini hesapla (her ürünün quantity'sini topla)
        const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        state.items = items;
        state.totalAmount = parseFloat(summary.subtotal || 0);
        state.discount = parseFloat(summary.discount || 0);
        state.shippingCost = parseFloat(summary.shipping_cost || 0);
        state.freeShippingThreshold = parseFloat(summary.free_shipping_threshold || 0);
        state.grandTotal = parseFloat(summary.total || 0);
        state.totalQuantity = totalQty;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Sepet boşsa hata olarak algılanmamalı
        if (action.payload?.includes('boş')) {
          state.items = [];
          state.totalAmount = 0;
          state.totalQuantity = 0;
          state.grandTotal = 0;
        }
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // Sepeti yeniden getir
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove Cart Item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // Local state'ten de sil
        const removedId = action.payload.cart_item_id;
        state.items = state.items.filter(item => item.id !== removedId);
        // Toplamları yeniden hesapla (veya sepeti yeniden getir)
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear Cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
        state.discount = 0;
        state.shippingCost = 0;
        state.freeShippingThreshold = 0;
        state.totalQuantity = 0;
        state.grandTotal = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, openCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;

