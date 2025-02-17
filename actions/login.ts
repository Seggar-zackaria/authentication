"use server";

import { LoginSchema } from "@/schemas/index";
import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const Login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields", status: 400 };
  }

  const { email, password } = validatedFields.data;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      // redirect: false,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    if (result?.error) {
      switch (result.error) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    if (result?.url) {
      return { redirectUrl: result.url };
    }

    return { error: "An unexpected error occurred" };
  } catch (error) {
    // Handle unexpected errors
    if (error instanceof AuthError) {
      return { error: "Authentication failed" };
    }
    throw error;
  }
};
