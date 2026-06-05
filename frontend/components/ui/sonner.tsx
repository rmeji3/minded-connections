"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      duration={4000}
      gap={8}
      toastOptions={{
        style: {
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          borderRadius: "8px",
          background: "var(--warm-white)",
          border: "1px solid var(--linen)",
          color: "var(--ink)",
          boxShadow: "0 4px 16px rgba(39,35,32,.09), 0 1px 3px rgba(39,35,32,.06)",
        },
      }}
    />
  );
}
