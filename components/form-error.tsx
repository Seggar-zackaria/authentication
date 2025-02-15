import { GoAlertFill } from "react-icons/go";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormErrorProps {
  message: string;
  description?: string;
}

export function FormError({ message, description }: FormErrorProps) {
  return (
    <Alert variant="destructive">
      <GoAlertFill className="h-4 w-4" />
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription>
        {description || "Something went wrong. Please try again."}
      </AlertDescription>
    </Alert>
  );
}
