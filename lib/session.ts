"use server";

import { signOut } from "next-auth/react";

export async function LogOutSession(provider: string): Promise<string | void> {
  await signOut();
  return ;
}
