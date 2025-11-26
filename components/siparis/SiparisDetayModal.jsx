import React from 'react'
import { FaTimes, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaHome, FaBuilding, FaCreditCard, FaUniversity, FaMoneyBillWave } from 'react-icons/fa'
import { GiFlowerPot } from 'react-icons/gi'
import Image from 'next/image'

const SiparisDetayModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-xl" />
      case 'confirmed':
        return <FaCheckCircle className="text-xl" />
      case 'preparing':
        return <FaBox className="text-xl" />
      case 'shipped':
        return <FaTruck className="text-xl" />
      case 'delivered':
        return <FaCheckCircle className="text-xl" />
      case 'cancelled':
      case 'refunded':
        return <FaTimesCircle className="text-xl" />
      default:
        return <FaBox className="text-xl" />
    }
  }

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit_card': return 'Kredi Kartı'
      case 'bank_transfer': return 'Havale/EFT'
      case 'cash_on_delivery': return 'Kapıda Ödeme'
      default: return method
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return <FaCreditCard />
      case 'bank_transfer': return <FaUniversity />
      case 'cash_on_delivery': return <FaMoneyBillWave />
      default: return <FaMoneyBillWave />
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

  const parseVariantInfo = (variantInfo) => {
    if (!variantInfo) return null
    
    try {
      // Eğer string ise parse et
      const parsed = typeof variantInfo === 'string' ? JSON.parse(variantInfo) : variantInfo
      
      // SKU ve stock gibi backend bilgilerini filtrele
      const filtered = Object.entries(parsed)
        .filter(([key]) => !['sku', 'stock', 'id', 'product_id'].includes(key))
        .map(([key, value]) => {
          // Key'leri Türkçeleştir
          const turkishKeys = {
            'size': 'Boyut',
            'color': 'Renk',
            'type': 'Tip',
            'material': 'Malzeme'
          }
          const displayKey = turkishKeys[key] || key.charAt(0).toUpperCase() + key.slice(1)
          return `${displayKey}: ${value}`
        })
        .join(', ')
      
      return filtered || null
    } catch (e) {
      return null
    }
  }

  const formatAddress = (address) => {
    if (!address) return 'Adres bilgisi yok'
    
    // Eğer address string ise parse et
    const addr = typeof address === 'string' ? JSON.parse(address) : address
    if (!addr) return 'Adres bilgisi yok'

    return (
      <div className="space-y-1">
        {/* İsim/Firma */}
        {addr.address_type === 'bireysel' ? (
          <p className="font-semibold text-gray-900">
            {addr.full_name || (addr.name && addr.surname ? `${addr.name} ${addr.surname}` : '')}
          </p>
        ) : (
          <p className="font-semibold text-gray-900">{addr.company_name}</p>
        )}
        
        {/* Adres */}
        {addr.address_line1 && <p className="text-gray-700">{addr.address_line1}</p>}
        
        {/* İlçe/Şehir */}
        <p className="text-gray-700">
          {addr.district && addr.city ? `${addr.district} / ${addr.city}` : addr.city || ''}
          {addr.postal_code && ` - ${addr.postal_code}`}
        </p>
        
        {/* Telefon */}
        {addr.phone && <p className="text-gray-600 text-sm">📞 {addr.phone}</p>}
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#eb1260] to-[#d10f54] text-white px-6 py-5 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <GiFlowerPot className="text-3xl" />
              <div>
                <h2 className="text-xl font-bold">{order.order_number}</h2>
                <p className="text-sm opacity-90">{formatDate(order.created_at)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
            {/* Status & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Order Status */}
              <div className={`border-2 rounded-2xl p-4 ${getStatusColor(order.order_status)}`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.order_status)}
                  <div>
                    <p className="text-xs opacity-70 font-medium">Sipariş Durumu</p>
                    <p className="font-bold text-lg">{getStatusText(order.order_status)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-2 border-gray-200 rounded-2xl p-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  {getPaymentMethodIcon(order.payment_method)}
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Ödeme Yöntemi</p>
                    <p className="font-bold text-gray-900">{getPaymentMethodText(order.payment_method)}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Durum: </span>
                  <span className={`font-semibold ${
                    order.payment_status === 'paid' ? 'text-green-600' :
                    order.payment_status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBox className="text-[#eb1260]" />
                Sipariş Detayları
              </h3>
              <div className="space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white rounded-xl p-3">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
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
                          <GiFlowerPot className="text-gray-400 text-4xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.product_name}</h4>
                      {item.variant_info && parseVariantInfo(item.variant_info) && (
                        <p className="text-sm text-gray-600 mb-1">
                          {parseVariantInfo(item.variant_info)}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-600">Adet: <span className="font-semibold text-gray-900">{item.quantity}</span></span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">Birim: <span className="font-semibold text-gray-900">{parseFloat(item.price).toFixed(2)} ₺</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#eb1260]">{parseFloat(item.line_total).toFixed(2)} ₺</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Shipping Address */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaHome className="text-gray-600" />
                  Teslimat Adresi
                </h3>
                <div className="text-sm">{formatAddress(order.shipping_address)}</div>
              </div>

              {/* Billing Address */}
              {order.billing_address && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaBuilding className="text-gray-600" />
                    Fatura Adresi
                  </h3>
                  <div className="text-sm mb-3">{formatAddress(order.billing_address)}</div>
                  {(() => {
                    const addr = typeof order.billing_address === 'string' 
                      ? JSON.parse(order.billing_address) 
                      : order.billing_address
                    return addr?.tax_office && addr?.tax_number && (
                      <div className="pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                        <p><strong>Vergi Dairesi:</strong> {addr.tax_office}</p>
                        <p><strong>Vergi No:</strong> {addr.tax_number}</p>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>

            {/* Customer Note */}
            {order.customer_note && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <GiFlowerPot className="text-gray-600" />
                  Çiçek Notu
                </h3>
                <p className="text-sm text-gray-700 italic">&ldquo;{order.customer_note}&rdquo;</p>
              </div>
            )}

            {/* Tracking Info */}
            {order.tracking_number && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FaTruck className="text-gray-600" />
                  Kargo Takip
                </h3>
                <div className="text-sm text-gray-700">
                  <p><strong>Kargo Firması:</strong> {order.shipping_company || 'Belirtilmemiş'}</p>
                  <p><strong>Takip No:</strong> {order.tracking_number}</p>
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Ödeme Özeti</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-semibold text-gray-900">{parseFloat(order.subtotal).toFixed(2)} ₺</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim</span>
                    <span className="font-semibold">- {parseFloat(order.discount).toFixed(2)} ₺</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo Ücreti</span>
                  <span className="font-semibold text-gray-900">
                    {order.shipping_cost > 0 ? `${parseFloat(order.shipping_cost).toFixed(2)} ₺` : 'Ücretsiz'}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Toplam</span>
                  <span className="text-2xl font-bold text-[#eb1260]">{parseFloat(order.total_amount).toFixed(2)} ₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default SiparisDetayModal