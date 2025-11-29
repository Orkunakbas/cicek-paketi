import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { FaStar, FaTimes, FaCamera } from 'react-icons/fa';
import { addReview, getReviewableProducts } from '@/store/slices/reviewSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';

const YorumEkleModal = ({ isOpen, onClose, product, userId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resim boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Lütfen yıldız seçimi yapın');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', userId || '');
    formData.append('product_id', product.product_id);
    formData.append('order_id', product.order_id);
    formData.append('order_item_id', product.order_item_id);
    formData.append('rating', rating);
    if (title) formData.append('title', title);
    if (comment) formData.append('comment', comment);
    if (image) formData.append('review_image', image);

    const result = await dispatch(addReview(formData));

    if (addReview.fulfilled.match(result)) {
      toast.success('Değerlendirmeniz alındı! Onaylandıktan sonra yayınlanacak.');
      // Listeyi yenile
      if (userId) {
        dispatch(getReviewableProducts(userId));
      }
      handleClose();
    } else {
      toast.error(result.payload || 'Değerlendirme eklenemedi');
    }

    setLoading(false);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setTitle('');
    setComment('');
    setImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900">Ürünü Değerlendir</h2>
            {product && (
              <div className="flex items-center gap-3 mt-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image 
                    src={product.product_image || '/placeholder.png'} 
                    alt={product.product_name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{product.product_name}</p>
                  <p className="text-sm text-gray-500">Adet: {product.quantity}</p>
                </div>
              </div>
            )}
          </ModalHeader>

          <ModalBody className="py-6">
            {/* Yıldız Seçimi */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Puanınız <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <FaStar
                      className={`text-4xl ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {rating === 1 && 'Çok Kötü'}
                  {rating === 2 && 'Kötü'}
                  {rating === 3 && 'Orta'}
                  {rating === 4 && 'İyi'}
                  {rating === 5 && 'Mükemmel'}
                </p>
              )}
            </div>

            {/* Başlık */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Başlık (Opsiyonel)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Harika bir ürün!"
                maxLength={255}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eb1260] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Yorum */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Yorumunuz (Opsiyonel)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#eb1260] focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Resim Yükleme */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Fotoğraf Ekle (Opsiyonel)
              </label>
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#eb1260] transition-colors bg-gray-50">
                  <FaCamera className="text-4xl text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Fotoğraf yüklemek için tıklayın</span>
                  <span className="text-xs text-gray-500 mt-1">Max 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative w-full h-40 rounded-xl overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="border-t border-gray-200 pt-4">
            <Button 
              color="default" 
              variant="light" 
              onPress={handleClose}
              isDisabled={loading}
            >
              İptal
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-[#eb1260] to-[#d10f54] text-white"
              isLoading={loading}
            >
              Gönder
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default YorumEkleModal;


