using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication13.Models
{
    public class NhaCungCap
    {
        public int NhaCungCapId { get; set; }
        [Required]
        public string TenNhaCungCap { get; set; }
        public string DiaChi { get; set; }
    }
}