import React from 'react'
import { FaMapMarkerAlt, FaPlus, FaUser, FaBuilding } from 'react-icons/fa'
import Link from 'next/link'

const UserForm = ({
  addresses,
  selectedShippingAddress,
  selectedBillingAddress,
  onShippingAddressSelect,
  onBillingAddressSelect,
  faturaAyni,
  onFaturaAyniChange
}) => {
  return (
    <>
      {/* Teslimat Adresi Seçimi */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#eb1260]" />
            Teslimat Adresi
          </h2>
          <Link
            href="/adreslerim"
            className="text-sm text-[#eb1260] hover:underline flex items-center gap-1"
          >
            <FaPlus className="text-xs" />
            Yeni Adres Ekle
          </Link>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Henüz kayıtlı adresiniz yok</p>
            <Link
              href="/adreslerim"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#eb1260] text-white rounded-lg hover:bg-[#d10f54] transition-colors"
            >
              <FaPlus />
              Adres Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => onShippingAddressSelect(address)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedShippingAddress?.id === address.id
                    ? 'border-[#eb1260] bg-pink-50'
                    : 'border-gray-200 hover:border-[#eb1260]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{address.title}</h3>
                      {(address.is_default === true || address.is_default === 1) && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Varsayılan
                        </span>
                      )}
                      {address.address_type && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${
                          address.address_type === 'kurumsal' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {address.address_type === 'kurumsal' ? (
                            <>
                              <FaBuilding className="text-xs" />
                              Kurumsal
                            </>
                          ) : (
                            <>
                              <FaUser className="text-xs" />
                              Bireysel
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    {address.address_type === 'kurumsal' && address.company_name ? (
                      <p className="text-sm text-gray-700 font-medium">{address.company_name}</p>
                    ) : (address.first_name || address.last_name) ? (
                      <p className="text-sm text-gray-700 font-medium">
                        {address.first_name} {address.last_name}
                      </p>
                    ) : null}
                    {address.phone && (
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    )}
                    {address.address_line && (
                      <p className="text-sm text-gray-600 mt-1">{address.address_line}</p>
                    )}
                    {(address.district || address.city) && (
                      <p className="text-sm text-gray-600">
                        {address.district && `${address.district} / `}{address.city}
                        {address.postal_code && ` - ${address.postal_code}`}
                      </p>
                    )}
                  </div>
                  {selectedShippingAddress?.id === address.id && (
                    <div className="w-6 h-6 bg-[#eb1260] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fatura Adresi Checkbox */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={faturaAyni}
            onChange={(e) => onFaturaAyniChange(e.target.checked)}
            className="w-5 h-5 text-[#eb1260] focus:ring-[#eb1260] rounded"
          />
          <span className="font-medium text-gray-900">
            Fatura adresim teslimat adresimle aynı
          </span>
        </label>
      </div>

      {/* Fatura Adresi (Farklı ise) */}
      {!faturaAyni && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#eb1260]" />
            Fatura Adresi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => onBillingAddressSelect(address)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedBillingAddress?.id === address.id
                    ? 'border-[#eb1260] bg-pink-50'
                    : 'border-gray-200 hover:border-[#eb1260]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{address.title}</h3>
                      {(address.is_default === true || address.is_default === 1) && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Varsayılan
                        </span>
                      )}
                      {address.address_type && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${
                          address.address_type === 'kurumsal' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {address.address_type === 'kurumsal' ? (
                            <>
                              <FaBuilding className="text-xs" />
                              Kurumsal
                            </>
                          ) : (
                            <>
                              <FaUser className="text-xs" />
                              Bireysel
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    {address.address_type === 'kurumsal' && address.company_name ? (
                      <p className="text-sm text-gray-700 font-medium">{address.company_name}</p>
                    ) : (address.first_name || address.last_name) ? (
                      <p className="text-sm text-gray-700 font-medium">
                        {address.first_name} {address.last_name}
                      </p>
                    ) : null}
                    {address.phone && (
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    )}
                    {address.address_line && (
                      <p className="text-sm text-gray-600 mt-1">{address.address_line}</p>
                    )}
                    {(address.district || address.city) && (
                      <p className="text-sm text-gray-600">
                        {address.district && `${address.district} / `}{address.city}
                        {address.postal_code && ` - ${address.postal_code}`}
                      </p>
                    )}
                  </div>
                  {selectedBillingAddress?.id === address.id && (
                    <div className="w-6 h-6 bg-[#eb1260] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default UserForm
