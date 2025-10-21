'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Mural } from '@/types/mural';

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

export default function Home() {
  const [adminMode, setAdminMode] = useState(false);
  const [murals, setMurals] = useState<Mural[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCoordinatesUpdate = async (muralId: string, lat: number, lng: number) => {
    // Update local state immediately for responsive UI
    setMurals(prevMurals =>
      prevMurals.map(mural =>
        mural.id === muralId
          ? {
              ...mural,
              location: {
                ...mural.location,
                coordinates: { lat, lng }
              }
            }
          : mural
      )
    );

    // Save to server
    try {
      const response = await fetch('/api/murals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ muralId, lat, lng })
      });

      if (response.ok) {
        console.log(`Saved mural ${muralId} coordinates to file`);
      }
    } catch (error) {
      console.error('Error saving mural coordinates:', error);
    }
  };

  const handleMuralUpdate = async (updatedMural: Mural) => {
    // Update local state immediately
    setMurals(prevMurals =>
      prevMurals.map(mural =>
        mural.id === updatedMural.id ? updatedMural : mural
      )
    );

    // Save to server
    try {
      const response = await fetch('/api/murals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMural)
      });

      if (response.ok) {
        console.log(`✅ Saved mural ${updatedMural.id} data to file`);
      }
    } catch (error) {
      console.error('❌ Error saving mural data:', error);
    }
  };

  const handleExportCoordinates = () => {
    const dataStr = JSON.stringify(murals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'murals-updated.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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

            {/* Admin Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdminMode(!adminMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  adminMode
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {adminMode ? 'Exit Admin Mode' : 'Admin Mode'}
              </button>

              {adminMode && (
                <button
                  onClick={handleExportCoordinates}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200"
                >
                  Export Coordinates
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="w-full h-full pt-20">
        <MapContainer
          murals={murals}
          adminMode={adminMode}
          onCoordinatesUpdate={handleCoordinatesUpdate}
          onMuralUpdate={handleMuralUpdate}
        />
      </div>

      {/* Admin Mode Indicator */}
      {adminMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-10">
          <p className="font-semibold">Admin Mode Active - Drag pins to reposition</p>
        </div>
      )}
    </div>
  );
}
