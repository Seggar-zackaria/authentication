import RegisterForm from "@/components/auth/register-form";
import {auth} from '@/auth'
import {redirect} from 'next/navigation'
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const RegisterPage = async () => {
  const defaultLoginRedirect = DEFAULT_LOGIN_REDIRECT;
  const session = await auth()

  if(session) { redirect(defaultLoginRedirect)}
  return (
    <main>
      <div>
        <RegisterForm />
      </div>
    </main>
  );
};

export default RegisterPage;
