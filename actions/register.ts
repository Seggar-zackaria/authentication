"use server";

import { RegisterSchema } from "@/schemas/index";
import * as z from "zod";

export const Register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const { success, error } = RegisterSchema.safeParse(values);
    if (!success) {
      throw error;
    }
  } catch (error) {
    return { error: "Invalid fields", ErrorDetails: error };
  }

  return { success: "Logged in" };
};
