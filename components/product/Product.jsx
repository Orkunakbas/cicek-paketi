import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Product = ({ 
  id,
  urun_adi, 
  urun_aciklama,
  fiyat, 
  indirimli_fiyat,
  kapak,
  url,
  tag = []
}) => {
  const [isFavorite, setIsFavorite] = useState(false)

  // İndirim yüzdesi hesaplama
  const discountPercentage = indirimli_fiyat 
    ? Math.round(((fiyat - indirimli_fiyat) / fiyat) * 100) 
    : 0

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Ürün Resmi */}
      <Link href={url} className="relative aspect-square overflow-hidden bg-gray-50 block">
        <Image
          src={kapak}
          alt={urun_adi}
          fill
          className="object-cover"
          unoptimized
        />
        
              {/* İndirim Badge */}
              {indirimli_fiyat && (
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#059669] text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg z-10">
                  <span className="md:hidden">%{discountPercentage}</span>
                  <span className="hidden md:inline">%{discountPercentage} İndirim</span>
                </div>
              )}

        {/* Favori Butonu */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group/fav z-10"
          aria-label="Favorilere Ekle"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "#eb1260" : "none"}
            stroke={isFavorite ? "#eb1260" : "currentColor"}
            strokeWidth="2" 
            className="w-5 h-5 text-gray-700 group-hover/fav:scale-110 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </Link>

      {/* Ürün Bilgileri */}
      <div className="p-4">
        {/* Ürün Adı */}
        <Link href={url}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#eb1260] transition-colors">
            {urun_adi}
          </h3>
        </Link>

        {/* Ürün Açıklaması */}
        {urun_aciklama && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {urun_aciklama}
          </p>
        )}

        {/* Fiyat */}
        <div className="flex items-center gap-2">
          {indirimli_fiyat ? (
            <>
              <span className="text-2xl font-bold text-[#eb1260]">
                {indirimli_fiyat} ₺
              </span>
              <span className="text-sm text-gray-500 line-through">
                {fiyat} ₺
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              {fiyat} ₺
            </span>
          )}
        </div>

              {/* Etiketler */}
              {tag && tag.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                  {tag.slice(0, 3).map((t, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-pink-50 text-[#eb1260] rounded-full whitespace-nowrap flex-shrink-0"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
      </div>

      {/* Yeni Ürün Badge (opsiyonel) */}
      {/* <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        YENİ
      </div> */}

      {/* Scrollbar gizleme CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default Product
