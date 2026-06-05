using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindedConnections.Scheduling.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceTypePrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "price",
                table: "service_types",
                type: "numeric(10,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "price",
                table: "service_types");
        }
    }
}
