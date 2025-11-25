// store/index.js veya store.js
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import profilReducer from "./slices/profilSlice"
import addressReducer from "./slices/addressSlice"
import categoriesReducer from "./slices/categoriesSlice"
import productsReducer from "./slices/productsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profilReducer,
    address: addressReducer,
    categories: categoriesReducer,
    products: productsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})



export default store
