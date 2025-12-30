import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva("grid", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
    },
    responsive: {
      true: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      false: "",
    },
  },
  defaultVariants: {
    columns: 1,
    gap: "md",
    responsive: false,
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns, gap, responsive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          gridVariants({
            columns: responsive ? undefined : columns,
            gap,
            responsive,
          }),
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";

export { Grid, gridVariants };

