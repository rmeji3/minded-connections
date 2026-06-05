namespace MindedConnections.Scheduling.Dtos.Appointments;

public record AppointmentStatsDto(
    AppointmentDto? NextVisit,
    int VisitsThisYear,
    int SinceLastMonthCount,
    int AttendanceRate,
    int NoShows,
    int Reschedules,
    int TelehealthVisits,
    int TotalVisits
);
