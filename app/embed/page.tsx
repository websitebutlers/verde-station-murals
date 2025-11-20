'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Mural } from '@/types/mural';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getWalkingDirections, DirectionsRoute } from '@/utils/directions';
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

export default function EmbedMapPage() {
  const [murals, setMurals] = useState<Mural[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState<DirectionsRoute | null>(null);
  const [routeDestination, setRouteDestination] = useState<Mural | null>(null);

  // Get user's location
  const { position: userPosition } = useGeolocation();

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
    }
  }, [userPosition]);

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
      {/* Minimal branding badge */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2">
        <h1 className="text-lg font-bold text-gray-900">Verde Station Murals</h1>
        <p className="text-xs text-gray-600">Gilbert, AZ</p>
      </div>

      {/* Directions Panel */}
      {activeRoute && routeDestination && (
        <DirectionsPanel
          route={activeRoute}
          destination={routeDestination}
          onClose={handleClearRoute}
        />
      )}

      {/* Map Container - Full screen, no header */}
      <div className="w-full h-full">
        <MapContainer
          murals={murals}
          adminMode={false}
          hideControls={true}
          userLocation={userPosition ? { latitude: userPosition.latitude, longitude: userPosition.longitude } : null}
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}

