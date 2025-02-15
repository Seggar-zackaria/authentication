import { FaCheckCircle } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormSuccesProps {
  message: string;
  description?: string;
}

export function FormSucces({ message, description }: FormSuccesProps) {
  return (
    <Alert variant="succes">
      <FaCheckCircle className="h-4 w-4" />
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription>
        {description || "Success! Your form has been submitted."}
      </AlertDescription>
    </Alert>
  );
}
