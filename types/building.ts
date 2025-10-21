export interface CustomBuilding {
  id: string;
  coordinates: [number, number][]; // [lng, lat] pairs forming a polygon
  height: number; // Height in feet
  name?: string;
}

