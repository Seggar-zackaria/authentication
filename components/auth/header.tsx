import { cn } from "@/lib/utils";
import { FC } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "600",
});

interface HeaderProps {
  Label: string;
}
const Header: FC<HeaderProps> = ({ Label }) => {
  return (
    <span className={cn(`text-sm text-center ${poppins.className}`)}>
      {Label}
    </span>
  );
};

export default Header;
