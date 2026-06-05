import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import type { LoginCredentials } from "@/lib/auth-api";

/**
 * Wraps the login action in a TanStack mutation so components
 * get isPending, error, and reset for free. The signed-in user is
 * delivered through auth context (not this mutation's result); the
 * login page redirects off that context state.
 */
export function useLogin() {
  const { login } = useAuth();

  return useMutation<void, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onError: (err) => {
      if (!(err instanceof ApiError)) {
        console.error("Unexpected login error:", err);
      }
    },
  });
}
