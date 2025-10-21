# Verde Station Murals - Embed Instructions

## Available Routes

### 1. **Home Page** - `/`
- Automatically redirects to the public map page
- Use this as the main entry point for visitors

### 2. **Public Map** - `/map`
- Full-featured public map with header
- Includes mural legend/list
- Click murals to view details
- Perfect for direct linking and sharing
- **URL**: `https://yourdomain.com/map`

### 3. **Embed Map** - `/embed`
- Minimal UI designed for iframe embedding
- No header, just a small branding badge
- Includes mural legend and interactive features
- Optimized for embedding in other websites
- **URL**: `https://yourdomain.com/embed`

### 4. **Admin Panel** - `/admin`
- Full admin controls for managing murals
- Edit mural details, images, and artist bios
- Drag pins to reposition murals
- Export coordinates
- Building editor for 3D structures
- **URL**: `https://yourdomain.com/admin`

---

## How to Embed the Map

### Basic Embed Code

```html
<iframe 
  src="https://yourdomain.com/embed" 
  width="100%" 
  height="600" 
  frameborder="0" 
  style="border:0;" 
  allowfullscreen
  loading="lazy">
</iframe>
```

### Responsive Embed (Recommended)

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://yourdomain.com/embed" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>
```

### Full-Height Embed

```html
<iframe 
  src="https://yourdomain.com/embed" 
  width="100%" 
  height="100vh" 
  frameborder="0" 
  style="border:0; display: block;" 
  allowfullscreen>
</iframe>
```

---

## Features Available in All Versions

- Interactive 3D map with custom buildings
- Clickable mural markers with thumbnails
- Mural detail modals with image galleries
- Image slider for multiple photos
- Artist information and social media links
- Mural legend/list with search functionality
- Zoom to mural location
- Mobile-responsive design
- Smooth animations and transitions

---

## Customization Options

If you need to customize the embed further, you can add URL parameters (future enhancement):

```
/embed?hideControls=true
/embed?hideLegend=true
/embed?theme=light
```

*(Note: These parameters would need to be implemented if required)*

---

## Technical Details

- Built with Next.js 14 and React
- Uses Mapbox GL JS for mapping
- Fully responsive (mobile, tablet, desktop)
- Optimized images hosted locally
- No external dependencies for mural data
- Fast loading with dynamic imports

---

## Support

For admin access or technical support, contact the site administrator.

