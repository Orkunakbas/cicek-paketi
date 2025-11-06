import React, { useState } from 'react'
import { FaTruck, FaSearch, FaTimes, FaCheckCircle, FaBox, FaHome } from 'react-icons/fa'

const KargoTakip = ({ isOpen, onClose }) => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingResult, setTrackingResult] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!trackingNumber.trim()) {
      alert('Lütfen takip numarası giriniz')
      return
    }

    setIsSearching(true)

    // Simüle edilmiş arama (gerçek uygulamada API çağrısı yapılacak)
    setTimeout(() => {
      setTrackingResult({
        orderNumber: trackingNumber,
        status: 'in-transit',
        currentLocation: 'İstanbul Dağıtım Merkezi',
        estimatedDelivery: '15 Kasım 2024, Cuma',
        timeline: [
          {
            status: 'completed',
            title: 'Sipariş Alındı',
            description: 'Siparişiniz alındı ve hazırlanıyor',
            date: '12 Kasım 2024, 14:30',
            location: 'Çiçek Paketi Merkez'
          },
          {
            status: 'completed',
            title: 'Hazırlandı',
            description: 'Siparişiniz hazırlandı',
            date: '13 Kasım 2024, 09:15',
            location: 'Çiçek Paketi Merkez'
          },
          {
            status: 'completed',
            title: 'Kargoya Verildi',
            description: 'Siparişiniz kargo firmasına teslim edildi',
            date: '13 Kasım 2024, 16:45',
            location: 'İstanbul Kargo Merkezi'
          },
          {
            status: 'active',
            title: 'Dağıtım Merkezinde',
            description: 'Paketiniz dağıtım merkezinde',
            date: '14 Kasım 2024, 08:20',
            location: 'İstanbul Dağıtım Merkezi'
          },
          {
            status: 'pending',
            title: 'Teslimat',
            description: 'Paketiniz size teslim edilecek',
            date: 'Tahmini: 15 Kasım 2024',
            location: 'Kadıköy, İstanbul'
          }
        ]
      })
      setIsSearching(false)
    }, 1500)
  }

  const handleReset = () => {
    setTrackingNumber('')
    setTrackingResult(null)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#eb1260] rounded-full flex items-center justify-center">
                <FaTruck className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kargo Takip</h2>
                <p className="text-sm text-gray-600">Siparişinizin durumunu öğrenin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Kapat"
            >
              <FaTimes className="text-gray-600 text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Arama Formu */}
            {!trackingResult && (
              <form onSubmit={handleSearch} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sipariş veya Kargo Takip Numarası
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Örn: ÇP123456 veya 1234567890"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e8125f] focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3 bg-[#e8125f] text-white rounded-lg hover:bg-[#d10f54] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Aranıyor...</span>
                      </>
                    ) : (
                      <>
                        <FaSearch />
                        <span>Sorgula</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Sipariş numaranızı e-posta veya SMS ile aldınız
                </p>
              </form>
            )}

            {/* Sonuç */}
            {trackingResult && (
              <div className="space-y-6">
                {/* Özet Bilgi */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Sipariş: #{trackingResult.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📍 {trackingResult.currentLocation}
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-sm text-gray-600 hover:text-[#e8125f] font-medium"
                    >
                      Yeni Sorgulama
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <FaTruck className="text-xl" />
                    <span className="font-semibold">
                      Tahmini Teslimat: {trackingResult.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Kargo Geçmişi</h3>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />
                    
                    <div className="space-y-6">
                      {trackingResult.timeline.map((item, index) => (
                        <div key={index} className="flex gap-4 relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'active' ? 'bg-[#e8125f] animate-pulse' :
                            'bg-gray-200'
                          }`}>
                            {item.status === 'completed' && <FaCheckCircle className="text-white text-xl" />}
                            {item.status === 'active' && <FaTruck className="text-white text-xl" />}
                            {item.status === 'pending' && <FaHome className="text-gray-500 text-xl" />}
                          </div>
                          <div className="flex-1 pb-6">
                            <h4 className={`font-bold mb-1 ${
                              item.status === 'completed' ? 'text-gray-900' :
                              item.status === 'active' ? 'text-[#e8125f]' :
                              'text-gray-500'
                            }`}>
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                            <p className="text-xs text-gray-500">📍 {item.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Yardım */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    ℹ️ <strong>Yardıma mı ihtiyacınız var?</strong> Müşteri hizmetlerimiz{' '}
                    <a href="tel:08502220000" className="text-[#e8125f] hover:underline font-semibold">
                      0850 222 0000
                    </a>
                    {' '}numarasından size yardımcı olabilir.
                  </p>
                </div>
              </div>
            )}

            {/* Bilgi Kutusu (Sonuç yoksa) */}
            {!trackingResult && !isSearching && (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <FaTruck className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Kargo Takibi Nasıl Yapılır?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sipariş numaranızı veya kargo takip numaranızı yukarıdaki alana girerek kargonuzun durumunu öğrenebilirsiniz.
                </p>
            
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default KargoTakip