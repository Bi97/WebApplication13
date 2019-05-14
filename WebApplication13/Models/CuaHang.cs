using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication13.Models
{
    public class CuaHang
    {

        public int CuaHangId { get; set; }
        [Required]
        public string TenCuaHang {get;set;}
        public string DiaChi { get; set; }

      


    }
}