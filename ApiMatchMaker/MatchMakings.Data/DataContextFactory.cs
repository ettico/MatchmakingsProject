using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;

namespace MatchMakings.Data
{
    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
    {
        public DataContext CreateDbContext(string[] args)
        {
            try
            {
                var connectionString = "server=bf3kcnsdftld7yvaseoc-mysql.services.clever-cloud.com;port=3306;database=bf3kcnsdftld7yvaseoc;user=utbrmpzecbil1fa6;password=wKWSVl8dCoroJtwLjZNp;SslMode=Preferred;";


                var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
                optionsBuilder.UseMySql(
                    connectionString,
                    new MySqlServerVersion(new Version(8, 0, 0)),
                    mysqlOptions => mysqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)
                );
                Console.WriteLine("✅ Connection string accepted.");
                return new DataContext(optionsBuilder.Options);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Failed to create DataContext:");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                throw;
            }
        }
    }
}
