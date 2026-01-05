import React, { ElementType, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-5xl sm:text-6xl font-medium",
      // h2: "text-3xl font-semibold tracking-tight lg:text-4xl",
      // h3: "text-2xl font-semibold tracking-tight",
      // h4: "text-xl font-semibold tracking-tight",
      // h5: "text-lg font-semibold tracking-tight",
      // h6: "text-base font-semibold tracking-tight",
      body: "text-base leading-7",
      // bodyLarge: "text-lg leading-7",
      // bodySmall: "text-sm leading-6",
      // caption: "text-xs text-muted-foreground",
      // lead: "text-xl text-muted-foreground leading-7",
      // muted: "text-sm text-muted-foreground",
      // code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: ElementType;
}

const defaultElements = {
  h1: "h1",
  body: "p",
} as const;

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body", as, ...props }, ref) => {
    const Component = (as ||
      (variant && defaultElements[variant]) ||
      "p") as ElementType;

    return (
      <Component
        className={cn(typographyVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

