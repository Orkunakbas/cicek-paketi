import React, { useState } from 'react'
import { FaCreditCard, FaLock } from 'react-icons/fa'

const KrediKartiFormu = () => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })

  const handleChange = (e) => {
    let { name, value } = e.target

    // Kart numarası formatı (16 hane, 4'lü gruplar)
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (value.replace(/\s/g, '').length > 16) return
    }

    // CVV sadece 3-4 rakam
    if (name === 'cvv' && value.length > 4) return

    setCardData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))

  return (
    <div className="space-y-6">
      {/* Güvenlik Mesajı */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <FaLock className="text-emerald-600 text-xl flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">Güvenli Ödeme</p>
          <p className="text-xs text-emerald-700">Kart bilgileriniz 256-bit SSL ile şifrelenmektedir</p>
        </div>
      </div>

      {/* Kart Numarası */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kart Numarası <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
            required
          />
          <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Kart Üzerindeki İsim */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kart Üzerindeki İsim <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="cardName"
          value={cardData.cardName}
          onChange={handleChange}
          placeholder="ORKUN AKBAŞ"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all uppercase"
          required
        />
      </div>

      {/* Son Kullanma Tarihi & CVV */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ay <span className="text-red-500">*</span>
          </label>
          <select
            name="expiryMonth"
            value={cardData.expiryMonth}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
            required
          >
            <option value="">Ay</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yıl <span className="text-red-500">*</span>
          </label>
          <select
            name="expiryYear"
            value={cardData.expiryYear}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
            required
          >
            <option value="">Yıl</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cvv"
            value={cardData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Sözleşme Onayı */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 text-[#e8125f] focus:ring-[#e8125f] rounded"
            required
          />
          <span className="text-sm text-gray-700">
            <a href="/sozlesmeler" className="text-[#e8125f] hover:underline">Ön Bilgilendirme Formu</a>'nu ve{' '}
            <a href="/sozlesmeler" className="text-[#e8125f] hover:underline">Mesafeli Satış Sözleşmesi</a>'ni okudum, onaylıyorum.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 text-[#e8125f] focus:ring-[#e8125f] rounded"
          />
          <span className="text-sm text-gray-700">
            Kampanya ve duyurulardan haberdar olmak istiyorum.
          </span>
        </label>
      </div>
    </div>
  )
}

export default KrediKartiFormu

