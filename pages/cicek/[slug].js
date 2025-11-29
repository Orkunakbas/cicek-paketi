import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Head from 'next/head'
import Image from 'next/image'
import { FaStar, FaStarHalfAlt, FaHeart, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa'
import Product from '@/components/product/Product'
import UrunDegerlendirmeleri from '@/components/urundegerlendirmeleri/UrunDegerlendirmeleri'
import { addToCart, openCart, getCart } from '@/store/slices/cartSlice'
import monsterraImage from '@/images/urunler/monsterra.jpg'
import monsterra2Image from '@/images/urunler/monsterra-2.jpg'
import monsterra3Image from '@/images/urunler/monsterra-3.jpg'

const ProductDetail = ({ productData, similarProducts, reviews, reviewStats, error }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { slug } = router.query

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Hata durumu
  if (error) {
    return (
      <>
        <Head>
          <title>Bir Hata Oluştu | Çiçek Paketi</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bir hata oluştu</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </>
    )
  }

  // Ürün verisi yoksa
  if (!productData) {
    return (
      <>
        <Head>
          <title>Ürün Bulunamadı | Çiçek Paketi</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ürün bulunamadı</h1>
            <p className="text-gray-600">Aradığınız ürün mevcut değil.</p>
          </div>
        </div>
      </>
    )
  }

  // API verisinden ürün bilgilerini hazırla
  const variant = productData.variants?.[0] || {}
  const hasDiscount = variant.discount_price !== null && variant.discount_price !== undefined
  const price = variant.price || 0
  const discountPrice = variant.discount_price || 0
  const discountPercentage = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0
  
  // Görseller
  const productImages = productData.images || []
  const fallbackImages = [monsterraImage, monsterra2Image, monsterra3Image]
  
  // Ürün özelliklerini parse et (\r\n ile ayrılmış string)
  const productFeatures = variant.product_features 
    ? variant.product_features.split(/\r\n|\n/).filter(f => f.trim()) 
    : []
  
  // Örnek ürün verisi (API'den gelen verilerle değiştirilecek)
  const product = {
    id: productData.id,
    name: productData.name,
    price: price,
    discountedPrice: hasDiscount ? discountPrice : null,
    rating: reviewStats?.averageRating || 0,
    reviewCount: reviewStats?.totalReviews || 0,
    stock: variant.stock_quantity || 0,
    shippingDays: 2,
    images: productImages.length > 0 
      ? productImages.map(img => `${process.env.NEXT_PUBLIC_API_URL}/${img.image_url}`) 
      : fallbackImages,
    description: productData.short_description || '', // Kısa açıklama yukarıda
    features: productFeatures,
    careInstructions: productData.description || '', // Uzun açıklama bakım talimatlarında
    tags: productData.tags ? productData.tags.split(',').map(t => t.trim()) : []
  }

  const handleAddToCart = async () => {
    if (isAddingToCart) return // Çift tıklamayı engelle
    
    setIsAddingToCart(true)
    
    try {
      const cartData = {
        product_id: productData.id,
        variant_id: variant.id, // İlk varyant
        quantity: quantity
      }
      
      console.log('🚀 Frontend - Sepete Ekleniyor:', cartData)
      
      // Redux ile sepete ekle
      await dispatch(addToCart(cartData)).unwrap()

      console.log('✅ Ürün sepete eklendi!')
      
      // Sepeti güncelle ve aç
      await dispatch(getCart())
      dispatch(openCart())
      
    } catch (error) {
      console.error('❌ Sepete ekleme hatası:', error)
      alert('Sepete eklenirken bir hata oluştu: ' + error)
    } finally {
      setIsAddingToCart(false)
    }
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
    <>
      {/* SEO Meta Tags */}
      <Head>
        {/* Temel Meta Tags */}
        <title>{product.name} | Çiçek Paketi</title>
        <meta name="description" content={product.description || `${product.name} - Çiçek Paketi'nden online sipariş verin.`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description || `${product.name} - Çiçek Paketi'nden online sipariş verin.`} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_API_URL}/cicek/${slug}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description || `${product.name} - Çiçek Paketi'nden online sipariş verin.`} />
        <meta name="twitter:image" content={product.images[0]} />
        
        {/* Fiyat Bilgisi */}
        <meta property="product:price:amount" content={product.discountedPrice || product.price} />
        <meta property="product:price:currency" content="TRY" />
        
        {/* Stok Durumu */}
        <meta property="product:availability" content={product.stock > 0 ? "in stock" : "out of stock"} />
        
        {/* Rating */}
        {product.reviewCount > 0 && (
          <>
            <meta property="product:rating:average" content={product.rating.toFixed(1)} />
            <meta property="product:rating:count" content={product.reviewCount} />
          </>
        )}
      </Head>

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
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#059669] text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg z-10">
                  %{discountPercentage}
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
          <div className="space-y-4 lg:pl-8 lg:max-w-[600px]">
            {/* Başlık ve Değerlendirme */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.reviewCount > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rating = product.rating;
                      const fillPercentage = Math.max(0, Math.min(100, (rating - i) * 100));
                      
                      if (fillPercentage >= 100) {
                        // Tam dolu yıldız
                        return (
                          <FaStar
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        );
                      } else if (fillPercentage > 0) {
                        // Kısmi dolu yıldız - gradient ile
                        return (
                          <div key={i} className="relative w-5 h-5">
                            <FaStar className="w-5 h-5 text-gray-300 fill-current absolute" />
                            <div 
                              className="overflow-hidden absolute top-0 left-0 h-full"
                              style={{ width: `${fillPercentage}%` }}
                            >
                              <FaStar className="w-5 h-5 text-yellow-400 fill-current" />
                            </div>
                          </div>
                        );
                      } else {
                        // Boş yıldız
                        return (
                          <FaStar
                            key={i}
                            className="w-5 h-5 text-gray-300 fill-current"
                          />
                        );
                      }
                    })}
                  </div>
                  <span className="text-gray-700 font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({product.reviewCount} değerlendirme)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <FaStar className="w-5 h-5 text-gray-300" />
                  <span className="text-sm">Henüz değerlendirme yapılmamış</span>
                </div>
              )}
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
                <span className="text-3xl md:text-4xl font-bold text-[#eb1260]">
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
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1 py-3 px-6 bg-[#eb1260] text-white font-semibold rounded-lg hover:bg-[#d10f54] transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? 'Ekleniyor...' : product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
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

        {/* Açıklama */}
        <div className="mt-12 p-6 bg-pink-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Açıklama</h3>
          <p className="text-gray-700 leading-relaxed">
            {product.careInstructions}
          </p>
        </div>

        {/* Benzer Ürünler */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {similarProducts.map((product) => {
                const productUrl = `/cicek/${product.slug}`
                const imageUrl = product.coverImage 
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${product.coverImage}` 
                  : monsterraImage
                
                // İndirimli fiyatları kontrol et
                let minDiscountPrice = null
                let maxDiscountPrice = null
                
                if (product.variants && product.variants.length > 0) {
                  const discountPrices = product.variants
                    .map(v => v.discount_price)
                    .filter(price => price !== null && price !== undefined && price > 0)
                  
                  if (discountPrices.length > 0) {
                    minDiscountPrice = Math.min(...discountPrices)
                    maxDiscountPrice = Math.max(...discountPrices)
                  }
                }
                
                return (
                  <Product
                    key={product.id}
                    id={product.id}
                    urun_adi={product.name}
                    urun_aciklama={product.short_description}
                    minPrice={product.minPrice}
                    maxPrice={product.maxPrice}
                    minDiscountPrice={minDiscountPrice}
                    maxDiscountPrice={maxDiscountPrice}
                    kapak={imageUrl}
                    url={productUrl}
                    tag={product.tags ? product.tags.split(',').map(t => t.trim()) : []}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Ürün Değerlendirmeleri */}
        <UrunDegerlendirmeleri
          reviews={reviews || []}
          productId={productData.id}
          averageRating={reviewStats?.averageRating || 0}
          totalReviews={reviewStats?.totalReviews || 0}
        />
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
    </>
  )
}

// Server-Side Rendering
export async function getServerSideProps(context) {
  const { slug } = context.params

  // API URL'i oluştur
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/detail/${slug}`
  
  console.log('🔍 Fetching product detail from:', apiUrl)
  console.log('📂 Product Slug:', slug)

  try {
    const response = await fetch(apiUrl)
    
    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText)
      return {
        props: {
          productData: null,
          similarProducts: [],
          reviews: [],
          reviewStats: null,
          error: 'Ürün detayları yüklenirken bir hata oluştu'
        }
      }
    }

    const data = await response.json()
    console.log('✅ Product detail fetched successfully')
    console.log('📋 Product Name:', data.data?.name || 'N/A')

    // Benzer ürünler için ilk kategori URL'ini al
    let similarProducts = []
    if (data.data?.categories && data.data.categories.length > 0) {
      const firstCategoryUrl = data.data.categories[0].url
      console.log('🔍 Fetching similar products from category:', firstCategoryUrl)
      
      try {
        const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${firstCategoryUrl}`)
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          const allProducts = categoryData.data || []
          
          // Mevcut ürünü hariç tut ve random 5 ürün seç
          const filtered = allProducts.filter(p => p.id !== data.data.id)
          const shuffled = filtered.sort(() => 0.5 - Math.random())
          similarProducts = shuffled.slice(0, 5)
          
          console.log('✅ Similar products fetched:', similarProducts.length)
        }
      } catch (err) {
        console.log('⚠️ Could not fetch similar products:', err.message)
      }
    }

    // Ürün yorumlarını fetch et
    let reviews = []
    let reviewStats = null
    if (data.data?.id) {
      console.log('🔍 Fetching product reviews for product ID:', data.data.id)
      
      try {
        const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${data.data.id}`)
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          console.log('📦 Reviews Response:', JSON.stringify(reviewsData).substring(0, 200))
          
          // API response formatı: { success: true, data: { reviews: [...], stats: {...} } }
          if (reviewsData.success && reviewsData.data) {
            reviews = Array.isArray(reviewsData.data.reviews) ? reviewsData.data.reviews : []
            
            // Stats API'den geliyor
            if (reviewsData.data.stats) {
              const avgRating = parseFloat(reviewsData.data.stats.avgRating) || 0
              const total = parseInt(reviewsData.data.stats.total) || 0
              reviewStats = {
                averageRating: avgRating,
                totalReviews: total
              }
              console.log('📊 Parsed Stats - Average:', avgRating, 'Total:', total)
            }
          }
          
          console.log('✅ Product reviews fetched:', reviews.length)
          if (reviewStats) {
            console.log('📊 Review Stats:', reviewStats)
          }
        }
      } catch (err) {
        console.log('⚠️ Could not fetch product reviews:', err.message)
      }
    }

    return {
      props: {
        productData: data.data || null,
        similarProducts: similarProducts,
        reviews: reviews,
        reviewStats: reviewStats,
        error: null
      }
    }
  } catch (error) {
    console.error('❌ Error fetching product detail:', error)
    return {
      props: {
        productData: null,
        similarProducts: [],
        reviews: [],
        reviewStats: null,
        error: 'Sunucu hatası oluştu'
      }
    }
  }
}

export default ProductDetail

