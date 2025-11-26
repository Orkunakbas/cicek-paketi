import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, getAddresses } from '@/store/slices/addressSlice'
import { Checkbox } from '@heroui/react'
import { FaTimes, FaHome, FaBuilding, FaUser, FaBriefcase } from 'react-icons/fa'
import { sehirler } from '@/data/sehir'
import toast from 'react-hot-toast'

const AdresEkleModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { loading, addresses } = useSelector((state) => state.address)
  
  // İlk adres mi kontrol et
  const isFirstAddress = !addresses || addresses.length === 0
  const [addressType, setAddressType] = useState('bireysel') // 'bireysel' veya 'kurumsal'
  const [formData, setFormData] = useState({
    title: '',
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    district: '',
    address_line: '',
    postal_code: '',
    is_default: isFirstAddress, // İlk adres ise otomatik varsayılan
    tc_number: '',
    tax_office: '',
    tax_number: '',
    company_name: ''
  })

  // Modal açıldığında adresleri yenile
  useEffect(() => {
    if (isOpen) {
      dispatch(getAddresses())
    }
  }, [isOpen, dispatch])

  // isFirstAddress değiştiğinde is_default'u güncelle
  useEffect(() => {
    if (isFirstAddress) {
      setFormData(prev => ({ ...prev, is_default: true }))
    }
  }, [isFirstAddress])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Telefon için sadece rakam
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    }
    // TC No için sadece rakam, 11 hane
    else if (name === 'tc_number') {
      const numericValue = value.replace(/\D/g, '').slice(0, 11)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    }
    // Posta kodu için sadece rakam, 5 hane
    else if (name === 'postal_code') {
      const numericValue = value.replace(/\D/g, '').slice(0, 5)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    }
    // Vergi No için sadece rakam, 10 hane
    else if (name === 'tax_number') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    }
    // Checkbox
    else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    }
    // Diğer alanlar
    else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleTypeChange = (type) => {
    setAddressType(type)
    // Tip değişince ilgili alanları temizle
    if (type === 'bireysel') {
      setFormData(prev => ({
        ...prev,
        company_name: '',
        tax_office: '',
        tax_number: ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        first_name: '',
        last_name: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Bireysel için TC No otomatik 11111111111
    const submitData = {
      address_type: addressType,
      title: formData.title,
      first_name: addressType === 'bireysel' ? formData.first_name : '',
      last_name: addressType === 'bireysel' ? formData.last_name : '',
      phone: `+90${formData.phone}`,
      city: formData.city,
      district: formData.district,
      address_line: formData.address_line,
      postal_code: formData.postal_code || null,
      tc_number: addressType === 'bireysel' ? '11111111111' : (formData.tc_number || null),
      tax_office: addressType === 'kurumsal' ? formData.tax_office : null,
      tax_number: addressType === 'kurumsal' ? formData.tax_number : null,
      company_name: addressType === 'kurumsal' ? formData.company_name : null,
      is_default: formData.is_default
    }
    
    console.log('Gönderilen Data:', submitData)
    
    const result = await dispatch(addAddress(submitData))
    
    if (addAddress.fulfilled.match(result)) {
      // Formu temizle
      setFormData({
        title: '',
        first_name: '',
        last_name: '',
        phone: '',
        city: '',
        district: '',
        address_line: '',
        postal_code: '',
        is_default: false,
        tc_number: '',
        tax_office: '',
        tax_number: '',
        company_name: ''
      })
      onClose()
    } else {
      toast.error(result.payload || 'Adres eklenemedi!')
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Yeni Adres Ekle</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Adres Tipi Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Adres Tipi
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('bireysel')}
                    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all ${
                      addressType === 'bireysel'
                        ? 'border-[#eb1260] bg-pink-50 text-[#eb1260]'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <FaUser className="text-2xl" />
                    <span className="font-semibold">Bireysel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('kurumsal')}
                    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all ${
                      addressType === 'kurumsal'
                        ? 'border-[#eb1260] bg-pink-50 text-[#eb1260]'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <FaBuilding className="text-2xl" />
                    <span className="font-semibold">Kurumsal</span>
                  </button>
                </div>
              </div>

              {/* Adres Başlığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres Başlığı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ev, İş, vb."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                />
              </div>

              {/* Bireysel Form Alanları */}
              {addressType === 'bireysel' && (
                <>
                  {/* Ad Soyad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        placeholder="Adınızı giriniz"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Soyad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Soyadınızı giriniz"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Kurumsal Form Alanları */}
              {addressType === 'kurumsal' && (
                <>
                  {/* Firma Adı */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firma Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      placeholder="Firma adını giriniz"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                    />
                  </div>

                  {/* Vergi Dairesi ve No */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vergi Dairesi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tax_office"
                        value={formData.tax_office}
                        onChange={handleChange}
                        required
                        placeholder="Vergi dairesi giriniz"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vergi No <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tax_number"
                        value={formData.tax_number}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        placeholder="10 haneli vergi numarası"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* TC No - Opsiyonel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TC Kimlik No (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      name="tc_number"
                      value={formData.tc_number}
                      onChange={handleChange}
                      maxLength={11}
                      placeholder="11 haneli TC kimlik numarası"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Telefon - Ortak Alan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numarası <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                    +90
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    placeholder="5xx xxx xx xx"
                    className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Şehir ve İlçe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent bg-white"
                  >
                    <option value="">Şehir Seçiniz</option>
                    {sehirler.map((sehir) => (
                      <option key={sehir.id} value={sehir.name}>
                        {sehir.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlçe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    placeholder="İlçe giriniz"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Posta Kodu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  maxLength={5}
                  placeholder="5 haneli posta kodu"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                />
              </div>

              {/* Adres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Mahalle, sokak, bina no, daire no vb."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent resize-none"
                />
              </div>

              {/* Varsayılan Adres */}
              <div className="pt-2">
                <Checkbox
                  isSelected={formData.is_default}
                  onValueChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                  isDisabled={isFirstAddress}
                  color="danger"
                  size="md"
                >
                  <span className="text-sm text-gray-700">
                    {isFirstAddress 
                      ? 'İlk adresiniz otomatik olarak varsayılan adres olacak' 
                      : 'Bu adresi varsayılan adres olarak ayarla'}
                  </span>
                </Checkbox>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-[#eb1260] text-white rounded-lg font-semibold hover:bg-[#d10f54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Kaydediliyor...' : 'Adresi Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdresEkleModal
