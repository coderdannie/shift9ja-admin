import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryLightboxModalProps {
  selectedImageIndex: number | null;
  galleryUrls: string[];
  setSelectedImageIndex: (index: number | null) => void;
}

const GalleryLightboxModal: React.FC<GalleryLightboxModalProps> = ({
  selectedImageIndex,
  galleryUrls,
  setSelectedImageIndex,
}) => {
  if (selectedImageIndex === null || !galleryUrls?.length) return null;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((selectedImageIndex + 1) % galleryUrls.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((selectedImageIndex - 1 + galleryUrls.length) % galleryUrls.length);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={() => setSelectedImageIndex(null)}
    >
      <button
        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImageIndex(null);
        }}
      >
        <X size={24} />
      </button>

      {galleryUrls.length > 1 && (
        <button
          className="absolute left-4 sm:left-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
          onClick={handlePrevImage}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      <div
        className="w-full h-full max-w-5xl max-h-[85vh] p-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={galleryUrls[selectedImageIndex]}
          alt={`Gallery preview ${selectedImageIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>

      {galleryUrls.length > 1 && (
        <button
          className="absolute right-4 sm:right-8 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
          onClick={handleNextImage}
        >
          <ChevronRight size={32} />
        </button>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full">
        <span className="text-white text-sm font-medium">
          {selectedImageIndex + 1} / {galleryUrls.length}
        </span>
      </div>
    </div>
  );
};

export default GalleryLightboxModal;
