'use client';

import { useState, useCallback, useRef } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox';
import type { MapRef, MarkerDragEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Mural } from '@/types/mural';
import MuralMarker from './MuralMarker';
import MuralModal from '../MuralDetail/MuralModal';

interface MapContainerProps {
  murals: Mural[];
  adminMode?: boolean;
  onCoordinatesUpdate?: (muralId: string, lat: number, lng: number) => void;
}

const VERDE_STATION_CENTER = {
  latitude: 33.3062741,
  longitude: -111.7051246,
  zoom: 17.5
};

export default function MapContainer({ 
  murals, 
  adminMode = false,
  onCoordinatesUpdate 
}: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedMural, setSelectedMural] = useState<Mural | null>(null);
  const [viewState, setViewState] = useState(VERDE_STATION_CENTER);

  const handleMarkerClick = useCallback((mural: Mural) => {
    setSelectedMural(mural);
  }, []);

  const handleMarkerDrag = useCallback((muralId: string, event: MarkerDragEvent) => {
    if (adminMode && onCoordinatesUpdate) {
      const { lng, lat } = event.lngLat;
      onCoordinatesUpdate(muralId, lat, lng);
    }
  }, [adminMode, onCoordinatesUpdate]);

  const handleCloseModal = useCallback(() => {
    setSelectedMural(null);
  }, []);

  return (
    <>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Mural Markers */}
        {murals.map((mural) => (
          <MuralMarker
            key={mural.id}
            mural={mural}
            onClick={handleMarkerClick}
            onDragEnd={handleMarkerDrag}
            draggable={adminMode}
            isSelected={selectedMural?.id === mural.id}
          />
        ))}
      </Map>

      {/* Mural Detail Modal */}
      {selectedMural && (
        <MuralModal
          mural={selectedMural}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

