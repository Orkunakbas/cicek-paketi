import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { GiFlowerHat } from 'react-icons/gi'
import Aiasistant from './Aiasistant'

const AiasistantButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="AI Asistan"
      >
        <div className="relative">
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-[#eb1260] rounded-full animate-ping opacity-75"></div>
          
          {/* Main Button */}
          <div className={`relative w-16 h-16 bg-gradient-to-r from-[#eb1260] to-[#d10f54] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'rotate-90 scale-95' : 'hover:scale-110'
          }`}>
            {isOpen ? (
              <FaTimes className="text-white text-2xl" />
            ) : (
              <GiFlowerHat className="text-white text-3xl" />
            )}
          </div>

          {/* Notification Badge */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          )}
        </div>

        {/* Tooltip */}
        {isHovered && !isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
            AI Asistan ile Konuş 💬
            <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </button>

      {/* AI Assistant Modal */}
      <Aiasistant isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default AiasistantButton