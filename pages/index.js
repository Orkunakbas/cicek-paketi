import Stories from '@/components/stories/Stories'
import Banner from '@/components/banner/Banner'
import Product from '@/components/product/Product'
import HomeStory from '@/components/homestory/HomeStory'
import SeoDescription from '@/components/seodescription/SeoDescription'
import React from 'react'
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

  return (
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
  )
}

export default Index