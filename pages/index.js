import Stories from '@/components/stories/Stories'
import Banner from '@/components/banner/Banner'
import Product from '@/components/product/Product'
import SeoDescription from '@/components/seodescription/SeoDescription'
import React from 'react'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const Index = () => {
  return (
    <div>
      <Stories />

      {/* Banner Bölümü */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 pt-0 pb-8 md:pt-0 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Banner 1 */}
          <Banner
            title="Yeni Sezon Çiçekleri"
            subtitle="Taze ve özel çiçeklerle sevdiklerinizi mutlu edin. %30'a varan indirimler!"
            buttonText="Hemen Keşfet"
            buttonLink="/yeni-sezon"
            image={monsterraImage}
            bgColor="bg-gradient-to-br from-pink-50 to-pink-100"
            accentColor="#eb1260"
          />

          {/* Banner 2 */}
          <Banner
            title="Premium Çiçekler"
            subtitle="Evinize doğal güzellik katın. Özel bakım rehberi hediye!"
            buttonText="İncele"
            buttonLink="/premium-cicekler"
            image={monsterraImage}
            bgColor="bg-gradient-to-br from-green-50 to-emerald-100"
            accentColor="#059669"
          />

          {/* Banner 3 - Mor */}
          <Banner
            title="Orkide Koleksiyonu"
            subtitle="Zarafet ve inceliğin simgesi orkidelerle özel anlarınızı süsleyin!"
            buttonText="Koleksiyonu Gör"
            buttonLink="/orkide-koleksiyonu"
            image={monsterraImage}
            bgColor="bg-gradient-to-br from-purple-50 to-violet-100"
            accentColor="#9333ea"
          />

          {/* Banner 4 - Sarı */}
          <Banner
            title="İç Mekan Bitkileri"
            subtitle="Evinizi yeşille buluşturun. Sağlıklı ve bakımı kolay bitkiler!"
            buttonText="Keşfet"
            buttonLink="/ic-mekan-bitkileri"
            image={monsterraImage}
            bgColor="bg-gradient-to-br from-yellow-50 to-amber-100"
            accentColor="#f59e0b"
          />
        </div>
      </div>

      {/* Ürünler Bölümü */}
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Başlık */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-[#eb1260]"></div>
            <span className="text-sm font-medium text-[#eb1260] uppercase tracking-wider">En Çok Tercih Edilenler</span>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-[#eb1260]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Popüler Ürünler</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Müşterilerimizin en çok beğendiği ve tercih ettiği taze çiçek ve bitkilerimizi keşfedin</p>
        </div>

        {/* Ürün Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
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

      {/* SEO Açıklama Bölümü */}
      <SeoDescription />
    </div>
  )
}

export default Index