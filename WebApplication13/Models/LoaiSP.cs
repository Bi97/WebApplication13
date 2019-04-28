using System.ComponentModel.DataAnnotations;

namespace WebApplication13.Models
{
    public class LoaiSP
    {
        public int LoaiSPId { get; set; }
        [Required]
        public string TenLoai { get; set; }
    }
}