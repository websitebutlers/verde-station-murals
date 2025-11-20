'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Mural } from '@/types/mural';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getWalkingDirections, calculateDistance, DirectionsRoute } from '@/utils/directions';
import DirectionsPanel from '@/components/Map/DirectionsPanel';

// Dynamically import MapContainer to avoid SSR issues with Mapbox
const MapContainer = dynamic(() => import('@/components/Map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function PublicMapPage() {
  const [murals, setMurals] = useState<Mural[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState<DirectionsRoute | null>(null);
  const [routeDestination, setRouteDestination] = useState<Mural | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Get user's location
  const { position: userPosition, error: locationError } = useGeolocation();

  // Load murals from API on mount
  useEffect(() => {
    const loadMurals = async () => {
      try {
        const response = await fetch('/api/murals');
        if (response.ok) {
          const data = await response.json();
          setMurals(data);
          console.log('Loaded murals from file:', data.length);
        }
      } catch (error) {
        console.error('Error loading murals:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMurals();
  }, []);

  // Handle navigation to a mural
  const handleNavigate = useCallback(async (mural: Mural) => {
    if (!userPosition) {
      alert('Unable to get your location. Please enable location services.');
      return;
    }

    setIsLoadingRoute(true);
    try {
      const route = await getWalkingDirections(
        [userPosition.longitude, userPosition.latitude],
        [mural.location.coordinates.lng, mural.location.coordinates.lat],
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
      );

      setActiveRoute(route.routes[0]);
      setRouteDestination(mural);
    } catch (error) {
      console.error('Error fetching directions:', error);
      alert('Unable to get directions. Please try again.');
    } finally {
      setIsLoadingRoute(false);
    }
  }, [userPosition]);

  // Navigate to nearest mural
  const handleNavigateToNearest = useCallback(() => {
    if (!userPosition || murals.length === 0) return;

    let nearestMural = murals[0];
    let minDistance = calculateDistance(
      userPosition.latitude,
      userPosition.longitude,
      murals[0].location.coordinates.lat,
      murals[0].location.coordinates.lng
    );

    murals.forEach(mural => {
      const distance = calculateDistance(
        userPosition.latitude,
        userPosition.longitude,
        mural.location.coordinates.lat,
        mural.location.coordinates.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestMural = mural;
      }
    });

    handleNavigate(nearestMural);
  }, [userPosition, murals, handleNavigate]);

  // Clear active route
  const handleClearRoute = useCallback(() => {
    setActiveRoute(null);
    setRouteDestination(null);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading murals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Verde Station Murals</h1>
              <p className="text-sm text-gray-600">Gilbert, Arizona</p>
            </div>
            {userPosition && (
              <button
                onClick={handleNavigateToNearest}
                disabled={isLoadingRoute}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Navigate to Nearest</span>
                <span className="sm:hidden">Nearest</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Directions Panel */}
      {activeRoute && routeDestination && (
        <DirectionsPanel
          route={activeRoute}
          destination={routeDestination}
          onClose={handleClearRoute}
        />
      )}

      {/* Map Container */}
      <div className="w-full h-full pt-20">
        <MapContainer
          murals={murals}
          adminMode={false}
          userLocation={userPosition ? { latitude: userPosition.latitude, longitude: userPosition.longitude } : null}
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}

