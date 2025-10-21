'use client';

import { useState } from 'react';
import { Mural } from '@/types/mural';
import Image from 'next/image';

interface MuralLegendProps {
  murals: Mural[];
  onMuralSelect: (mural: Mural) => void;
  selectedMuralId?: string;
}

export default function MuralLegend({ murals, onMuralSelect, selectedMuralId }: MuralLegendProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getThumbnailUrl = (mural: Mural) => {
    return mural.images && mural.images.length > 0 
      ? mural.images[0].url 
      : mural.image;
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 left-4 z-20 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-all duration-200 md:top-28"
        aria-label="Toggle mural list"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="hidden md:inline font-medium text-gray-700">Murals</span>
        </div>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Legend Panel */}
      <div
        className={`
          fixed top-24 left-4 z-40 bg-white rounded-lg shadow-2xl
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[calc(100%+1rem)] opacity-0 pointer-events-none'}
          w-[calc(100vw-2rem)] max-w-sm
          md:top-28
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Mural List</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close mural list"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{murals.length} murals</p>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-14rem)]">
          <div className="p-2 space-y-2">
            {murals.map((mural) => {
              const isSelected = selectedMuralId === mural.id;
              const thumbnailUrl = getThumbnailUrl(mural);

              return (
                <button
                  key={mural.id}
                  onClick={() => {
                    onMuralSelect(mural);
                    // Close on mobile after selection
                    if (window.innerWidth < 768) {
                      setIsOpen(false);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    transition-all duration-200
                    ${isSelected 
                      ? 'bg-amber-50 border-2 border-amber-500 shadow-md' 
                      : 'bg-white border-2 border-gray-200 hover:border-amber-300 hover:shadow-md'
                    }
                  `}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
                    <Image
                      src={thumbnailUrl}
                      alt={mural.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {mural.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {mural.artist.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`
                        inline-block px-2 py-0.5 rounded text-xs font-medium
                        ${isSelected ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}
                      `}>
                        {mural.buildingCode}
                      </span>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 transition-colors ${isSelected ? 'text-amber-500' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

