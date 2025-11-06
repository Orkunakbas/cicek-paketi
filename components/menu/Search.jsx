import React, { useState } from 'react'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Arama işlemi burada yapılacak
    console.log('Arama:', searchQuery)
  }

  return (
    <div className="hidden md:flex flex-1 max-w-2xl">
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default Search
