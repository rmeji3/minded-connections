import { apiRequest } from "./api-client";

export interface SlotDto {
  id: string;
  providerId: string;
  startsAt: string;
  endsAt: string;
}

export interface BookAppointmentRequest {
  slotId: string;
  notes?: string;
  visitType: string;
  visitMode: string;
}

export interface AppointmentDto {
  id: string;
  providerId: string;
  patientId: string;
  timeSlotId: string;
  startsAt: string;
  endsAt: string;
  status: string;
  notes?: string;
  visitType: string;
  visitMode: string;
  meetingUrl?: string;
}

export async function getAvailableSlots(providerId: string, from: string, to: string): Promise<SlotDto[]> {
  const query = new URLSearchParams({
    providerId,
    from,
    to
  });
  return apiRequest<SlotDto[]>(`/scheduling/slots?${query.toString()}`);
}

export async function bookAppointment(request: BookAppointmentRequest): Promise<AppointmentDto> {
  return apiRequest<AppointmentDto>("/scheduling/appointments", {
    method: "POST",
    body: request,
  });
}

export interface RescheduleAppointmentRequest {
  newSlotId: string;
}

export async function rescheduleAppointment(id: string, request: RescheduleAppointmentRequest): Promise<AppointmentDto> {
  return apiRequest<AppointmentDto>(`/scheduling/appointments/${id}/reschedule`, {
    method: "PATCH",
    body: request,
  });
}

export interface CancelAppointmentRequest {
  reason?: string;
}

export async function cancelAppointment(id: string, request: CancelAppointmentRequest = {}): Promise<AppointmentDto> {
  return apiRequest<AppointmentDto>(`/scheduling/appointments/${id}/cancel`, {
    method: "PATCH",
    body: request,
  });
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetAppointmentsQuery {
  patientId?: string;
  providerId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export async function getAppointments(query: GetAppointmentsQuery = {}): Promise<PagedResponse<AppointmentDto>> {
  const params = new URLSearchParams();
  if (query.patientId) params.set("patientId", query.patientId);
  if (query.providerId) params.set("providerId", query.providerId);
  if (query.status) params.set("status", query.status);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.page) params.set("page", query.page.toString());
  if (query.pageSize) params.set("pageSize", query.pageSize.toString());

  return apiRequest<PagedResponse<AppointmentDto>>(`/scheduling/appointments?${params.toString()}`);
}

export interface AppointmentStatsDto {
  nextVisit: AppointmentDto | null;
  visitsThisYear: number;
  sinceLastMonthCount: number;
  attendanceRate: number;
  noShows: number;
  reschedules: number;
  telehealthVisits: number;
  totalVisits: number;
}

export async function getAppointmentStats(): Promise<AppointmentStatsDto> {
  return apiRequest<AppointmentStatsDto>("/scheduling/appointments/stats");
}

export interface ServiceTypeDto {
  id: string;
  name: string;
  durationMin: number;
  isActive: boolean;
  price: number | null;
  isFree: boolean;
}

export async function getServiceTypes(): Promise<ServiceTypeDto[]> {
  return apiRequest<ServiceTypeDto[]>("/scheduling/services");
}
