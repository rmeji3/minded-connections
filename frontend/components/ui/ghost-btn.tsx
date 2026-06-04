import { cn } from "@/lib/utils";

interface GhostBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean;
}

export function GhostBtn({ small, className, children, ...props }: GhostBtnProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center border-[1.5px] border-[var(--linen)] rounded bg-transparent cursor-pointer font-[var(--font-body)] text-[var(--stone-600)] uppercase tracking-[.07em] transition-colors hover:border-[var(--sage-400)] hover:text-[var(--sage-700)] whitespace-nowrap",
        small ? "px-2.5 py-1.5 text-[0.6875rem]" : "px-3.5 py-2 text-[0.75rem]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
