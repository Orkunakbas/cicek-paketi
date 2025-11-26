import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAddresses, deleteAddress, setDefaultAddress } from '@/store/slices/addressSlice'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaBars, FaTimes, FaPlus, FaEdit, FaTrash, FaStar, FaHome, FaBuilding, FaPhone, FaCheckCircle } from 'react-icons/fa'
import AdresEkleModal from '@/components/address/AdresEkleModal'
import ConfirmModal from '@/components/confirmModal/ConfirmModal'
import toast from 'react-hot-toast'
import { Button } from '@heroui/react'

const Adreslerim = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { addresses, loading } = useSelector((state) => state.address)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Adresleri yükle
  useEffect(() => {
    dispatch(getAddresses())
  }, [dispatch])

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
    { icon: FaCog, label: 'Ayarlar', href: '/ayarlar' },
  ]

  const isActive = (href) => router.pathname === href

  // Varsayılan adresleri en üste sırala
  const sortedAddresses = [...addresses].sort((a, b) => {
    const aIsDefault = a.is_default === true || a.is_default === 1
    const bIsDefault = b.is_default === true || b.is_default === 1
    if (aIsDefault && !bIsDefault) return -1
    if (!aIsDefault && bIsDefault) return 1
    return 0
  })

  const handleDelete = (addressId) => {
    setAddressToDelete(addressId)
    setIsConfirmModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return
    
    setIsDeleting(true)
    const result = await dispatch(deleteAddress(addressToDelete))
    
    if (deleteAddress.fulfilled.match(result)) {
      dispatch(getAddresses()) // Listeyi yenile
      setIsConfirmModalOpen(false)
      setAddressToDelete(null)
    } else {
      toast.error(result.payload || 'Adres silinemedi!')
    }
    setIsDeleting(false)
  }

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setIsConfirmModalOpen(false)
      setAddressToDelete(null)
    }
  }

  const handleSetDefault = async (addressId) => {
    const result = await dispatch(setDefaultAddress(addressId))
    if (setDefaultAddress.fulfilled.match(result)) {
      toast.success('Varsayılan adres ayarlandı!')
      dispatch(getAddresses()) // Listeyi yenile
    } else {
      toast.error(result.payload || 'Varsayılan adres ayarlanamadı!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 px-3">Hesabım</h2>
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              <span className="font-medium">Menü</span>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="mt-4 bg-white rounded-2xl shadow-md p-4">
                <nav className="space-y-1">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="text-lg" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Adreslerim</h1>
                  <p className="text-gray-600 mt-1">Kayıtlı teslimat adreslerinizi yönetin</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#eb1260] to-[#d10f54] text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <FaPlus />
                  <span>Yeni Adres</span>
                </button>
              </div>

              {/* Address List */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1260] mx-auto mb-4"></div>
                    <p className="text-gray-600">Adresleriniz yükleniyor...</p>
                  </div>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 p-5 transition-all hover:shadow-lg"
                  >
                    {/* Başlık */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">{address.title}</h3>
                      {(address.is_default === true || address.is_default === 1) && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#eb1260] text-white text-xs font-semibold rounded-full">
                          <FaStar className="text-[10px]" />
                          <span>Varsayılan</span>
                        </div>
                      )}
                    </div>

                    {/* Bilgiler */}
                    <div className="space-y-2 mb-5">
                      {/* Tip */}
                      <p className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                        {address.address_type === 'kurumsal' ? <FaBuilding /> : <FaHome />}
                        {address.address_type === 'kurumsal' ? 'Kurumsal' : 'Bireysel'}
                      </p>

                      {/* İsim/Firma */}
                      {(address.first_name || address.last_name || address.company_name) && (
                        <p className="text-gray-900 font-semibold">
                          {address.first_name && address.last_name 
                            ? `${address.first_name} ${address.last_name}`
                            : address.company_name}
                        </p>
                      )}
                      
                      {/* Telefon */}
                      {address.phone && (
                        <p className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaPhone className="text-xs" />
                          {address.phone}
                        </p>
                      )}
                      
                      {/* Şehir/İlçe */}
                      {(address.city || address.district) && (
                        <p className="text-gray-700 text-sm font-medium">
                          {address.district && `${address.district}, `}{address.city}
                          {address.postal_code && ` - ${address.postal_code}`}
                        </p>
                      )}
                      
                      {/* Adres */}
                      {address.address_line && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {address.address_line}
                        </p>
                      )}
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-2">
                      {(address.is_default !== true && address.is_default !== 1) && (
                        <Button 
                          onClick={() => handleSetDefault(address.id)}
                          variant="flat"
                          className="flex-1"
                          startContent={<FaStar />}
                        >
                          Varsayılan Yap
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleDelete(address.id)}
                        color="danger"
                        variant="bordered"
                        className={`${(address.is_default === true || address.is_default === 1) ? 'flex-1' : ''}`}
                        startContent={<FaTrash />}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              )}

              {/* Empty State */}
              {addresses.length === 0 && !loading && (
                <div className="text-center py-16">
                  <FaMapMarkerAlt className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Kayıtlı adresiniz bulunmuyor
                  </h3>
                  <p className="text-gray-600">
                    Hızlı teslimat için adres ekleyin
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Adres Ekleme Modalı */}
      <AdresEkleModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Silme Onay Modalı */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        title="Adresi Sil"
        message="Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="İptal"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default Adreslerim