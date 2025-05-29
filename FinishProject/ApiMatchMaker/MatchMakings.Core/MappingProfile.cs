using ApiMatchMaker.PostModels;
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
            CreateMap<Note, NoteDTO>().ReverseMap();
            CreateMap<BaseUser, BaseUserDTO>().ReverseMap();
            //CreateMap<Women, BaseUserDTO>();
            //CreateMap<Male, BaseUserDTO>();
            CreateMap<RegisterDTO, BaseUserDTO>();
            CreateMap<LoginDTO, BaseUserDTO>();
            CreateMap<MalePostModels, Male>()
     .ForMember(dest => dest.Id, opt => opt.Ignore())
     .ForMember(dest => dest.Acquaintances, opt => opt.Ignore())
     .ForMember(dest => dest.FamilyDetails, opt => opt.Ignore())
     .ForMember(dest => dest.Matchings, opt => opt.Ignore());
        }
    }
}
