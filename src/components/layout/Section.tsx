import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full", {
  variants: {
    padding: {
      none: "py-0",
      sm: "py-8 sm:py-12",
      md: "py-12 sm:py-16",
      lg: "py-16 sm:py-24",
      xl: "py-24 sm:py-32",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article" | "aside";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding, as: Component = "section", ...props }, ref) => {
    return (
      <Component
        // @ts-expect-error - ref type varies by component
        ref={ref}
        className={cn(sectionVariants({ padding }), className)}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";

export { Section, sectionVariants };

