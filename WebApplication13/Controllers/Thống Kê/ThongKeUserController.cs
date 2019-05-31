using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers
{
    public class ThongKeUserController : Controller
    {
        // GET: ThongKe1

        ApplicationDbContext db = new ApplicationDbContext();
        // GET: ThongKe
        public ActionResult ThongKe()
        {
            var MaCH = User.TenCuaHang();

            var ThongKe = (from s in db.DonHangs
                           where s.CuaHangId.ToString() == MaCH.ToString() && s.NgayMua.Day == DateTime.Now.Day

                           select s).Include(s => s.KhachHang).ToList();

           
            var Dem = (from s in db.DonHangs where s.CuaHangId.ToString() == MaCH.ToString() && s.NgayMua.Day == DateTime.Now.Day select s.DonHangId).Count();
            if( Dem !=0)
            {
                var TongSL = (from s in db.DonHangs where s.CuaHangId.ToString() == MaCH.ToString() && s.NgayMua.Day == DateTime.Now.Day select s.SoLuongBan).Sum();
                var TongT = (from s in db.DonHangs where s.CuaHangId.ToString() == MaCH.ToString() && s.NgayMua.Day == DateTime.Now.Day select s.TongTien).Sum();
                ViewBag.TongSL = TongSL;
                ViewBag.TongT = TongT;
            }
            else
            {
                ViewBag.TongSL = 0;
                ViewBag.TongT = 0;
            }
            ViewBag.Dem = Dem;
            
            return View(ThongKe);
        }
    }
}