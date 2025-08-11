import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentImageIndex
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || `${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-gray-500">
          {currentImageIndex + 1} of {images.length}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;