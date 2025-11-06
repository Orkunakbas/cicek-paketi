import React, { useState } from 'react'
import { useRouter } from 'next/router'
import AdresSecimi from '@/components/odeme/AdresSecimi'
import SiparisOzeti from '@/components/odeme/SiparisOzeti'
import OdemeSecenekleri from '@/components/odeme/OdemeSecenekleri'

const Odeme = () => {
  const router = useRouter()
  const { type } = router.query // 'guest' ise üyeliksiz kullanıcı
  const [faturaAyni, setFaturaAyni] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')

  const handleCompleteOrder = async () => {
    try {
      setIsProcessing(true)
      
      // Burada ödeme işlemi yapılacak
      // API çağrısı, validasyon vb.
      
      // Simüle edilmiş ödeme işlemi
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Başarılı ödeme sonrası sipariş onay sayfasına yönlendir (ödeme yöntemiyle birlikte)
      router.push(`/siparis-onay?paymentMethod=${paymentMethod}`)
    } catch (error) {
      console.error('Ödeme hatası:', error)
      setIsProcessing(false)
      alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Ödeme
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Sepet</span>
            <span>→</span>
            <span className="text-[#e8125f] font-semibold">Ödeme</span>
            <span>→</span>
            <span>Onay</span>
          </div>
        </div>

        {/* Üyeliksiz Kullanıcı Uyarısı */}
        {type === 'guest' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900">
              ℹ️ <strong>Misafir olarak alışveriş yapıyorsunuz.</strong> Üye olarak sipariş geçmişinizi takip edebilir ve daha hızlı alışveriş yapabilirsiniz.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mobil: Sipariş Özeti En Üstte */}
          <div className="lg:hidden">
            <SiparisOzeti 
              onCompleteOrder={handleCompleteOrder}
              isProcessing={isProcessing}
              isMobile={true}
            />
          </div>

          {/* Sol Taraf - Formlar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teslimat Adresi */}
            <AdresSecimi type="teslimat" />

            {/* Fatura Adresi Checkbox */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={faturaAyni}
                  onChange={(e) => setFaturaAyni(e.target.checked)}
                  className="w-5 h-5 text-[#e8125f] focus:ring-[#e8125f] rounded"
                />
                <span className="font-medium text-gray-900">
                  Fatura adresim teslimat adresimle aynı
                </span>
              </label>
            </div>

            {/* Fatura Adresi (Farklı ise) */}
            {!faturaAyni && (
              <AdresSecimi type="fatura" />
            )}

            {/* Ödeme Seçenekleri */}
            <OdemeSecenekleri onPaymentMethodChange={setPaymentMethod} />

            {/* Siparişi Tamamla Butonu (Mobil) */}
            <div className="lg:hidden">
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-[#e8125f] to-[#d10f54] text-white text-center font-bold rounded-xl hover:from-[#d10f54] hover:to-[#b90d47] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    İşleniyor...
                  </span>
                ) : (
                  'Siparişi Tamamla'
                )}
              </button>
            </div>
          </div>

          {/* Sağ Taraf - Sipariş Özeti (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <SiparisOzeti 
              onCompleteOrder={handleCompleteOrder}
              isProcessing={isProcessing}
              isMobile={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Odeme