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
        public double TongTien { get; set; }

        public DateTime NgayMua { get; set; }

        public KhachHang KhachHang { get; set; }
        [Required]
        public int KhachHangId { get; set; }

        public SanPham SanPham { get; set; }
        [Required]
        public int SanPhamId { get; set; }

    }
}