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
      return { status: 400, error: "Invalid fields" };
    }
    const { email, password, name } = values;
    
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return { error: "User already exists", status: 409 };
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return { success: "User created", status: 201 };
  } catch (error) {
    return { status: 500, error: "Internal server error" };
  }
};
