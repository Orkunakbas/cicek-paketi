import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaBars, FaTimes, FaTrash } from 'react-icons/fa'
import Product from '@/components/product/Product'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const Favoriler = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
    { icon: FaCog, label: 'Ayarlar', href: '/ayarlar' },
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Favorilerim</h1>
                <span className="text-gray-600">6 ürün</span>
              </div>

              {/* Favorites Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Product
                    key={index}
                    id={index + 1}
                    urun_adi="Monstera Deliciosa"
                    urun_aciklama="Monstera Deliciosa, büyük, parlak yeşil ve karakteristik delikli yapraklarıyla bilinen popüler bir iç mekan bitkisidir."
                    fiyat={450}
                    indirimli_fiyat={349}
                    kapak={monsterraImage}
                    url={`/cicek/monstera-deliciosa-${index + 1}`}
                    tag={["monstera", "tropik", "iç mekan"]}
                    initialFavorite={true}
                  />
                ))}
              </div>

              {/* Empty State */}
              {false && (
                <div className="text-center py-12">
                  <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Henüz favori ürününüz yok
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Beğendiğiniz ürünleri favorilere ekleyin
                  </p>
                  <Link href="/" className="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Alışverişe Başla
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Favoriler