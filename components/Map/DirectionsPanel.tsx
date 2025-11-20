'use client';

import { DirectionsRoute, formatDistance, formatDuration } from '@/utils/directions';
import { Mural } from '@/types/mural';

interface DirectionsPanelProps {
  route: DirectionsRoute;
  destination: Mural;
  onClose: () => void;
}

export default function DirectionsPanel({ route, destination, onClose }: DirectionsPanelProps) {
  return (
    <div className="fixed top-24 right-4 z-40 bg-white rounded-lg shadow-2xl w-[calc(100vw-2rem)] max-w-md md:top-28">
      {/* Header */}
      <div className="sticky top-0 bg-blue-600 text-white px-4 py-3 rounded-t-lg z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-bold">Walking Directions</h2>
            <p className="text-sm text-blue-100">to {destination.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            aria-label="Close directions"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Route Summary */}
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDuration(route.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{formatDistance(route.distance)}</span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="overflow-y-auto max-h-[calc(100vh-16rem)] md:max-h-[calc(100vh-18rem)]">
        <div className="p-4 space-y-3">
          {route.steps.map((step, index) => {
            const isLast = index === route.steps.length - 1;
            
            return (
              <div key={index} className="flex gap-3">
                {/* Step Icon */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                  {isLast ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium">
                    {step.instruction}
                  </p>
                  {!isLast && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDistance(step.distance)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-50 px-4 py-3 rounded-b-lg border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Directions are approximate. Please follow local traffic laws and stay safe.
        </p>
      </div>
    </div>
  );
}

