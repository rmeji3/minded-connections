import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Injected by FormField cloneElement
  id?: string;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, "aria-describedby": ariaDescribedby, "aria-required": ariaRequired, className, ...props }, ref) => {
    const [showPw, setShowPw] = React.useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-describedby={ariaDescribedby}
          aria-required={ariaRequired}
          type={showPw ? "text" : "password"}
          className={cn("pr-12", className)}
          {...props}
        />
        <button
          type="button"
          aria-label={showPw ? "Hide password" : "Show password"}
          onClick={() => setShowPw((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--stone-500)] hover:text-[var(--sage-500)] transition-colors duration-150 cursor-pointer rounded flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
        >
          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
