"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BackButton } from "./back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    backButtonLabel: string;
    backButtonHref: string;
}

export const CardWrapper = ({
    children,
    backButtonLabel,
    backButtonHref
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-none border-none">
            <CardContent>{children}</CardContent>
            <CardFooter>
                <BackButton
                    href={backButtonHref}
                    label={backButtonLabel}
                />
            </CardFooter>
        </Card>
    )
}