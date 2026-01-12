"use client";

import React from "react";
import { LogIn, LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { cn } from "@/lib/utils";

interface AuthenticationRequiredProps {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Icon to display */
  icon?: LucideIcon;
  /** Icon color class */
  iconColorClass?: string;
  /** Login button text */
  buttonText?: string;
  /** Callback when login button is clicked */
  onLogin: () => void;
  /** Additional class name */
  className?: string;
}

/**
 * AuthenticationRequired - Shared component for prompting user authentication
 */
export function AuthenticationRequired({
  title = "Authentication Required",
  description = "Please log in to continue",
  icon: Icon = LogIn,
  iconColorClass = "text-primary",
  buttonText = "Log In",
  onLogin,
  className,
}: AuthenticationRequiredProps) {
  return (
    <Card className={cn("p-6 space-y-4 border-border", className)}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className={cn("w-5 h-5", iconColorClass)} aria-hidden="true" />
        </div>
        <div>
          <Typography
            variant="bodySmall"
            className="font-semibold text-foreground"
          >
            {title}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            {description}
          </Typography>
        </div>
      </div>
      <Button onClick={onLogin} className="w-full gap-2">
        <LogIn className="w-4 h-4" aria-hidden="true" />
        {buttonText}
      </Button>
    </Card>
  );
}

// ============ Integration-specific presets ============

interface IntegrationAuthCardProps {
  onLogin: () => void;
  className?: string;
}

export function SlackAuthCard({
  onLogin,
  className,
}: IntegrationAuthCardProps) {
  return (
    <AuthenticationRequired
      title="Slack Authentication"
      description="Log in to configure Slack integration"
      onLogin={onLogin}
      className={className}
    />
  );
}

export function TelegramAuthCard({
  onLogin,
  className,
}: IntegrationAuthCardProps) {
  return (
    <AuthenticationRequired
      title="Telegram Authentication"
      description="Log in to configure Telegram integration"
      onLogin={onLogin}
      className={className}
    />
  );
}

export function EmailAuthCard({
  onLogin,
  className,
}: IntegrationAuthCardProps) {
  return (
    <AuthenticationRequired
      title="Email Authentication"
      description="Log in to configure email notifications"
      onLogin={onLogin}
      className={className}
    />
  );
}
