"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useState, useEffect } from "react";
import { FormError } from "@/components/form-error";
import { useSearchParams } from "next/navigation";

export const Social = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "OAuthAccountNotLinked") {
      setError(
        "Email already exists with different provider. Please sign in with the correct provider."
      );
    }
  }, [searchParams]);

  const handleSocialLogin = async (provider:"google") => {
    try {
      setIsLoading(true);
      setError(undefined);

      await signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,    
      });
    } catch (error) {
      setError(`Something went wrong with ${provider} login. ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <FormError message={error} />
      <div className="flex justify-center space-x-4 w-full">
        <Button
          onClick={() => handleSocialLogin("google")}
          size="lg"
          variant="outline"
          className="rounded-sm w-full"
          disabled={isLoading}
        >
          <FcGoogle className="size-6" />
        </Button>
       
      </div>
    </div>
  );
};