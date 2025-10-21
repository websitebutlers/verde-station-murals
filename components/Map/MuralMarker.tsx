'use client';

import { Marker } from 'react-map-gl/mapbox';
import type { MarkerDragEvent } from 'react-map-gl/mapbox';
import { Mural } from '@/types/mural';

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
          width="40"
          height="50"
          viewBox="0 0 40 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Pin Shape */}
          <path
            d="M20 0C9 0 0 9 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 9 31 0 20 0Z"
            fill={isSelected ? '#10B981' : '#F59E0B'}
            className="transition-colors duration-200"
          />
          {/* Inner Circle */}
          <circle
            cx="20"
            cy="20"
            r="8"
            fill="white"
            className="transition-all duration-200"
          />
          {/* Building Code Text */}
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fontSize="8"
            fontWeight="bold"
            fill={isSelected ? '#10B981' : '#F59E0B'}
            className="select-none"
          >
            {mural.buildingCode}
          </text>
        </svg>
      </div>
    </Marker>
  );
}

