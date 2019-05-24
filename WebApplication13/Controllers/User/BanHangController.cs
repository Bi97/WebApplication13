using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers
{
    public class BanHangController : Controller
    {
        public ActionResult BanHang()
        {
            return View();
        }
        [HttpPost]
        public JsonResult ChonSP(string prefix)
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var customers = (from SP in db.SanPhams
                             where SP.TenSP.StartsWith(prefix)
                             select new
                             {
                                 label = SP.TenSP,
                                 value= SP.SanPhamId,  
                                 DonGia = SP.DonGia,

                             });

            return Json(customers);
        }

        [HttpPost]
        public ActionResult BanHang(string TenSP, string SanPhamId)
        {
            ViewBag.Message = "CustomerName: " + TenSP + " CustomerId: " + SanPhamId;
            return View();
        }

    }
}