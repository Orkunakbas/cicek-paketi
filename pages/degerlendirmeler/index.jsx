import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewableProducts } from '@/store/slices/reviewSlice';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaBars, FaTimes, FaStar, FaCheckCircle } from 'react-icons/fa';
import { Button } from '@heroui/react';
import YorumEkleModal from '@/components/reviews/YorumEkleModal';
import Image from 'next/image';

const Degerlendirmelerim = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviewableProducts, loading } = useSelector((state) => state.review);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Kullanıcı kontrolü
  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    dispatch(getReviewableProducts(user.id));
  }, [dispatch, user, router]);

  const menuItems = [
    { icon: FaUser, label: 'Profilim', href: '/profil' },
    { icon: FaShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
    { icon: FaMapMarkerAlt, label: 'Adreslerim', href: '/adreslerim' },
    { icon: FaStar, label: 'Değerlendirmelerim', href: '/degerlendirmeler' },
    { icon: FaHeart, label: 'Favorilerim', href: '/favorilerim' },
  ];

  const isActive = (href) => router.pathname === href;

  const handleReview = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  // Değerlendirilecek ve değerlendirilmiş ürünleri ayır
  const pendingReviews = reviewableProducts.filter(p => !p.has_review);
  const completedReviews = reviewableProducts.filter(p => p.has_review);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1650px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 px-3">Hesabım</h2>
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              <span className="font-medium">Menü</span>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="mt-4 bg-white rounded-2xl shadow-md p-4">
                <nav className="space-y-1">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="text-lg" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Değerlendirmelerim</h1>
                <p className="text-gray-600 mt-1">Satın aldığınız ürünleri değerlendirin</p>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1260] mx-auto mb-4"></div>
                    <p className="text-gray-600">Değerlendirmeleriniz yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Değerlendirilecek Ürünler */}
                  {pendingReviews.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaStar className="text-[#eb1260]" />
                        Değerlendirmeyi Bekleyen Ürünler
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingReviews.map((product) => (
                          <div
                            key={product.order_item_id}
                            className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 p-5 transition-all hover:shadow-lg"
                          >
                            <div className="flex gap-4">
                              {/* Ürün Resmi */}
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={product.product_image || '/placeholder.png'}
                                  alt={product.product_name}
                                  width={80}
                                  height={80}
                                  className="object-cover w-full h-full"
                                />
                              </div>

                              {/* Ürün Bilgileri */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                  {product.product_name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                  Adet: {product.quantity}
                                </p>
                                <Button
                                  onClick={() => handleReview(product)}
                                  className="bg-gradient-to-r from-[#eb1260] to-[#d10f54] text-white"
                                  size="sm"
                                  startContent={<FaStar />}
                                >
                                  Değerlendir
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Değerlendirilmiş Ürünler */}
                  {completedReviews.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        Değerlendirdiğiniz Ürünler
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {completedReviews.map((product) => (
                          <div
                            key={product.order_item_id}
                            className="bg-white rounded-xl border-2 border-green-200 p-5"
                          >
                            <div className="flex gap-4">
                              {/* Ürün Resmi */}
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={product.product_image || '/placeholder.png'}
                                  alt={product.product_name}
                                  width={80}
                                  height={80}
                                  className="object-cover w-full h-full"
                                />
                              </div>

                              {/* Ürün Bilgileri */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                  {product.product_name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Adet: {product.quantity}
                                </p>
                                <div className="flex items-center gap-1">
                                  <FaCheckCircle className="text-green-500 text-sm" />
                                  <span className="text-sm text-green-600 font-medium">
                                    Değerlendirildi
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {reviewableProducts.length === 0 && !loading && (
                    <div className="text-center py-16">
                      <FaStar className="mx-auto text-6xl text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Değerlendirilebilir ürün bulunmuyor
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Teslim edilmiş siparişlerinizden ürünleri değerlendirebilirsiniz
                      </p>
                      <Button
                        onClick={() => router.push('/siparislerim')}
                        className="bg-gradient-to-r from-[#eb1260] to-[#d10f54] text-white"
                      >
                        Siparişlerime Git
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Yorum Ekleme Modalı */}
      <YorumEkleModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        userId={user?.id}
      />
    </div>
  );
};

export default Degerlendirmelerim;
