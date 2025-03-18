'use server'

import { Permission } from '@/lib/types/permissions';
import { checkPermission } from '@/app/auth/permission/check-permission';
import { db } from "@/lib/db"

export async function createBooking(formData: FormData) {
  // Check permission first
  await checkPermission(Permission.CREATE_BOOKING);
  
  try {
    // Your booking creation logic here
    const booking = await db.hotelBooking.create({
      // ... booking data
    });
    
    return { success: true, data: booking };
  } catch (error) {
    return { success: false, error: 'Failed to create booking' };
  }
}

export async function deleteBooking(bookingId: string) {
  await checkPermission(Permission.DELETE_BOOKING);
  
  try {
    // Your booking deletion logic here
    await db.hotelBooking.delete({
      where: { id: bookingId }
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete booking' };
  }
}