"use server";
import { RegisterSchema } from "@/schemas/index";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const { success, error } = RegisterSchema.safeParse(values);
    if (!success) {
      throw error;
    }
  } catch (error) {
    return { error: "Invalid fields", ErrorDetails: error };
  }

  const { email, password, name }: z.infer<typeof RegisterSchema> = values;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "User created" };
};
