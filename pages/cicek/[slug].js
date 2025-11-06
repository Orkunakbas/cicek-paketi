import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { FaStar, FaHeart, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa'
import Product from '@/components/product/Product'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const ProductDetail = () => {
  const router = useRouter()
  const { slug } = router.query

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)

  // Örnek ürün verisi
  const product = {
    id: 1,
    name: "Monstera Deliciosa - Premium İç Mekan Bitkisi",
    price: 450,
    discountedPrice: 349,
    rating: 4.8,
    reviewCount: 127,
    stock: 15,
    shippingDays: 2, // Kaç gün içinde kargoya verilir
    images: [
      monsterraImage,
      monsterraImage,
      monsterraImage,
      monsterraImage,
    ],
    description: "Monstera Deliciosa, büyük, parlak yeşil ve karakteristik delikli yapraklarıyla bilinen popüler bir iç mekan bitkisidir. Tropikal bir atmosfer yaratır ve bakımı oldukça kolaydır. Ev veya ofis ortamları için mükemmel bir seçimdir.",
    features: [
      "Saksı Çapı: 21 cm",
      "Bitki Boyu: 60-80 cm",
      "Işık İhtiyacı: Orta-Parlak Dolaylı Işık",
      "Sulama: Haftada 1-2 kez",
      "Bakım Seviyesi: Kolay",
      "Evcil Hayvan Dostu: Hayır"
    ],
    careInstructions: "Monstera bitkisi dolaylı güneş ışığını sever. Toprak kuruduğunda sulayın, fazla su vermemeye dikkat edin. Yapraklarını düzenli olarak nemli bir bezle silin. İlkbahar ve yaz aylarında ayda bir kez gübreleme yapın.",
    tags: ["monstera", "tropik", "iç mekan", "ofis bitkisi", "kolay bakım"]
  }

  const discountPercentage = Math.round(((product.price - product.discountedPrice) / product.price) * 100)

  const handleAddToCart = () => {
    console.log('Sepete eklendi:', { product, quantity })
    // Sepete ekleme işlemi
  }

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const diff = e.clientX - startX
    const threshold = 50 // Minimum sürükleme mesafesi
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedImage > 0) {
        // Sola kaydır (önceki resim)
        setSelectedImage(selectedImage - 1)
        setStartX(e.clientX)
      } else if (diff < 0 && selectedImage < product.images.length - 1) {
        // Sağa kaydır (sonraki resim)
        setSelectedImage(selectedImage + 1)
        setStartX(e.clientX)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    
    const diff = e.touches[0].clientX - startX
    const threshold = 50
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedImage > 0) {
        setSelectedImage(selectedImage - 1)
        setStartX(e.touches[0].clientX)
      } else if (diff < 0 && selectedImage < product.images.length - 1) {
        setSelectedImage(selectedImage + 1)
        setStartX(e.touches[0].clientX)
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-6">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-[#eb1260]">Ana Sayfa</a>
            <span className="text-gray-400">/</span>
            <a href="/bitkiler" className="text-gray-500 hover:text-[#eb1260]">Bitkiler</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Monstera Deliciosa</span>
          </nav>
        </div>
      </div>

      {/* Ürün Detayı */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 pb-8 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Sol Taraf - Görseller */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Küçük Görseller - Dikey */}
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto md:overflow-x-visible scrollbar-hide pb-2 md:pb-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === index
                      ? 'border-[#eb1260] ring-2 ring-[#eb1260]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            {/* Ana Görsel */}
            <div 
              className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50 order-1 md:order-2 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover pointer-events-none"
                unoptimized
                draggable={false}
              />
              {product.discountedPrice && (
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#059669] text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
                  <span className="md:hidden">%{discountPercentage}</span>
                  <span className="hidden md:inline">%{discountPercentage} İndirim</span>
                </div>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group z-10"
              >
                <FaHeart
                  className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                    isFavorite ? 'text-[#eb1260] fill-current' : 'text-gray-700'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sağ Taraf - Bilgiler */}
          <div className="space-y-4 lg:pl-8">
            {/* Başlık ve Değerlendirme */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-700 font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.reviewCount} değerlendirme)</span>
              </div>
            </div>

            {/* Fiyat */}
            <div className="flex items-center gap-3">
              {product.discountedPrice ? (
                <>
                  <span className="text-3xl md:text-4xl font-bold text-[#eb1260]">
                    {product.discountedPrice} ₺
                  </span>
                  <span className="text-xl md:text-2xl text-gray-500 line-through">
                    {product.price} ₺
                  </span>
                </>
              ) : (
                <span className="text-3xl md:text-4xl font-bold text-gray-900">
                  {product.price} ₺
                </span>
              )}
            </div>

            {/* Kargo Bilgisi */}
            <div className="flex items-center gap-2 text-sm">
              <FaTruck className="text-[#eb1260]" />
              <span className="text-gray-700">
                <span className="font-semibold text-gray-900">{product.shippingDays} gün</span> içinde kargoya verilir
              </span>
            </div>

            {/* Açıklama */}
            <div>
              <p className="text-gray-700 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Özellikler */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Ürün Özellikleri</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-[#eb1260] mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stok Durumu */}
            {product.stock > 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Stokta {product.stock} adet</span>
              </div>
            )}

            {/* Miktar ve Sepete Ekle */}
            <div className="flex gap-4">
              {/* Miktar */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 border-x border-gray-300 text-gray-800 font-medium min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Sepete Ekle */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-[#eb1260] text-white font-semibold rounded-lg hover:bg-[#d10f54] transition-colors shadow-lg hover:shadow-xl"
              >
                Sepete Ekle
              </button>
            </div>

            {/* Güven Rozetleri */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center gap-2">
                <FaTruck className="text-[#eb1260] text-2xl" />
                <span className="text-xs text-gray-600">Aynı Gün Teslimat</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <FaShieldAlt className="text-[#eb1260] text-2xl" />
                <span className="text-xs text-gray-600">Güvenli Alışveriş</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <FaUndo className="text-[#eb1260] text-2xl" />
                <span className="text-xs text-gray-600">Kolay İade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bakım Talimatları */}
        <div className="mt-12 p-6 bg-pink-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Bakım Talimatları</h3>
          <p className="text-gray-700 leading-relaxed">
            {product.careInstructions}
          </p>
        </div>

        {/* Benzer Ürünler */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
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
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scrollbar gizleme CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default ProductDetail

