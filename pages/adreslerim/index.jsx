import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAddresses, deleteAddress, setDefaultAddress } from '@/store/slices/addressSlice'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaBars, FaTimes, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa'
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  <FaPlus />
                  <span>Yeni Adres Ekle</span>
                </Button>
              </div>

              {/* Address List */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1260]"></div>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-[#eb1260] transition-colors relative"
                  >
                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {/* Adres Tipi */}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          address.address_type === 'kurumsal' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {address.address_type === 'kurumsal' ? 'Kurumsal' : 'Bireysel'}
                        </span>
                        
                        {/* Varsayılan Badge */}
                        {(address.is_default === true || address.is_default === 1) && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Varsayılan
                        </span>
                        )}
                      </div>

                    {/* Address Info */}
                    <div className="space-y-2 mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{address.title}</h3>
                        {(address.first_name || address.last_name || address.company_name) && (
                          <p className="text-gray-700 font-medium">
                            {address.first_name && address.last_name 
                              ? `${address.first_name} ${address.last_name}`
                              : address.company_name}
                          </p>
                        )}
                        {address.phone && (
                      <p className="text-gray-600 text-sm">{address.phone}</p>
                        )}
                        {(address.city || address.district) && (
                          <p className="text-gray-600 text-sm font-medium">
                            {address.district && `${address.district} / `}{address.city}
                            {address.postal_code && ` - ${address.postal_code}`}
                          </p>
                        )}
                        {address.address_line && (
                      <p className="text-gray-600 text-sm">
                            {address.address_line}
                      </p>
                        )}
                    </div>

                    {/* Actions */}
                           <div className="flex gap-2 pt-4 border-t border-gray-100">
                        {(address.is_default !== true && address.is_default !== 1) && (
                          <Button 
                            onClick={() => handleSetDefault(address.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#eb1260] text-white hover:bg-[#d10f54]"
                          >
                            <FaStar />
                            <span>Varsayılan Yap</span>
                          </Button>
                        )}
                        <div className={(address.is_default === true || address.is_default === 1) ? "w-1/2 ml-auto" : "flex-1"}>
                          <Button 
                            variant='bordered'
                            color='danger'
                            onClick={() => handleDelete(address.id)}
                            className="w-full flex items-center justify-center gap-2"
                          >
                               <FaTrash />
                               <span>Sil</span>
                          </Button>
                        </div>
                           </div>
                  </div>
                ))}
              </div>
              )}

              {/* Empty State */}
              {addresses.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FaMapMarkerAlt className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Henüz adres eklemediniz
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Hızlı teslimat için adres ekleyin
                  </p>
                         <button 
                           onClick={() => setIsAddModalOpen(true)}
                           className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                         >
                           İlk Adresini Ekle
                         </button>
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