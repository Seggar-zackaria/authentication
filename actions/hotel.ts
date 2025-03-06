import { HotelSchema } from "@/schemas/index";
import * as z  from "zod";
import { db } from "@/lib/db";

export const addHotel = async (values: z.infer<typeof HotelSchema>) => {
  try {
    const { success, error } = HotelSchema.safeParse(values);
    if (!success) {
      return { status: 400, error: "Invalid fields" };
    }
    const { name, description, images, address, city, state, country, price, amenities, rating } = values;
    
    const hotel = await db.hotel.create({
      data: {
        name,
        description,
        address,
        city,
        country,
        price,
        rating,
        amenities,
        images,
    },
    });
  } catch (error) {
    return { status: 500, error: "Internal server error" };
  }
};

