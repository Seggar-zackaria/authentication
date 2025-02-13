import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export const Social = () => {
  return (
    <div className="flex justify-center space-x-4 w-full">
      <Button
        variant={"default"}
        onClick={() => {}}
        size={"lg"}
        className="rounded-sm w-full"
      >
        <FcGoogle className="size-6" />
      </Button>
      <Button
        variant={"default"}
        size={"lg"}
        onClick={() => {}}
        className="rounded-sm w-full"
      >
        <FaGithub className="size-6" />
      </Button>
    </div>
  );
};
