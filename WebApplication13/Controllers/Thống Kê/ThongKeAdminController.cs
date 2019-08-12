using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers.Thống_Kê
{
    public class ThongKeAdminController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: ThongKeAdmin
        public ActionResult TKCuaHang(int id)
        {
            
            var TongSL = (from s in db.DonHangs where s.CuaHangId == id select s.SoLuongBan).Sum();
            var TongT = (from s in db.DonHangs where s.CuaHangId == id select s.TongTien).Sum();
            var Dem = (from s in db.DonHangs where s.CuaHangId == id select s.DonHangId).Count();


            ViewBag.TongT = TongT;
            ViewBag.TongSL = TongSL;
            ViewBag.TongDH = Dem;
            return View();
        }
        public ActionResult TK()
        {
            var Tk = db.DonHangs.Include(a=>a.CuaHang).Include(a=>a.KhachHang);
           
            
            return View(Tk.ToList());
        }
    }
}
