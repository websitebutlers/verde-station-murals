'use client';

import { useEffect, useState } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

interface PitchControlProps {
  mapRef: React.RefObject<MapRef | null>;
}

export default function PitchControl({ mapRef }: PitchControlProps) {
  const [pitch, setPitch] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update local state when map pitch changes externally
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handlePitchChange = () => {
      const currentPitch = map.getPitch();
      setPitch(Math.round(currentPitch));
    };

    map.on('pitch', handlePitchChange);
    return () => {
      map.off('pitch', handlePitchChange);
    };
  }, [mapRef]);

  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    const map = mapRef.current?.getMap();
    if (map) {
      map.setPitch(newPitch);
    }
  };

  const presetPitches = [
    { label: 'Flat', value: 0 },
    { label: 'Low', value: 30 },
    { label: 'Med', value: 50 },
    { label: 'High', value: 70 }
  ];

  return (
    <div className="absolute bottom-32 right-4 z-10">
      {/* Collapsed Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 group"
          title="Adjust 3D tilt"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span className="text-sm font-medium text-gray-700">{pitch}°</span>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-2xl p-4 w-64">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <h3 className="font-semibold text-gray-900">3D Tilt</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close pitch control"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Pitch Value Display */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-blue-600">{pitch}°</div>
            <div className="text-xs text-gray-500 mt-1">
              {pitch === 0 ? 'Top-down view' : pitch < 45 ? 'Slight perspective' : 'Strong 3D effect'}
            </div>
          </div>

          {/* Slider */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="85"
              step="5"
              value={pitch}
              onChange={(e) => handlePitchChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(pitch / 85) * 100}%, #e5e7eb ${(pitch / 85) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0°</span>
              <span>85°</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {presetPitches.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePitchChange(preset.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  pitch === preset.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Adjust the tilt angle to see buildings in 3D. Higher angles create a more dramatic perspective.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

