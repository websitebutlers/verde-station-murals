# Next Steps for Verde Station Murals Project

## Immediate Tasks

### 1. Add Mural Images
The application is currently set up with placeholder image paths. You need to:

1. Collect all mural photos
2. Optimize images for web (recommended: 1200px wide, compressed JPG/WebP)
3. Name them according to the mural IDs in `data/murals.json`
4. Place them in `public/murals/` directory

Example:
```
public/murals/
  ├── abstract-behind-p.jpg
  ├── birds.jpg
  ├── cardinal.jpg
  └── ...
```

### 2. Adjust Mural Coordinates
All murals currently share the same coordinates. Use Admin Mode to position them:

1. Open the app at http://localhost:3000
2. Click "Admin Mode" in the header
3. Drag each marker to its precise location on the map
4. Click "Export Coordinates" to download the updated JSON
5. Replace `data/murals.json` with the exported file
6. Commit and push the changes

### 3. Add Artist Bios (Optional)
If you have detailed artist bios, you can:

1. Create `data/artists.json` with full bio information
2. Update `MuralModal.tsx` to display extended artist information
3. Add an artist directory page if desired

## Deployment to Netlify

### Option 1: Automatic Deployment (Recommended)

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `websitebutlers/verde-station-murals`
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variable:
   - Key: `NEXT_PUBLIC_MAPBOX_TOKEN`
   - Value: `pk.eyJ1IjoiZ3JpZG5waXhlbCIsImEiOiJjbDRqNHhnM2wwM25iM3FteTJ1ZXljOGR2In0.GnrUDPM6Px34cpQzQYj9Ug`
6. Click "Deploy site"

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

## Enhancements to Consider

### High Priority
- [ ] Add actual mural images
- [ ] Position all markers correctly using Admin Mode
- [ ] Test on mobile devices
- [ ] Add loading states for images
- [ ] Implement error boundaries

### Medium Priority
- [ ] Add search/filter functionality
- [ ] Create a sidebar with mural list
- [ ] Add building outlines overlay on the map
- [ ] Implement image gallery for murals with multiple photos
- [ ] Add share functionality (social media, copy link)

### Low Priority
- [ ] Add virtual tour mode (auto-navigate between murals)
- [ ] Implement favorites/bookmarking
- [ ] Add analytics to track popular murals
- [ ] Create QR codes for on-site scanning
- [ ] Add augmented reality features

## Customization Options

### Change Map Style
Edit `components/Map/MapContainer.tsx`:
```typescript
mapStyle="mapbox://styles/mapbox/streets-v12"  // More detailed
mapStyle="mapbox://styles/mapbox/dark-v11"     // Dark mode
mapStyle="mapbox://styles/mapbox/satellite-v9" // Satellite view
```

### Customize Marker Colors
Edit `components/Map/MuralMarker.tsx`:
```typescript
// Change selected color from green to another color
fill={isSelected ? '#FF6B6B' : '#3B82F6'}

// Color-code by building
const buildingColors = {
  'A': '#FF6B6B',
  'B1': '#4ECDC4',
  'B2': '#45B7D1',
  // ... etc
};
```

### Add Custom Map Controls
You can add more controls to the map:
```typescript
import { FullscreenControl, ScaleControl } from 'react-map-gl/mapbox';

// In MapContainer.tsx
<FullscreenControl position="top-right" />
<ScaleControl position="bottom-left" />
```

## Testing Checklist

- [ ] All markers appear on the map
- [ ] Clicking markers opens the modal
- [ ] Modal displays correct information
- [ ] Instagram links work correctly
- [ ] Admin mode allows dragging markers
- [ ] Export coordinates downloads JSON file
- [ ] Map is responsive on mobile
- [ ] Images load correctly
- [ ] Navigation controls work
- [ ] No console errors

## Maintenance

### Updating Mural Data
1. Edit `data/murals.json`
2. Commit and push changes
3. Netlify will automatically redeploy

### Adding New Murals
1. Add mural image to `public/murals/`
2. Add entry to `data/murals.json`
3. Use Admin Mode to position the marker
4. Export and update coordinates
5. Commit and push

### Updating Dependencies
```bash
npm update
npm audit fix
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the Mapbox token is set correctly
3. Ensure all images exist in the correct paths
4. Check that coordinates are valid (lat/lng)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)
- [react-map-gl Documentation](https://visgl.github.io/react-map-gl/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

Good luck with the project! The foundation is solid and ready for your content.

