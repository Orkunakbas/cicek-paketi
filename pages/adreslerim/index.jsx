import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaBars, FaTimes, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const Adreslerim = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
    { icon: FaCog, label: 'Ayarlar', href: '/ayarlar' },
  ]

  // Örnek adresler
  const [addresses] = useState([
    {
      id: 1,
      title: 'Ev Adresim',
      name: 'Orkun Akbaş',
      phone: '(555) 123 45 67',
      address: 'Atatürk Caddesi No:123 Daire:5',
      district: 'Kadıköy',
      city: 'İstanbul',
      isDefault: true
    },
    {
      id: 2,
      title: 'İş Adresim',
      name: 'Orkun Akbaş',
      phone: '(555) 987 65 43',
      address: 'İstiklal Caddesi No:456 Kat:3',
      district: 'Beyoğlu',
      city: 'İstanbul',
      isDefault: false
    }
  ])

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
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  <FaPlus />
                  <span>Yeni Adres Ekle</span>
                </button>
              </div>

              {/* Address List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-[#eb1260] transition-colors relative"
                  >
                    {/* Default Badge */}
                    {address.isDefault && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Varsayılan
                        </span>
                      </div>
                    )}

                    {/* Address Info */}
                    <div className="space-y-2 mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{address.title}</h3>
                      <p className="text-gray-700 font-medium">{address.name}</p>
                      <p className="text-gray-600 text-sm">{address.phone}</p>
                      <p className="text-gray-600 text-sm">
                        {address.address}
                        <br />
                        {address.district} / {address.city}
                      </p>
                    </div>

                    {/* Actions */}
                           <div className="flex gap-2 pt-4 border-t border-gray-100">
                             <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                               <FaEdit />
                               <span>Düzenle</span>
                             </button>
                             <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                               <FaTrash />
                               <span>Sil</span>
                             </button>
                           </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {addresses.length === 0 && (
                <div className="text-center py-12">
                  <FaMapMarkerAlt className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Henüz adres eklemediniz
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Hızlı teslimat için adres ekleyin
                  </p>
                         <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                           İlk Adresini Ekle
                         </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Adreslerim