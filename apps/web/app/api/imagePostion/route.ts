// app/api/imagePosition/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@repo/prisma_database/client';
import { z } from 'zod';

// Schema for position validation
const PositionSchema = z.object({
  imageId: z.string(),
  index: z.number().int(),
  position: z.object({
    x: z.number().min(-100).max(100),
    y: z.number().min(-100).max(100),
    zoom: z.number().min(1.0).max(2.0),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    
    // Validate request body
    const validatedData = PositionSchema.safeParse(json);
    
    if (!validatedData.success) {
      return Response.json(
        { error: 'Invalid input', details: validatedData.error.errors },
        { status: 400 }
      );
    }

    const { imageId, index, position } = validatedData.data;

    // Update or create the position record
    const result = await prisma.imagePosition.upsert({
      where: {
        image_id: imageId,
      },
      update: {
        position_x: position.x,
        position_y: position.y,
        zoom: position.zoom,
        index: index,
        updated_at: new Date(),
      },
      create: {
        image_id: imageId,
        index: index,
        position_x: position.x,
        position_y: position.y,
        zoom: position.zoom,
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error('Error updating image position:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get position for a specific image
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return Response.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const position = await prisma.imagePosition.findUnique({
      where: {
        image_id: imageId,
      },
    });

    if (!position) {
      return Response.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }

    // Transform database format back to component format
    const formattedPosition = {
      imageId: position.image_id,
      index: position.index,
      position: {
        x: position.position_x,
        y: position.position_y,
        zoom: position.zoom,
      },
    };

    return Response.json(formattedPosition);
  } catch (error) {
    console.error('Error fetching image position:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a position
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return Response.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    await prisma.imagePosition.delete({
      where: {
        image_id: imageId,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting image position:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}