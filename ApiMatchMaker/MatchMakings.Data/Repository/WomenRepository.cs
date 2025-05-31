using MatchMakings.Core.IRepositories;
using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Net;
using System.Numerics;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Data.Repository
{
    public class WomenRepository: IWomenRepository
    {
        private readonly DataContext _dataContext;

        public WomenRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<IEnumerable<Women>> GetListOfWomenAsync()
        {
            return await _dataContext.Users.OfType<Women>().Include(u => u.FamilyDetails).ToListAsync();//todo
        }

        public async Task<Women> GetWomenByIdAsync(int id)
        {
            var Women = await _dataContext.Users.OfType<Women>().FirstOrDefaultAsync(x => x.Id == id);
            if (Women == null)
            {
                throw new ArgumentException($"Women with id {id} was not found.");
            }
            return Women;
        }

        public async Task<Women> AddWomenAsync(Women Women)
        {
            _dataContext.Users.Add(Women);
            await _dataContext.SaveChangesAsync();
            return Women;
        }

        //public Task<Women> UpdateWomenAsync(int id, Women women)
        //{
        //    throw new NotImplementedException();
        //}
        public async Task<Women> UpdateWomenAsync(int id, Women updatedWomen)
        {
            var existingWomen = await _dataContext.Users
                .OfType<Women>()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (existingWomen == null)
                throw new Exception("Women not found");

            // עדכון שדות ידני, מבלי לגעת ב-Id
            // העתקת כל השדות חוץ מה-Id
            if (existingWomen != null)
            {
                // שדות בסיסיים מ-BaseUser
                existingWomen.FirstName = updatedWomen.FirstName;
                existingWomen.LastName = updatedWomen.LastName;
                existingWomen.Username = updatedWomen.Username;
                existingWomen.Password = updatedWomen.Password;
                existingWomen.Role = updatedWomen.Role;

                //// שדות ספציפיים למחלקת Male
                existingWomen.Country = updatedWomen.Country;
                existingWomen.City = updatedWomen.City;
                existingWomen.Address = updatedWomen.Address;
                existingWomen.Tz = updatedWomen.Tz;
                existingWomen.Class = updatedWomen.Class;
                existingWomen.AnOutsider = updatedWomen.AnOutsider;
                existingWomen.BackGround = updatedWomen.BackGround;
                existingWomen.Openness = updatedWomen.Openness;
                existingWomen.BurnDate = updatedWomen.BurnDate;
                 existingWomen.Age = updatedWomen.Age;
                existingWomen.HealthCondition = updatedWomen.HealthCondition;
                existingWomen.Status = updatedWomen.Status;
                existingWomen.StatusVacant = updatedWomen.StatusVacant;
                existingWomen.PairingType = updatedWomen.PairingType;
                existingWomen.Height = updatedWomen.Height;
                existingWomen.GeneralAppearance = updatedWomen.GeneralAppearance;
                existingWomen.FacePaint = updatedWomen.FacePaint;
                 existingWomen.Appearance = updatedWomen.Appearance;
                existingWomen.Phone = updatedWomen.Phone;
                existingWomen.Email = updatedWomen.Email;
                existingWomen.FatherPhone = updatedWomen.FatherPhone;
                existingWomen.MotherPhone = updatedWomen.MotherPhone;
                existingWomen.MoreInformation = updatedWomen.MoreInformation;
                existingWomen.HeadCovering = updatedWomen.HeadCovering;
                existingWomen.HighSchool = updatedWomen.HighSchool;
                existingWomen.Seminar = updatedWomen.Seminar;
                existingWomen.StudyPath = updatedWomen.StudyPath;
                existingWomen.AdditionalEducationalInstitution = updatedWomen.AdditionalEducationalInstitution;
                existingWomen.CurrentOccupation = updatedWomen.CurrentOccupation;
                existingWomen.Club = updatedWomen.Club;
                existingWomen.AgeFrom = updatedWomen.AgeFrom;
                existingWomen.AgeTo = updatedWomen.Age;
                existingWomen.ImportantTraitsInMe = updatedWomen.ImportantTraitsInMe;
                existingWomen.ImportantTraitsIMLookingFor = updatedWomen.ImportantTraitsIMLookingFor;
                existingWomen.PreferredSittingStyle = updatedWomen.PreferredSittingStyle;
                existingWomen.InterestedInBoy = updatedWomen.InterestedInBoy;
                existingWomen.DrivingLicense = updatedWomen.DrivingLicense;
                existingWomen.Smoker = updatedWomen.Smoker;
                existingWomen.Beard = updatedWomen.Beard;
                existingWomen.Hat = updatedWomen.Hat;
                existingWomen.Suit = updatedWomen.Suit;
                existingWomen.Occupation = updatedWomen.Occupation;


                existingWomen.PhotoUrl = updatedWomen.PhotoUrl;
                existingWomen.TZFormUrl = updatedWomen.TZFormUrl;
                existingWomen.PhotoName = updatedWomen.PhotoName;
                
                existingWomen.TZFormName = updatedWomen.TZFormName;

                // לא מעדכנים את שדות הקישור (Acquaintances, FamilyDetails, Matchings)
            }
            Console.WriteLine($"FirstName: {updatedWomen.FirstName}, LastName: {updatedWomen.LastName}  username:  {updatedWomen.Username}");


//            if (updatedWomen.FirstName == null || updatedWomen.LastName == null)
//{
//    throw new Exception("FirstName and LastName cannot be null");
//}
            await _dataContext.SaveChangesAsync();
            return existingWomen;
        }

        public async Task<Women> DeleteWomenAsync(int id)
        {
            var Women = await _dataContext.Users.OfType<Women>().FirstOrDefaultAsync(x => x.Id == id);
            if (Women == null)
            {
                throw new ArgumentException($"Contact with id {id} was not found.");
            }
            _dataContext.Users.Remove(Women);
            await _dataContext.SaveChangesAsync();
            return Women;
        }

     
    }
}
