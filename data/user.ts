import { db } from "@/lib/db";

const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: { email },
    });
  } catch (error) {
    return { error: "User not found" };
  }
};

const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: { id },
    });
  } catch (error) {
    return { error: "User not found" };
  }
};

// const saltAndHashPassword = async (password: string) => {
//   const hashPwd = await bcrypt.compare(password, password);
//   return hashPwd;
// };

export { getUserByEmail, getUserById };
