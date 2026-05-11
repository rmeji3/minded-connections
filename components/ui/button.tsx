import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "text" | "text-dark" | "phone";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: Variant;
  size?: "default" | "sm";
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  light: "btn-light",
  text: "btn-text",
  "text-dark": "btn-text btn-text--on-dark",
  phone: "btn-phone",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, variant = "primary", size, className, ...props }, ref) => {
    const Comp: React.ElementType = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(variantClass[variant], size === "sm" && "btn-sm", className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
