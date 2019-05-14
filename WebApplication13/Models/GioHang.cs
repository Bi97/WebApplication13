using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication13.Models
{
    public class GioHang
    {
        ApplicationDbContext db = new ApplicationDbContext();
        public int gSanPhamId { get; set; }
        public string gTenSP { get; set; }
        public int gSoLuong { get; set; }
        public double gDonGia { get; set; }
        public double gThanhTien
        {
            get { return gSoLuong * gDonGia; }
        }

        public GioHang(int SanPhamId)
        {
            gSanPhamId = SanPhamId;
            SanPham SP = db.SanPhams.Single(n => n.SanPhamId == gSanPhamId);
            gTenSP = SP.TenSP;
            gSoLuong = 1;
            gDonGia = double.Parse(SP.DonGia.ToString());
        }

    }
}