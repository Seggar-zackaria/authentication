import * as z from "zod";

if (typeof window !== 'undefined') {
  // Only import File when in browser environment
  z.instanceof(File);
}

// const formatPhoneNumber = (value: string): string => {
//   const cleaned = value.replace(/\s/g, "");
//   if (cleaned.length !== 10) return cleaned;
//   return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(
//     6,
//     8
//   )} ${cleaned.slice(8)}`;
// };

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Invalid credentials")
    .max(32, "Password must be less than 32 characters"),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  // firstName: z.string().min(1, { message: "le prénom est obligatoire" }),
  // phoneNumber: z
  //   .string()
  //   .refine((value) => /^(05|06|07)\d{8}$/.test(value.replace(/\s/g, "")), {
  //     message: "le numéro de téléphone est invalide",
  //   })
  //   .transform(formatPhoneNumber),
  // dateOfBirth: z
  //   .string()
  //   .min(1, { message: "la date de naissance est obligatoire" }),
  // homeAddress: z.string().min(1, { message: "l'adresse est obligatoire" }),
  // gender: z.string().min(1, { message: "le genre est obligatoire" }),
  // passportNumber: z
  //   .string()
  //   .min(1, { message: "le numéro de passport est obligatoire" }),
  email: z.string().min(1, { message: "email is required" }).email(),
  password: z
    .string()
    .min(8, { message: "password most be 8 character or above" }),
});


export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "email is required" }).email(),
})

export const ResetPasswordSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be 8 characters or above")
    .max(32, "Password must be less than 32 characters"),
});

export const HotelSchema = z.object({
  name: z.string().min(1, { message: "Hotel name is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  rating: z.number().min(0).max(5).default(0),
  state: z.string().min(1, { message: "State is required" }),
  price: z.number().positive({ message: "Price is required" }),
  images: z
    .any()
    .refine((files) => {
      if (typeof window === 'undefined') {
        return Array.isArray(files);
      }
      return files instanceof FileList || Array.isArray(files);
    }, "Invalid file input")
    .transform((files) => {
      if (typeof window !== 'undefined' && files instanceof FileList) {
        return Array.from(files);
      }
      return files;
    })
    .default([]),
  amenities: z.array(z.string()).min(1, { message: "At least one amenity is required" })
});