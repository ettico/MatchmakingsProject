using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MatchMakings.Core.Models
{
    public class RolePermission
    {
        [Key]
        public int Id { get; set; }
        public int PermissionId { get; set; } // מפתח זר ל-Users
        [ForeignKey(nameof(PermissionId))]
        public Permission Permission { get; set; }
        public int RoleId { get; set; } // מפתח זר ל-Roles
        [ForeignKey(nameof(RoleId))]
        public Role Role { get; set; }
    }
}
