import React, { useState } from 'react'

const YeniAdresFormu = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    baslik: '',
    adSoyad: '',
    telefon: '',
    adres: '',
    ilce: '',
    il: '',
    postaKodu: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basit validasyon
    if (!formData.baslik || !formData.adSoyad || !formData.telefon || !formData.adres || !formData.ilce || !formData.il) {
      alert('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    onSave(formData)
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Yeni Adres Ekle</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Adres Başlığı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adres Başlığı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="baslik"
            value={formData.baslik}
            onChange={handleChange}
            placeholder="Örn: Ev, İş, Annem"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Ad Soyad & Telefon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="adSoyad"
              value={formData.adSoyad}
              onChange={handleChange}
              placeholder="Ad Soyad"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              placeholder="0532 123 45 67"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Adres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adres <span className="text-red-500">*</span>
          </label>
          <textarea
            name="adres"
            value={formData.adres}
            onChange={handleChange}
            placeholder="Mahalle, Sokak, Bina No, Daire No"
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all resize-none"
            required
          />
        </div>

        {/* İl, İlçe, Posta Kodu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İl <span className="text-red-500">*</span>
            </label>
            <select
              name="il"
              value={formData.il}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
              required
            >
              <option value="">İl Seçin</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
              <option value="Bursa">Bursa</option>
              <option value="Antalya">Antalya</option>
              {/* Diğer iller eklenebilir */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İlçe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ilce"
              value={formData.ilce}
              onChange={handleChange}
              placeholder="İlçe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posta Kodu
            </label>
            <input
              type="text"
              name="postaKodu"
              value={formData.postaKodu}
              onChange={handleChange}
              placeholder="34000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#e8125f] text-white rounded-lg hover:bg-[#d10f54] transition-colors font-medium"
          >
            Adresi Kaydet
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}

export default YeniAdresFormu

