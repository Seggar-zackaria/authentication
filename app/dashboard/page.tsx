import { PageWrapper } from "@/components/PageWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  console.log(session);
  return(
    <PageWrapper>
    <div>
        <h1>Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="rounded-lg">
                {session?.user?.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
        </div>
    </div>
    </PageWrapper>
  )
}