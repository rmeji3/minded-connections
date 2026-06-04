import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import type { LoginCredentials } from "@/lib/auth-api";

/**
 * Wraps the login action in a TanStack mutation so components
 * get isPending, error, and reset for free.
 */
export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onError: (err) => {
      if (!(err instanceof ApiError)) {
        console.error("Unexpected login error:", err);
      }
    },
  });
}
