using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.DTOs
{
    public class NoteDTO
    {
        public int Id { get; set; }
        public int MatchMakerId { get; set; }
        public int? UserId { get; set; }
        //public int? WomenId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
