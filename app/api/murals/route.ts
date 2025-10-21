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

// PATCH - Update single mural (coordinates or full data)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Read current murals
    const fileContent = await fs.readFile(MURALS_FILE, 'utf-8');
    const murals: Mural[] = JSON.parse(fileContent);

    // Check if this is a coordinate update or full mural update
    if (body.muralId && body.lat !== undefined && body.lng !== undefined) {
      // Coordinate update (legacy support)
      const muralIndex = murals.findIndex(m => m.id === body.muralId);
      if (muralIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Mural not found' },
          { status: 404 }
        );
      }

      murals[muralIndex].location.coordinates = { lat: body.lat, lng: body.lng };

      await fs.writeFile(MURALS_FILE, JSON.stringify(murals, null, 2), 'utf-8');
      console.log(`Updated mural ${body.muralId} coordinates to (${body.lat}, ${body.lng})`);
      return NextResponse.json({ success: true, mural: murals[muralIndex] });
    } else if (body.id) {
      // Full mural update
      const muralIndex = murals.findIndex(m => m.id === body.id);
      if (muralIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Mural not found' },
          { status: 404 }
        );
      }

      // Update the mural with new data
      murals[muralIndex] = body as Mural;

      await fs.writeFile(MURALS_FILE, JSON.stringify(murals, null, 2), 'utf-8');
      console.log(`Updated mural ${body.id} data (bio, images, etc.)`);
      return NextResponse.json({ success: true, mural: murals[muralIndex] });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating mural:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update mural' },
      { status: 500 }
    );
  }
}

