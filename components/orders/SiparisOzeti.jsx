import React from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'

const SiparisOzeti = ({ isMobile, onContinue, disabled, isLoggedIn, onRegister, onCompleteOrder, isProcessing }) => {
  const { items, totalAmount, discount, shippingCost, freeShippingThreshold, grandTotal } = useSelector(state => state.cart)

  // Ara toplam hesapla (kargo hariç) - Backend zaten indirimli fiyatlarla gönderiyor
  const subtotalAfterDiscount = totalAmount
  const remainingForFreeShipping = freeShippingThreshold - subtotalAfterDiscount

  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${!isMobile && 'sticky top-24'}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

      {/* Ürünler Listesi */}
      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const product = item.product || {}
          const variant = item.variant || null
          const imageUrl = item.product.image
          const productName = product.name || 'Ürün'
          const discountPrice = item.discount_price ? parseFloat(item.discount_price) : null
          const normalPrice = parseFloat(item.price || 0)
          const displayPrice = discountPrice || normalPrice
          const quantity = parseInt(item.quantity || 1)
          const variantOptions = variant?.options?.map(opt => `${opt.name}: ${opt.value}`).join(', ') || ''

          return (
            <div key={item.id} className="flex gap-3">
              {/* Ürün Resmi */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={productName}
                    width={64}
                    height={64}
                    unoptimized
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
                {/* Adet Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#eb1260] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {quantity}
                </div>
              </div>

              {/* Ürün Bilgisi */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{productName}</h3>
                {variantOptions && (
                  <p className="text-xs text-gray-500 truncate">{variantOptions}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-[#eb1260]">{displayPrice.toFixed(2)} ₺</span>
                  {discountPrice && (
                    <span className="text-xs text-gray-500 line-through">{normalPrice.toFixed(2)} ₺</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fiyat Özeti */}
      <div className="space-y-3 mb-6 pb-6 border-t border-b border-gray-200 pt-4">
        <div className="flex justify-between text-gray-700">
          <span>Ara Toplam</span>
          <span className="font-semibold">{subtotalAfterDiscount.toFixed(2)} ₺</span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Kargo</span>
          <span className="font-semibold">
            {shippingCost === 0 ? (
              <span className="text-green-600">Ücretsiz</span>
            ) : (
              `${shippingCost.toFixed(2)} ₺`
            )}
          </span>
        </div>

        {shippingCost > 0 && remainingForFreeShipping > 0 && (
          <div className="p-3 bg-pink-50 rounded-lg">
            <p className="text-xs text-[#eb1260]">
              🚚 {remainingForFreeShipping.toFixed(2)} ₺ daha alışveriş yapın, kargo bedava!
            </p>
          </div>
        )}
      </div>

      {/* Toplam */}
      <div className="flex justify-between text-xl font-bold text-gray-900">
        <span>Toplam</span>
        <span className="text-[#eb1260]">{grandTotal.toFixed(2)} ₺</span>
      </div>

      {/* Butonlar */}
      {onCompleteOrder ? (
        // Ödeme sayfası - Siparişi Tamamla butonu
        <div className="mt-6">
          <button
            onClick={onCompleteOrder}
            disabled={isProcessing || items.length === 0}
            className="w-full py-4 bg-gradient-to-r from-[#e8125f] to-[#d10f54] text-white text-center font-bold rounded-xl hover:from-[#d10f54] hover:to-[#b90d47] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sipariş Oluşturuluyor...
              </span>
            ) : (
              'Siparişi Tamamla'
            )}
          </button>
        </div>
      ) : onContinue && (
        // Sipariş bilgileri sayfası - Devam Et / Kayıt Ol butonları
        <div className="mt-6 space-y-3">
          {isLoggedIn ? (
            // Giriş yapmış kullanıcı için
            <button
              onClick={onContinue}
              disabled={disabled}
              className="w-full py-4 bg-gradient-to-r from-[#e8125f] to-[#d10f54] text-white text-center font-bold rounded-xl hover:from-[#d10f54] hover:to-[#b90d47] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Devam Et
            </button>
          ) : (
            // Giriş yapmamış kullanıcı için
            <>
              <button
                onClick={onRegister}
                className="w-full py-4 bg-gradient-to-r from-[#e8125f] to-[#d10f54] text-white text-center font-bold rounded-xl hover:from-[#d10f54] hover:to-[#b90d47] transition-all shadow-lg hover:shadow-xl"
              >
                Şimdi Kayıt Ol
              </button>
              
              <button
                onClick={onContinue}
                disabled={disabled}
                className="w-full py-4 bg-white text-[#e8125f] border-2 border-[#e8125f] text-center font-bold rounded-xl hover:bg-pink-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Üyeliksiz Devam Et
              </button>
            </>
          )}
        </div>
      )}

      {/* Güven Badge'leri */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 text-lg">✓</span>
          </div>
          <span>Güvenli Ödeme</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 text-lg">✓</span>
          </div>
          <span>Aynı Gün Teslimat</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 text-lg">✓</span>
          </div>
          <span>Kolay İade</span>
        </div>
      </div>
    </div>
  )
}

export default SiparisOzeti
