import React, { useState } from 'react'
import { FaCreditCard, FaUniversity } from 'react-icons/fa'

const Odeme = ({ selectedMethod, onPaymentMethodChange }) => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const paymentMethods = [
    {
      id: 'credit_card',
      title: 'Kredi Kartı',
      description: 'Visa, Mastercard, American Express',
      icon: FaCreditCard,
    },
    {
      id: 'bank_transfer',
      title: 'Banka Havale/EFT',
      description: 'Sipariş onaylandıktan sonra ödeme yapabilirsiniz',
      icon: FaUniversity,
    }
  ]

  const handleCardInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cardNumber') {
      // Sadece rakam ve boşluk
      const cleaned = value.replace(/\D/g, '')
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
      setCardInfo(prev => ({ ...prev, [name]: formatted.slice(0, 19) }))
    } else if (name === 'expiryDate') {
      // MM/YY formatı
      const cleaned = value.replace(/\D/g, '')
      let formatted = cleaned
      if (cleaned.length >= 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
      }
      setCardInfo(prev => ({ ...prev, [name]: formatted }))
    } else if (name === 'cvv') {
      // Sadece 3-4 rakam
      const cleaned = value.replace(/\D/g, '')
      setCardInfo(prev => ({ ...prev, [name]: cleaned.slice(0, 4) }))
    } else {
      setCardInfo(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Ödeme Yöntemi</h2>
      
      {/* Ödeme Yöntemi Seçimi - Yan Yana */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          
          return (
            <div
              key={method.id}
              onClick={() => onPaymentMethodChange(method.id)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#eb1260] bg-pink-50'
                  : 'border-gray-200 hover:border-[#eb1260]'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-[#eb1260]' : 'bg-gray-100'
                }`}>
                  <Icon className={`text-xl ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
                  <p className="text-xs text-gray-600">{method.description}</p>
                </div>

                {/* Check Icon */}
                {isSelected && (
                  <div className="w-6 h-6 bg-[#eb1260] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Kredi Kartı Formu */}
      {selectedMethod === 'credit_card' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-4">Kart Bilgileri</h3>
          
          {/* Kart Numarası */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kart Numarası <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardInfo.cardNumber}
              onChange={handleCardInputChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260]"
            />
          </div>

          {/* Kart Üzerindeki İsim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kart Üzerindeki İsim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cardName"
              value={cardInfo.cardName}
              onChange={handleCardInputChange}
              placeholder="AD SOYAD"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260]"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {/* Son Kullanma Tarihi ve CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Son Kullanma Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardInfo.expiryDate}
                onChange={handleCardInputChange}
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cvv"
                value={cardInfo.cvv}
                onChange={handleCardInputChange}
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260]"
              />
            </div>
          </div>

          {/* Kart Logoları */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="text-3xl">💳</div>
            <span className="text-sm text-gray-600">Visa, Mastercard, American Express</span>
          </div>
        </div>
      )}

      {/* Havale/EFT Bilgisi */}
      {selectedMethod === 'bank_transfer' && (
        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-900">
            ℹ️ Sipariş onaylandıktan sonra banka hesap bilgileri e-posta ile gönderilecektir.
          </p>
        </div>
      )}

      {/* Güvenli Ödeme Badge */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600 flex-shrink-0">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Güvenli Ödeme</h4>
            <p className="text-sm text-green-800">
              Tüm ödemeleriniz 256-bit SSL şifrelemesi ile korunmaktadır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Odeme
