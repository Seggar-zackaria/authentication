import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

const LoginPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/setting");
  }

  return (
    <main>
      <div>
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;