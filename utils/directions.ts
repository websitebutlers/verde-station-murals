export interface DirectionsStep {
  instruction: string;
  distance: number; // in meters
  duration: number; // in seconds
  maneuver?: {
    type: string;
    modifier?: string;
  };
}

export interface DirectionsRoute {
  distance: number; // total distance in meters
  duration: number; // total duration in seconds
  geometry: {
    coordinates: [number, number][]; // [lng, lat] pairs
    type: 'LineString';
  };
  steps: DirectionsStep[];
}

export interface DirectionsResponse {
  routes: DirectionsRoute[];
  waypoints: Array<{
    location: [number, number];
    name: string;
  }>;
}

/**
 * Fetch walking directions from Mapbox Directions API
 * @param start - Starting coordinates [lng, lat]
 * @param end - Ending coordinates [lng, lat]
 * @param token - Mapbox access token
 * @returns DirectionsResponse with route information
 */
export async function getWalkingDirections(
  start: [number, number],
  end: [number, number],
  token: string
): Promise<DirectionsResponse> {
  const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?steps=true&geometries=geojson&access_token=${token}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Directions API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found');
  }

  return data;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format distance for display
 * @param meters - Distance in meters
 * @returns Formatted string (e.g., "150 ft" or "0.5 mi")
 */
export function formatDistance(meters: number): string {
  const feet = meters * 3.28084;
  
  if (feet < 528) { // Less than 0.1 miles
    return `${Math.round(feet)} ft`;
  }
  
  const miles = feet / 5280;
  return `${miles.toFixed(1)} mi`;
}

/**
 * Format duration for display
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "5 min" or "1 hr 15 min")
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Get maneuver icon name based on instruction type
 * @param type - Maneuver type from Mapbox
 * @param modifier - Maneuver modifier (e.g., "left", "right")
 * @returns Icon name for display
 */
export function getManeuverIcon(type?: string, modifier?: string): string {
  if (!type) return 'arrow-up';
  
  const key = `${type}-${modifier || ''}`;
  
  const iconMap: Record<string, string> = {
    'turn-left': 'arrow-left',
    'turn-right': 'arrow-right',
    'turn-slight left': 'arrow-up-left',
    'turn-slight right': 'arrow-up-right',
    'turn-sharp left': 'corner-up-left',
    'turn-sharp right': 'corner-up-right',
    'arrive-': 'map-pin',
    'depart-': 'navigation',
  };
  
  return iconMap[key] || 'arrow-up';
}

