import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, disabled, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "cursor-pointer group relative px-6 h-[50px] overflow-hidden rounded-full flex items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Gradient Background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #f97316 0%, #fb923c 50%, #f97316 100%)",
          }}
        />

        {/* Content with hover effect */}
        <div className="relative z-10 flex items-center justify-center gap-2 text-white overflow-hidden h-full">
          {/* Original text - slides down on hover */}
          <div className="flex items-center gap-2 transition-transform duration-300 ease-in-out group-hover:translate-y-[50px]">
            {children}
          </div>
          {/* Duplicate text - starts above (hidden) and slides down on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out -translate-y-[50px] group-hover:translate-y-0">
            {children}
          </div>
        </div>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
