import * as z from "zod";

// const formatPhoneNumber = (value: string): string => {
//   const cleaned = value.replace(/\s/g, "");
//   if (cleaned.length !== 10) return cleaned;
//   return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(
//     6,
//     8
//   )} ${cleaned.slice(8)}`;
// };

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
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
