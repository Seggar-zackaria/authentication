"use server";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOutSession } from "@/lib/session";
import { Form } from "../ui/form";

export const SignOutButton = async () => {
  return (
    <Form>
      <Button variant={"default"} size={"lg"} type="submit">
        Log Out
        <LogOut />
      </Button>
    </Form>
  );
};
