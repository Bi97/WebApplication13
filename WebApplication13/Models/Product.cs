using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication13.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        [Required]
        public string TenSP { get; set; }
        [Required]
        public float SoLuong { get; set; }
        public string MoTa { get; set; }

        public float DonGia { get; set; }



        public LoaiSP LoaiSP { get; set; }
        [Required]
        public int LoaiSPId { get; set; }
    }
}