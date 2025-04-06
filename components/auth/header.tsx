import { cn } from "@/lib/utils";
import { FC } from "react";
import { Poppins } from "next/font/google";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: "600",
// });

interface HeaderProps {
  Label: string;
}
export const Header: FC<HeaderProps> = ({ Label }) => {
  return (
    <div className={cn(`text-sm text-center`)}>

      <p>{Label}</p>
    </div>
  );
};
