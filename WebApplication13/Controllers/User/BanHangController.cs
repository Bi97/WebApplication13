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
        public JsonResult AutoComplete(string prefix)
        {
            ApplicationDbContext entities = new ApplicationDbContext();
            var customers = (from SP in entities.SanPhams
                             where SP.TenSP.StartsWith(prefix)
                             select new
                             {
                                 label = SP.TenSP,
                                 value= SP.TenSP ,
                                 text = SP.DonGia,
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