using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers.Admin
{
    public class AdminController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Admin
        public ActionResult TrangChu()
        {
            return View();
        }
        public ActionResult CuaHang()
        {
            var CuaHang = db.cuaHangs;
            return PartialView(CuaHang.ToList());
        }
        public ActionResult TKCuaHang()
        {
            var CuaHang = db.cuaHangs;
            return PartialView(CuaHang.ToList());
        }
    }
}