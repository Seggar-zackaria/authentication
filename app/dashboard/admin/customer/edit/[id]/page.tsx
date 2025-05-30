import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserEditForm } from "@/components/forms/user-edit-form";
import { Suspense } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

// Default export as the main async Server Component
export default async function UserEditPage({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // Only admin can edit other users
  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && session.user.id !== params.id) {
    redirect("/dashboard");
  }
  
  const user = await db.user.findUnique({
    where: { id: params.id },
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

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isAdmin ? "Edit User" : "Edit Profile"}
        </h1>
        <UserEditForm 
          user={formattedUser}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
