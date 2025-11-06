import React from 'react'
import Image from 'next/image'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const SiparisOzeti = ({ onCompleteOrder, isProcessing, isMobile = false }) => {
  // Örnek sepet verileri (gerçek uygulamada Redux/Context'ten gelecek)
  const cartItems = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 349,
      quantity: 1,
      image: monsterraImage
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 29.90
  const discount = 0
  const total = subtotal + shipping - discount

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sticky top-28 self-start">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🛍️</span>
        Sipariş Özeti
      </h2>

      {/* Ürünler */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
              <p className="text-sm font-bold text-[#e8125f]">{item.price} ₺</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fiyat Detayları */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-gray-700">
          <span>Ara Toplam</span>
          <span className="font-semibold">{subtotal.toFixed(2)} ₺</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Kargo</span>
          <span className="font-semibold">{shipping.toFixed(2)} ₺</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>İndirim</span>
            <span className="font-semibold">-{discount.toFixed(2)} ₺</span>
          </div>
        )}
      </div>

      {/* Toplam */}
      <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
        <span>Toplam</span>
        <span className="text-[#e8125f]">{total.toFixed(2)} ₺</span>
      </div>

      {/* İndirim Kodu */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İndirim Kodu
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="İndirim kodunuz"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none"
          />
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Uygula
          </button>
        </div>
      </div>

      {/* Güvenlik Rozetleri */}
      <div className="space-y-2 pt-4 border-t border-gray-200 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 text-xs">✓</span>
          </div>
          <span>Güvenli Ödeme</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 text-xs">✓</span>
          </div>
          <span>Aynı Gün Teslimat</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 text-xs">✓</span>
          </div>
          <span>Kolay İade</span>
        </div>
      </div>

      {/* Siparişi Tamamla Butonu (Sadece Desktop'ta) */}
      {!isMobile && (
        <button
          onClick={onCompleteOrder}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-[#e8125f] to-[#d10f54] text-white text-center font-bold rounded-xl hover:from-[#d10f54] hover:to-[#b90d47] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              İşleniyor...
            </span>
          ) : (
            'Siparişi Tamamla'
          )}
        </button>
      )}
    </div>
  )
}

export default SiparisOzeti

