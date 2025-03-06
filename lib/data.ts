import { db } from "@/lib/db";
import { UserCog } from "lucide-react";

export async function getUsers() {
const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
});

return users;
}


export const UserCount = async () => {
  const user = await db.user.count()
  
  return user
}

export const HotelCount = async () => {
  const hotel = await db.hotelBooking.count()
  
  return hotel
}
export const FlightCount = async () => {
  const flight = await db.flightBooking.count()
  
  return flight
}