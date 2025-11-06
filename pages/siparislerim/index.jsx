import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaBars, FaTimes, FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Image from 'next/image'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const Siparislerim = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // all, pending, completed, cancelled

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
    { icon: FaCog, label: 'Ayarlar', href: '/ayarlar' },
  ]

  // Örnek siparişler
  const orders = [
    {
      id: '#12345',
      date: '15 Kasım 2024',
      status: 'delivered',
      statusText: 'Teslim Edildi',
      total: 698,
      items: [
        { name: 'Monstera Deliciosa', quantity: 1, price: 349, image: monsterraImage },
        { name: 'Yılbaşı Çiçeği', quantity: 1, price: 349, image: monsterraImage }
      ]
    },
    {
      id: '#12344',
      date: '10 Kasım 2024',
      status: 'shipping',
      statusText: 'Kargoda',
      total: 698,
      items: [
        { name: 'Monstera Deliciosa', quantity: 2, price: 698, image: monsterraImage }
      ]
    },
    {
      id: '#12343',
      date: '5 Kasım 2024',
      status: 'cancelled',
      statusText: 'İptal Edildi',
      total: 450,
      items: [
        { name: 'Orkide', quantity: 1, price: 450, image: monsterraImage }
      ]
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'shipping':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle />
      case 'shipping':
        return <FaTruck />
      case 'cancelled':
        return <FaTimesCircle />
      default:
        return <FaBox />
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Siparişlerim</h1>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'shipping'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Kargoda
                </button>
                <button
                  onClick={() => setActiveTab('delivered')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'delivered'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Teslim Edildi
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'cancelled'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  İptal Edildi
                </button>
              </div>

              {/* Orders List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {orders
                  .filter(order => activeTab === 'all' || order.status === activeTab)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-gray-900 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Sipariş {order.id}
                          </h3>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.statusText}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{item.price} ₺</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-100">
                        <div className="mb-3 md:mb-0">
                          <span className="text-gray-600">Toplam: </span>
                          <span className="text-xl font-bold text-gray-900">{order.total} ₺</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                            Detaylar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty State */}
              {orders.filter(order => activeTab === 'all' || order.status === activeTab).length === 0 && (
                <div className="text-center py-12">
                  <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Henüz sipariş vermediniz
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Hemen alışverişe başlayın!
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

export default Siparislerim