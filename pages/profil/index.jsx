import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, updateProfile, clearUpdateSuccess } from '@/store/slices/profilSlice'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaStar, FaBars, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Profil = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { profile, loading, error, updateSuccess } = useSelector((state) => state.profile)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  })

  // Profil bilgilerini yükle
  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  // Profile state'i değiştiğinde formu güncelle
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        surname: profile.surname || '',
        email: profile.email || '',
        phone: profile.phone?.replace('+90', '') || ''
      })
    }
  }, [profile])

  // Güncelleme başarılı olduğunda toast göster
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Profil bilgileriniz güncellendi!')
      dispatch(clearUpdateSuccess())
    }
  }, [updateSuccess, dispatch])

  // Hata durumunda toast göster
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Telefon için sadece rakam
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: numericValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.surname) {
      toast.error('Ad ve Soyad alanları zorunludur!')
      return
    }

    if (formData.phone && formData.phone.length !== 10) {
      toast.error('Geçerli bir telefon numarası girin!')
      return
    }

    const updateData = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      phone: formData.phone ? `+90${formData.phone}` : null
    }

    await dispatch(updateProfile(updateData))
  }

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaStar, label: 'Değerlendirmelerim', href: '/degerlendirmeler' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
  ]

  const isActive = (href) => router.pathname === href

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
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profilim</h1>
              
              {loading && !profile ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1260]"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ad Soyad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* E-posta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                  />
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Numarası
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
                        maxLength={10}
                        className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1260] focus:border-transparent"
                        placeholder="5xx xxx xx xx"
                  />
                </div>
                    <p className="text-xs text-gray-500 mt-1">10 haneli telefon numaranızı giriniz</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#e8125f] text-white rounded-lg font-medium hover:bg-[#d10f54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                    <button 
                      type="button"
                      onClick={() => dispatch(getProfile())}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                    İptal
                  </button>
                </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Profil