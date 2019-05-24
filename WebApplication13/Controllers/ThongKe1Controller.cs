using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers
{
    public class ThongKe1Controller : Controller
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

            ViewBag.Dem = TongDH();
            ViewBag.TongSL = TongSL();
            ViewBag.TongT = TongT();

            return View(ThongKe);
        }
        //Toán Tử//
        //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
        private int TongSL()
        {
            var MaCH = User.TenCuaHang();
            var TongSL = (from s in db.DonHangs where s.CuaHangId.ToString() == MaCH.ToString() && s.NgayMua.Day == DateTime.Now.Day select s.SoLuongBan).Sum();
            return TongSL;
        }
        private double TongT()
        {
            var MaCH = User.TenCuaHang();
            var TongT = (from s in db.DonHangs where s.CuaHangId.ToString() == MaCH.ToString() && s.NgayMua.Day == DateTime.Now.Day select s.TongTien).Sum();
            return TongT;
        }
        private int TongDH()
        {
            var MaCH = User.TenCuaHang();
            var Dem = (from s in db.DonHangs where s.CuaHangId.ToString() == MaCH.ToString() && s.NgayMua.Day == DateTime.Now.Day select s.DonHangId).Count();
            return Dem;
        }
    }
}