using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindedConnections.Scheduling.Migrations
{
    /// <inheritdoc />
    public partial class AllowMultipleAppointmentsPerSlot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_appointments_time_slot_id",
                table: "appointments");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_time_slot_id",
                table: "appointments",
                column: "time_slot_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_appointments_time_slot_id",
                table: "appointments");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_time_slot_id",
                table: "appointments",
                column: "time_slot_id",
                unique: true);
        }
    }
}
