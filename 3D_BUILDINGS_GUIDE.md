# 3D Buildings Feature Guide

## What Changed

Your Verde Station Murals map now has **3D building extrusions** with a **dark theme**, just like the Mapbox example you showed!

## Visual Features

### 3D Buildings
- **Height-based rendering**: Buildings appear with realistic height and depth
- **Purple gradient coloring**: Buildings change color based on height
  - Short buildings (0-50m): Indigo (#6366f1)
  - Medium buildings (50-100m): Purple (#8b5cf6)
  - Tall buildings (100-200m): Bright purple (#a855f7)
  - Very tall buildings (200m+): Magenta (#c026d3)
- **Smooth appearance**: Buildings fade in as you zoom to level 15+
- **Vertical gradient**: Realistic lighting effect from top to bottom
- **80% opacity**: Subtle transparency for a modern look

### Dark Theme
- **Map style**: Switched from light to dark theme
- **Better contrast**: Buildings and markers stand out beautifully
- **Improved readability**: Street names and labels are easier to read

### Enhanced Markers
- **Amber/Orange color** (#F59E0B): Default marker color for visibility on dark background
- **Green color** (#10B981): Selected marker state
- **Better contrast**: Markers pop against the dark map

### Camera Angle
- **45-degree pitch**: Map is tilted to showcase 3D buildings
- **Optimal zoom**: Set to 17.5 for perfect view of Verde Station
- **Smooth rotation**: You can rotate the map to see buildings from different angles

## How to Use

### Viewing 3D Buildings
1. The map loads with a tilted view (45-degree pitch)
2. Zoom in to see buildings appear in 3D (zoom level 15+)
3. Use two-finger drag (or right-click drag) to rotate the map
4. Use Shift + drag to change the pitch (tilt angle)

### Navigation Controls
- **Zoom**: Use the +/- buttons or scroll wheel
- **Rotate**: Right-click and drag (or two-finger drag on trackpad)
- **Pitch**: Hold Shift and drag up/down
- **Reset**: Click the compass icon to reset north

## Technical Details

### 3D Buildings Layer
```javascript
{
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': [
      'interpolate',
      ['linear'],
      ['get', 'height'],
      0, '#6366f1',    // Indigo for short buildings
      50, '#8b5cf6',   // Purple for medium
      100, '#a855f7',  // Bright purple for tall
      200, '#c026d3'   // Magenta for very tall
    ],
    'fill-extrusion-height': ['get', 'height'],
    'fill-extrusion-base': ['get', 'min_height'],
    'fill-extrusion-opacity': 0.8,
    'fill-extrusion-vertical-gradient': true
  }
}
```

### Map Configuration
```javascript
{
  latitude: 33.3062741,
  longitude: -111.7051246,
  zoom: 17.5,
  pitch: 45,  // 45-degree tilt
  bearing: 0  // North-facing
}
```

## Customization Options

### Change Building Colors
Edit `components/Map/MapContainer.tsx` and modify the color gradient:

```javascript
'fill-extrusion-color': [
  'interpolate',
  ['linear'],
  ['get', 'height'],
  0, '#your-color-1',
  50, '#your-color-2',
  100, '#your-color-3',
  200, '#your-color-4'
]
```

### Adjust Opacity
Make buildings more or less transparent:
```javascript
'fill-extrusion-opacity': 0.6  // More transparent
'fill-extrusion-opacity': 1.0  // Fully opaque
```

### Change Pitch (Tilt Angle)
Adjust the initial tilt in `VERDE_STATION_CENTER`:
```javascript
pitch: 60  // More tilted (bird's eye view)
pitch: 30  // Less tilted (closer to flat)
pitch: 0   // Completely flat (2D view)
```

### Switch Back to Light Theme
If you prefer the light theme:
```javascript
mapStyle="mapbox://styles/mapbox/light-v11"
```

And update marker colors back to blue:
```javascript
fill={isSelected ? '#10B981' : '#3B82F6'}
```

## Performance Notes

- 3D buildings only render at zoom level 15 and above
- This improves performance when viewing the map from far away
- Buildings smoothly fade in as you zoom closer
- The layer is optimized for smooth rendering on most devices

## Browser Compatibility

3D buildings work on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with WebGL support

## Troubleshooting

### Buildings not appearing?
1. Make sure you're zoomed in to level 15 or higher
2. Check that WebGL is enabled in your browser
3. Try refreshing the page

### Performance issues?
1. Reduce the opacity to 0.6 or lower
2. Increase the minzoom to 16 or 17
3. Disable vertical gradient if needed

### Want to disable 3D buildings?
Comment out or remove the `useEffect` hook in `MapContainer.tsx` that adds the 3D buildings layer.

## What's Next

You can further enhance the 3D experience by:
- Adding custom lighting effects
- Implementing time-of-day lighting
- Adding shadows
- Creating custom building styles for specific structures
- Adding animation effects

---

Enjoy your new 3D map! The buildings at Verde Station should now be clearly visible with depth and dimension.

