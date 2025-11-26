import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '@/store/slices/orderSlice'
import { getCart } from '@/store/slices/cartSlice'
import Odeme from '@/components/orders/Odeme'
import SiparisOzeti from '@/components/orders/SiparisOzeti'
import toast from 'react-hot-toast'

const OdemeSayfasi = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  
  const { items } = useSelector((state) => state.cart)
  const { creating } = useSelector((state) => state.order)
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [addressData, setAddressData] = useState(null)

  // Sepeti ve adres bilgilerini yükle
  useEffect(() => {
    dispatch(getCart())
    
    // localStorage'dan adres bilgilerini al
    const savedAddressData = localStorage.getItem('checkout_address_data')
    if (savedAddressData) {
      setAddressData(JSON.parse(savedAddressData))
    } else {
      // Adres bilgisi yoksa geri yönlendir
      toast.error('Lütfen önce teslimat bilgilerinizi girin')
      router.push('/siparis-bilgileri')
    }
  }, [dispatch, router])

  const handleCompleteOrder = async () => {
    try {
      // Validasyon
      if (items.length === 0) {
        toast.error('Sepetiniz boş!')
        return
      }

      if (!paymentMethod) {
        toast.error('Lütfen ödeme yöntemi seçin!')
        return
      }

      if (!addressData) {
        toast.error('Adres bilgileri bulunamadı!')
        router.push('/siparis-bilgileri')
        return
      }

      // Sipariş verilerini hazırla
      const orderData = {
        payment_method: paymentMethod,
        customer_note: null,
      }

      // Giriş yapmış kullanıcı için
      if (!addressData.isGuest) {
        const { selectedShippingAddress, selectedBillingAddress, customerEmail } = addressData

        // Müşteri bilgileri
        const shippingAddressType = selectedShippingAddress.address_type || 'bireysel'
        const billingAddressType = selectedBillingAddress.address_type || 'bireysel'
        
        if (shippingAddressType === 'bireysel') {
          orderData.customer_name = `${selectedShippingAddress.first_name || ''} ${selectedShippingAddress.last_name || ''}`.trim()
        } else {
          orderData.customer_name = selectedShippingAddress.company_name
        }
        
        orderData.customer_email = customerEmail
        orderData.customer_phone = selectedShippingAddress.phone || ''
        
        // Teslimat adresi
        if (shippingAddressType === 'bireysel') {
          orderData.shipping_address = {
            full_name: orderData.customer_name,
            name: selectedShippingAddress.first_name,
            surname: selectedShippingAddress.last_name,
            phone: selectedShippingAddress.phone,
            address_line1: selectedShippingAddress.address_line,
            address_line2: null,
            city: selectedShippingAddress.city,
            district: selectedShippingAddress.district,
            postal_code: selectedShippingAddress.postal_code,
            country: 'Türkiye',
            address_type: 'bireysel'
          }
        } else {
          orderData.shipping_address = {
            company_name: selectedShippingAddress.company_name,
            phone: selectedShippingAddress.phone,
            address_line1: selectedShippingAddress.address_line,
            address_line2: null,
            city: selectedShippingAddress.city,
            district: selectedShippingAddress.district,
            postal_code: selectedShippingAddress.postal_code,
            country: 'Türkiye',
            address_type: 'kurumsal'
          }
        }

        // Fatura adresi
        if (billingAddressType === 'bireysel') {
          orderData.billing_address = {
            full_name: `${selectedBillingAddress.first_name || ''} ${selectedBillingAddress.last_name || ''}`.trim(),
            name: selectedBillingAddress.first_name,
            surname: selectedBillingAddress.last_name,
            phone: selectedBillingAddress.phone,
            address_line1: selectedBillingAddress.address_line,
            address_line2: null,
            city: selectedBillingAddress.city,
            district: selectedBillingAddress.district,
            postal_code: selectedBillingAddress.postal_code,
            country: 'Türkiye',
            address_type: 'bireysel',
            tc_number: selectedBillingAddress.tc_number || '11111111111'
          }
        } else {
          orderData.billing_address = {
            company_name: selectedBillingAddress.company_name,
            phone: selectedBillingAddress.phone,
            address_line1: selectedBillingAddress.address_line,
            address_line2: null,
            city: selectedBillingAddress.city,
            district: selectedBillingAddress.district,
            postal_code: selectedBillingAddress.postal_code,
            country: 'Türkiye',
            address_type: 'kurumsal',
            tax_office: selectedBillingAddress.tax_office,
            tax_number: selectedBillingAddress.tax_number
          }
        }
      }
      // Misafir kullanıcı için
      else {
        const { guestFormData } = addressData
        const { addressType, billingAddressType, shipping, billing, faturaFarkli } = guestFormData

        // Teslimat her zaman bireysel (QuestForm'da böyle ayarladık)
        const customerName = `${shipping.name || ''} ${shipping.surname || ''}`.trim()
        
        // Customer name, email, phone shipping'den gelsin (boş kalmasın)
        orderData.customer_name = customerName || 'Misafir Kullanıcı'
        orderData.customer_email = shipping.email || ''
        orderData.customer_phone = shipping.phone || ''
        
        // Teslimat adresi (her zaman bireysel)
        orderData.shipping_address = {
          full_name: customerName,
          name: shipping.name,
          surname: shipping.surname,
          phone: shipping.phone,
          address_line1: shipping.address,
          address_line2: null,
          city: shipping.city,
          district: shipping.district,
          postal_code: shipping.postal_code || null,
          country: 'Türkiye',
          address_type: 'bireysel'
        }

        // Fatura adresi
        if (faturaFarkli) {
          const billingType = billingAddressType || 'bireysel'
          
          if (billingType === 'bireysel') {
            orderData.billing_address = {
              full_name: `${billing.name || ''} ${billing.surname || ''}`.trim(),
              name: billing.name,
              surname: billing.surname,
              phone: billing.phone,
              address_line1: billing.address,
              address_line2: null,
              city: billing.city,
              district: billing.district,
              postal_code: billing.postal_code || null,
              country: 'Türkiye',
              address_type: 'bireysel',
              tc_number: billing.tc_number || '11111111111'
            }
          } else {
            // Kurumsal fatura
            orderData.billing_address = {
              company_name: billing.company_name,
              phone: billing.phone,
              address_line1: billing.address,
              address_line2: null,
              city: billing.city,
              district: billing.district,
              postal_code: billing.postal_code || null,
              country: 'Türkiye',
              address_type: 'kurumsal',
              tax_office: billing.tax_office,
              tax_number: billing.tax_number
            }
          }
        } else {
          // Fatura adresi teslimat ile aynı (bireysel)
          orderData.billing_address = {
            ...orderData.shipping_address,
            tc_number: '11111111111'
          }
        }
      }

      console.log('📦 Sipariş Verileri:', orderData)

      // Sipariş oluştur
      const result = await dispatch(createOrder(orderData)).unwrap()
      
      console.log('✅ Sipariş Oluşturuldu:', result)
      toast.success('Siparişiniz başarıyla oluşturuldu!')
      
      // Sipariş verilerini localStorage'a kaydet (onay sayfasında kullanmak için)
      localStorage.setItem('latest_order', JSON.stringify(result.data))
      
      // Checkout bilgilerini temizle
      localStorage.removeItem('checkout_address_data')
      
      // Sipariş onay sayfasına yönlendir
      router.push('/siparis-onay')
      
    } catch (error) {
      console.error('❌ Sipariş hatası:', error)
      toast.error(error || 'Sipariş oluşturulurken bir hata oluştu')
    }
  }

  if (!addressData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1260]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Ödeme
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Sepet</span>
            <span>→</span>
            <span>Adres</span>
            <span>→</span>
            <span className="text-[#e8125f] font-semibold">Ödeme</span>
            <span>→</span>
            <span>Onay</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mobil: Sipariş Özeti En Üstte */}
          <div className="lg:hidden">
            <SiparisOzeti 
              isMobile={true}
              onCompleteOrder={handleCompleteOrder}
              isProcessing={creating}
            />
          </div>

          {/* Sol Taraf - Ödeme Formu */}
          <div className="lg:col-span-2 space-y-6">
            <Odeme 
              selectedMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          {/* Sağ Taraf - Sipariş Özeti (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <SiparisOzeti 
              isMobile={false}
              onCompleteOrder={handleCompleteOrder}
              isProcessing={creating}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OdemeSayfasi

