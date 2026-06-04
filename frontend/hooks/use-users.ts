import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchUserStats,
  createProvider,
  createPatient,
  deleteUser,
  type UsersQuery,
  type CreateProviderPayload,
  type CreatePatientPayload,
} from "@/lib/users-api";

export const userKeys = {
  all:   ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list:  (query: UsersQuery) => [...userKeys.lists(), query] as const,
  stats: () => [...userKeys.all, "stats"] as const,
};

// ─────────────────────────────────────────────────────────────────────────────

export function useUsers(query: UsersQuery = {}) {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn:  () => fetchUsers(query),
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn:  fetchUserStats,
  });
}

export function useCreateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProviderPayload) => createProvider(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}
