import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const SettingPage = async () => {
  const Session = await auth();
  return (
    <div>
      <h1>{JSON.stringify(Session)}</h1>
      hi rania
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>
          Sign out
          <LogOut />
        </Button>
      </form>
    </div>
  );
};

export default SettingPage;
