import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Banner = ({ 
  title, 
  subtitle, 
  buttonText, 
  buttonLink, 
  image, 
  bgColor = 'bg-gradient-to-br from-pink-50 to-pink-100',
  textColor = 'text-gray-900',
  accentColor = '#eb1260'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl md:rounded-2xl ${bgColor} shadow-lg hover:shadow-xl transition-shadow duration-300 group`}>
      <div className="flex flex-row md:flex-row items-center justify-between p-5 md:p-12 gap-3 md:gap-6">
        {/* Sol Taraf - Metin İçeriği */}
        <div className="flex-1 z-10 text-left">
          <h2 className={`text-lg md:text-4xl font-bold ${textColor} mb-2 md:mb-3 group-hover:scale-105 transition-transform duration-300 origin-left leading-tight`}>
            {title}
          </h2>
          <p className="text-gray-600 text-xs md:text-lg mb-3 md:mb-6 max-w-md line-clamp-2 md:line-clamp-none">
            {subtitle}
          </p>
          <Link 
            href={buttonLink}
            className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-8 md:py-3.5 rounded-full font-semibold text-white text-xs md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            <span>{buttonText}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Sağ Taraf - Görsel */}
        <div className="relative w-32 h-32 md:w-80 md:h-80 flex-shrink-0">
          <div className="absolute inset-0 bg-white/30 rounded-xl md:rounded-2xl backdrop-blur-sm"></div>
          <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          
          {/* Dekoratif Elementler - sadece desktop */}
          <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
          <div className="hidden md:block absolute -bottom-4 -left-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Arka Plan Dekoratif Pattern - sadece desktop */}
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.4,76.1C27,83.2,13.5,84.8,-0.3,85.4C-14.1,86,-28.2,85.6,-41.2,78.8C-54.2,72,-66.1,58.8,-73.8,43.8C-81.5,28.8,-85,12,-84.2,-4.5C-83.4,-21,-78.3,-42,-68.8,-58.4C-59.3,-74.8,-45.4,-86.6,-30.2,-93.1C-15,-99.6,0.5,-100.8,14.8,-96.3C29.1,-91.8,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>
  )
}

export default Banner
