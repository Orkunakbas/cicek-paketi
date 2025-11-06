import React, { useState } from 'react'
import { FaCreditCard, FaUniversity } from 'react-icons/fa'
import KrediKartiFormu from './KrediKartiFormu'

const OdemeSecenekleri = ({ onPaymentMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('credit-card')
  
  const handleMethodChange = (method) => {
    setSelectedMethod(method)
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method)
    }
  }

  const paymentMethods = [
    {
      id: 'credit-card',
      icon: <FaCreditCard className="text-2xl" />,
      title: 'Kredi/Banka Kartı',
      description: 'Tüm kartlar ile ödeme yapabilirsiniz',
      badge: 'Popüler'
    },
    {
      id: 'bank-transfer',
      icon: <FaUniversity className="text-2xl" />,
      title: 'Havale / EFT',
      description: 'Banka hesabımıza havale yapabilirsiniz',
      badge: null
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span>💳</span>
        Ödeme Yöntemi
      </h2>

      {/* Ödeme Yöntemi Seçimi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodChange(method.id)}
            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedMethod === method.id
                ? 'border-[#e8125f] bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Badge */}
            {method.badge && (
              <span className="absolute top-2 right-2 px-2 py-1 bg-[#e8125f] text-white text-xs font-semibold rounded-full">
                {method.badge}
              </span>
            )}

            {/* İkon */}
            <div className={`mb-3 ${selectedMethod === method.id ? 'text-[#e8125f]' : 'text-gray-400'}`}>
              {method.icon}
            </div>

            {/* Başlık & Açıklama */}
            <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
            <p className="text-xs text-gray-600">{method.description}</p>

            {/* Seçili İşareti */}
            {selectedMethod === method.id && (
              <div className="absolute bottom-4 right-4 w-6 h-6 bg-[#e8125f] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Seçilen Ödeme Yöntemine Göre Form */}
      <div className="pt-6 border-t border-gray-200">
        {selectedMethod === 'credit-card' && <KrediKartiFormu />}
        
        {selectedMethod === 'bank-transfer' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-semibold mb-3">
                ℹ️ Havale/EFT Bilgileri
              </p>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Banka:</strong> Türkiye İş Bankası</p>
                <p><strong>Hesap Sahibi:</strong> Çiçek Paketi A.Ş.</p>
                <p><strong>IBAN:</strong> TR12 3456 7890 1234 5678 9012 34</p>
                <p><strong>Şube Kodu:</strong> 1234</p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Havale açıklamasına sipariş numaranızı yazmayı unutmayın. Ödemeniz onaylandıktan sonra siparişiniz hazırlanacaktır.
              </p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default OdemeSecenekleri