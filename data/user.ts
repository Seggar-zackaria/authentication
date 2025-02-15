import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: { email },
    });
  } catch (error) {
    return { error: "User not found" };
  }
};

export const getUserById = async (id: number) => {
  try {
    return await db.user.findUnique({
      where: { id },
    });
  } catch (error) {
    return { error: "User not found" };
  }
};
