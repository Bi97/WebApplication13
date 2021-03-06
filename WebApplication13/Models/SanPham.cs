﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication13.Models
{
    public class SanPham
    {
        public int SanPhamId { get; set; }
        [Required]
        public string TenSP { get; set; }
        [Required]
        public int SoLuong { get; set; }
        public string MoTa { get; set; }

        public int DonGia { get; set; }

        public NhaCungCap NhaCungCap { get; set; }
        public int NhaCungCapId { get; set; }

        public LoaiSP LoaiSP { get; set; }
        [Required]
        public int LoaiSPId { get; set; }
    }
}