using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindedConnections.Scheduling.Migrations
{
    /// <inheritdoc />
    public partial class AddZoomMeetingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "meeting_url",
                table: "appointments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "zoom_meeting_id",
                table: "appointments",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "meeting_url",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "zoom_meeting_id",
                table: "appointments");
        }
    }
}
