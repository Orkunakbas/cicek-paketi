import React, { useState, useRef } from 'react'
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaInstagram } from 'react-icons/fa'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const HomeStory = () => {
  const [playingVideo, setPlayingVideo] = useState(null)
  const [mutedVideos, setMutedVideos] = useState({
    1: true,
    2: true,
    3: true,
    4: true
  })
  const [loadingVideos, setLoadingVideos] = useState({})
  const videoRefs = useRef({})
  
  const setVideoRef = (id, el) => {
    if (el) {
      videoRefs.current[id] = el
    }
  }

  const videos = [
    { id: 1, src: '/videos/1.mp4', title: 'Çiçek Bakımı' },
    { id: 2, src: '/videos/2.mp4', title: 'Bitki Dikimi' },
    { id: 3, src: '/videos/3.mp4', title: 'Aranjman Yapımı' },
    { id: 4, src: '/videos/4.mp4', title: 'Sulama İpuçları' }
  ]

  const handlePlayPause = (videoId) => {
    const video = videoRefs.current[videoId]
    console.log('handlePlayPause called', videoId, video)
    
    if (!video) {
      console.log('Video not found!', videoId)
      return
    }

    if (playingVideo === videoId) {
      video.pause()
      setPlayingVideo(null)
      setLoadingVideos(prev => ({ ...prev, [videoId]: false }))
    } else {
      // Diğer videoları durdur
      Object.keys(videoRefs.current).forEach(id => {
        if (videoRefs.current[id] && id !== videoId.toString()) {
          videoRefs.current[id].pause()
        }
      })
      setLoadingVideos(prev => ({ ...prev, [videoId]: true }))
      setTimeout(() => {
        video.play().then(() => {
          console.log('Video playing')
          setPlayingVideo(videoId)
          setLoadingVideos(prev => ({ ...prev, [videoId]: false }))
        }).catch(err => {
          console.error('Play error:', err)
          setLoadingVideos(prev => ({ ...prev, [videoId]: false }))
        })
      }, 2000)
    }
  }

  const handleMuteToggle = (videoId) => {
    setMutedVideos(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }))
  }

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    centerMode: false
  }

  return (
    <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Başlık */}
      <div className="mb-6 flex items-center gap-3">
        <FaInstagram className="text-3xl md:text-4xl text-pink-600" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Instagram Storylerimiz</h2>
          <p className="text-sm text-gray-600">Günlük paylaşımlarımızı keşfedin</p>
        </div>
      </div>

      {/* Video Grid - Desktop */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={`desktop-${video.id}`} className="relative group">
            {/* Video Container */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300">
              <video
                key={`video-desktop-${video.id}`}
                ref={(el) => setVideoRef(video.id, el)}
                src={video.src}
                loop
                muted={mutedVideos[video.id]}
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                onClick={() => handlePlayPause(video.id)}
                onLoadedData={(e) => {
                  e.target.currentTime = 0.1
                }}
              />

              {/* Play/Pause Button */}
              <button
                onClick={() => handlePlayPause(video.id)}
                className="absolute inset-0 flex items-center justify-center group/play"
              >
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center">
                  <FaPlay className={`w-6 h-6 text-white ml-1 transition-all duration-300 z-10 ${
                    playingVideo === video.id ? 'opacity-0 scale-75' : 'opacity-100 scale-100 group-hover/play:scale-110'
                  }`} />
                  <svg className={`absolute w-20 h-20 -rotate-90 transition-opacity duration-300 ${
                    playingVideo === video.id ? 'opacity-0' : 'opacity-100'
                  }`} viewBox="0 0 80 80">
                    {/* Progress border (boşalacak) */}
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray="226"
                      strokeDashoffset="0"
                      className={loadingVideos[video.id] ? "animate-progress-reverse" : ""}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </button>

              {/* Mute/Unmute Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleMuteToggle(video.id)
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all z-10"
              >
                {mutedVideos[video.id] ? (
                  <FaVolumeMute className="w-4 h-4 text-white" />
                ) : (
                  <FaVolumeUp className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Slider - Mobile */}
      <div className="md:hidden">
        <Slider {...sliderSettings}>
          {videos.map((video) => (
            <div key={`mobile-${video.id}`} className="px-2">
              <div className="relative group">
                {/* Video Container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 shadow-lg">
                  <video
                    key={`video-mobile-${video.id}`}
                    ref={(el) => setVideoRef(video.id, el)}
                    src={video.src}
                    loop
                    muted={mutedVideos[video.id]}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    onClick={() => handlePlayPause(video.id)}
                    onLoadedData={(e) => {
                      e.target.currentTime = 0.1
                    }}
                  />

                  {/* Play/Pause Button */}
                  <button
                    onClick={() => handlePlayPause(video.id)}
                    className="absolute inset-0 flex items-center justify-center group/play"
                  >
                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center">
                      <FaPlay className={`w-6 h-6 text-white ml-1 transition-all duration-300 z-10 ${
                        playingVideo === video.id ? 'opacity-0 scale-75' : 'opacity-100 scale-100 group-hover/play:scale-110'
                      }`} />
                      <svg className={`absolute w-20 h-20 -rotate-90 transition-opacity duration-300 ${
                        playingVideo === video.id ? 'opacity-0' : 'opacity-100'
                      }`} viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeDasharray="226"
                          strokeDashoffset="0"
                          className={loadingVideos[video.id] ? "animate-progress-reverse" : ""}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Mute/Unmute Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMuteToggle(video.id)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all z-10"
                  >
                    {mutedVideos[video.id] ? (
                      <FaVolumeMute className="w-4 h-4 text-white" />
                    ) : (
                      <FaVolumeUp className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        .slick-dots {
          bottom: -35px;
        }
        .slick-dots li button:before {
          color: #eb1260;
          font-size: 8px;
        }
        .slick-dots li.slick-active button:before {
          color: #eb1260;
        }
      `}</style>

      <style jsx>{`
        @keyframes progress-reverse {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 226;
          }
        }
        .animate-progress-reverse {
          animation: progress-reverse 2s linear forwards;
        }
      `}</style>
    </div>
  )
}

export default HomeStory