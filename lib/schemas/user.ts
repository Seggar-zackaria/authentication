import * as z from "zod";
import { UserRole } from "@prisma/client";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const UserEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.union([
    z.string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters"),
    z.literal(""),
    z.null(),
  ])
  .optional()
  .transform(val => val === null ? "" : val), // Transform null to empty string
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  image: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .nullable()
    .optional(),
});

export type UserEditValues = z.infer<typeof UserEditSchema>; 