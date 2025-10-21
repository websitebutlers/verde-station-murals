'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef, MarkerDragEvent, MapLayerMouseEvent } from 'react-map-gl/mapbox';
import type { AnyLayer } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Mural } from '@/types/mural';
import { CustomBuilding } from '@/types/building';
import MuralMarker from './MuralMarker';
import MuralModal from '../MuralDetail/MuralModal';
import BuildingEditor from './BuildingEditor';

interface MapContainerProps {
  murals: Mural[];
  adminMode?: boolean;
  onCoordinatesUpdate?: (muralId: string, lat: number, lng: number) => void;
}

const VERDE_STATION_CENTER = {
  latitude: 33.3062741,
  longitude: -111.7051246,
  zoom: 17.5,
  pitch: 0, // Flat view for easier tracing
  bearing: 0 // No rotation
};

const BUILDINGS_STORAGE_KEY = 'verde-station-custom-buildings';

export default function MapContainer({
  murals,
  adminMode = false,
  onCoordinatesUpdate
}: MapContainerProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedMural, setSelectedMural] = useState<Mural | null>(null);

  // Building editor state
  const [buildingEditorActive, setBuildingEditorActive] = useState(false);
  const [currentBuildingPoints, setCurrentBuildingPoints] = useState<[number, number][]>([]);
  const [customBuildings, setCustomBuildings] = useState<CustomBuilding[]>([]);
  const [useSatellite, setUseSatellite] = useState(true); // Start with satellite for tracing

  // Load buildings from API on mount
  useEffect(() => {
    const loadBuildings = async () => {
      try {
        const response = await fetch('/api/buildings');
        if (response.ok) {
          const buildings = await response.json();
          setCustomBuildings(buildings);
          console.log('Loaded buildings from file:', buildings);
        }
      } catch (error) {
        console.error('Error loading buildings:', error);
      }
    };
    loadBuildings();
  }, []);

  // Save buildings to API whenever they change
  useEffect(() => {
    const saveBuildings = async () => {
      if (customBuildings.length === 0) return;

      try {
        const response = await fetch('/api/buildings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customBuildings)
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Saved buildings to file:', result);
        }
      } catch (error) {
        console.error('Error saving buildings:', error);
      }
    };

    saveBuildings();
  }, [customBuildings]);

  // Add 3D buildings layer when map loads
  const handleMapLoad = useCallback(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    console.log('🏗️ Map loaded via onLoad callback!');
    console.log('🔍 Current zoom level:', map.getZoom());
    console.log('📐 Current pitch:', map.getPitch());
    console.log('🧭 Current bearing:', map.getBearing());

    // Check if the layer already exists
    if (map.getLayer('3d-buildings')) {
      console.log('⚠️ 3D buildings layer already exists');
      return;
    }

    // Add 3D buildings layer
    const layers = map.getStyle()?.layers;
    console.log('📋 Available layers:', layers?.length);

    const labelLayerId = layers?.find(
      (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
    )?.id;

    console.log('🏷️ Label layer ID:', labelLayerId);

    try {
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
      console.log('✅ 3D buildings layer added successfully!');

      // Force a repaint
      map.triggerRepaint();
      console.log('🎨 Triggered map repaint');
    } catch (error) {
      console.error('❌ Error adding 3D buildings layer:', error);
    }
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

  // Building editor handlers
  const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
    if (!buildingEditorActive) return;

    const { lng, lat } = event.lngLat;
    setCurrentBuildingPoints(prev => [...prev, [lng, lat]]);
  }, [buildingEditorActive]);

  const handleUndoPoint = useCallback(() => {
    setCurrentBuildingPoints(prev => prev.slice(0, -1));
  }, []);

  const handleSaveBuilding = useCallback((height: number) => {
    if (currentBuildingPoints.length < 3) return;

    const newBuilding: CustomBuilding = {
      id: `building-${Date.now()}`,
      coordinates: currentBuildingPoints,
      height
    };

    setCustomBuildings(prev => [...prev, newBuilding]);
    setCurrentBuildingPoints([]);
    console.log('Saved building:', newBuilding);
  }, [currentBuildingPoints]);

  const handleCancelBuilding = useCallback(() => {
    setCurrentBuildingPoints([]);
  }, []);

  const handleToggleEditor = useCallback(() => {
    setBuildingEditorActive(prev => !prev);
    setCurrentBuildingPoints([]);
  }, []);

  const handleToggleSatellite = useCallback(() => {
    setUseSatellite(prev => !prev);
  }, []);

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={VERDE_STATION_CENTER}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
        mapStyle={useSatellite ? "mapbox://styles/mapbox/satellite-streets-v12" : "mapbox://styles/mapbox/dark-v11"}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        antialias={true}
        maxPitch={85}
        interactiveLayerIds={buildingEditorActive ? [] : undefined}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Custom 3D Buildings */}
        {customBuildings.length > 0 && (
          <Source
            id="custom-buildings"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: customBuildings.map(building => ({
                type: 'Feature',
                properties: {
                  height: building.height,
                  base_height: 0
                },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[...building.coordinates, building.coordinates[0]]] // Close the polygon
                }
              }))
            }}
          >
            <Layer
              id="custom-buildings-3d"
              type="fill-extrusion"
              paint={{
                'fill-extrusion-color': '#F59E0B', // Amber color to match markers
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'base_height'],
                'fill-extrusion-opacity': 0.9,
                'fill-extrusion-vertical-gradient': true
              }}
            />
          </Source>
        )}

        {/* Current building being traced */}
        {buildingEditorActive && currentBuildingPoints.length > 0 && (
          <Source
            id="current-building"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: currentBuildingPoints.length > 2 ? 'Polygon' : 'LineString',
                    coordinates: currentBuildingPoints.length > 2
                      ? [[...currentBuildingPoints, currentBuildingPoints[0]]]
                      : currentBuildingPoints
                  }
                }
              ]
            }}
          >
            <Layer
              id="current-building-outline"
              type={currentBuildingPoints.length > 2 ? 'fill' : 'line'}
              paint={
                currentBuildingPoints.length > 2
                  ? {
                      'fill-color': '#3B82F6',
                      'fill-opacity': 0.3
                    }
                  : {
                      'line-color': '#3B82F6',
                      'line-width': 2
                    }
              }
            />
          </Source>
        )}

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

      {/* Building Editor UI */}
      <BuildingEditor
        isActive={buildingEditorActive}
        onToggle={handleToggleEditor}
        currentPoints={currentBuildingPoints}
        onUndo={handleUndoPoint}
        onSave={handleSaveBuilding}
        onCancel={handleCancelBuilding}
        useSatellite={useSatellite}
        onToggleSatellite={handleToggleSatellite}
        buildings={customBuildings}
      />

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

