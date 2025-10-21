# Changelog

## [1.1.0] - 2025-10-21

### Added
- **3D Building Extrusions with Depth**: Added true 3D building layer to the map
  - Buildings now render with realistic height, depth, and dimension
  - Purple gradient coloring based on building height
  - Smooth fade-in effect as you zoom in
  - Vertical gradient for realistic lighting
  - **Antialiasing enabled** for smooth, professional-looking edges

- **Dark Theme**: Switched to Mapbox dark theme for better visual contrast
  - Dark background makes buildings and markers stand out
  - Improved readability of street names and labels

- **Dramatic Camera Angles**:
  - **60-degree pitch** (tilt) for dramatic 3D building perspective
  - **-17.6 degree bearing** for optimal building viewing angle
  - Optimized zoom level (17.5) for viewing Verde Station plaza
  - Buildings now have clear depth and dimension when viewed

### Changed
- **Marker Colors**: Updated marker colors for better visibility on dark theme
  - Default markers: Amber/Orange (#F59E0B) instead of blue
  - Selected markers: Green (#10B981) for clear selection state
  - Improved contrast against dark background

### Technical Details
- Added `fill-extrusion` layer type for 3D buildings
- Implemented dynamic height interpolation based on zoom level
- Buildings appear at zoom level 15 and above
- Color gradient: Purple shades (#6366f1 → #c026d3) based on height
- 80% opacity for subtle transparency
- Vertical gradient enabled for realistic lighting
- **Antialias: true** for smooth 3D rendering
- **Pitch: 60** for dramatic tilt angle
- **Bearing: -17.6** for rotated perspective

## [1.0.0] - 2025-10-21

### Initial Release
- Interactive Mapbox map centered on Verde Station
- 23 mural locations with custom markers
- Mural detail modal with artist information
- Admin mode for draggable pin placement
- Export coordinates functionality
- Responsive design
- Netlify deployment configuration

