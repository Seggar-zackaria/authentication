import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail, getUserById } from "@/data/user";
import bcrypt from "bcryptjs";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate form fields
        const validateFields = LoginSchema.safeParse(credentials);
        if (!validateFields.success) {
          throw new Error("Invalid input");
        }

        const { email, password } = validateFields.data;

        const existingUser = await getUserByEmail(email);

        if (!existingUser || !existingUser.password) {
          throw new Error("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!passwordMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
