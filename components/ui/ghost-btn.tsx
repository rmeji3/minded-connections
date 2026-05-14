import { cn } from "@/lib/utils";

interface GhostBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean;
}

export function GhostBtn({ small, className, children, ...props }: GhostBtnProps) {
  return (
    <button
      className={cn("btn-ghost", small ? "btn-ghost--sm" : "btn-ghost--md", className)}
      {...props}
    >
      {children}
    </button>
  );
}
