import React, { useState } from 'react'
import Image from 'next/image'
import { FaStar, FaStarHalfAlt, FaCheckCircle, FaThumbsUp, FaTimes } from 'react-icons/fa'

const UrunDegerlendirmeleri = ({ reviews = [], productId, averageRating = 0, totalReviews = 0 }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  // Reviews'u array'e çevir (eğer değilse)
  const reviewsArray = Array.isArray(reviews) ? reviews : []
  
  // Yıldız dağılımını hesapla
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviewsArray.filter(r => r.rating === star).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { star, count, percentage }
  })

  // Tarih formatlama
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Yıldız render
  const renderStars = (rating, size = "w-4 h-4") => {
    return [...Array(5)].map((_, i) => {
      const fillPercentage = Math.max(0, Math.min(100, (rating - i) * 100));
      
      if (fillPercentage >= 100) {
        // Tam dolu yıldız
        return (
          <FaStar
            key={i}
            className={`${size} text-yellow-400 fill-current`}
          />
        );
      } else if (fillPercentage > 0) {
        // Kısmi dolu yıldız - gradient ile
        return (
          <div key={i} className={`relative ${size}`}>
            <FaStar className={`${size} text-gray-300 fill-current absolute`} />
            <div 
              className="overflow-hidden absolute top-0 left-0 h-full"
              style={{ width: `${fillPercentage}%` }}
            >
              <FaStar className={`${size} text-yellow-400 fill-current`} />
            </div>
          </div>
        );
      } else {
        // Boş yıldız
        return (
          <FaStar
            key={i}
            className={`${size} text-gray-300 fill-current`}
          />
        );
      }
    })
  }

  if (totalReviews === 0) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Müşteri Değerlendirmeleri</h2>
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-4xl text-[#eb1260]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Henüz değerlendirme yapılmamış
            </h3>
            <p className="text-gray-600">
              Bu ürün için ilk değerlendirmeyi siz yapın!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Müşteri Değerlendirmeleri</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Taraf - Özet */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
              {/* Genel Puan */}
              <div className="mb-6">
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({totalReviews} değerlendirme)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(averageRating)}
                  </div>
                </div>
              </div>

              {/* Yıldız Dağılımı */}
              <div className="space-y-3 mb-6">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 w-16">{star} yıldız</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Yorumlar */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {/* Yorumlar */}
              {reviewsArray.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 md:p-6">
                  {/* Desktop: 3 Kolonlu Yapı */}
                  <div className="hidden md:block">
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="w-[60px] h-[60px] bg-gradient-to-br from-[#eb1260] to-[#d10f54] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-base">
                          {(() => {
                            const nameParts = (review.user_name || 'Kullanıcı').split(' ');
                            if (nameParts.length >= 2) {
                              return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
                            }
                            return nameParts[0].charAt(0).toUpperCase();
                          })()}
                        </span>
                      </div>

                      {/* İçerik Wrapper */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        {/* 1. Satır: İsim + Onaylı + Tarih */}
                        <div className="flex items-center justify-between gap-4 h-5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-500 font-normal text-sm leading-none italic">
                              {review.user_name || 'Kullanıcı'}
                            </h4>
                            {review.is_verified_purchase && (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-medium leading-none">
                                <FaCheckCircle className="text-[9px]" />
                                Onaylı
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap leading-none">
                            {formatDate(review.created_at)}
                          </span>
                        </div>

                        {/* 2. Satır: Başlık + Yıldızlar (mt-2) */}
                        <div className="flex items-center gap-2 mt-2 h-5">
                          {review.title && (
                            <h5 className="font-bold text-gray-900 text-base leading-none">{review.title}</h5>
                          )}
                          <div className="flex items-center gap-0.5">
                            {renderStars(review.rating)}
                          </div>
                        </div>

                        {/* 3. Satır: Yorum + Foto */}
                        <div className="flex gap-4 items-start mt-2">
                          {/* Yorum */}
                          {review.comment && (
                            <p className="text-gray-600 text-sm leading-relaxed flex-1">{review.comment}</p>
                          )}

                          {/* Foto */}
                          {review.review_image && (
                            <div className="flex-shrink-0">
                              <div 
                                className="relative w-[60px] h-[60px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_API_URL}/${review.review_image}`)}
                              >
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_API_URL}/${review.review_image}`}
                                  alt="Değerlendirme resmi"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Dikey Yapı */}
                  <div className="md:hidden">
                    {/* Üst: Avatar + Ad + Tarih + Onaylı */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#eb1260] to-[#d10f54] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">
                          {review.user_name?.charAt(0).toUpperCase() || 'K'}
                        </span>
                      </div>

                      {/* Ad + Tarih + Onaylı */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-gray-500 font-normal text-sm">
                            {review.user_name || 'Kullanıcı'}
                          </h4>
                          {review.is_verified_purchase && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md font-medium">
                              <FaCheckCircle className="text-[8px]" />
                              Onaylı
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(review.created_at)}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {renderStars(review.rating, "w-3 h-3")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Orta: Başlık + Yorum */}
                    <div className="mb-3">
                      {review.title && (
                        <h5 className="font-bold text-gray-900 mb-1 text-base">{review.title}</h5>
                      )}
                      {review.comment && (
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      )}
                    </div>

                    {/* Alt: Resim */}
                    {review.review_image && (
                      <div 
                        className="relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(`${process.env.NEXT_PUBLIC_API_URL}/${review.review_image}`)}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${review.review_image}`}
                          alt="Değerlendirme resmi"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resim Modal - Elegant Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group z-10"
          >
            <FaTimes className="text-white text-xl group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-5xl w-full max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full min-h-[400px] max-h-[85vh]">
              <Image
                src={selectedImage}
                alt="Büyütülmüş değerlendirme resmi"
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </>
  )
}

export default UrunDegerlendirmeleri