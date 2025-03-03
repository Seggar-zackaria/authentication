import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const LoginPage = async () => {
  const defaultLoginRedirect = DEFAULT_LOGIN_REDIRECT;
  const session = await auth();

  if (session) {
    redirect(defaultLoginRedirect);
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