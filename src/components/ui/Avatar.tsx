"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getColorFromEmail, getInitialsFromEmail } from "@/lib/avatarUtils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ email, size = "md", className, ...props }: AvatarProps) {
  const color = getColorFromEmail(email);
  const initials = getInitialsFromEmail(email);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 hover:scale-105",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      {initials}
    </div>
  );
}

