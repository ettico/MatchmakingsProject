using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Data
{

    public class DataContext : DbContext
    {
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<FamilyDetails> FamilyDetails { get; set; }
        //public DbSet<MatchMaker> MatchMakers { get; set; }
        public DbSet<MatchMaking> MatchMakings { get; set; }
        //public DbSet<Meeting> Meetings { get; set; }
        public DbSet<BaseUser> Users { get; set; }
        public DbSet<Note> Notes { get; set; }

       
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=DBMatchMakingsFixAll");
        //}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            //optionsBuilder.LogTo(mesege => Console.Write(mesege));
        }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //      modelBuilder.Entity<BaseUser>()
        //          .HasDiscriminator<string>("UserType")
        //          .HasValue<MatchMaker>("Matchmaker")
        //          .HasValue<Women>("Woman")
        //          .HasValue<Male>("Man");
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BaseUser>()
                  .HasDiscriminator<string>("UserType")
                  .HasValue<MatchMaker>("MatchMaker")
                  .HasValue<Women>("Women")
                  .HasValue<Male>("Male");
            modelBuilder.Entity<MatchMaking>()
                .HasOne(m => m.Male) // קשר לגבר
                .WithMany() // קשר אחד לרבים (אפשר לשנות לפי הצורך)
                .HasForeignKey(m => m.MaleId)
                .OnDelete(DeleteBehavior.Restrict); // מונע מחיקה אוטומטית

            modelBuilder.Entity<MatchMaking>()
                .HasOne(m => m.Women) // קשר לאישה
                .WithMany() // קשר אחד לרבים (אפשר לשנות לפי הצורך)
                .HasForeignKey(m => m.WomenId)
                .OnDelete(DeleteBehavior.Restrict); // מונע מחיקה אוטומטית

            modelBuilder.Entity<MatchMaking>()
                .HasOne(m => m.MatchMaker) // קשר לשדכן
                .WithMany() // קשר אחד לרבים (אפשר לשנות לפי הצורך)
                .HasForeignKey(m => m.MatchMakerId)
                .OnDelete(DeleteBehavior.Restrict); // מונע מחיקה אוטומטית


            modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
            modelBuilder.Entity<RolePermission>().HasKey(rp => new { rp.RoleId, rp.PermissionId });
        }

       


    }

}
