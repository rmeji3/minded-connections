import { useAuthContext } from "@/contexts/auth-context";

/**
 * Returns the current auth state and actions.
 *
 * Must be used inside a component rendered under <Providers>.
 */
export function useAuth() {
  return useAuthContext();
}
