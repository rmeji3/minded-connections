using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindedConnections.Scheduling.Migrations
{
    /// <inheritdoc />
    public partial class AddVisitTypeAndMode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "visit_mode",
                table: "appointments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "visit_type",
                table: "appointments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "visit_mode",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "visit_type",
                table: "appointments");
        }
    }
}
