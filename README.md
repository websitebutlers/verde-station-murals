# Verde Station Murals - Interactive Map

An interactive map application showcasing the vibrant murals at Verde Station plaza in Gilbert, Arizona. Built with Next.js, React, Mapbox GL, and Tailwind CSS.

## Features

- **Interactive Map**: Explore murals on a custom Mapbox map centered on Verde Station
- **Custom Markers**: Color-coded pins with building codes for easy identification
- **Mural Details**: Click any marker to view high-resolution images, artist information, and social media links
- **Admin Mode**: Drag and drop markers to adjust coordinates, then export updated data
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Powered by Framer Motion for delightful user interactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Mapping**: Mapbox GL JS with react-map-gl
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/websitebutlers/verde-station-murals.git
cd verde-station-murals
```

2. Install dependencies:
```bash
npm install
```

3. The `.env.local` file is already configured with the Mapbox token

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Viewing Murals

1. Navigate the map using mouse/touch gestures
2. Click on any marker to view mural details
3. Use the modal to see the mural image, artist info, and location
4. Click the Instagram link to visit the artist's profile

### Admin Mode (Coordinate Adjustment)

1. Click "Admin Mode" in the header
2. Drag markers to their precise locations on the map
3. Click "Export Coordinates" to download updated JSON
4. Replace `data/murals.json` with the exported file

## Adding Mural Images

Place mural images in the `public/murals/` directory and update the `image` field in `data/murals.json`

## Deployment

The project is configured for Netlify deployment. Push to the main branch to trigger automatic deployment.

---

Built with ❤️ for Verde Station, Gilbert, AZ
