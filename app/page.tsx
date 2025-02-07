import { Button } from "@/components/ui/button";
import SignInButton from "@/components/auth/sign-in-button";
export default function Home() {
  return (
    <main className="antialiased space-y-6 flex-col flex justify-center h-screen items-center bg-white">
      <div className="text-center text-4xl">
        <h1>AUTH</h1>
        <p>Authentication service</p>
      </div>
      <SignInButton>
        <Button variant={"default"} size={"lg"}>
          Sign in
        </Button>
      </SignInButton>
    </main>
  );
}
