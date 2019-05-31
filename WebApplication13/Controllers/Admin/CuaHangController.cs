using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers.Admin
{
    public class CuaHangController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();       
        // GET: CuaHang
        
        public ActionResult Index(int id)
        {
            ViewBag.Message = "Thông Tin Cửa Hàng " + id;
            return View();
        }
       
        /* public ActionResult DonHang(int id)
         {
             var DH = from s in db.DonHangs
                      where s.CuaHangId == id
                      select s;
             return View(DH.ToList());
         }*/
    }
}