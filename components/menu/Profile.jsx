import React from 'react'
import Link from 'next/link'
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa'

const Profile = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
    { icon: FaCog, label: 'Ayarlar', href: '/ayarlar' },
  ]

  const handleLogout = () => {
    // Çıkış işlemi
    if (onLogout) {
      onLogout()
    }
    console.log('Çıkış yapıldı')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-start md:justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Profile Menu */}
      <div className="relative bg-white w-full md:w-96 md:mt-20 md:mr-6 md:rounded-2xl shadow-2xl transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="p-4 md:rounded-t-2xl" style={{ background: 'linear-gradient(to right, #e8125f, #c91054)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-lg">Hesabım</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <FaUser className="text-white text-lg" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">{user?.name || 'Kullanıcı'}</h4>
              <p className="text-white/90 text-xs">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-pink-50 transition-colors group"
            >
              <item.icon className="text-gray-600 group-hover:text-[#eb1260] text-xl" />
              <span className="text-gray-800 group-hover:text-[#eb1260] font-medium">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors group mt-2"
          >
            <FaSignOutAlt className="text-gray-600 group-hover:text-red-600 text-xl" />
            <span className="text-gray-800 group-hover:text-red-600 font-medium">
              Çıkış Yap
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 md:rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Çiçek Paketi'ni tercih ettiğiniz için teşekkürler! 🌸
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile