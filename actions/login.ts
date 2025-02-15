"use server";

import { LoginSchema } from "@/schemas/index";
import * as z from "zod";

export const Login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const { success, error } = LoginSchema.safeParse(values);
    if (!success) {
      throw error;
    }
  } catch (error) {
    return { error: "Invalid fields", ErrorDetails: error };
  }

  return { success: "Logged in" };
};
