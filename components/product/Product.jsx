import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Product = ({ 
  id,
  urun_adi, 
  urun_aciklama,
  minPrice,
  maxPrice,
  minDiscountPrice,
  maxDiscountPrice,
  kapak,
  url,
  tag = [],
  initialFavorite = false
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  
  // Fiyat aralığı var mı kontrol et
  const hasPriceRange = minPrice !== maxPrice
  
  // İndirim var mı kontrol et
  const hasDiscount = minDiscountPrice !== null && minDiscountPrice !== undefined
  
  // İndirim yüzdesi hesapla
  const discountPercentage = hasDiscount 
    ? Math.round(((minPrice - minDiscountPrice) / minPrice) * 100) 
    : 0

  return (
    <div className="group relative h-full flex flex-col">
      {/* Outer Decorative Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-200/40 via-pink-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md scale-105"></div>
      
      {/* Main Border Ring */}
      <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-pink-200/60 via-pink-100/50 to-pink-50/40 group-hover:from-[#eb1260]/70 group-hover:via-[#ff6b9d]/60 group-hover:to-pink-300/50 shadow-md group-hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* White Background */}
        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col">
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
            {hasDiscount && (
              <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#059669] text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg z-10">
                %{discountPercentage}
              </div>
            )}

            {/* Favori İkonu - Sağ Üst */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsFavorite(!isFavorite)
              }}
              className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 group/fav z-10"
              aria-label="Favorilere Ekle"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "#eb1260" : "none"}
                stroke={isFavorite ? "#eb1260" : "currentColor"}
                strokeWidth="2" 
                className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover/fav:scale-110 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </Link>

      {/* Ürün Bilgileri */}
      <div className="p-4 flex flex-col flex-1">
        {/* Ürün Adı - Sabit 2 satır yükseklik */}
        <Link href={url}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] hover:text-[#eb1260] transition-colors">
            {urun_adi}
          </h3>
        </Link>

        {/* Ürün Açıklaması - Sabit 2 satır */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
          {urun_aciklama || ''}
        </p>

        {/* Fiyat */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasDiscount ? (
            // İndirimli fiyat
            <>
              {hasPriceRange && minDiscountPrice !== maxDiscountPrice ? (
                // Varyantlı indirimli ürün
                <span className="text-xl md:text-2xl font-bold text-[#eb1260]">
                  {minDiscountPrice} ₺ - {maxDiscountPrice} ₺
                </span>
              ) : (
                // Tek indirimli fiyat
                <span className="text-xl md:text-2xl font-bold text-[#eb1260]">
                  {minDiscountPrice} ₺
                </span>
              )}
              {/* Eski fiyat */}
              {hasPriceRange ? (
                <span className="text-xs md:text-sm text-gray-500 line-through">
                  {minPrice} ₺ - {maxPrice} ₺
                </span>
              ) : (
                <span className="text-xs md:text-sm text-gray-500 line-through">
                  {minPrice} ₺
                </span>
              )}
            </>
          ) : (
            // İndirim yok
            <>
              {hasPriceRange ? (
                // Varyantlı ürün - Fiyat aralığı göster
                <span className="text-xl md:text-2xl font-bold text-[#eb1260]">
                  {minPrice} ₺ - {maxPrice} ₺
                </span>
              ) : (
                // Tek fiyat
                <span className="text-xl md:text-2xl font-bold text-[#eb1260]">
                  {minPrice} ₺
                </span>
              )}
            </>
          )}
        </div>

              {/* Etiketler */}
              {tag && tag.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                  {tag.slice(0, 3).map((t, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full whitespace-nowrap flex-shrink-0"
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
      </div>
    </div>
  )
}

export default Product
