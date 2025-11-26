import React, { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa'
import { Input, Textarea, Select, SelectItem } from '@heroui/react'
import { sehirler } from '@/data/sehir'

const QuestForm = ({ onFormDataChange }) => {
  const [billingAddressType, setBillingAddressType] = useState('bireysel')
  const [faturaFarkli, setFaturaFarkli] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postal_code: '',
    delivery_note: ''
  })

  const [billingData, setBillingData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postal_code: '',
    company_name: '',
    tax_office: '',
    tax_number: '',
    tc_number: ''
  })

  // Form data değiştiğinde parent'a bildir
  useEffect(() => {
    // Teslimat her zaman bireysel
    const isShippingValid = formData.name && formData.surname && formData.email && formData.phone && formData.city && formData.district && formData.postal_code && formData.address

    const isBillingValid = !faturaFarkli || (
      billingAddressType === 'bireysel'
        ? billingData.name && billingData.surname && billingData.email && billingData.phone && billingData.city && billingData.district && billingData.postal_code && billingData.address
        : billingData.company_name && billingData.tax_office && billingData.tax_number && billingData.email && billingData.phone && billingData.city && billingData.district && billingData.postal_code && billingData.address
    )

    if (isShippingValid && isBillingValid) {
      onFormDataChange({
        addressType: 'bireysel', // Teslimat her zaman bireysel
        billingAddressType,
        shipping: formData,
        billing: faturaFarkli ? billingData : formData,
        faturaFarkli
      })
    } else {
      onFormDataChange(null)
    }
  }, [formData, billingData, faturaFarkli, billingAddressType, onFormDataChange])

  const handleChange = (name, value, isBilling = false) => {
    // Telefon için sadece rakam, 10 hane
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10)
      if (isBilling) {
        setBillingData(prev => ({ ...prev, [name]: numericValue }))
      } else {
        setFormData(prev => ({ ...prev, [name]: numericValue }))
      }
    }
    // Posta kodu için sadece rakam, 5 hane
    else if (name === 'postal_code') {
      const numericValue = value.replace(/\D/g, '').slice(0, 5)
      if (isBilling) {
        setBillingData(prev => ({ ...prev, [name]: numericValue }))
      } else {
        setFormData(prev => ({ ...prev, [name]: numericValue }))
      }
    }
    // TC No ve Tax Number sadece fatura için (kurumsal fatura)
    else if (name === 'tc_number') {
      const numericValue = value.replace(/\D/g, '').slice(0, 11)
      setBillingData(prev => ({ ...prev, [name]: numericValue }))
    }
    else if (name === 'tax_number') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10)
      setBillingData(prev => ({ ...prev, [name]: numericValue }))
    }
    // Diğer alanlar
    else {
      if (isBilling) {
        setBillingData(prev => ({ ...prev, [name]: value }))
      } else {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
    }
  }

  const handleBillingTypeChange = (type) => {
    setBillingAddressType(type)
    if (type === 'bireysel') {
      setBillingData(prev => ({ ...prev, company_name: '', tax_office: '', tax_number: '', tc_number: '' }))
    } else {
      setBillingData(prev => ({ ...prev, name: '', surname: '' }))
    }
  }

  return (
    <>
      {/* Teslimat Bilgileri */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Teslimat Bilgileri</h2>

        <div className="space-y-4">
          {/* Ad Soyad */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              placeholder="Adınız"
              value={formData.name}
              onValueChange={(value) => handleChange('name', value)}
              isRequired
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900"
              }}
            />
            <Input
              label="Soyad"
              placeholder="Soyadınız"
              value={formData.surname}
              onValueChange={(value) => handleChange('surname', value)}
              isRequired
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900"
              }}
            />
          </div>

          {/* E-posta ve Telefon 2'li */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="email"
              label="E-posta"
              placeholder="ornek@email.com"
              value={formData.email}
              onValueChange={(value) => handleChange('email', value)}
              isRequired
              startContent={<FaEnvelope className="text-gray-400" />}
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900"
              }}
            />
            <Input
              type="tel"
              label="Telefon"
              placeholder="5xx xxx xx xx"
              value={formData.phone}
              onValueChange={(value) => handleChange('phone', value)}
              maxLength={10}
              isRequired
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-gray-600 text-small">+90</span>
                </div>
              }
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900"
              }}
            />
          </div>

          {/* Şehir ve İlçe */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Şehir"
              placeholder="Şehir seçiniz"
              selectedKeys={formData.city ? [formData.city] : []}
              onChange={(e) => handleChange('city', e.target.value)}
              isRequired
              classNames={{
                label: "text-gray-700 font-medium",
                value: "text-gray-900"
              }}
            >
              {sehirler.map((sehir) => (
                <SelectItem key={sehir.name} value={sehir.name}>
                  {sehir.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="İlçe"
              placeholder="İlçe giriniz"
              value={formData.district}
              onValueChange={(value) => handleChange('district', value)}
              isRequired
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900"
              }}
            />
          </div>

          {/* Posta Kodu */}
          <Input
            label="Posta Kodu"
            placeholder="34000"
            value={formData.postal_code}
            onValueChange={(value) => handleChange('postal_code', value)}
            maxLength={5}
            isRequired
            classNames={{
              label: "text-gray-700 font-medium",
              input: "text-gray-900"
            }}
          />

          {/* Adres */}
          <Textarea
            label="Adres"
            placeholder="Mahalle, sokak, bina no, daire no vb."
            value={formData.address}
            onValueChange={(value) => handleChange('address', value)}
            isRequired
            minRows={3}
            classNames={{
              label: "text-gray-700 font-medium",
              input: "text-gray-900"
            }}
          />

          {/* Çiçek Notu */}
          <Textarea
            label="Çiçek Notu (Opsiyonel)"
            placeholder="Çiçeğe eklemek istediğiniz özel notunuzu yazabilirsiniz..."
            value={formData.delivery_note}
            onValueChange={(value) => handleChange('delivery_note', value)}
            minRows={2}
            classNames={{
              label: "text-gray-700 font-medium",
              input: "text-gray-900"
            }}
          />
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Not:</strong> Sipariş durumunuz hakkında bilgilendirme için e-posta ve telefon numaranız kullanılacaktır.
          </p>
        </div>
      </div>

      {/* Fatura Adresi Checkbox */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={faturaFarkli}
            onChange={(e) => setFaturaFarkli(e.target.checked)}
            className="w-5 h-5 text-[#eb1260] focus:ring-[#eb1260] rounded"
          />
          <span className="font-medium text-gray-900">
            Fatura adresim farklı
          </span>
        </label>
      </div>

      {/* Fatura Adresi Formu */}
      {faturaFarkli && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Fatura Adresi</h2>
          
          {/* Fatura Adres Tipi Seçimi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Fatura Adresi Tipi
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleBillingTypeChange('bireysel')}
                className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all ${
                  billingAddressType === 'bireysel'
                    ? 'border-[#eb1260] bg-pink-50 text-[#eb1260]'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <FaUser className="text-2xl" />
                <span className="font-semibold">Bireysel</span>
              </button>
              <button
                type="button"
                onClick={() => handleBillingTypeChange('kurumsal')}
                className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all ${
                  billingAddressType === 'kurumsal'
                    ? 'border-[#eb1260] bg-pink-50 text-[#eb1260]'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <FaBuilding className="text-2xl" />
                <span className="font-semibold">Kurumsal</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Bireysel için Ad Soyad */}
            {billingAddressType === 'bireysel' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ad"
                    placeholder="Adınız"
                    value={billingData.name}
                    onValueChange={(value) => handleChange('name', value, true)}
                    isRequired
                    classNames={{
                      label: "text-gray-700 font-medium",
                      input: "text-gray-900"
                    }}
                  />
                  <Input
                    label="Soyad"
                    placeholder="Soyadınız"
                    value={billingData.surname}
                    onValueChange={(value) => handleChange('surname', value, true)}
                    isRequired
                    classNames={{
                      label: "text-gray-700 font-medium",
                      input: "text-gray-900"
                    }}
                  />
                </div>

                <Input
                  label="TC Kimlik No (Opsiyonel)"
                  placeholder="11 haneli TC kimlik numarası"
                  value={billingData.tc_number}
                  onValueChange={(value) => handleChange('tc_number', value, true)}
                  maxLength={11}
                  classNames={{
                    label: "text-gray-700 font-medium",
                    input: "text-gray-900"
                  }}
                />
              </>
            )}

            {/* Kurumsal için Firma Bilgileri */}
            {billingAddressType === 'kurumsal' && (
              <>
                <Input
                  label="Firma Adı"
                  placeholder="Firma adınız"
                  value={billingData.company_name}
                  onValueChange={(value) => handleChange('company_name', value, true)}
                  isRequired
                  startContent={<FaBuilding className="text-gray-400" />}
                  classNames={{
                    label: "text-gray-700 font-medium",
                    input: "text-gray-900"
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Vergi Dairesi"
                    placeholder="Vergi dairesi"
                    value={billingData.tax_office}
                    onValueChange={(value) => handleChange('tax_office', value, true)}
                    isRequired
                    classNames={{
                      label: "text-gray-700 font-medium",
                      input: "text-gray-900"
                    }}
                  />
                  <Input
                    label="Vergi No"
                    placeholder="10 haneli"
                    value={billingData.tax_number}
                    onValueChange={(value) => handleChange('tax_number', value, true)}
                    maxLength={10}
                    isRequired
                    classNames={{
                      label: "text-gray-700 font-medium",
                      input: "text-gray-900"
                    }}
                  />
                </div>
              </>
            )}

            {/* E-posta ve Telefon 2'li */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="email"
                label="E-posta"
                placeholder="ornek@email.com"
                value={billingData.email}
                onValueChange={(value) => handleChange('email', value, true)}
                isRequired
                startContent={<FaEnvelope className="text-gray-400" />}
                classNames={{
                  label: "text-gray-700 font-medium",
                  input: "text-gray-900"
                }}
              />
              <Input
                type="tel"
                label="Telefon"
                placeholder="5xx xxx xx xx"
                value={billingData.phone}
                onValueChange={(value) => handleChange('phone', value, true)}
                maxLength={10}
                isRequired
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-gray-600 text-small">+90</span>
                  </div>
                }
                classNames={{
                  label: "text-gray-700 font-medium",
                  input: "text-gray-900"
                }}
              />
            </div>

            {/* Şehir ve İlçe */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Şehir"
                placeholder="Şehir seçiniz"
                selectedKeys={billingData.city ? [billingData.city] : []}
                onChange={(e) => handleChange('city', e.target.value, true)}
                isRequired
                classNames={{
                  label: "text-gray-700 font-medium",
                  value: "text-gray-900"
                }}
              >
                {sehirler.map((sehir) => (
                  <SelectItem key={sehir.name} value={sehir.name}>
                    {sehir.name}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="İlçe"
                placeholder="İlçe giriniz"
                value={billingData.district}
                onValueChange={(value) => handleChange('district', value, true)}
                isRequired
                classNames={{
                  label: "text-gray-700 font-medium",
                  input: "text-gray-900"
                }}
              />
            </div>

            {/* Posta Kodu */}
            <Input
              label="Posta Kodu"
              placeholder="34000"
              value={billingData.postal_code}
              onValueChange={(value) => handleChange('postal_code', value, true)}
              maxLength={5}
              isRequired
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900"
              }}
            />

            {/* Adres */}
            <Textarea
              label="Adres"
              placeholder="Mahalle, sokak, bina no, daire no vb."
              value={billingData.address}
              onValueChange={(value) => handleChange('address', value, true)}
              isRequired
              minRows={3}
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900"
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default QuestForm
