import React, { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaTimes, FaSeedling, FaRobot } from 'react-icons/fa'

const Aiasistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Merhaba! 🌸 Ben Çiçek Paketi AI asistanınızım. Size nasıl yardımcı olabilirim?',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simüle edilmiş AI yanıtı (gerçek API'ye bağlanabilir)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('merhaba') || input.includes('selam')) {
      return 'Merhaba! 🌺 Size nasıl yardımcı olabilirim?'
    } else if (input.includes('çiçek') || input.includes('gül') || input.includes('orkide')) {
      return 'Harika bir seçim! 🌹 Çiçeklerimiz taze ve özenle seçilmiştir. Hangi özel gün için çiçek arıyorsunuz?'
    } else if (input.includes('fiyat') || input.includes('ücret')) {
      return 'Fiyatlarımız çok uygun! 💰 Kategorilere göz atarak size en uygun ürünü bulabilirsiniz. Bütçeniz nedir?'
    } else if (input.includes('teslimat') || input.includes('kargo')) {
      return 'Aynı gün teslimat hizmetimiz var! 🚚 Siparişinizi hızlıca ulaştırıyoruz. İl içi teslimat 2-4 saat içinde gerçekleşir.'
    } else if (input.includes('bakım') || input.includes('sulama')) {
      return 'Bitki bakımı çok önemli! 🌿 Her bitkimizle birlikte detaylı bakım talimatları gönderiyoruz. Hangi bitkiyle ilgileniyorsunuz?'
    } else if (input.includes('teşekkür')) {
      return 'Rica ederim! 🌸 Başka bir sorunuz varsa çekinmeden sorun.'
    } else {
      return 'Anladım! 🌻 Size daha iyi yardımcı olabilmem için biraz daha detay verebilir misiniz? Veya ürünlerimize göz atmak ister misiniz?'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#eb1260] to-[#d10f54] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <FaSeedling className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Çiçek Paketi AI Asistan</h3>
              <p className="text-pink-100 text-sm">Her zaman yanınızdayız 🌸</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-pink-50/30 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#eb1260] to-[#d10f54] text-white'
                    : 'bg-white shadow-md border border-pink-100'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <FaRobot className="text-[#eb1260]" />
                    <span className="text-xs font-semibold text-[#eb1260]">AI Asistan</span>
                  </div>
                )}
                <p className={`text-sm leading-relaxed ${
                  message.sender === 'user' ? 'text-white' : 'text-gray-800'
                }`}>
                  {message.text}
                </p>
                <span className={`text-xs mt-2 block ${
                  message.sender === 'user' ? 'text-pink-100' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md border border-pink-100 rounded-2xl p-4 max-w-[75%]">
                <div className="flex items-center gap-2 mb-2">
                  <FaRobot className="text-[#eb1260]" />
                  <span className="text-xs font-semibold text-[#eb1260]">AI Asistan</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#eb1260] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#eb1260] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#eb1260] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-pink-100">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 px-4 py-3 border border-pink-200 rounded-full focus:outline-none focus:border-[#eb1260] focus:ring-2 focus:ring-pink-200 transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-12 h-12 bg-gradient-to-r from-[#eb1260] to-[#d10f54] text-white rounded-full flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
            >
              <FaPaperPlane />
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-2">
            AI asistan beta sürümündedir. Yanıtlar simüle edilmiştir.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Aiasistant