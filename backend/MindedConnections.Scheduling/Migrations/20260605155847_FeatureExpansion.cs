using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindedConnections.Scheduling.Migrations
{
    /// <inheritdoc />
    public partial class FeatureExpansion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "recurrence_group_id",
                table: "appointments",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    tenant_id = table.Column<string>(type: "text", nullable: false),
                    actor_id = table.Column<string>(type: "text", nullable: false),
                    actor_role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    entity_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    entity_id = table.Column<string>(type: "text", nullable: false),
                    action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    metadata = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "blocked_slots",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    tenant_id = table.Column<string>(type: "text", nullable: false),
                    provider_id = table.Column<string>(type: "text", nullable: false),
                    starts_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ends_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_blocked_slots", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "care_relationships",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    tenant_id = table.Column<string>(type: "text", nullable: false),
                    patient_id = table.Column<string>(type: "text", nullable: false),
                    provider_id = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_care_relationships", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "notification_outbox",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    tenant_id = table.Column<string>(type: "text", nullable: false),
                    appointment_id = table.Column<string>(type: "text", nullable: false),
                    recipient_user_id = table.Column<string>(type: "text", nullable: false),
                    type = table.Column<int>(type: "integer", nullable: false),
                    scheduled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    retries = table.Column<int>(type: "integer", nullable: false),
                    last_error = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    payload_json = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification_outbox", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_recurrence_group_id",
                table: "appointments",
                column: "recurrence_group_id",
                filter: "recurrence_group_id IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_tenant_id_actor_id",
                table: "audit_logs",
                columns: new[] { "tenant_id", "actor_id" });

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_tenant_id_entity_id",
                table: "audit_logs",
                columns: new[] { "tenant_id", "entity_id" });

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_tenant_id_timestamp",
                table: "audit_logs",
                columns: new[] { "tenant_id", "timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_blocked_slots_tenant_id_provider_id_starts_at_ends_at",
                table: "blocked_slots",
                columns: new[] { "tenant_id", "provider_id", "starts_at", "ends_at" });

            migrationBuilder.CreateIndex(
                name: "IX_care_relationships_tenant_id_patient_id_is_active",
                table: "care_relationships",
                columns: new[] { "tenant_id", "patient_id", "is_active" });

            migrationBuilder.CreateIndex(
                name: "IX_care_relationships_tenant_id_patient_id_provider_id",
                table: "care_relationships",
                columns: new[] { "tenant_id", "patient_id", "provider_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_care_relationships_tenant_id_provider_id_is_active",
                table: "care_relationships",
                columns: new[] { "tenant_id", "provider_id", "is_active" });

            migrationBuilder.CreateIndex(
                name: "IX_notification_outbox_appointment_id",
                table: "notification_outbox",
                column: "appointment_id");

            migrationBuilder.CreateIndex(
                name: "ix_notification_outbox_pending",
                table: "notification_outbox",
                columns: new[] { "scheduled_at", "sent_at" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "blocked_slots");

            migrationBuilder.DropTable(
                name: "care_relationships");

            migrationBuilder.DropTable(
                name: "notification_outbox");

            migrationBuilder.DropIndex(
                name: "IX_appointments_recurrence_group_id",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "recurrence_group_id",
                table: "appointments");
        }
    }
}
