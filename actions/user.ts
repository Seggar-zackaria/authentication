"use server";

import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { UserEditSchema, type UserEditValues } from "@/lib/schemas/user";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function editUser(
  userId: string,
  formData: FormData,
  isAdmin: boolean = false
) {
  try {
    const session = await auth();
    
    if (!session) {
      return { error: "Unauthorized" };
    }

    // If not admin, user can only edit their own account
    if (!isAdmin && session.user.id !== userId) {
      return { error: "Unauthorized" };
    }

    // Debug: Log form data entries
    console.log('Form data received:', {
      name: formData.get("name"),
      email: formData.get("email"),
      hasPassword: !!formData.get("password"),
      role: formData.get("role"),
      hasImage: formData.has("image") && (formData.get("image") as File)?.size > 0
    });

    const values = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string | null,
      role: formData.get("role") as UserRole,
    };

    // Basic validation before schema validation
    if (!values.name?.trim()) {
      return { error: "Name is required" };
    }

    if (!values.email?.trim()) {
      return { error: "Email is required" };
    }

    // Normalize password value
    if (values.password === null || values.password === undefined) {
      values.password = ""; // Convert null/undefined to empty string
    }

    // Validate input
    const validatedFields = UserEditSchema.safeParse(values);
    if (!validatedFields.success) {
      const errors = validatedFields.error.format();
      console.error("Validation errors:", errors);
      
      // Find first field with errors
      for (const [field, fieldErrors] of Object.entries(errors)) {
        // Skip _errors at root level
        if (field === '_errors') continue;
        
        // Check if this field has errors
        if (fieldErrors && typeof fieldErrors === 'object' && '_errors' in fieldErrors && 
            Array.isArray(fieldErrors._errors) && fieldErrors._errors.length > 0) {
          return { error: fieldErrors._errors[0] };
        }
      }
      
      // Fallback to generic error
      return { error: "Invalid fields" };
    }

    // Check if email is already taken by another user
    const existingUser = await db.user.findFirst({
      where: {
        email: values.email,
        NOT: {
          id: userId
        }
      }
    });

    if (existingUser) {
      return { error: "Email already in use" };
    }

    // Prepare update data
    const updateData: any = {
      name: values.name,
      email: values.email,
    };

    // Only admin can change roles
    if (isAdmin) {
      updateData.role = values.role;
    }

    // Handle image upload
    const imageFile = formData.get("image") as File;
    if (imageFile && typeof imageFile !== 'string' && imageFile instanceof File && imageFile.size > 0) {
      try {
        console.log("Processing image upload:", {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size
        });
        
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename with sanitized extension
        const filename = sanitizeFileName(`${userId}-${Date.now()}.${getFileExtension(imageFile.name)}`);
        
        // Ensure avatars directory exists
        const fs = require('fs');
        // Place avatars in the public directory for direct access
        const avatarDir = "avatars";
        const avatarPath = join(process.cwd(), "public", avatarDir);
        
        if (!fs.existsSync(avatarPath)) {
          fs.mkdirSync(avatarPath, { recursive: true });
        }
        
        // Use a relative path that works with Next.js image loading
        const relativePath = `/${avatarDir}/${filename}`;
        const fullPath = join(avatarPath, filename);
        
        // Save file
        await writeFile(fullPath, buffer);
        console.log("Image saved successfully:", {
          relativePath,
          fullPath
        });
        
        updateData.image = relativePath;
      } catch (error) {
        console.error("[IMAGE_UPLOAD_ERROR]", error);
        return { error: "Failed to upload image" };
      }
    } else {
      console.log("No valid image file received");
    }

    // Hash password if provided
    if (values.password && typeof values.password === 'string' && values.password.trim()) {
      const hashedPassword = await bcrypt.hash(values.password, 10);
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/admin/customer/${userId}`);
    revalidatePath("/dashboard/profile");

    return { success: "User updated successfully", user: updatedUser };
  } catch (error) {
    console.error("[USER_EDIT_ERROR]", error);
    return { error: "Something went wrong!" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth();
    
    if (!session) {
      return { error: "Unauthorized", status: 401 };
    }

    // Only admins can delete users
    if (session.user.role !== "ADMIN") {
      return { error: "Unauthorized", status: 401 };
    }

    // Cannot delete your own account
    if (session.user.id === userId) {
      return { error: "Cannot delete your own account", status: 400 };
    }

    // Delete user
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/admin/customers");
    
    return { 
      success: "User deleted successfully",
      status: 200
    };
  } catch (error) {
    console.error("[USER_DELETE_ERROR]", error);
    return { 
      error: "Something went wrong!",
      status: 500
    };
  }
}

// Helper function to sanitize file names
function sanitizeFileName(filename: string): string {
  // Remove any path components, illegal characters, etc.
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

// Helper function to get a safe file extension
function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  // Only allow specific extensions
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  return allowedExtensions.includes(ext) ? ext : 'jpg';
}
