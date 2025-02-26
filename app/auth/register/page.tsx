import RegisterForm from "@/components/auth/register-form";
import {auth} from '@/auth'
import {redirect} from 'next/navigation'
const RegisterPage = async () => {
  const session = await auth()

  if(session) { redirect("/setting")}
  return (
    <main>
      <div>
        <RegisterForm />
      </div>
    </main>
  );
};

export default RegisterPage;
