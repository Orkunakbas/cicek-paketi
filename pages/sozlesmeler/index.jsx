import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTerms } from '@/store/slices/termsSlice'

const Sozlesmeler = () => {
  const dispatch = useDispatch()
  const { terms, loading, error } = useSelector((state) => state.terms)
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    dispatch(fetchTerms())
  }, [dispatch])

  useEffect(() => {
    // İlk sözleşmeyi aktif tab olarak ayarla
    if (terms && terms.length > 0 && !activeTab) {
      setActiveTab(terms[0].id)
    }
  }, [terms, activeTab])

  // Aktif sözleşmeyi bul
  const activeTerm = terms.find((term) => term.id === activeTab)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1260] mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchTerms())}
            className="px-4 py-2 bg-[#eb1260] text-white rounded-lg hover:bg-[#d10f54]"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8">
        <div className="bg-white p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Sözleşmeler</h1>
          
          {terms && terms.length > 0 ? (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                  {terms.map((term) => (
                    <button
                      key={term.id}
                      onClick={() => setActiveTab(term.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                        activeTab === term.id
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {term.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                {activeTerm && (
                  <>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                      {activeTerm.title}
                    </h2>
                    <div 
                      className="prose max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: activeTerm.description }}
                    />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Henüz sözleşme eklenmemiş.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sozlesmeler
