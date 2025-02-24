"use server";

import { signOut } from "next-auth/react";

export async function LogOutSession(provider: string) Promise<String> | null {
  await signOut({ redirectTo: "/auth/login" });
}
