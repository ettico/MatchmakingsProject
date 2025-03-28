using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MatchMakings.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigrationToDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserType = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tz = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Class = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnOutsider = table.Column<bool>(type: "bit", nullable: true),
                    BackGround = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Openness = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BurnDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Age = table.Column<int>(type: "int", nullable: true),
                    HealthCondition = table.Column<bool>(type: "bit", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusVacant = table.Column<bool>(type: "bit", nullable: true),
                    PairingType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Height = table.Column<double>(type: "float", nullable: true),
                    GeneralAppearance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FacePaint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Appearance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FatherPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MotherPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoreInformation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DriversLicense = table.Column<bool>(type: "bit", nullable: true),
                    Smoker = table.Column<bool>(type: "bit", nullable: true),
                    Beard = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hot = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Suit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SmallYeshiva = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BigYeshiva = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Kibbutz = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Occupation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpectationsFromPartner = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Club = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AgeFrom = table.Column<int>(type: "int", nullable: true),
                    AgeTo = table.Column<int>(type: "int", nullable: true),
                    ImportantTraitsInMe = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImportantTraitsIAmLookingFor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreferredSeminarStyle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreferredProfessionalPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeadCovering = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MatchmakerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MatchMaker_Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MatchMaker_City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MatchMaker_Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MobilePhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LandlinePhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PersonalClub = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Community = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MatchMaker_Occupation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousWorkplaces = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsSeminarGraduate = table.Column<bool>(type: "bit", nullable: true),
                    HasChildrenInShidduchim = table.Column<bool>(type: "bit", nullable: true),
                    ExperienceInShidduchim = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LifeSkills = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    YearsInShidduchim = table.Column<int>(type: "int", nullable: true),
                    IsInternalMatchmaker = table.Column<bool>(type: "bit", nullable: true),
                    PrintingNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Tz = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Class = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_AnOutsider = table.Column<bool>(type: "bit", nullable: true),
                    Women_BackGround = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Openness = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_BurnDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Women_Age = table.Column<int>(type: "int", nullable: true),
                    Women_HealthCondition = table.Column<bool>(type: "bit", nullable: true),
                    Women_Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_StatusVacant = table.Column<bool>(type: "bit", nullable: true),
                    Women_PairingType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Height = table.Column<double>(type: "float", nullable: true),
                    Women_GeneralAppearance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_FacePaint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Appearance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_FatherPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_MotherPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_MoreInformation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_HeadCovering = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HighSchool = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Seminar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StudyPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalEducationalInstitution = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CurrentOccupation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Club = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_AgeFrom = table.Column<int>(type: "int", nullable: true),
                    Women_AgeTo = table.Column<int>(type: "int", nullable: true),
                    Women_ImportantTraitsInMe = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImportantTraitsIMLookingFor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreferredSittingStyle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InterestedInBoy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DrivingLicense = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Smoker = table.Column<bool>(type: "bit", nullable: true),
                    Women_Beard = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hat = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Suit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Women_Occupation = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaleId = table.Column<int>(type: "int", nullable: true),
                    WomenId = table.Column<int>(type: "int", nullable: true),
                    MatchMakerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contacts_Users_MaleId",
                        column: x => x.MaleId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Contacts_Users_MatchMakerId",
                        column: x => x.MatchMakerId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Contacts_Users_WomenId",
                        column: x => x.WomenId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FamilyDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FatherName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherOrigin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherYeshiva = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherAffiliation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherOccupation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherOrigin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherGraduateSeminar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherPreviousName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotherOccupation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ParentsStatus = table.Column<bool>(type: "bit", nullable: true),
                    HealthStatus = table.Column<bool>(type: "bit", nullable: false),
                    FamilyRabbi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilyAbout = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaleId = table.Column<int>(type: "int", nullable: true),
                    WomenId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyDetails_Users_MaleId",
                        column: x => x.MaleId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FamilyDetails_Users_WomenId",
                        column: x => x.WomenId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MatchMakings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaleId = table.Column<int>(type: "int", nullable: false),
                    WomenId = table.Column<int>(type: "int", nullable: false),
                    MatchMakerId = table.Column<int>(type: "int", nullable: false),
                    ClosingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NumMeetings = table.Column<int>(type: "int", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaleId1 = table.Column<int>(type: "int", nullable: true),
                    MatchMakerId1 = table.Column<int>(type: "int", nullable: true),
                    WomenId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchMakings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchMakings_Users_MaleId",
                        column: x => x.MaleId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MatchMakings_Users_MaleId1",
                        column: x => x.MaleId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MatchMakings_Users_MatchMakerId",
                        column: x => x.MatchMakerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MatchMakings_Users_MatchMakerId1",
                        column: x => x.MatchMakerId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MatchMakings_Users_WomenId",
                        column: x => x.WomenId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MatchMakings_Users_WomenId1",
                        column: x => x.WomenId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Meetings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NumMeeting = table.Column<int>(type: "int", nullable: true),
                    MeetingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MeetingPlace = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MatchMakingId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meetings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Meetings_MatchMakings_MatchMakingId",
                        column: x => x.MatchMakingId,
                        principalTable: "MatchMakings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_MaleId",
                table: "Contacts",
                column: "MaleId");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_MatchMakerId",
                table: "Contacts",
                column: "MatchMakerId");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_WomenId",
                table: "Contacts",
                column: "WomenId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyDetails_MaleId",
                table: "FamilyDetails",
                column: "MaleId",
                unique: true,
                filter: "[MaleId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyDetails_WomenId",
                table: "FamilyDetails",
                column: "WomenId",
                unique: true,
                filter: "[WomenId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_MatchMakings_MaleId",
                table: "MatchMakings",
                column: "MaleId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchMakings_MaleId1",
                table: "MatchMakings",
                column: "MaleId1");

            migrationBuilder.CreateIndex(
                name: "IX_MatchMakings_MatchMakerId",
                table: "MatchMakings",
                column: "MatchMakerId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchMakings_MatchMakerId1",
                table: "MatchMakings",
                column: "MatchMakerId1");

            migrationBuilder.CreateIndex(
                name: "IX_MatchMakings_WomenId",
                table: "MatchMakings",
                column: "WomenId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchMakings_WomenId1",
                table: "MatchMakings",
                column: "WomenId1");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_MatchMakingId",
                table: "Meetings",
                column: "MatchMakingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "FamilyDetails");

            migrationBuilder.DropTable(
                name: "Meetings");

            migrationBuilder.DropTable(
                name: "MatchMakings");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
