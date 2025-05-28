using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MatchMakings.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_MaleId",
                table: "Notes");

            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_WomenId",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_Notes_MaleId",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "MaleId",
                table: "Notes");

            migrationBuilder.RenameColumn(
                name: "WomenId",
                table: "Notes",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Notes_WomenId",
                table: "Notes",
                newName: "IX_Notes_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_UserId",
                table: "Notes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_UserId",
                table: "Notes");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Notes",
                newName: "WomenId");

            migrationBuilder.RenameIndex(
                name: "IX_Notes_UserId",
                table: "Notes",
                newName: "IX_Notes_WomenId");

            migrationBuilder.AddColumn<int>(
                name: "MaleId",
                table: "Notes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notes_MaleId",
                table: "Notes",
                column: "MaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_MaleId",
                table: "Notes",
                column: "MaleId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_WomenId",
                table: "Notes",
                column: "WomenId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
