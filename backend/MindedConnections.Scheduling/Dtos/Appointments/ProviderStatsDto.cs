namespace MindedConnections.Scheduling.Dtos.Appointments;

public record ProviderStatsDto(
    int AppointmentsToday,
    int AppointmentsThisWeek,
    int AppointmentsThisMonth,
    int UniquePatients,
    int NoShowsThisMonth,
    int AttendanceRate,
    AppointmentDto? NextAppointment
);
