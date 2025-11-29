// store/index.js veya store.js
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import profilReducer from "./slices/profilSlice"
import addressReducer from "./slices/addressSlice"
import categoriesReducer from "./slices/categoriesSlice"
import productsReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"
import orderReducer from "./slices/orderSlice"
import reviewReducer from "./slices/reviewSlice"
import termsReducer from "./slices/termsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profilReducer,
    address: addressReducer,
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    order: orderReducer,
    review: reviewReducer,
    terms: termsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})



export default store
