import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserEditForm } from "@/components/forms/user-edit-form";
import { AvatarDebug } from "@/components/ui/avatar-debug";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    }
  });

  if (!user) {
    redirect("/dashboard");
  }

  // Ensure non-null values for the form
  const formattedUser = {
    ...user,
    name: user.name || "",
    email: user.email || "",
  };

  // Log image path for debugging
  console.log("User image path:", user.image);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <UserEditForm 
          user={formattedUser}
          isAdmin={isAdmin}
        />
        
        {/* Debug component - can be removed in production */}
        {process.env.NODE_ENV !== "production" && (
          <div className="mt-8">
            <AvatarDebug />
          </div>
        )}
      </div>
    </div>
  );
} 