"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
type SignInButtonProps = {
  children: React.ReactNode;
}

const SignInButton: FC<SignInButtonProps> = ({
  children,
}) => {
  const router = useRouter();
  const OnClick = () => {
    router.push("/auth/login");
  };


  return (
    <span className="cursor-pointer" onClick={OnClick}>
      {children}
    </span>
  );
};

export default SignInButton;
