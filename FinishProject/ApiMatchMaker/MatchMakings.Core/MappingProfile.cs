using AutoMapper;
using MatchMakings.Core.DTOs;
using MatchMakings.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core
{
    public  class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Contact, ContactDTO>().ReverseMap();
            CreateMap<FamilyDetails, FamilyDetailsDTO>().ReverseMap();
            CreateMap<Male, MaleDTO>().ReverseMap();
            CreateMap<MatchMaker, MatchMakerDTO>().ReverseMap();
            CreateMap<Women, WomenDTO>().ReverseMap();
        }
    }
}
