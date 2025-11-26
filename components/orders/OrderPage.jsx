import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { FaTimes } from 'react-icons/fa'
import { getAddresses } from '@/store/slices/addressSlice'
import { getCart } from '@/store/slices/cartSlice'
import UserForm from './UserForm'
import QuestForm from './QuestForm'
import SiparisOzeti from './SiparisOzeti'
import Login from '@/components/auth/Login'
import Register from '@/components/auth/Register'
import toast from 'react-hot-toast'

const OrderPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: session, status } = useSession()
  const { type } = router.query // 'guest' ise üyeliksiz kullanıcı
  
  const { addresses } = useSelector((state) => state.address)
  const { items } = useSelector((state) => state.cart)
  
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null)
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null)
  const [faturaAyni, setFaturaAyni] = useState(true)
  const [guestFormData, setGuestFormData] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  
  // Giriş yapmış kullanıcı kontrolü
  const isLoggedIn = status === 'authenticated' && !!session?.user
  const isGuest = type === 'guest' || !isLoggedIn

  // Sepeti ve adresleri yükle
  useEffect(() => {
    dispatch(getCart())
    if (isLoggedIn) {
      dispatch(getAddresses())
    }
  }, [dispatch, isLoggedIn])

  // Varsayılan adresi seç
  useEffect(() => {
    if (addresses.length > 0 && !selectedShippingAddress) {
      const defaultAddress = addresses.find(addr => addr.is_default === true || addr.is_default === 1)
      const firstAddress = addresses[0]
      setSelectedShippingAddress(defaultAddress || firstAddress)
    }
  }, [addresses, selectedShippingAddress])

  const handleContinue = () => {
    // Validasyon
    if (items.length === 0) {
      toast.error('Sepetiniz boş!')
      return
    }

    // Giriş yapmış kullanıcı için
    if (!isGuest) {
      if (!selectedShippingAddress) {
        toast.error('Lütfen teslimat adresi seçin!')
        return
      }

      const addressData = {
        isGuest: false,
        selectedShippingAddress,
        selectedBillingAddress: faturaAyni ? selectedShippingAddress : selectedBillingAddress,
        faturaAyni,
        customerEmail: session?.user?.email || ''
      }

      // localStorage'a kaydet
      localStorage.setItem('checkout_address_data', JSON.stringify(addressData))
      
      // Ödeme adımına geç
      router.push('/odeme')
    }
    // Misafir kullanıcı için
    else {
      if (!guestFormData) {
        toast.error('Lütfen adres bilgilerinizi girin!')
        return
      }

      const addressData = {
        isGuest: true,
        guestFormData
      }

      // localStorage'a kaydet
      localStorage.setItem('checkout_address_data', JSON.stringify(addressData))
      
      // Ödeme adımına geç
      router.push('/odeme')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Teslimat Bilgileri
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Sepet</span>
            <span>→</span>
            <span className="text-[#e8125f] font-semibold">Adres</span>
            <span>→</span>
            <span>Ödeme</span>
            <span>→</span>
            <span>Onay</span>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mobil: Sipariş Özeti ve Devam Et Butonu */}
          <div className="lg:hidden space-y-6">
            <SiparisOzeti 
              isMobile={true}
              onContinue={handleContinue}
              disabled={items.length === 0}
              isLoggedIn={isLoggedIn}
              onRegister={() => setShowRegisterModal(true)}
            />
          </div>

          {/* Sol Taraf - Formlar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kullanıcı Tipi Kontrolü */}
            {isGuest ? (
              <QuestForm onFormDataChange={setGuestFormData} />
            ) : (
              <UserForm 
                addresses={addresses}
                selectedShippingAddress={selectedShippingAddress}
                selectedBillingAddress={selectedBillingAddress}
                onShippingAddressSelect={setSelectedShippingAddress}
                onBillingAddressSelect={setSelectedBillingAddress}
                faturaAyni={faturaAyni}
                onFaturaAyniChange={setFaturaAyni}
              />
            )}

          </div>

          {/* Sağ Taraf - Sipariş Özeti (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <SiparisOzeti 
              isMobile={false}
              onContinue={handleContinue}
              disabled={items.length === 0}
              isLoggedIn={isLoggedIn}
              onRegister={() => setShowRegisterModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Login Component */}
            <div className="p-6">
              <Login 
                onClose={() => {
                  setShowLoginModal(false)
                  // Giriş başarılıysa query parametresini temizle ve sayfayı yenile
                  router.push('/siparis-bilgileri')
                }}
                switchToRegister={() => {
                  setShowLoginModal(false)
                  setShowRegisterModal(true)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Register Component */}
            <div className="p-6">
              <Register 
                onClose={() => setShowRegisterModal(false)}
                switchToLogin={() => {
                  setShowRegisterModal(false)
                  setShowLoginModal(true)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderPage
