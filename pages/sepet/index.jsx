import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const Sepet = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 349,
      originalPrice: 450,
      quantity: 1,
      image: monsterraImage
    }
  ])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 29.90
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Sepetim</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl text-gray-300 mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-6">Alışverişe başlamak için ürünleri keşfedin</p>
            <Link href="/" className="inline-block px-6 py-3 bg-[#e8125f] text-white rounded-lg font-medium hover:bg-[#d10f54] transition-colors">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-md p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl md:text-2xl font-bold text-[#e8125f]">
                            {item.price} ₺
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {item.originalPrice} ₺
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                          >
                            <FaMinus className="text-gray-700" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                          >
                            <FaPlus className="text-gray-700" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                          <span className="hidden md:inline">Sil</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
                
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Ara Toplam</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Kargo</span>
                    <span className="font-semibold">{shipping.toFixed(2)} ₺</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                  <span>Toplam</span>
                  <span className="text-[#e8125f]">{total.toFixed(2)} ₺</span>
                </div>

                {/* Ödeme Seçenekleri */}
                <div className="space-y-3">
                  <Link 
                    href="/odeme"
                    className="block w-full py-3 bg-[#e8125f] text-white rounded-lg font-medium hover:bg-[#d10f54] transition-colors text-center"
                  >
                    Ödeme Adımına Geç
                  </Link>
                  
                  <Link 
                    href="/odeme?type=guest"
                    className="block w-full py-3 bg-white text-[#e8125f] border-2 border-[#e8125f] rounded-lg font-medium hover:bg-pink-50 transition-colors text-center"
                  >
                    Üyeliksiz Devam Et
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <span>Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <span>Aynı Gün Teslimat</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600">✓</span>
                    </div>
                    <span>Kolay İade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sepet
