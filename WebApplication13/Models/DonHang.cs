using System;
using System.ComponentModel.DataAnnotations;

namespace WebApplication13.Models
{
    public class DonHang
    {
        public int DonHangId { get; set; }
        [Required]
        public int SoLuongBan { get; set; }
        public string HinhThucTT { get; set; }
        public float TongTien { get; set; }
        
        public DateTime NgayMua { get; set; }

        public KhachHang KhachHang { get; set; }
        [Required]
        public int KhachHangId { get; set; }

        public CuaHang CuaHang { get; set; }
        [Required]
        public int CuaHangId { get; set; }

    }
}