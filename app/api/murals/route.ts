import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Mural } from '@/types/mural';

const MURALS_FILE = path.join(process.cwd(), 'data', 'murals.json');

// GET - Load murals
export async function GET() {
  try {
    const fileContent = await fs.readFile(MURALS_FILE, 'utf-8');
    const murals: Mural[] = JSON.parse(fileContent);
    return NextResponse.json(murals);
  } catch (error) {
    console.error('Error reading murals file:', error);
    return NextResponse.json(
      { error: 'Failed to load murals' },
      { status: 500 }
    );
  }
}

// POST - Save murals
export async function POST(request: NextRequest) {
  try {
    const murals: Mural[] = await request.json();
    
    // Write murals to file
    await fs.writeFile(MURALS_FILE, JSON.stringify(murals, null, 2), 'utf-8');
    
    console.log(`Saved ${murals.length} murals to file`);
    return NextResponse.json({ success: true, count: murals.length });
  } catch (error) {
    console.error('Error saving murals file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save murals' },
      { status: 500 }
    );
  }
}

// PATCH - Update single mural coordinates
export async function PATCH(request: NextRequest) {
  try {
    const { muralId, lat, lng } = await request.json();
    
    // Read current murals
    const fileContent = await fs.readFile(MURALS_FILE, 'utf-8');
    const murals: Mural[] = JSON.parse(fileContent);
    
    // Find and update the mural
    const muralIndex = murals.findIndex(m => m.id === muralId);
    if (muralIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Mural not found' },
        { status: 404 }
      );
    }
    
    murals[muralIndex].location.coordinates = { lat, lng };
    
    // Write back to file
    await fs.writeFile(MURALS_FILE, JSON.stringify(murals, null, 2), 'utf-8');
    
    console.log(`Updated mural ${muralId} coordinates to (${lat}, ${lng})`);
    return NextResponse.json({ success: true, mural: murals[muralIndex] });
  } catch (error) {
    console.error('Error updating mural coordinates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update mural' },
      { status: 500 }
    );
  }
}

