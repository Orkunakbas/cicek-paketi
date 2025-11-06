import React, { useState } from 'react'
import { FaPlus, FaCheck, FaEdit, FaTrash } from 'react-icons/fa'
import YeniAdresFormu from './YeniAdresFormu'

const AdresSecimi = ({ type = 'teslimat' }) => {
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      baslik: 'Ev Adresim',
      adSoyad: 'Orkun Akbaş',
      telefon: '0532 123 45 67',
      adres: 'Atatürk Mahallesi, Çiçek Sokak No:15 Daire:3',
      ilce: 'Kadıköy',
      il: 'İstanbul',
      postaKodu: '34710'
    },
    {
      id: 2,
      baslik: 'İş Adresim',
      adSoyad: 'Orkun Akbaş',
      telefon: '0532 123 45 67',
      adres: 'Barbaros Mahallesi, İş Merkezi Kat:5 No:12',
      ilce: 'Beşiktaş',
      il: 'İstanbul',
      postaKodu: '34353'
    }
  ])

  const handleAddAddress = (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: addresses.length + 1
    }
    setAddresses([...addresses, addressWithId])
    setShowNewAddressForm(false)
    setSelectedAddress(addressWithId.id)
  }

  const handleDeleteAddress = (id) => {
    if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      setAddresses(addresses.filter(addr => addr.id !== id))
      if (selectedAddress === id) {
        setSelectedAddress(null)
      }
    }
  }

  const title = type === 'teslimat' ? 'Teslimat Adresi' : 'Fatura Adresi'
  const icon = type === 'teslimat' ? '📦' : '📄'

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h2>
        <button
          onClick={() => setShowNewAddressForm(!showNewAddressForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#e8125f] text-white rounded-lg hover:bg-[#d10f54] transition-colors text-sm font-medium"
        >
          <FaPlus className="text-xs" />
          Yeni Adres Ekle
        </button>
      </div>

      {/* Yeni Adres Formu */}
      {showNewAddressForm && (
        <div className="mb-6">
          <YeniAdresFormu
            onSave={handleAddAddress}
            onCancel={() => setShowNewAddressForm(false)}
          />
        </div>
      )}

      {/* Adres Listesi */}
      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">Henüz kayıtlı adresiniz bulunmuyor</p>
          <button
            onClick={() => setShowNewAddressForm(true)}
            className="px-6 py-3 bg-[#e8125f] text-white rounded-lg hover:bg-[#d10f54] transition-colors font-medium"
          >
            İlk Adresini Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => setSelectedAddress(address.id)}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedAddress === address.id
                  ? 'border-[#e8125f] bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Seçili İşareti */}
              {selectedAddress === address.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-[#e8125f] rounded-full flex items-center justify-center">
                  <FaCheck className="text-white text-xs" />
                </div>
              )}

              {/* Adres Bilgileri */}
              <div className="pr-8">
                <h3 className="font-bold text-gray-900 mb-2">{address.baslik}</h3>
                <p className="text-sm text-gray-700 font-medium mb-1">{address.adSoyad}</p>
                <p className="text-sm text-gray-600 mb-1">{address.telefon}</p>
                <p className="text-sm text-gray-600 mb-1">{address.adres}</p>
                <p className="text-sm text-gray-600">
                  {address.ilce} / {address.il} - {address.postaKodu}
                </p>
              </div>

              {/* Düzenle & Sil Butonları */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Düzenleme fonksiyonu eklenecek
                    alert('Düzenleme özelliği yakında eklenecek')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#e8125f] hover:bg-pink-50 rounded-lg transition-colors"
                >
                  <FaEdit />
                  Düzenle
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAddress(address.id)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uyarı Mesajı */}
      {addresses.length > 0 && !selectedAddress && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Lütfen bir adres seçiniz
          </p>
        </div>
      )}
    </div>
  )
}

export default AdresSecimi

