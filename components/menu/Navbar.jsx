import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import darkLogo from '@/images/dark-logo.png'
import Cart from '@/components/cart/Cart'
import Search from '@/components/menu/Search'
import AuthModal from '@/components/auth/AuthModal'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Dil kaldırıldı

  // Alt menü açma/kapama işlevi
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  }

  // Sayfa değiştiğinde menüyü kapat (router kaldırıldığı için sadece menü kapatma mantığı bırakıldı)
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  }, []);

  // Body scroll kilidi
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1650px] w-full mx-auto px-6">
          {/* Üst Satır: Logo, Search, İkonlar */}
          <div className="flex items-center h-20 gap-4">
            {/* Hamburger Menu Button (sadece mobilde - solda) */}
            <button 
              className="md:hidden text-[#230060] focus:outline-none flex-shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo (mobilde ortada, masaüstünde solda) */}
            <div className="flex justify-center md:justify-start items-center flex-1 md:flex-initial">
              <Link href="/">
                <Image
                  src={darkLogo}
                  alt="Logo"
                  width={180}
                  height={60}
                  priority
                  className="h-auto w-28 md:w-44"
                />
              </Link>
            </div>

            {/* Desktop Search Bar (ortada) */}
            <Search />

            {/* Sağ taraf: Sepet & Giriş/Kayıt ikonu */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              {/* Sepet İkonu */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Sepet"
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-700 hover:text-[#eb1260] hover:border-[#eb1260] hover:bg-pink-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {/* Sepet Badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#eb1260] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  1
                </span>
              </button>

            {/* Giriş/Kayıt İkonu */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              aria-label="Giriş / Kayıt"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-700 hover:text-[#eb1260] hover:border-[#eb1260] hover:bg-pink-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a8.25 8.25 0 0115 0" />
              </svg>
            </button>
            </div>
          </div>

          {/* Alt Satır: Desktop Menüler (sadece masaüstünde) */}
          <div className="hidden md:flex items-center h-14 border-t border-gray-100">
            <div className="flex items-center space-x-8 flex-1">
              <div className="flex items-center space-x-8">
              {/* Çiçek Türleri */}
              <div className="relative group">
                <button className="text-gray-800 hover:text-white hover:bg-[#eb1260] font-medium flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300">
                  <span>Çiçek Türleri</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-3 w-64 opacity-0 translate-y-1 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out bg-white border border-gray-100 shadow-lg rounded-lg p-3 z-50">
                  <Link href="/cicek-turleri/guller" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Güller</Link>
                  <Link href="/cicek-turleri/orkideler" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Orkideler</Link>
                  <Link href="/cicek-turleri/papatyalar" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Papatyalar</Link>
                  <Link href="/cicek-turleri/buketler" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Buketler</Link>
                  <Link href="/cicek-turleri/aranjmanlar" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Aranjmanlar</Link>
                  <Link href="/cicek-turleri/saksi-cicekleri" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Saksı Çiçekleri</Link>
                </div>
              </div>

              {/* Özel Günler */}
              <div className="relative group">
                <button className="text-gray-800 hover:text-white hover:bg-[#eb1260] font-medium flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300">
                  <span>Özel Günler</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-3 w-64 opacity-0 translate-y-1 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out bg-white border border-gray-100 shadow-lg rounded-lg p-3 z-50">
                  <Link href="/ozel-gunler/dogum-gunu" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Doğum Günü</Link>
                  <Link href="/ozel-gunler/yildonumu" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Yıldönümü</Link>
                  <Link href="/ozel-gunler/sevgililer-gunu" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Sevgililer Günü</Link>
                  <Link href="/ozel-gunler/anneler-gunu" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Anneler Günü</Link>
                  <Link href="/ozel-gunler/gecmis-olsun" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Geçmiş Olsun</Link>
                  <Link href="/ozel-gunler/taziye" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Taziye</Link>
                </div>
              </div>
              
              {/* Bitkiler */}
              <div className="relative group">
                <button className="text-gray-800 hover:text-white hover:bg-[#eb1260] font-medium flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300">
                  <span>Bitkiler</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-3 w-64 opacity-0 translate-y-1 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out bg-white border border-gray-100 shadow-lg rounded-lg p-3 z-50">
                  <Link href="/bitkiler/sukulentler" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Sukulentler</Link>
                  <Link href="/bitkiler/kaktusler" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Kaktüsler</Link>
                  <Link href="/bitkiler/ic-mekan" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">İç Mekan Bitkileri</Link>
                  <Link href="/bitkiler/ofis-bitkileri" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Ofis Bitkileri</Link>
                  <Link href="/bitkiler/bakimi-kolay" className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-[#eb1260] rounded-md">Bakımı Kolay</Link>
                </div>
              </div>

              {/* Tekli Linkler */}
              <Link href="/premium-cicekler" className="text-gray-800 hover:text-white hover:bg-[#eb1260] font-medium px-4 py-2 rounded-full transition-all duration-300">Premium Çiçekler</Link>
              <Link href="/saksilar" className="text-gray-800 hover:text-white hover:bg-[#eb1260] font-medium px-4 py-2 rounded-full transition-all duration-300">Saksılar</Link>
              <Link href="/bitki-bakim-malzemeleri" className="text-gray-800 hover:text-white hover:bg-[#eb1260] font-medium px-4 py-2 rounded-full transition-all duration-300">Bitki Bakım Malzemeleri</Link>
              
              {/* Yılbaşı Koleksiyonu - Özel İkon ile */}
              <Link href="/yilbasi-koleksiyonu" className="text-gray-800 hover:text-white hover:bg-[#eb1260] font-medium flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-green-600">
                  <path d="M12 3 L6 9 L8 9 L4 15 L7 15 L3 21 L12 21 L21 21 L17 15 L20 15 L16 9 L18 9 Z" fill="#15803d" stroke="#15803d"/>
                  <rect x="10.5" y="21" width="3" height="2" fill="#78350f" stroke="none"/>
                  <circle cx="12" cy="2" r="1.5" fill="#fbbf24" stroke="none"/>
                </svg>
                <span>Yılbaşı Koleksiyonu</span>
              </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil Soldan Açılan Menü */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Karartılmış overlay */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Menü paneli - daha geniş */}
        <div className={`absolute top-0 left-0 h-full w-4/5 sm:w-3/4 bg-white shadow-xl overflow-y-auto transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            {/* Menü Başlık ve Kapatma */}
            <div className="flex justify-between items-center mb-8">
              <Image
                src={darkLogo}
                alt="Logo"
                width={100}
                height={32}
                className="h-auto"
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobil Menü Öğeleri */}
            <nav className="space-y-6 divide-y divide-gray-100">
              {/* Çiçek Türleri */}
              <div>
                <button
                  onClick={() => toggleSubmenu('types')}
                  aria-expanded={activeSubmenu === 'types'}
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-[#eb1260] transition-colors px-2 py-2 rounded-md hover:bg-pink-50"
                >
                  <span>Çiçek Türleri</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-5 h-5 transform transition-transform duration-300 ${activeSubmenu === 'types' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`mt-2 pl-4 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${activeSubmenu === 'types' ? 'opacity-100 max-h-80' : 'opacity-0 max-h-0'}`}>
                  <Link href="/cicek-turleri/guller" className="block text-gray-600 hover:text-[#eb1260]">Güller</Link>
                  <Link href="/cicek-turleri/orkideler" className="block text-gray-600 hover:text-[#eb1260]">Orkideler</Link>
                  <Link href="/cicek-turleri/papatyalar" className="block text-gray-600 hover:text-[#eb1260]">Papatyalar</Link>
                  <Link href="/cicek-turleri/buketler" className="block text-gray-600 hover:text-[#eb1260]">Buketler</Link>
                  <Link href="/cicek-turleri/aranjmanlar" className="block text-gray-600 hover:text-[#eb1260]">Aranjmanlar</Link>
                  <Link href="/cicek-turleri/saksi-cicekleri" className="block text-gray-600 hover:text-[#eb1260]">Saksı Çiçekleri</Link>
                </div>
              </div>

              {/* Özel Günler */}
              <div>
                <button
                  onClick={() => toggleSubmenu('occasions')}
                  aria-expanded={activeSubmenu === 'occasions'}
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-[#eb1260] transition-colors px-2 py-2 rounded-md hover:bg-pink-50"
                >
                  <span>Özel Günler</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-5 h-5 transform transition-transform duration-300 ${activeSubmenu === 'occasions' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`mt-2 pl-4 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${activeSubmenu === 'occasions' ? 'opacity-100 max-h-80' : 'opacity-0 max-h-0'}`}>
                  <Link href="/ozel-gunler/dogum-gunu" className="block text-gray-600 hover:text-[#eb1260]">Doğum Günü</Link>
                  <Link href="/ozel-gunler/yildonumu" className="block text-gray-600 hover:text-[#eb1260]">Yıldönümü</Link>
                  <Link href="/ozel-gunler/sevgililer-gunu" className="block text-gray-600 hover:text-[#eb1260]">Sevgililer Günü</Link>
                  <Link href="/ozel-gunler/anneler-gunu" className="block text-gray-600 hover:text-[#eb1260]">Anneler Günü</Link>
                  <Link href="/ozel-gunler/gecmis-olsun" className="block text-gray-600 hover:text-[#eb1260]">Geçmiş Olsun</Link>
                  <Link href="/ozel-gunler/taziye" className="block text-gray-600 hover:text-[#eb1260]">Taziye</Link>
                </div>
              </div>
              
              {/* Bitkiler */}
              <div>
                <button
                  onClick={() => toggleSubmenu('plants')}
                  aria-expanded={activeSubmenu === 'plants'}
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 hover:text-[#eb1260] transition-colors px-2 py-2 rounded-md hover:bg-pink-50"
                >
                  <span>Bitkiler</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-5 h-5 transform transition-transform duration-300 ${activeSubmenu === 'plants' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`mt-2 pl-4 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${activeSubmenu === 'plants' ? 'opacity-100 max-h-80' : 'opacity-0 max-h-0'}`}>
                  <Link href="/bitkiler/sukulentler" className="block text-gray-600 hover:text-[#eb1260]">Sukulentler</Link>
                  <Link href="/bitkiler/kaktusler" className="block text-gray-600 hover:text-[#eb1260]">Kaktüsler</Link>
                  <Link href="/bitkiler/ic-mekan" className="block text-gray-600 hover:text-[#eb1260]">İç Mekan Bitkileri</Link>
                  <Link href="/bitkiler/ofis-bitkileri" className="block text-gray-600 hover:text-[#eb1260]">Ofis Bitkileri</Link>
                  <Link href="/bitkiler/bakimi-kolay" className="block text-gray-600 hover:text-[#eb1260]">Bakımı Kolay</Link>
                </div>
              </div>

              {/* Tekli Linkler */}
              <Link href="/premium-cicekler" className="block text-lg font-medium text-gray-800 hover:text-[#eb1260] transition-colors px-2 py-2 rounded-md hover:bg-pink-50">Premium Çiçekler</Link>
              <Link href="/saksilar" className="block text-lg font-medium text-gray-800 hover:text-[#eb1260] transition-colors px-2 py-2 rounded-md hover:bg-pink-50">Saksılar</Link>
              <Link href="/bitki-bakim-malzemeleri" className="block text-lg font-medium text-gray-800 hover:text-[#eb1260] transition-colors px-2 py-2 rounded-md hover:bg-pink-50">Bitki Bakım Malzemeleri</Link>
              
              {/* Yılbaşı Koleksiyonu - Özel İkon ile */}
              <Link href="/yilbasi-koleksiyonu" className="flex items-center gap-2 text-lg font-medium text-gray-800 hover:text-[#eb1260] transition-colors px-2 py-2 rounded-md hover:bg-pink-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-600">
                  <path d="M12 3 L6 9 L8 9 L4 15 L7 15 L3 21 L12 21 L21 21 L17 15 L20 15 L16 9 L18 9 Z" fill="#15803d" stroke="#15803d"/>
                  <rect x="10.5" y="21" width="3" height="2" fill="#78350f" stroke="none"/>
                  <circle cx="12" cy="2" r="1.5" fill="#fbbf24" stroke="none"/>
                </svg>
                <span>Yılbaşı Koleksiyonu</span>
              </Link>
              
              
            </nav>

          </div>
        </div>
      </div>

      {/* Spacer div to prevent content from going under navbar */}
      <div className="h-20 md:h-[136px]"></div>

      {/* Sepet Drawer */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

export default Navbar