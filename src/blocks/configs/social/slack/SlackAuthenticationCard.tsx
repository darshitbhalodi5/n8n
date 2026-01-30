"use client";

import React from "react";
import { LogIn } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

interface SlackAuthenticationCardProps {
    onLogin: () => void;
}

/**
 * Authentication prompt card for Slack integration
 */
export const SlackAuthenticationCard = React.memo(function SlackAuthenticationCard({
    onLogin,
}: SlackAuthenticationCardProps) {
    return (
        <Card className="p-4 space-y-3">
            <Typography variant="bodySmall" className="font-semibold text-foreground">
                Authentication Required
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
                Please log in to configure Slack integration
            </Typography>
            <Button onClick={onLogin} className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                Login / Sign Up
            </Button>
        </Card>
    );
});
