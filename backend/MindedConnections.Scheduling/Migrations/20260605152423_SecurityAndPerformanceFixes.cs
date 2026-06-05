using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindedConnections.Scheduling.Migrations
{
    /// <inheritdoc />
    public partial class SecurityAndPerformanceFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_time_slots_tenant_id_provider_id_starts_at",
                table: "time_slots");

            migrationBuilder.DropIndex(
                name: "IX_appointments_time_slot_id",
                table: "appointments");

            migrationBuilder.AlterColumn<string>(
                name: "notes",
                table: "appointments",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_time_slots_tenant_id_provider_id_starts_at",
                table: "time_slots",
                columns: new[] { "tenant_id", "provider_id", "starts_at" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_appointments_time_slot_scheduled_unique",
                table: "appointments",
                column: "time_slot_id",
                unique: true,
                filter: "status = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_time_slots_tenant_id_provider_id_starts_at",
                table: "time_slots");

            migrationBuilder.DropIndex(
                name: "ix_appointments_time_slot_scheduled_unique",
                table: "appointments");

            migrationBuilder.AlterColumn<string>(
                name: "notes",
                table: "appointments",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_time_slots_tenant_id_provider_id_starts_at",
                table: "time_slots",
                columns: new[] { "tenant_id", "provider_id", "starts_at" });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_time_slot_id",
                table: "appointments",
                column: "time_slot_id");
        }
    }
}
