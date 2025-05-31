using MatchMakings.Core.IRepositories;
using MatchMakings.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Data.Repository
{
   
    public class MatchMakerRepository: IMatchMakerRepository
    {
        private readonly DataContext _dataContext;

        public MatchMakerRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<IEnumerable<MatchMaker>> GetListOfMatchMakerAsync()
        {
            return await _dataContext.Users.OfType<MatchMaker>().Include(u => u.Recommend).ToListAsync();//todo
        }

        public async Task<MatchMaker> GetMatchMakerByIdAsync(int id)
        {
            var MatchMaker = await _dataContext.Users.OfType<MatchMaker>().FirstOrDefaultAsync(x => x.Id == id);
            if (MatchMaker == null)
            {
                throw new ArgumentException($"MatchMaker with id {id} was not found.");
            }
            return MatchMaker;
        }

        public async Task<MatchMaker> AddMatchMakerAsync(MatchMaker MatchMaker)
        {
            _dataContext.Users.Add(MatchMaker);
            await _dataContext.SaveChangesAsync();
            return MatchMaker;
        }


        //public async Task<MatchMaker> UpdateMatchMakerAsync(int id, MatchMaker MatchMaker)
        //{
        //    await DeleteMatchMakerAsync(id);
        //    await _dataContext.SaveChangesAsync();
        //    return await AddMatchMakerAsync(MatchMaker);


        //}

        public async Task<MatchMaker> UpdateMatchMakerAsync(int id, MatchMaker updatedMM)
        {
            var existingMatchMaker = await _dataContext.Users
                .OfType<MatchMaker>()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (existingMatchMaker == null)
                throw new Exception("Male not found");

            // עדכון שדות ידני, מבלי לגעת ב-Id
            // העתקת כל השדות חוץ מה-Id
            if (updatedMM != null)
            {
                // שדות בסיסיים מ-BaseUser
                existingMatchMaker.FirstName = updatedMM.FirstName;
                existingMatchMaker.LastName = updatedMM.LastName;
                existingMatchMaker.Username = updatedMM.Username;
                existingMatchMaker.Password = updatedMM.Password;
                existingMatchMaker.Role = updatedMM.Role;
                existingMatchMaker.MatchmakerName = updatedMM.MatchmakerName;
                existingMatchMaker.IdNumber = updatedMM.IdNumber;
                existingMatchMaker.BirthDate = updatedMM.BirthDate;
                existingMatchMaker.Email = updatedMM.Email;
                existingMatchMaker.Gender = updatedMM.Gender;
                existingMatchMaker.City = updatedMM.City;
                existingMatchMaker.Address = updatedMM.Address;
                existingMatchMaker.MobilePhone = updatedMM.MobilePhone;
                existingMatchMaker.LandlinePhone = updatedMM.LandlinePhone;
                existingMatchMaker.PhoneType = updatedMM.PhoneType;
                existingMatchMaker.PersonalClub = updatedMM.PersonalClub;
                existingMatchMaker.Community = updatedMM.Community;
                existingMatchMaker.Occupation = updatedMM.Occupation;
                existingMatchMaker.PreviousWorkplaces = updatedMM.PreviousWorkplaces;
                existingMatchMaker.IsSeminarGraduate = updatedMM.IsSeminarGraduate;
                existingMatchMaker.HasChildrenInShidduchim = updatedMM.HasChildrenInShidduchim;
                existingMatchMaker.ExperienceInShidduchim = updatedMM.ExperienceInShidduchim;
                existingMatchMaker.LifeSkills = updatedMM.LifeSkills;
                existingMatchMaker.YearsInShidduchim = updatedMM.YearsInShidduchim;
                existingMatchMaker.IsInternalMatchmaker = updatedMM.IsInternalMatchmaker;
                existingMatchMaker.PrintingNotes = updatedMM.PrintingNotes;

                // לא מעדכנים את שדות הקישור (Acquaintances, FamilyDetails, Matchings)
            }
            Console.WriteLine($"FirstName: {updatedMM.FirstName}, LastName: {updatedMM.LastName}  username:  {updatedMM.Username}");

            await _dataContext.SaveChangesAsync();
            return existingMatchMaker;
        }

        public async Task<MatchMaker> DeleteMatchMakerAsync(int id)
        {
            var MatchMaker = await _dataContext.Users.OfType<MatchMaker>().FirstOrDefaultAsync(x => x.Id == id);
            if (MatchMaker == null)
            {
                throw new ArgumentException($"MatchMaker with id {id} was not found.");
            }
            _dataContext.Users.Remove(MatchMaker);
            await _dataContext.SaveChangesAsync();
            return MatchMaker;
        }
    }
}
