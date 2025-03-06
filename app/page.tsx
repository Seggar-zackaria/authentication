import { Button } from "@/components/ui/button";
import SignInButton from "@/components/auth/sign-in-button";
import { auth } from "@/auth";
import Link from "next/link"
export default async function Home() {

  const session = await auth()
  return (
    <main className="antialiased space-y-6 flex-col flex justify-center h-screen items-center bg-white">
      <div className="text-center text-4xl">
        <p>SunSummer</p>
        <h1>AUTH</h1>
      </div>
      {session ? 
      <Link href={"/dashboard"}>  
        <Button>
            Go to dashboard
        </Button>
      </Link>
      :
      <SignInButton>
        <Button variant={"default"} size={"lg"}>
          Sign in
        </Button>
      </SignInButton>
      }
    </main>
  );
}
