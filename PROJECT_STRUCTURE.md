# Verde Station Murals - Interactive Map Project

## Project Overview
An interactive map application for displaying mural locations at Verde Station plaza in Gilbert, AZ. The application allows users to explore murals, view artist information, and see mural images through an intuitive map interface.

## Tech Stack

### Core Framework
- **Next.js 14** (App Router) - Modern React framework with built-in optimization
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience

### Mapping
- **react-map-gl** (v7+) - React wrapper for Mapbox GL JS
- **Mapbox GL JS** - Interactive vector maps with WebGL rendering
- Mapbox Token: `pk.eyJ1IjoiZ3JpZG5waXhlbCIsImEiOiJjbDRqNHhnM2wwM25iM3FteTJ1ZXljOGR2In0.GnrUDPM6Px34cpQzQYj9Ug`

### Styling
- **Tailwind CSS** - Utility-first CSS framework for modern, clean design
- **Framer Motion** - Smooth animations and transitions

### Deployment
- **Netlify** - Static site hosting with continuous deployment from GitHub

## Project Structure

```
verde-station-murals/
├── public/
│   ├── murals/              # Mural images organized by location
│   │   ├── building-a/
│   │   ├── building-b1/
│   │   ├── building-b2/
│   │   └── ...
│   └── icons/               # Custom map markers and UI icons
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main map page
│   │   └── globals.css      # Global styles with Tailwind
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx      # Main map component
│   │   │   ├── MuralMarker.tsx       # Custom marker component
│   │   │   └── MapControls.tsx       # Zoom, navigation controls
│   │   ├── MuralDetail/
│   │   │   ├── MuralModal.tsx        # Full-screen mural detail view
│   │   │   ├── MuralCard.tsx         # Compact mural info card
│   │   │   └── ArtistBio.tsx         # Artist information component
│   │   ├── Admin/
│   │   │   ├── AdminPanel.tsx        # Admin mode toggle
│   │   │   └── PinEditor.tsx         # Draggable pin placement
│   │   └── UI/
│   │       ├── Sidebar.tsx           # Mural list sidebar
│   │       └── SearchBar.tsx         # Search/filter murals
│   ├── data/
│   │   ├── murals.json              # Mural data with coordinates
│   │   ├── artists.json             # Artist bios and information
│   │   └── buildings.json           # Building/location data
│   ├── types/
│   │   ├── mural.ts                 # Mural type definitions
│   │   ├── artist.ts                # Artist type definitions
│   │   └── location.ts              # Location/coordinate types
│   ├── hooks/
│   │   ├── useMapInteraction.ts     # Map interaction logic
│   │   └── useMuralData.ts          # Data fetching and filtering
│   └── utils/
│       ├── coordinates.ts           # Coordinate conversion utilities
│       └── mapHelpers.ts            # Map-related helper functions
├── .env.local                       # Environment variables (Mapbox token)
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── netlify.toml                     # Netlify deployment config
└── package.json                     # Dependencies and scripts
```

## Data Structure

### Mural Data Format
```typescript
interface Mural {
  id: string;
  name: string;
  location: {
    building: string;      // e.g., "Building C - Spot 1"
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  artist: {
    name: string;
    socialMedia?: string;
  };
  image: string;           // Path to mural image
  buildingCode: string;    // e.g., "14M", "10M", etc.
}
```

### Artist Data Format
```typescript
interface Artist {
  name: string;
  bio: string;
  socialMedia?: {
    instagram?: string;
    website?: string;
  };
  murals: string[];        // Array of mural IDs
}
```

## Key Features

### 1. Interactive Map
- Custom styled Mapbox map centered on Verde Station
- Custom markers for each mural location
- Smooth zoom and pan interactions
- Building outlines overlay matching the property layout

### 2. Mural Exploration
- Click markers to view mural details
- Modal/sidebar with:
  - High-resolution mural image
  - Mural name and location
  - Artist name and bio
  - Social media links
- Smooth transitions and animations

### 3. Admin Mode (Pin Placement)
- Toggle admin mode with password/key
- Drag and drop markers to precise locations
- Export updated coordinates to JSON
- Visual feedback during editing

### 4. Search & Filter
- Search murals by name, artist, or location
- Filter by building
- Highlight searched/filtered murals on map

### 5. Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Adaptive layout for different screen sizes

## Map Configuration

### Center Point
- Latitude: 33.3062741
- Longitude: -111.7051246
- Initial Zoom: 17-18 (close enough to see buildings)

### Map Style
- Custom Mapbox style or modified streets style
- Muted colors to make mural markers stand out
- Building footprints visible

### Custom Markers
- Color-coded by building or artist
- Hover effects for interactivity
- Active state when selected
- Custom SVG icons matching the modern aesthetic

## Development Workflow

1. **Setup**: Initialize Next.js project with TypeScript and Tailwind
2. **Data Preparation**: Convert CSV to JSON, add coordinates
3. **Map Integration**: Set up Mapbox with react-map-gl
4. **UI Components**: Build marker, modal, and sidebar components
5. **Interactivity**: Implement click handlers and state management
6. **Admin Mode**: Add draggable markers for coordinate adjustment
7. **Polish**: Add animations, optimize images, responsive design
8. **Deploy**: Configure Netlify and deploy

## Environment Variables

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiZ3JpZG5waXhlbCIsImEiOiJjbDRqNHhnM2wwM25iM3FteTJ1ZXljOGR2In0.GnrUDPM6Px34cpQzQYj9Ug
```

## Deployment

### Netlify Configuration
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables set in Netlify dashboard
- Automatic deployments from main branch

## Future Enhancements
- Virtual tours with image galleries
- AR integration for on-site experience
- User-submitted photos
- Mural voting/favorites
- Multi-language support

