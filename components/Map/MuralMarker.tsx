'use client';

import { Marker } from 'react-map-gl/mapbox';
import type { MarkerDragEvent } from 'react-map-gl/mapbox';
import { Mural } from '@/types/mural';
import Image from 'next/image';

interface MuralMarkerProps {
  mural: Mural;
  onClick: (mural: Mural) => void;
  onDragEnd?: (muralId: string, event: MarkerDragEvent) => void;
  draggable?: boolean;
  isSelected?: boolean;
}

export default function MuralMarker({
  mural,
  onClick,
  onDragEnd,
  draggable = false,
  isSelected = false
}: MuralMarkerProps) {
  const handleClick = () => {
    onClick(mural);
  };

  const handleDragEnd = (event: MarkerDragEvent) => {
    if (onDragEnd) {
      onDragEnd(mural.id, event);
    }
  };

  // Get the first image from the images array, or fallback to legacy image
  const thumbnailUrl = mural.images && mural.images.length > 0
    ? mural.images[0].url
    : mural.image;

  return (
    <Marker
      longitude={mural.location.coordinates.lng}
      latitude={mural.location.coordinates.lat}
      anchor="bottom"
      draggable={draggable}
      onDragEnd={handleDragEnd}
    >
      <div
        onClick={handleClick}
        className={`
          cursor-pointer transition-all duration-200 ease-in-out
          ${isSelected ? 'scale-125' : 'scale-100 hover:scale-110'}
        `}
      >
        <svg
          width="50"
          height="60"
          viewBox="0 0 50 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Pin Shape */}
          <path
            d="M25 0C13 0 3 10 3 22C3 38 25 60 25 60C25 60 47 38 47 22C47 10 37 0 25 0Z"
            fill={isSelected ? '#10B981' : '#F59E0B'}
            className="transition-colors duration-200"
          />

          {/* Clip path for circular image */}
          <defs>
            <clipPath id={`clip-${mural.id}`}>
              <circle cx="25" cy="22" r="13" />
            </clipPath>
          </defs>

          {/* White background circle */}
          <circle
            cx="25"
            cy="22"
            r="14"
            fill="white"
            className="transition-all duration-200"
          />

          {/* Image */}
          <foreignObject x="12" y="9" width="26" height="26" clipPath={`url(#clip-${mural.id})`}>
            <div className="w-full h-full">
              <Image
                src={thumbnailUrl}
                alt={mural.name}
                width={26}
                height={26}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          </foreignObject>
        </svg>
      </div>
    </Marker>
  );
}

