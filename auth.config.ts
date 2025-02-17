import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const existingUser = await db.user.findUnique({
            where: { email },
          });

          if (!existingUser || !existingUser.password) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password
          );

          console.log("Password match result:", passwordMatch); // Debugging 6: Password comparison

          if (passwordMatch) return existingUser;
        }

        return null;
      },
    }),
  ],
};

export default authConfig;
