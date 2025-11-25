import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchProducts, clearSearchResults } from '@/store/slices/productsSlice'
import Link from 'next/link'
import Image from 'next/image'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { searchResults, loading } = useSelector((state) => state.products)
  const searchRef = useRef(null)
  const debounceTimer = useRef(null)

  // Dışarıya tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Arama fonksiyonu (debounce ile)
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      // Önceki timer'ı temizle
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Yeni timer başlat (500ms sonra arama yap)
      debounceTimer.current = setTimeout(() => {
        dispatch(searchProducts(searchQuery.trim()))
        setIsOpen(true)
      }, 500)
    } else {
      dispatch(clearSearchResults())
      setIsOpen(false)
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery, dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim().length > 2) {
      dispatch(searchProducts(searchQuery.trim()))
      setIsOpen(true)
    }
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setSearchQuery('')
    dispatch(clearSearchResults())
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Çiçek, bitki veya ürün ara..."
          className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-[#eb1260] focus:ring-2 focus:ring-[#eb1260]/20 transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#eb1260] text-white rounded-full flex items-center justify-center hover:bg-[#d10f54] transition-colors"
          aria-label="Ara"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          )}
        </button>
      </form>

      {/* Arama Sonuçları Dropdown */}
      {isOpen && searchQuery.trim().length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-[500px] overflow-y-auto z-50">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#eb1260] mx-auto"></div>
              <p className="text-gray-500 mt-3">Aranıyor...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((product) => {
                const imageUrl = product.coverImage 
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${product.coverImage}` 
                  : '/images/placeholder.jpg'
                
                return (
                  <Link
                    key={product.id}
                    href={`/cicek/${product.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {product.short_description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-[#eb1260]">
                          {product.minPrice} ₺
                        </span>
                        {product.minPrice !== product.maxPrice && (
                          <span className="text-xs text-gray-500">
                            - {product.maxPrice} ₺
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">Sonuç bulunamadı</p>
              <p className="text-sm text-gray-400 mt-1">"{searchQuery}" için ürün bulunamadı</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
