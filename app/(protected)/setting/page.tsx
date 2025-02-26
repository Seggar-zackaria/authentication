"use server";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
const SettingPage = async () => {
  const session = await auth();

  return (
    <div>
      <h1>User Credentials</h1>
      {session ? (
        <div>
          <p>Email: {session.user?.email}</p>
          <p>Name: {session.user?.name}</p>
          <p>Role: {JSON.stringify(session.user.role)} </p>
          <Image src={session.user?.image}
          className="size-12 rounded-lg" width={100} height={100} alt={session.user.name}></Image>
          <SignOutButton />
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <Button variant={"default"}>
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
