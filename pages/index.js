import Stories from '@/components/stories/Stories'
import Banner from '@/components/banner/Banner'
import Product from '@/components/product/Product'
import HomeStory from '@/components/homestory/HomeStory'
import SeoDescription from '@/components/seodescription/SeoDescription'
import React from 'react'
import Head from 'next/head'
import { FaSeedling } from 'react-icons/fa'
import monsterraImage from '@/images/urunler/monsterra.jpg'

export async function getServerSideProps() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Parallel data fetching
    const [productsRes, bannersRes] = await Promise.all([
      fetch(`${apiUrl}/api/products/featured`),
      fetch(`${apiUrl}/api/banners/list`)
    ]);

    const featuredProductsData = productsRes.ok ? await productsRes.json() : { success: false, data: [] };
    const bannersData = bannersRes.ok ? await bannersRes.json() : { success: false, data: [] };

    return {
      props: {
        featuredProducts: featuredProductsData.success ? featuredProductsData.data : [],
        banners: bannersData.success ? bannersData.data : []
      }
    }
  } catch (error) {
    console.error("Data fetch error:", error);
    return {
      props: {
        featuredProducts: [],
        banners: []
      }
    }
  }
}

const Index = ({ featuredProducts, banners }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // SEO için kapak resmi (ilk banner veya ilk ürün)
  const seoImage = banners && banners.length > 0 && banners[0].banner_image
    ? `${apiUrl}/${banners[0].banner_image}`
    : (featuredProducts && featuredProducts.length > 0 && featuredProducts[0].coverImage
      ? `${apiUrl}/${featuredProducts[0].coverImage}`
      : `${apiUrl}/images/logo.png`)

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        {/* Temel Meta Tags */}
        <title>Çiçek Paketi - Taze Çiçek ve Bitki Teslimatı | Aynı Gün Teslimat</title>
        <meta name="description" content="En taze çiçekler ve bitkiler Çiçek Paketi'nde! Aynı gün teslimat ile sevdiklerinize özel anlar yaşatın. Güller, orkideler, buketler ve daha fazlası." />
        <meta name="keywords" content="çiçek, çiçek siparişi, online çiçekçi, çiçek gönder, aynı gün teslimat, gül, orkide, buket, bitki, saksı çiçeği, doğum günü çiçeği, sevgililer günü" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Çiçek Paketi - Taze Çiçek ve Bitki Teslimatı" />
        <meta property="og:description" content="En taze çiçekler ve bitkiler Çiçek Paketi'nde! Aynı gün teslimat ile sevdiklerinize özel anlar yaşatın." />
        <meta property="og:image" content={seoImage} />
        <meta property="og:url" content={apiUrl} />
        <meta property="og:site_name" content="Çiçek Paketi" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Çiçek Paketi - Taze Çiçek ve Bitki Teslimatı" />
        <meta name="twitter:description" content="En taze çiçekler ve bitkiler Çiçek Paketi'nde! Aynı gün teslimat ile sevdiklerinize özel anlar yaşatın." />
        <meta name="twitter:image" content={seoImage} />
        
        {/* Mobil */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#eb1260" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical */}
        <link rel="canonical" href={apiUrl} />
        
        {/* Structured Data - Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Çiçek Paketi",
              "image": seoImage,
              "description": "En taze çiçekler ve bitkiler Çiçek Paketi'nde! Aynı gün teslimat ile sevdiklerinize özel anlar yaşatın.",
              "@id": apiUrl,
              "url": apiUrl,
              "telephone": "+90-XXX-XXX-XX-XX",
              "priceRange": "₺₺",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "İstanbul",
                "addressCountry": "TR"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "22:00"
              },
              "sameAs": [
                "https://www.facebook.com/cicekpaketi",
                "https://www.instagram.com/cicekpaketi",
                "https://twitter.com/cicekpaketi"
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Çiçek Paketi",
              "url": apiUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${apiUrl}/arama?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <div>
        <Stories />

      {/* Banner Bölümü */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 pt-0 pb-8 md:pt-0 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {banners && banners.length > 0 ? (
            banners.map((banner) => (
              <Banner
                key={banner.id}
                title={banner.title}
                subtitle={banner.description}
                buttonText={banner.button_text}
                buttonLink={banner.button_link}
                image={banner.banner_image ? `${apiUrl}/${banner.banner_image}` : monsterraImage}
                bgColor={banner.background_color}
                accentColor={banner.button_color}
              />
            ))
          ) : (
            // Fallback if no banners found (optional)
             null
          )}
        </div>
      </div>

      {/* Ürünler Bölümü */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Başlık */}
        <div className="mb-6 flex items-center gap-3">
          <FaSeedling className="text-3xl md:text-4xl text-emerald-600" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popüler Ürünler</h2>
            <p className="text-sm text-gray-600">Müşterilerimizin en çok beğendiği ve tercih ettiği taze çiçek ve bitkilerimizi keşfedin</p>
          </div>
        </div>

        {/* Ürün Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {featuredProducts && featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                urun_adi={product.name}
                urun_aciklama={product.short_description}
                minPrice={product.minPrice}
                maxPrice={product.maxPrice}
                minDiscountPrice={product.minDiscountPrice}
                maxDiscountPrice={product.maxDiscountPrice}
                kapak={product.coverImage ? `${apiUrl}/${product.coverImage}` : monsterraImage}
                url={`/cicek/${product.slug}`}
                tag={product.tags ? product.tags.split(',').map(t => t.trim()) : []}
                avgRating={product.avgRating || 0}
                reviewCount={product.reviewCount || 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Öne çıkan ürün bulunamadı.
            </div>
          )}
        </div>
      </div>

      {/* Video Bölümü */}
      <HomeStory />

      {/* SEO Açıklama Bölümü */}
      <SeoDescription />
      </div>
    </>
  )
}

export default Index