"use client";
import { FC } from "react";

import { useRouter } from "next/navigation";

interface SignInButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const SignInButton: FC<SignInButtonProps> = ({
  children,
  mode = "redirect",
  asChild,
}) => {
  const router = useRouter();
  const OnClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span>TODO: IMPLEMENTATION</span>;
  }

  return (
    <span className="cursor-pointer" onClick={OnClick}>
      {children}
    </span>
  );
};

export default SignInButton;
