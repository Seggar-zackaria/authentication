import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import Header from "@/components/auth/header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  footerLabel: string;
}

export default function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  footerLabel,
}: CardWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <h1>AUTH</h1>
        <Header Label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <p>{footerLabel}</p>
      </CardFooter>
    </Card>
  );
}
