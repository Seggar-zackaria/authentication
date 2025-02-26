"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <Button 
      size="lg" 
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
    >
      Log Out
      <LogOut />
    </Button>
  );
};
