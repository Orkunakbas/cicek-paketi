'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import monsterraImage from '@/images/urunler/monsterra.jpg'

const Stories = () => {
  const scrollContainerRef = useRef(null)

  const stories = [
    { id: 1, title: 'İndirimli Çiçekler', image: monsterraImage, link: '/indirimli-cicekler' },
    { id: 2, title: 'Yeni Gelenler', image: monsterraImage, link: '/yeni-gelenler' },
    { id: 3, title: 'Yeni Bebek', image: monsterraImage, link: '/yeni-bebek' },
    { id: 4, title: 'Geçmiş Olsun', image: monsterraImage, link: '/gecmis-olsun' },
    { id: 5, title: 'İsteme Çiçeği', image: monsterraImage, link: '/isteme-cicegi' },
    { id: 6, title: 'Doğum Günü', image: monsterraImage, link: '/dogum-gunu' },
    { id: 7, title: 'Yıl Dönümü', image: monsterraImage, link: '/yil-donumu' },
    { id: 8, title: 'Premium Çiçekler', image: monsterraImage, link: '/premium-cicekler' },
    { id: 9, title: 'Saksılar', image: monsterraImage, link: '/saksilar' },
    { id: 10, title: 'Kaktüs & Sukulent', image: monsterraImage, link: '/kaktus-sukulent' },
  ]

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative w-full bg-gradient-to-b from-pink-50/20 via-white to-white pt-4 pb-8 md:pt-6 md:pb-12">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6">
        <div className="relative group">
          {/* Sol Ok */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-3 md:-translate-x-4 z-10 w-9 h-9 md:w-11 md:h-11 bg-white border border-pink-200 rounded-full shadow-md flex items-center justify-center text-[#eb1260] hover:bg-[#eb1260] hover:text-white hover:border-[#eb1260] transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Sola Kaydır"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Stories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 md:gap-7 overflow-x-auto scrollbar-hide scroll-smooth px-6 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story) => (
              <Link
                key={story.id}
                href={story.link}
                className="flex flex-col items-center gap-2.5 flex-shrink-0 group/item"
              >
                {/* Story Circle */}
                <div className="relative">
                  {/* Outer Decorative Glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200/40 via-pink-100/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur-md scale-110"></div>
                  
                  {/* Main Border Ring */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-[2px] bg-gradient-to-br from-pink-200/60 via-pink-100/50 to-pink-50/40 group-hover/item:from-[#eb1260]/70 group-hover/item:via-[#ff6b9d]/60 group-hover/item:to-pink-300/50 group-hover/item:shadow-lg transition-all duration-300">
                    {/* White Ring */}
                    <div className="w-full h-full rounded-full bg-white p-[2.5px]">
                      {/* Image Container */}
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {/* Subtle Overlay on Hover */}
                        <div className="absolute inset-0 bg-[#eb1260]/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Title */}
                <span className="text-xs md:text-sm font-medium text-gray-700 text-center max-w-[90px] md:max-w-[100px] leading-tight group-hover/item:text-[#eb1260] transition-colors duration-300">
                  {story.title}
                </span>
              </Link>
            ))}
          </div>

          {/* Sağ Ok */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-3 md:translate-x-4 z-10 w-9 h-9 md:w-11 md:h-11 bg-white border border-pink-200 rounded-full shadow-md flex items-center justify-center text-[#eb1260] hover:bg-[#eb1260] hover:text-white hover:border-[#eb1260] transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Sağa Kaydır"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Stories
