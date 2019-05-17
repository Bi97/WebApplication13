using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication13.Models
{
    public class CTDonHang
    {
        public int CTDonHangId { get; set; }
        public int SoLuong { get; set; }
        public double DonGia { get; set; }
        public double GiamGia { get; set; }
        public DonHang DonHang { get; set; }
        public int DonhangId { get; set; }
        public SanPham SanPham { get; set; }
        public int SanPhamId { get; set; }

    }
}