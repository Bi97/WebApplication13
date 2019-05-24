using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers
{
    public class TimKiemController : Controller
    {
        // GET: TimKiem
        public ActionResult Index()
        {
            return View();
        }
        //Chức năng tìm khách ha
        [HttpPost]
        public JsonResult AutoComplete(string prefix)
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var customers = (from KH in db.KhachHangs
                             where KH.SoDT.StartsWith(prefix)
                             select new
                             {
                                 label = KH.TenKH,
                                 val = KH.TenKH,
                                 DC = KH.DiaChi,
                                 Sdt = KH.SoDT,
                                 KHId = KH.KhachHangId,

                             }).ToList();

            return Json(customers);
        }
    }
}