using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MatchMakings.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MatchMakerId = table.Column<int>(type: "int", nullable: false),
                    MaleId = table.Column<int>(type: "int", nullable: true),
                    WomenId = table.Column<int>(type: "int", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notes_Users_MaleId",
                        column: x => x.MaleId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Notes_Users_MatchMakerId",
                        column: x => x.MatchMakerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Notes_Users_WomenId",
                        column: x => x.WomenId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notes_MaleId",
                table: "Notes",
                column: "MaleId");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_MatchMakerId",
                table: "Notes",
                column: "MatchMakerId");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_WomenId",
                table: "Notes",
                column: "WomenId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notes");
        }
    }
}
