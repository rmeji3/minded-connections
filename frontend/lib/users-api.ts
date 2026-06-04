import { apiRequest } from "@/lib/api-client";

export type UserRole = "Admin" | "Provider" | "Patient";

export interface UserDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: UserRole | null;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UserStats {
  total: number;
  patients: number;
  providers: number;
  admins: number;
}

export interface UsersQuery {
  page?: number;
  pageSize?: number;
  role?: UserRole | "";
  search?: string;
}

export interface CreateProviderPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty?: string;
  bio?: string;
  phone?: string;
  timezone?: string;
}

export interface CreatePatientPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  timezone?: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export function fetchUsers(query: UsersQuery = {}): Promise<PagedResponse<UserDto>> {
  const params = new URLSearchParams();
  if (query.page)     params.set("page",     String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.role)     params.set("role",     query.role);
  if (query.search)   params.set("search",   query.search);

  const qs = params.toString();
  return apiRequest<PagedResponse<UserDto>>(`/users${qs ? `?${qs}` : ""}`);
}

export function fetchUserStats(): Promise<UserStats> {
  return apiRequest<UserStats>("/users/stats");
}

export function fetchUser(id: string): Promise<UserDto> {
  return apiRequest<UserDto>(`/users/${id}`);
}

export function createProvider(payload: CreateProviderPayload): Promise<UserDto> {
  return apiRequest<UserDto>("/users/providers", { method: "POST", body: payload });
}

export function createPatient(payload: CreatePatientPayload): Promise<UserDto> {
  return apiRequest<UserDto>("/users/patients", { method: "POST", body: payload });
}

export function deleteUser(id: string): Promise<void> {
  return apiRequest<void>(`/users/${id}`, { method: "DELETE" });
}
