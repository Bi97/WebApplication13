using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication13.Models
{
    public class KhachHang
    {
        public int KhachHangId { get; set; }
        [Required]
        public string TenKH { get; set; }
        [Required]
        public string DiaChi { get; set; }
        public DateTime NgaySinh { get; set; }
        public string SoDT { get; set; }
    }
}