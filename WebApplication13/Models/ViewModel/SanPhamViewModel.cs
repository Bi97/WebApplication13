using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication13.Models.ViewModel
{
    public class SanPhamViewModel
    {                
        public string TenSP { get; set; } 
        public double SoLuong { get; set; }
        public string MoTa { get; set; }
        public int LoaiSP { get; set; }
        public int NhaCungCap { get; set; }
        public IEnumerable<LoaiSP> LoaiSPs { get; set; }
        public IEnumerable<NhaCungCap> NhaCungCaps { get; set; }

    }
}