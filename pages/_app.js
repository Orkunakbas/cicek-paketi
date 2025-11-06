"use client";

import "@/styles/globals.css";
import {  HeroUIProvider } from "@heroui/react";
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Navbar from '@/components/menu/Navbar'
import Topbar from "@/components/menu/Topbar";

// AppContent'i düzeltelim
function AppContent({ Component, pageProps }) {
  return (
    <>
      <Topbar/>
      <Navbar />
      <Component {...pageProps} />
    </>
  )
}

// i18n kaldırıldı

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <AppContent Component={Component} pageProps={pageProps} />
        <Toaster position="bottom-right" />
      </HeroUIProvider>
    </Provider>
  )
}