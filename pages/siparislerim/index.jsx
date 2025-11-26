import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { getOrders } from '@/store/slices/orderSlice'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaBars, FaTimes, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa'
import { GiFlowerPot } from 'react-icons/gi'
import Image from 'next/image'
import SiparisDetayModal from '@/components/siparis/SiparisDetayModal'
import { Button } from '@heroui/react'

const Siparislerim = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: session, status } = useSession()
  const { orders, loading, error } = useSelector(state => state.order)
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // all, pending, shipped, delivered, cancelled
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Giriş kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris')
    } else if (status === 'authenticated') {
      dispatch(getOrders())
    }
  }, [status, dispatch, router])

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
    { icon: FaCog, label: 'Ayarlar', href: '/ayarlar' },
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    })
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'confirmed': return 'Onaylandı'
      case 'preparing': return 'Hazırlanıyor'
      case 'shipped': return 'Kargoda'
      case 'delivered': return 'Teslim Edildi'
      case 'cancelled': return 'İptal Edildi'
      case 'refunded': return 'İade Edildi'
      default: return 'Beklemede'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-700'
      case 'shipped':
        return 'bg-purple-100 text-purple-700'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock />
      case 'confirmed':
        return <FaCheckCircle />
      case 'preparing':
        return <FaBox />
      case 'shipped':
        return <FaTruck />
      case 'delivered':
        return <FaCheckCircle />
      case 'cancelled':
      case 'refunded':
        return <FaTimesCircle />
      default:
        return <FaBox />
    }
  }

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Ödeme Bekleniyor'
      case 'paid': return 'Ödendi'
      case 'failed': return 'Ödeme Başarısız'
      case 'refunded': return 'İade Edildi'
      default: return 'Beklemede'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
      case 'refunded':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const isActive = (href) => router.pathname === href

  const handleOpenModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#eb1260] mx-auto mb-4"></div>
          <p className="text-gray-600">Siparişleriniz yükleniyor...</p>
        </div>
      </div>
    )
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
                  Tümü ({orders?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'pending'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Beklemede
                </button>
                <button
                  onClick={() => setActiveTab('shipped')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'shipped'
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
                  ?.filter(order => activeTab === 'all' || order.order_status === activeTab)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-gray-900 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {order.order_number}
                          </h3>
                          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 mt-2 md:mt-0">
                          <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                            {getStatusIcon(order.order_status)}
                            {getStatusText(order.order_status)}
                          </span>
                          <span className={`text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                            <FaMoneyBillWave className="inline mr-1" />
                            {getPaymentStatusText(order.payment_status)}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.orderItems?.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                              {item.product_image ? (
                                <Image
                                  src={item.product_image}
                                  alt={item.product_name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <GiFlowerPot className="text-gray-400 text-3xl" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                              <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{parseFloat(item.line_total).toFixed(2)} ₺</p>
                              <p className="text-xs text-gray-500">{parseFloat(item.price).toFixed(2)} ₺ / adet</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                        <div className="text-right md:text-left">
                          <span className="text-gray-600">Toplam: </span>
                          <span className="text-xl font-bold text-gray-900">{parseFloat(order.total_amount).toFixed(2)} ₺</span>
                        </div>
                        <Button
                          onClick={() => handleOpenModal(order)}
                          className="w-full md:w-auto bg-gray-900 text-white hover:bg-gray-800"
                        >
                          Detaylar
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty State */}
              {(!orders || orders.filter(order => activeTab === 'all' || order.order_status === activeTab).length === 0) && (
                <div className="text-center py-12">
                  <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeTab === 'all' ? 'Henüz sipariş vermediniz' : 'Bu kategoride sipariş bulunamadı'}
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

      {/* Sipariş Detay Modal */}
      <SiparisDetayModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  )
}

export default Siparislerim