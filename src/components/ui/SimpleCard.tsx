import * as React from "react";
import { cn } from "@/lib/utils";

export type SimpleCardProps = React.HTMLAttributes<HTMLDivElement>;

export const SimpleCard = React.forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground",
          "transition-colors duration-200",
          "hover:border-primary/50 hover:bg-secondary/30",
          className
        )}
        {...props}
      />
    );
  }
);
SimpleCard.displayName = "SimpleCard";
