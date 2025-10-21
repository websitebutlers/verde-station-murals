const fs = require('fs');
const path = require('path');

// Mapping of folder names to mural IDs
const folderToMuralMap = {
  'madmanart (Abstract Behind P)': 'abstract-behind-p',
  'macsch_ (Birds)': 'birds',
  'PriceGoodman (Concrete face)': 'concrete-face',
  'Tato (Cello & Musicians & Distorted Face)': 'distorted-face', // One of Tato's murals
  'somethingsparkley (Dreamy Cotton Fields)': 'dreamy-cotton-field',
  'JustCreatedIt (Peony & Electric box)': 'electric-box', // One of Just's murals
  'PrimeAfterPrime (Field of Screams)': 'field-of-screams',
  'Issac.Caruso (Largest Mural)': 'gilbert-mural',
  'clyde_0000 (Girl & Flower)': 'girl-flower-pannels',
  'GabrielPecinaArt (Horse & Cowboy)': 'horse-and-cowboy',
  'SmokeyJoePaintingCo': 'jimi-hendrix', // One of Smokey Joe's murals
  'nyla.lee (Love and Peace)': 'love-peace-adjacent-murals',
  'ABOMBTHEARTIST (Low Rider Truck)': 'low-rider-truck',
  'ize_official (Manny, Moe, & Jack)': 'manny-moe-jack',
  'jessie.yazzie (Navajo Hoop Dancer)': 'navajo-hoop-dancer',
  'torvasm (Shiny Statues)': 'shiny-statues',
  'tonyplak (Welcome)': 'welcome',
  'Baconcat (Whimsical Tiger)': 'whimsical-tiger'
};

// Special handling for artists with multiple murals
const multiMuralArtists = {
  'Tato (Cello & Musicians & Distorted Face)': ['distorted-face', 'musician'],
  'JustCreatedIt (Peony & Electric box)': ['electric-box', 'peony']
};

// Special handling for Smokey Joe with subfolders
const smokeyJoeMapping = {
  'SmokeyJoePaintingCo/Jimi Hendrix': 'jimi-hendrix',
  'SmokeyJoePaintingCo/Utility box': 'utility-box'
};

const assetsDir = path.join(__dirname, '../public/assets');
const muralsFile = path.join(__dirname, '../data/murals.json');

// Read murals.json
const murals = JSON.parse(fs.readFileSync(muralsFile, 'utf-8'));

// Process each folder
Object.entries(folderToMuralMap).forEach(([folderName, muralId]) => {
  const folderPath = path.join(assetsDir, folderName);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder not found: ${folderName}`);
    return;
  }

  // Get all image files from the folder
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log(`⚠️  No images found in: ${folderName}`);
    return;
  }

  // Sort images by filename for consistent ordering
  imageFiles.sort();

  // Create images array (limit to 5)
  const images = imageFiles.slice(0, 5).map((file, index) => ({
    url: `/assets/${folderName}/${file}`,
    description: `${folderName.split('(')[1]?.replace(')', '') || 'Mural'} - Image ${index + 1}`,
    isPrimary: index === 0 // First image is primary
  }));

  // Find and update the mural
  const muralIndex = murals.findIndex(m => m.id === muralId);
  if (muralIndex === -1) {
    console.log(`❌ Mural not found: ${muralId}`);
    return;
  }

  murals[muralIndex].images = images;
  console.log(`✅ Updated ${muralId} with ${images.length} images`);
});

// Handle multi-mural artists - distribute images evenly
Object.entries(multiMuralArtists).forEach(([folderName, muralIds]) => {
  const folderPath = path.join(assetsDir, folderName);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder not found: ${folderName}`);
    return;
  }

  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log(`⚠️  No images found in: ${folderName}`);
    return;
  }

  imageFiles.sort();

  // Distribute images across murals
  const imagesPerMural = Math.ceil(imageFiles.length / muralIds.length);
  
  muralIds.forEach((muralId, muralIndex) => {
    const startIdx = muralIndex * imagesPerMural;
    const endIdx = Math.min(startIdx + imagesPerMural, imageFiles.length);
    const muralImages = imageFiles.slice(startIdx, endIdx);

    if (muralImages.length === 0) return;

    const images = muralImages.slice(0, 5).map((file, index) => ({
      url: `/assets/${folderName}/${file}`,
      description: `${folderName.split('(')[1]?.replace(')', '') || 'Mural'} - Image ${index + 1}`,
      isPrimary: index === 0
    }));

    const muralIndexInArray = murals.findIndex(m => m.id === muralId);
    if (muralIndexInArray === -1) {
      console.log(`❌ Mural not found: ${muralId}`);
      return;
    }

    murals[muralIndexInArray].images = images;
    console.log(`✅ Updated ${muralId} with ${images.length} images (multi-mural artist)`);
  });
});

// Handle Smokey Joe's subfolders
Object.entries(smokeyJoeMapping).forEach(([folderPath, muralId]) => {
  const fullPath = path.join(assetsDir, folderPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Folder not found: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(fullPath);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log(`⚠️  No images found in: ${folderPath}`);
    return;
  }

  imageFiles.sort();

  const images = imageFiles.slice(0, 5).map((file, index) => ({
    url: `/assets/${folderPath}/${file}`,
    description: `${folderPath.split('/')[1]} - Image ${index + 1}`,
    isPrimary: index === 0
  }));

  const muralIndex = murals.findIndex(m => m.id === muralId);
  if (muralIndex === -1) {
    console.log(`❌ Mural not found: ${muralId}`);
    return;
  }

  murals[muralIndex].images = images;
  console.log(`✅ Updated ${muralId} with ${images.length} images (Smokey Joe)`);
});

// Write updated murals back to file
fs.writeFileSync(muralsFile, JSON.stringify(murals, null, 2), 'utf-8');
console.log('\n🎉 Successfully updated murals.json with local images!');
console.log(`📊 Total murals updated: ${murals.filter(m => m.images && m.images.length > 0).length}`);

