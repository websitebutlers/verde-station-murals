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

export default function PublicMapPage() {
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
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="w-full h-full pt-20">
        <MapContainer
          murals={murals}
          adminMode={false}
        />
      </div>
    </div>
  );
}

