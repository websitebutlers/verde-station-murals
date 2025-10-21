import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { CustomBuilding } from '@/types/building';

const BUILDINGS_FILE = path.join(process.cwd(), 'data', 'buildings.json');

// GET - Load buildings
export async function GET() {
  try {
    const fileContent = await fs.readFile(BUILDINGS_FILE, 'utf-8');
    const buildings: CustomBuilding[] = JSON.parse(fileContent);
    return NextResponse.json(buildings);
  } catch (error) {
    console.error('Error reading buildings file:', error);
    // If file doesn't exist or is invalid, return empty array
    return NextResponse.json([]);
  }
}

// POST - Save buildings
export async function POST(request: NextRequest) {
  try {
    const buildings: CustomBuilding[] = await request.json();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Write buildings to file
    await fs.writeFile(BUILDINGS_FILE, JSON.stringify(buildings, null, 2), 'utf-8');
    
    console.log(`Saved ${buildings.length} buildings to file`);
    return NextResponse.json({ success: true, count: buildings.length });
  } catch (error) {
    console.error('Error saving buildings file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save buildings' },
      { status: 500 }
    );
  }
}

