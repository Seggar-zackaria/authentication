"use server";

// import { AuthError } from "next-auth";

// import { signIn } from "next-auth/react";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

// export const Login = async (values: z.infer<typeof LoginSchema>) => {
//   const validateFields = LoginSchema.safeParse(values);

//   if (!validateFields) {
//     return { error: "Invalid fields!" };
//   }

//   try {
//     await signIn("credentials", {
//       email: validateFields.data?.email,
//       password: validateFields.data?.password,
//       redirect: false,
//       redirectTo: DEFAULT_LOGIN_REDIRECT,
//     });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Invalid credentials" };
//         default:
//           return { error: "Something went wrong!" };
//       }
//     }
//   }
// };

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

interface LoginProps {
  values: z.infer<typeof LoginSchema>;
  formData: FormData;
}
interface LoginResponse {
  success?: string;
  error?: string;
}
export async function Login({
  values,
  formData,
}: LoginProps): Promise<LoginResponse> {
  const validateFields = LoginSchema.safeParse(values);

  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
    });
    return !validateFields
      ? { error: "incorrect credentials!" }
      : { success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}
