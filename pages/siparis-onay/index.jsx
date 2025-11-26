import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { FaCheckCircle, FaCreditCard, FaUniversity, FaBox, FaTruck, FaHome } from 'react-icons/fa'
import { GiFlowerPot } from 'react-icons/gi'

const SiparisOnay = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [confetti, setConfetti] = useState(true)
  const [orderInfo, setOrderInfo] = useState(null)

  const isLoggedIn = status === 'authenticated' && !!session?.user

  useEffect(() => {
    // Konfeti animasyonunu 3 saniye sonra kapat
    const timer = setTimeout(() => setConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // localStorage'dan sipariş bilgilerini al
    const storedOrder = localStorage.getItem('latest_order')
    if (storedOrder) {
      setOrderInfo(JSON.parse(storedOrder))
      // Kullanıldıktan sonra temizle
      localStorage.removeItem('latest_order')
    } else {
      // Sipariş bilgisi yoksa ana sayfaya yönlendir
      router.push('/')
    }
  }, [router])

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#eb1260] mx-auto mb-4"></div>
          <p className="text-gray-600">Sipariş bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  const isCardPayment = orderInfo.payment_method === 'credit_card'
  const isBankTransfer = orderInfo.payment_method === 'bank_transfer'

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white relative overflow-hidden">
      {/* Konfeti Efekti */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#eb1260', '#ff6b9d', '#ffc0cb', '#ff1493', '#ff69b4'][Math.floor(Math.random() * 5)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Başarı İkonu ve Başlık */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-400 to-[#eb1260] rounded-full mb-6 shadow-2xl animate-scale-in">
            <GiFlowerPot className="text-white text-6xl" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {isCardPayment ? 'Siparişiniz Alındı!' : 'Siparişiniz Oluşturuldu!'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Sipariş No: <span className="font-bold text-[#e8125f]">#{orderInfo.order_number}</span>
          </p>
          
          <p className="text-sm text-gray-500">
            {formatDate(orderInfo.created_at)}
          </p>
        </div>

        {/* Ödeme Yöntemine Göre Mesaj */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 animate-slide-up">
          {isCardPayment ? (
            // Kredi Kartı ile Ödeme
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FaCreditCard className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Ödemeniz Başarıyla Alındı
              </h2>
              <p className="text-gray-600 mb-4">
                Kredi kartınızdan <span className="font-bold text-[#e8125f]">{parseFloat(orderInfo.total_amount).toFixed(2)} ₺</span> tutarında ödeme alınmıştır.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ Siparişiniz hazırlanmaya başlandı. Kısa süre içinde kargoya teslim edilecektir.
                </p>
              </div>
            </div>
          ) : (
            // Havale/EFT ile Ödeme
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                  <FaUniversity className="text-blue-600 text-2xl" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Havale/EFT Bekleniyor
              </h2>
              
              <p className="text-gray-600 mb-6 text-center">
                Siparişiniz oluşturuldu. Ödemenizi tamamlamak için aşağıdaki hesaba havale/EFT yapınız.
              </p>

              {/* Banka Bilgileri */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUniversity className="text-blue-600" />
                  Havale/EFT Bilgileri
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span className="text-gray-600">Banka:</span>
                    <span className="font-semibold text-gray-900">Türkiye İş Bankası</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span className="text-gray-600">Hesap Sahibi:</span>
                    <span className="font-semibold text-gray-900">Çiçek Paketi A.Ş.</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span className="text-gray-600">IBAN:</span>
                    <span className="font-mono font-semibold text-gray-900">TR12 3456 7890 1234 5678 9012 34</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-200">
                    <span className="text-gray-600">Tutar:</span>
                    <span className="font-bold text-[#e8125f] text-lg">{parseFloat(orderInfo.total_amount).toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Açıklama:</span>
                    <span className="font-semibold text-gray-900">#{orderInfo.order_number}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>
                    <strong>Önemli:</strong> Havale açıklamasına mutlaka sipariş numaranızı (<strong>#{orderInfo.order_number}</strong>) yazınız. 
                    Ödemeniz onaylandıktan sonra siparişiniz hazırlanacaktır.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sipariş Detayları */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaBox className="text-[#e8125f]" />
            Sipariş Detayları
          </h2>

          {/* Ürünler */}
          <div className="space-y-4 mb-6">
            {orderInfo.orderItems && orderInfo.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product_image ? (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <GiFlowerPot className="text-gray-400 text-3xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.product_name}</h3>
                  <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                  <p className="text-sm font-bold text-[#e8125f]">{parseFloat(item.price).toFixed(2)} ₺</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{parseFloat(item.line_total).toFixed(2)} ₺</p>
                </div>
              </div>
            ))}
          </div>

          {/* Teslimat Adresi */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FaHome className="text-gray-600" />
              Teslimat Adresi
            </h3>
            <p className="text-sm text-gray-900 font-semibold mb-1">
              {orderInfo.shipping_address?.full_name || 
               orderInfo.shipping_address?.company_name || 
               (orderInfo.shipping_address?.name && orderInfo.shipping_address?.surname 
                 ? `${orderInfo.shipping_address.name} ${orderInfo.shipping_address.surname}` 
                 : orderInfo.customer_name)}
            </p>
            <p className="text-sm text-gray-600 mb-1">{orderInfo.shipping_address?.phone || orderInfo.customer_phone}</p>
            <p className="text-sm text-gray-600">
              {orderInfo.shipping_address?.address_line1}
              {orderInfo.shipping_address?.district && orderInfo.shipping_address?.city 
                ? `, ${orderInfo.shipping_address.district} / ${orderInfo.shipping_address.city}`
                : ''}
            </p>
          </div>
        </div>

        {/* Sipariş Takibi */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaTruck className="text-[#e8125f]" />
            Sipariş Durumu
          </h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />
            
            <div className="space-y-6">
              {/* Sipariş Alındı */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-gray-900">Sipariş Alındı</h3>
                  <p className="text-sm text-gray-600">{formatDate(orderInfo.created_at)}</p>
                </div>
              </div>

              {/* Hazırlanıyor */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                  <FaBox className="text-gray-500 text-xl" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-gray-500">Hazırlanıyor</h3>
                  <p className="text-sm text-gray-400">Yakında</p>
                </div>
              </div>

              {/* Kargoya Verildi */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                  <FaTruck className="text-gray-500 text-xl" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-gray-500">Kargoya Verildi</h3>
                  <p className="text-sm text-gray-400">Bekleniyor</p>
                </div>
              </div>

              {/* Teslim Edildi */}
              <div className="flex gap-4 relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                  <FaHome className="text-gray-500 text-xl" />
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-gray-500">Teslim Edildi</h3>
                  <p className="text-sm text-gray-400">Bekleniyor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className={`grid grid-cols-1 ${isLoggedIn ? 'md:grid-cols-2' : ''} gap-4 animate-slide-up`} style={{ animationDelay: '0.3s' }}>
          {isLoggedIn && (
            <Link
              href="/siparislerim"
              className="block py-4 bg-[#e8125f] text-white text-center font-bold rounded-xl hover:bg-[#d10f54] transition-all shadow-lg hover:shadow-xl"
            >
              Siparişlerimi Görüntüle
            </Link>
          )}
          <Link
            href="/"
            className="block py-4 bg-white border-2 border-gray-300 text-gray-700 text-center font-bold rounded-xl hover:border-[#e8125f] hover:text-[#e8125f] transition-all"
          >
            Alışverişe Devam Et
          </Link>
        </div>

        {/* Yardım Mesajı */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-gray-600">
            Sorularınız için{' '}
            <a href="tel:08502220000" className="text-[#e8125f] hover:underline font-semibold">
              0850 222 0000
            </a>
            {' '}numaralı telefondan bize ulaşabilirsiniz.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

export default SiparisOnay