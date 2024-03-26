"use client";

import { BackButton } from "@/components/auth/back-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  backButtonLabel: string;
  backButtonHref: string;
}

export const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] border-none shadow-none">
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};
