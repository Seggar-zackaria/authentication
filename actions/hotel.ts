import { HotelSchema } from "@/schemas/index";
import * as z  from "zod";
import { db } from "@/lib/db";

export const addHotel = async (values: z.infer<typeof HotelSchema>) => {
  try {
    const result = HotelSchema.safeParse(values);
    
    if (!result.success) {
      return { status: 400, error: "Invalid fields", details: result.error.format() };
    }

    const { name, description, images, address, city, state, country, price, amenities, rating } = result.data;

    await db.hotel.create({
      data: {
        name,
        description,
        address,
        city,
        country,
        price,
        state,
        rating,
        amenities,
        images,
      },
    });

    return { status: 201, message: "Hotel created successfully" };
  } catch (error) {
    return { status: 500, error: "Internal server error" };
  }
};
