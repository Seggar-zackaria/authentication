import { getVerificationTokenByEmail } from "@/data/verification-token";
import { randomBytes } from "crypto";
import { db } from "./db";

export const generateToken = async (identifier: string) => {
  // generate a random token
  const token = randomBytes(32).toString("hex");
  // 1000ms * 60s * 60min = 1 hour in milliseconds
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  const existingToken = await getVerificationTokenByEmail(identifier);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return verificationToken;
};
