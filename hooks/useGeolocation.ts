import { useState, useEffect } from 'react';

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeolocationState {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
  isSupported: boolean;
}

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
    isSupported: typeof window !== 'undefined' && 'geolocation' in navigator,
  });

  useEffect(() => {
    if (!state.isSupported) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    let watchId: number;

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        position: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        },
        error: null,
        loading: false,
        isSupported: true,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unable to retrieve your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Please enable location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    // Watch position for continuous updates
    watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      }
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [state.isSupported]);

  return state;
}

