using MatchMakings.Core.IRepositories;
using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Data.Repository
{
    public class MaleRepository : IMaleRepository
    {
        private readonly DataContext _dataContext;

        public MaleRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<IEnumerable<Male>> GetListOfMaleAsync()
        {
            return await _dataContext.Users
            .OfType<Male>() // מחזיר רק משתמשים מהסוג Man
            .Include(u => u.FamilyDetails)
            .ToListAsync();

        }

        public async Task<Male> GetMaleByIdAsync(int id)
        {
            var Male = await _dataContext.Users.OfType<Male>().FirstOrDefaultAsync(x => x.Id == id);
            if (Male == null)
            {
                throw new ArgumentException($"Male with id {id} was not found.");
            }
            return Male;
        }

        public async Task<Male> AddMaleAsync(Male Male)
        {
            _dataContext.Users.Add(Male);
            await _dataContext.SaveChangesAsync();
            return Male;
        }

        public async Task<Male> UpdateMaleAsync(int id, Male updatedMale)
        {
            var existingMale = await _dataContext.Users
                .OfType<Male>()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (existingMale == null)
                throw new Exception("Male not found");

            // עדכון שדות ידני, מבלי לגעת ב-Id
            // העתקת כל השדות חוץ מה-Id
            if (updatedMale != null)
            {
                // שדות בסיסיים מ-BaseUser
                existingMale.FirstName = updatedMale.FirstName;
                existingMale.LastName = updatedMale.LastName;
                existingMale.Username = updatedMale.Username;
                existingMale.Password = updatedMale.Password;
                existingMale.Role = updatedMale.Role;

                // שדות ספציפיים למחלקת Male
                existingMale.Country = updatedMale.Country;
                existingMale.City = updatedMale.City;
                existingMale.Address = updatedMale.Address;
                existingMale.Tz = updatedMale.Tz;
                existingMale.Class = updatedMale.Class;
                existingMale.AnOutsider = updatedMale.AnOutsider;
                existingMale.BackGround = updatedMale.BackGround;
                existingMale.Openness = updatedMale.Openness;
                existingMale.BurnDate = updatedMale.BurnDate;
                existingMale.Age = updatedMale.Age;
                existingMale.HealthCondition = updatedMale.HealthCondition;
                existingMale.Status = updatedMale.Status;
                existingMale.StatusVacant = updatedMale.StatusVacant;
                existingMale.PairingType = updatedMale.PairingType;
                existingMale.Height = updatedMale.Height;
                existingMale.GeneralAppearance = updatedMale.GeneralAppearance;
                existingMale.FacePaint = updatedMale.FacePaint;
                existingMale.Appearance = updatedMale.Appearance;
                existingMale.Phone = updatedMale.Phone;
                existingMale.Email = updatedMale.Email;
                existingMale.FatherPhone = updatedMale.FatherPhone;
                existingMale.MotherPhone = updatedMale.MotherPhone;
                existingMale.MoreInformation = updatedMale.MoreInformation;
                existingMale.DriversLicense = updatedMale.DriversLicense;
                existingMale.Smoker = updatedMale.Smoker;
                existingMale.Beard = updatedMale.Beard;
                existingMale.Hot = updatedMale.Hot;
                existingMale.Suit = updatedMale.Suit;
                existingMale.SmallYeshiva = updatedMale.SmallYeshiva;
                existingMale.BigYeshiva = updatedMale.BigYeshiva;
                existingMale.Kibbutz = updatedMale.Kibbutz;
                existingMale.Occupation = updatedMale.Occupation;
                existingMale.ExpectationsFromPartner = updatedMale.ExpectationsFromPartner;
                existingMale.Club = updatedMale.Club;
                existingMale.AgeFrom = updatedMale.AgeFrom;
                existingMale.AgeTo = updatedMale.AgeTo;
                existingMale.ImportantTraitsInMe = updatedMale.ImportantTraitsInMe;
                existingMale.ImportantTraitsIAmLookingFor = updatedMale.ImportantTraitsIAmLookingFor;
                existingMale.PreferredSeminarStyle = updatedMale.PreferredSeminarStyle;
                existingMale.PreferredProfessionalPath = updatedMale.PreferredProfessionalPath;
                existingMale.HeadCovering = updatedMale.HeadCovering;

                // לא מעדכנים את שדות הקישור (Acquaintances, FamilyDetails, Matchings)
            }
            Console.WriteLine($"FirstName: {updatedMale.FirstName}, LastName: {updatedMale.LastName}  username:  {updatedMale.Username}");

            await _dataContext.SaveChangesAsync();
            return existingMale;
        }
     
        public async Task<Male> DeleteMaleAsync(int id)
        {
            var Male = await _dataContext.Users.OfType<Male>().FirstOrDefaultAsync(x => x.Id == id);
            if (Male == null)
            {
                throw new ArgumentException($"Male with id {id} was not found.");
            }
            _dataContext.Users.Remove(Male);
            await _dataContext.SaveChangesAsync();
            return Male;
        }

        //Task<Male> IMaleRepository.GetMaleByokIdAsync(int id)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
