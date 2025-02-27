'use server';

import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { ForgotPasswordSchema } from "@/schemas/index";
import crypto from "crypto";
import {sendPasswordResetEmail} from "@/app/api/send/route";
import { generatePasswordResetToken } from "@/lib/tokens";
export const forgotPassword = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    const generatedToken = crypto.randomBytes(32).toString("hex");
    const validatedFields = ForgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email } = validatedFields.data;

    const expires = new Date(Date.now() + 1000 * 60 * 60);

    const existingUser = await getUserByEmail(email);
    if(!existingUser){
        return {error: "Email not found"}
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);


    return {success: "Email sent"}
}
    
