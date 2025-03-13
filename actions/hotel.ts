'use server';

import { db } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import { HotelSchema } from '@/schemas/index';
import * as z from 'zod';

export async function addHotel(values: z.infer<typeof HotelSchema>) {
  try {
    const validatedFields = HotelSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        status: 400,
        error: 'Invalid fields',
        message: validatedFields.error.message,
      };
    }

    const { images, ...hotelData } = validatedFields.data;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Process and save images
    const imageUrls = await Promise.all(
      images.map(async (file: File) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadsDir, fileName);
        
        await fs.writeFile(filePath, buffer);
        return `/uploads/${fileName}`;
      })
    );

    // Create hotel record with image URLs
    await db.hotel.create({
      data: {
        ...hotelData,
        images: imageUrls,
      },
    });

    return {
      status: 201,
      message: 'Hotel created successfully',
    };
  } catch (error) {
    console.error('Hotel creation error:', error);
    return {
      status: 500,
      error: 'Failed to create hotel',
    };
  }
}

export async function editHotel(
  hotelId: string,
  values: z.infer<typeof HotelSchema>
) {
  try {
    const validatedFields = HotelSchema.safeParse(values);

    // Check if hotel exists
    const existingHotel = await db.hotel.findUnique({
      where: { id: hotelId }
    });

    if (!existingHotel) {
      return {
        status: 404,
        error: 'Hotel not found'
      };
    }

    if (!validatedFields.success) {
      return {
        status: 400,
        error: 'Invalid fields',
        message: validatedFields.error.message,
      };
    }

    const { images, ...hotelData } = validatedFields.data;

    // Process new images only if provided
    let imageUrls = existingHotel.images;
    if (images && images.length > 0) {
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      imageUrls = await Promise.all(
        images.map(async (file: File) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = path.join(uploadsDir, fileName);
          
          await fs.writeFile(filePath, buffer);
          return `/uploads/${fileName}`;
        })
      );
    }

    await db.hotel.update({
      where: { id: hotelId },
      data: {
        ...hotelData,
        images: imageUrls,
      },
    });

    return {
      status: 200,
      message: 'Hotel updated successfully',
    };
  } catch (error) {
    console.error('Hotel update error:', error);
    return {
      status: 500,
      error: 'Failed to update hotel',
    };
  }
}
