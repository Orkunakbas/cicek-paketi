import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Select, SelectItem, Button } from '@heroui/react'
import { FaStar, FaTruck, FaLock, FaSmile, FaFilter } from 'react-icons/fa'
import Product from '@/components/product/Product'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const DynamicPage = ({ products, category: apiCategory, error }) => {
  const router = useRouter()
  const { slug } = router.query
  
  // Filtre state'leri
  const [sortBy, setSortBy] = useState('recommended')
  const [priceRange, setPriceRange] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [rating, setRating] = useState('all')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  
  // Tüm etiketleri topla
  const allTags = React.useMemo(() => {
    if (!products || products.length === 0) return []
    const tagsSet = new Set()
    products.forEach(product => {
      if (product.tags) {
        product.tags.split(',').forEach(tag => {
          const trimmedTag = tag.trim()
          if (trimmedTag) tagsSet.add(trimmedTag)
        })
      }
    })
    return Array.from(tagsSet)
  }, [products])
  
  // Filtrelenmiş ve sıralanmış ürünler
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = [...(products || [])]
    
    // Etiket filtresi
    if (selectedTag !== 'all') {
      filtered = filtered.filter(product => {
        if (!product.tags) return false
        const productTags = product.tags.split(',').map(t => t.trim())
        return productTags.includes(selectedTag)
      })
    }
    
    // Fiyat aralığı filtresi
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.minPrice
        if (priceRange === '0-400') return price >= 0 && price <= 400
        if (priceRange === '400-600') return price >= 400 && price <= 600
        if (priceRange === '600-800') return price >= 600 && price <= 800
        if (priceRange === '800-1000') return price >= 800 && price <= 1000
        if (priceRange === '1000-1500') return price >= 1000 && price <= 1500
        if (priceRange === '1500-3000') return price >= 1500 && price <= 3000
        if (priceRange === '3000+') return price >= 3000
        return true
      })
    }
    
    // Sıralama
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.minPrice - b.minPrice)
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.minPrice - a.minPrice)
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    }
    
    return filtered
  }, [products, selectedTag, priceRange, sortBy])
  
  // Filtre aktif mi kontrolü
  const hasActiveFilters = selectedTag !== 'all' || priceRange !== 'all' || sortBy !== 'recommended'
  
  // Filtreleri temizle
  const clearFilters = () => {
    setSelectedTag('all')
    setPriceRange('all')
    setSortBy('recommended')
  }

  // slug array'den kategori ve alt kategoriyi al
  const category = slug?.[0]
  const subcategory = slug?.[1]

  // Başlık çevirme fonksiyonu
  const getTitle = (key) => {
    const titles = {
      // Ana kategoriler
      'premium-cicekler': 'Premium Çiçekler',
      'saksilar': 'Saksılar',
      'bitki-bakim-malzemeleri': 'Bitki Bakım Malzemeleri',
      'yilbasi-koleksiyonu': 'Yılbaşı Koleksiyonu',
      'cicek-turleri': 'Çiçek Türleri',
      'ozel-gunler': 'Özel Günler',
      'bitkiler': 'Bitkiler',
      // Alt kategoriler - Çiçek Türleri
      'guller': 'Güller',
      'orkideler': 'Orkideler',
      'papatyalar': 'Papatyalar',
      'buketler': 'Buketler',
      'aranjmanlar': 'Aranjmanlar',
      'saksi-cicekleri': 'Saksı Çiçekleri',
      // Alt kategoriler - Özel Günler
      'dogum-gunu': 'Doğum Günü',
      'yildonumu': 'Yıldönümü',
      'sevgililer-gunu': 'Sevgililer Günü',
      'anneler-gunu': 'Anneler Günü',
      'gecmis-olsun': 'Geçmiş Olsun',
      'taziye': 'Taziye',
      // Alt kategoriler - Bitkiler
      'sukulentler': 'Sukulentler',
      'kaktusler': 'Kaktüsler',
      'ic-mekan': 'İç Mekan Bitkileri',
      'ofis-bitkileri': 'Ofis Bitkileri',
      'bakimi-kolay': 'Bakımı Kolay'
    }
    return titles[key] || key
  }

  // Açıklama metni
  const getDescription = (cat, subcat) => {
    if (subcat) {
      return `En taze ve kaliteli ${getTitle(subcat).toLowerCase()} çeşitlerimizi keşfedin. Aynı gün teslimat ile sevdiklerinize özel anlar yaşatın.`
    }
    
    const descriptions = {
      'premium-cicekler': 'Özel günleriniz için seçkin ve lüks çiçek koleksiyonumuz. En kaliteli çiçeklerle sevdiklerinizi mutlu edin.',
      'saksilar': 'Evinize ve bahçenize renk katacak şık saksı modelleri. Her tarza uygun geniş ürün yelpazesi.',
      'bitki-bakim-malzemeleri': 'Bitkilerinizin sağlıklı büyümesi için ihtiyaç duyduğunuz tüm bakım ürünleri.',
      'yilbasi-koleksiyonu': 'Yılbaşı havasını evinize taşıyacak özel çiçek ve bitki koleksiyonu.',
      'cicek-turleri': 'Her zevke uygun geniş çiçek çeşitlerimizi keşfedin.',
      'ozel-gunler': 'Özel günleriniz için anlamlı çiçek seçenekleri.',
      'bitkiler': 'İç ve dış mekan için ideal bitki çeşitleri.'
    }
    return descriptions[cat] || 'En taze ve kaliteli ürünlerimizi keşfedin.'
  }

  // API'den gelen kategori bilgisi varsa onu kullan, yoksa fallback
  const pageTitle = apiCategory?.name || (subcategory ? getTitle(subcategory) : getTitle(category))
  const pageDescription = apiCategory?.description || getDescription(category, subcategory)

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

  // SEO için kapak resmi
  const categoryImage = products && products.length > 0 && products[0].coverImage
    ? `${process.env.NEXT_PUBLIC_API_URL}/${products[0].coverImage}`
    : `${process.env.NEXT_PUBLIC_API_URL}/images/default-category.jpg`

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        {/* Temel Meta Tags */}
        <title>{pageTitle} | Çiçek Paketi</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${pageTitle} | Çiçek Paketi`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={categoryImage} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_API_URL}/${slug?.join('/')}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pageTitle} | Çiçek Paketi`} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={categoryImage} />
        
        {/* Kategori Bilgisi */}
        {products && products.length > 0 && (
          <meta property="product:count" content={products.length} />
        )}
      </Head>

      <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-6">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-[#eb1260]">Ana Sayfa</a>
            <span className="text-gray-400">/</span>
            <a href={`/${category}`} className="text-gray-500 hover:text-[#eb1260]">
              {getTitle(category)}
            </a>
            {subcategory && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">{getTitle(subcategory)}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Sayfa İçeriği */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 pb-8 md:pb-12">
        {/* Başlık ve Açıklama */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {pageTitle}
          </h1>
          <p className="text-gray-600 max-w-3xl">
            {pageDescription}
          </p>
        </div>

        {/* Filtreler */}
        <div className="mb-8">
          {/* Mobil Filtre Butonu ve Ürün Sayısı */}
          <div className="flex md:hidden items-center justify-between mb-4">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#eb1260] hover:text-[#eb1260] transition-colors"
            >
              <FaFilter className="text-sm" />
              <span className="font-medium">Filtrele</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-base text-gray-900">{filteredAndSortedProducts?.length || 0}</span> ürün bulundu
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#eb1260] hover:text-[#d10f54] font-medium underline"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filtreler */}
          <div className="hidden md:flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            {/* Filtreler */}
            <div className="flex flex-wrap gap-4">
              {/* Etikete Göre */}
              <div className="w-48">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Etikete Göre</label>
                <Select
                  selectedKeys={[selectedTag]}
                  onSelectionChange={(keys) => setSelectedTag(Array.from(keys)[0])}
                  placeholder="Etiket seçin"
                  className="w-full"
                  classNames={{
                    trigger: "border-gray-300 hover:border-[#eb1260]",
                  }}
                >
                  <SelectItem key="all">Tümü</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag}>{tag}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Fiyat Aralığı */}
              <div className="w-48">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Fiyat Aralığı</label>
                <Select
                  selectedKeys={[priceRange]}
                  onSelectionChange={(keys) => setPriceRange(Array.from(keys)[0])}
                  placeholder="Fiyat seçin"
                  className="w-full"
                  classNames={{
                    trigger: "border-gray-300 hover:border-[#eb1260]",
                  }}
                >
                  <SelectItem key="all">Tümü</SelectItem>
                  <SelectItem key="0-400">0₺ - 400₺</SelectItem>
                  <SelectItem key="400-600">400₺ - 600₺</SelectItem>
                  <SelectItem key="600-800">600₺ - 800₺</SelectItem>
                  <SelectItem key="800-1000">800₺ - 1000₺</SelectItem>
                  <SelectItem key="1000-1500">1000₺ - 1500₺</SelectItem>
                  <SelectItem key="1500-3000">1500₺ - 3000₺</SelectItem>
                  <SelectItem key="3000+">3000₺ ve üzeri</SelectItem>
                </Select>
              </div>

              {/* Puana Göre */}
              <div className="w-56">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Puana Göre</label>
                <Select
                  selectedKeys={[rating]}
                  onSelectionChange={(keys) => setRating(Array.from(keys)[0])}
                  placeholder="Puan seçin"
                  className="w-full"
                  classNames={{
                    trigger: "border-gray-300 hover:border-[#eb1260]",
                  }}
                  renderValue={(items) => {
                    return items.map((item) => {
                      if (item.key === "all") return "Tümü"
                      const stars = parseInt(item.key)
                      return (
                        <div key={item.key} className="flex items-center gap-1">
                          {[...Array(stars)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 text-sm" />
                          ))}
                          <span className="ml-1">({stars} yıldız{stars < 5 ? " ve üzeri" : ""})</span>
                        </div>
                      )
                    })
                  }}
                >
                  <SelectItem key="all" textValue="Tümü">
                    Tümü
                  </SelectItem>
                  <SelectItem key="5" textValue="5 yıldız">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                      <span className="ml-1">(5 yıldız)</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="4" textValue="4 yıldız ve üzeri">
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                      <span className="ml-1">(4 yıldız ve üzeri)</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="3" textValue="3 yıldız ve üzeri">
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                      <span className="ml-1">(3 yıldız ve üzeri)</span>
                    </div>
                  </SelectItem>
                </Select>
              </div>

              {/* Sıralama */}
              <div className="w-56">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sıralama</label>
                <Select
                  selectedKeys={[sortBy]}
                  onSelectionChange={(keys) => setSortBy(Array.from(keys)[0])}
                  placeholder="Sıralama seçin"
                  className="w-full"
                  classNames={{
                    trigger: "border-gray-300 hover:border-[#eb1260]",
                  }}
                >
                  <SelectItem key="recommended">Önerilen</SelectItem>
                  <SelectItem key="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
                  <SelectItem key="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                  <SelectItem key="newest">En Yeni</SelectItem>
                  <SelectItem key="popular">En Popüler</SelectItem>
                </Select>
              </div>

              {/* Filtreleri Temizle Butonu */}
              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    onClick={clearFilters}
                    color="primary"
                    style={{ backgroundColor: '#eb1260' }}
                    className="font-medium"
                  >
                    Filtreleri Temizle
                  </Button>
                </div>
              )}
            </div>

            {/* Sonuç Sayısı */}
            <div className="ml-auto">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-base text-gray-900">{filteredAndSortedProducts?.length || 0}</span> ürün bulundu
              </div>
            </div>
          </div>

          {/* Güven Kartları */}
          <div className="mt-6 mb-6 bg-gradient-to-r from-pink-50 via-pink-100 to-pink-50 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:justify-around md:items-center md:gap-6">
              {/* Her Gün Aynı Gün Teslimat */}
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <FaTruck className="text-[#eb1260] text-lg md:text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm leading-tight">Her Gün Aynı Gün Teslimat</p>
                </div>
              </div>

              {/* Güvenli Alışveriş */}
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <FaLock className="text-[#eb1260] text-lg md:text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm leading-tight">Güvenli Alışveriş</p>
                </div>
              </div>

              {/* Yüksek Müşteri Memnuniyeti */}
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                  <FaSmile className="text-[#eb1260] text-lg md:text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs md:text-sm leading-tight">Yüksek Müşteri Memnuniyeti</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobil Filtre Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFilterModalOpen(false)}
            ></div>

            {/* Modal */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filtrele</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filtreler */}
              <div className="space-y-6">
                {/* Etikete Göre */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Etikete Göre</label>
                  <Select
                    selectedKeys={[selectedTag]}
                    onSelectionChange={(keys) => setSelectedTag(Array.from(keys)[0])}
                    placeholder="Etiket seçin"
                    className="w-full"
                    classNames={{
                      trigger: "border-gray-300 hover:border-[#eb1260]",
                    }}
                  >
                    <SelectItem key="all">Tümü</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag}>{tag}</SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Fiyat Aralığı */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Fiyat Aralığı</label>
                  <Select
                    selectedKeys={[priceRange]}
                    onSelectionChange={(keys) => setPriceRange(Array.from(keys)[0])}
                    placeholder="Fiyat seçin"
                    className="w-full"
                    classNames={{
                      trigger: "border-gray-300 hover:border-[#eb1260]",
                    }}
                  >
                    <SelectItem key="all">Tümü</SelectItem>
                    <SelectItem key="0-400">0₺ - 400₺</SelectItem>
                    <SelectItem key="400-600">400₺ - 600₺</SelectItem>
                    <SelectItem key="600-800">600₺ - 800₺</SelectItem>
                    <SelectItem key="800-1000">800₺ - 1000₺</SelectItem>
                    <SelectItem key="1000-1500">1000₺ - 1500₺</SelectItem>
                    <SelectItem key="1500-3000">1500₺ - 3000₺</SelectItem>
                    <SelectItem key="3000+">3000₺ ve üzeri</SelectItem>
                  </Select>
                </div>

                {/* Puana Göre */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Puana Göre</label>
                  <Select
                    selectedKeys={[rating]}
                    onSelectionChange={(keys) => setRating(Array.from(keys)[0])}
                    placeholder="Puan seçin"
                    className="w-full"
                    classNames={{
                      trigger: "border-gray-300 hover:border-[#eb1260]",
                    }}
                    renderValue={(items) => {
                      return items.map((item) => {
                        if (item.key === "all") return "Tümü"
                        const stars = parseInt(item.key)
                        return (
                          <div key={item.key} className="flex items-center gap-1">
                            {[...Array(stars)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-sm" />
                            ))}
                            <span className="ml-1">({stars} yıldız{stars < 5 ? " ve üzeri" : ""})</span>
                          </div>
                        )
                      })
                    }}
                  >
                    <SelectItem key="all" textValue="Tümü">
                      Tümü
                    </SelectItem>
                    <SelectItem key="5" textValue="5 yıldız">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                        <span className="ml-1">(5 yıldız)</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="4" textValue="4 yıldız ve üzeri">
                      <div className="flex items-center gap-1">
                        {[...Array(4)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                        <span className="ml-1">(4 yıldız ve üzeri)</span>
                      </div>
                    </SelectItem>
                    <SelectItem key="3" textValue="3 yıldız ve üzeri">
                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                        <span className="ml-1">(3 yıldız ve üzeri)</span>
                      </div>
                    </SelectItem>
                  </Select>
                </div>

                {/* Sıralama */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sıralama</label>
                  <Select
                    selectedKeys={[sortBy]}
                    onSelectionChange={(keys) => setSortBy(Array.from(keys)[0])}
                    placeholder="Sıralama seçin"
                    className="w-full"
                    classNames={{
                      trigger: "border-gray-300 hover:border-[#eb1260]",
                    }}
                  >
                    <SelectItem key="recommended">Önerilen</SelectItem>
                    <SelectItem key="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
                    <SelectItem key="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                    <SelectItem key="newest">En Yeni</SelectItem>
                    <SelectItem key="popular">En Popüler</SelectItem>
                  </Select>
                </div>
              </div>

              {/* Uygula Butonu */}
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-full mt-6 py-3 bg-[#eb1260] text-white font-semibold rounded-lg hover:bg-[#d10f54] transition-colors"
              >
                Filtreleri Uygula
              </button>
            </div>
          </div>
        )}

               {/* Ürün Grid */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => {
              // Tüm ürünler detay sayfasına gitsin
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
                  avgRating={product.avgRating || 0}
                  reviewCount={product.reviewCount || 0}
                />
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Bu kategoride henüz ürün bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}

// Server-Side Rendering
export async function getServerSideProps(context) {
  const { slug } = context.params
  const categoryUrl = Array.isArray(slug) ? slug.join('/') : slug

  // API URL'i oluştur
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/${categoryUrl}`
  
  console.log('🔍 Fetching products from:', apiUrl)
  console.log('📂 Category URL:', categoryUrl)

  try {
    const response = await fetch(apiUrl)
    
    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText)
      return {
        props: {
          products: [],
          category: null,
          error: 'Ürünler yüklenirken bir hata oluştu'
        }
      }
    }

    const data = await response.json()
    console.log('✅ Products fetched:', data.data?.length || 0, 'ürün')
    console.log('📋 Category:', data.category?.name || 'N/A')

    return {
      props: {
        products: data.data || [],
        category: data.category || null,
        error: null
      }
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return {
      props: {
        products: [],
        category: null,
        error: 'Sunucu hatası oluştu'
      }
    }
  }
}

export default DynamicPage

