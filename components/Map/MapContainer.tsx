'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox';
import type { MapRef, MarkerDragEvent } from 'react-map-gl/mapbox';
import type { AnyLayer } from 'mapbox-gl';
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
  zoom: 17.5,
  pitch: 60, // Tilt the map to see 3D buildings (60 degrees for dramatic effect)
  bearing: -17.6 // Slight rotation for better building perspective
};

export default function MapContainer({
  murals,
  adminMode = false,
  onCoordinatesUpdate
}: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedMural, setSelectedMural] = useState<Mural | null>(null);
  const [viewState, setViewState] = useState(VERDE_STATION_CENTER);

  // Add 3D buildings layer when map loads
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();

    const handleLoad = () => {
      // Check if the layer already exists
      if (map.getLayer('3d-buildings')) return;

      // Add 3D buildings layer
      const layers = map.getStyle()?.layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              0, '#6366f1',
              50, '#8b5cf6',
              100, '#a855f7',
              200, '#c026d3'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.8,
            'fill-extrusion-vertical-gradient': true
          }
        } as AnyLayer,
        labelLayerId
      );
    };

    if (map.isStyleLoaded()) {
      handleLoad();
    } else {
      map.on('load', handleLoad);
    }

    return () => {
      map.off('load', handleLoad);
    };
  }, []);

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
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        antialias={true}
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

