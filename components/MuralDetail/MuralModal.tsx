'use client';

import { useEffect, useState, useRef } from 'react';
import type { TouchEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mural } from '@/types/mural';
import Image from 'next/image';
import { formatDistance } from '@/utils/directions';

interface MuralModalProps {
  mural: Mural;
  onClose: () => void;
  onNavigate?: (mural: Mural) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  distance?: number | null;
}

export default function MuralModal({ mural, onClose, onNavigate, userLocation, distance }: MuralModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;

    const deltaX = e.changedTouches[0]?.clientX - touchStartXRef.current;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold && hasMultipleImages) {
      if (deltaX < 0) {
        // Swipe left -> next image
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right -> previous image
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }


    touchStartXRef.current = null;
  };



  // Get images array, fallback to legacy single image
  const images = mural.images && mural.images.length > 0
    ? mural.images
    : [{ url: mural.image, description: mural.name, isPrimary: true }];

  const hasMultipleImages = images.length > 1;

  // Auto-advance images every 5 seconds when multiple images are available
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [hasMultipleImages, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, hasMultipleImages, images.length]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Image Slider */}
            <div
              className="relative w-full h-96 bg-gray-100 group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].description || mural.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />

              {/* Previous Button */}
              {hasMultipleImages && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next Button */}
              {hasMultipleImages && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Dot Indicators */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'bg-white w-6'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mural Details */}
            <div className="p-8">
              {/* Title and Location */}
              <div className="mb-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {mural.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-lg">{mural.location.building}</span>
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {mural.buildingCode}
                  </span>
                </div>
              </div>

              {/* Navigation Button */}
              {userLocation && onNavigate && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        Get Walking Directions
                      </h3>
                      {distance !== null && distance !== undefined && (
                        <p className="text-sm text-blue-700">
                          {formatDistance(distance)} away
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onNavigate(mural)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>Navigate</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Artist Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Artist
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold text-gray-900">
                    {mural.artist.name}
                  </p>
                  {mural.artist.socialMedia && (
                    <a
                      href={`https://instagram.com/${mural.artist.socialMedia}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>@{mural.artist.socialMedia}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Artist Bio */}
              {mural.artist.bio && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    About the Artist
                  </h4>
                  <div className="text-gray-700 leading-relaxed">
                    {mural.artist.bio.length > 300 ? (
                      <>
                        <p className="text-sm">
                          {showFullBio ? mural.artist.bio : `${mural.artist.bio.substring(0, 300)}...`}
                        </p>
                        <button
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        >
                          {showFullBio ? 'Read less' : 'Read more'}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm">{mural.artist.bio}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

