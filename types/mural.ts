export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  building: string;
  coordinates: Coordinates;
}

export interface Artist {
  name: string;
  socialMedia?: string;
  bio?: string;
}

export interface MuralImage {
  url: string;
  description: string;
  isPrimary?: boolean;
}

export interface Mural {
  id: string;
  name: string;
  location: Location;
  artist: Artist;
  image: string; // Legacy - kept for backwards compatibility
  images?: MuralImage[];
  buildingCode: string;
}

export interface ArtistBio {
  name: string;
  bio: string;
  socialMedia?: {
    instagram?: string;
    website?: string;
  };
  murals: string[];
}

