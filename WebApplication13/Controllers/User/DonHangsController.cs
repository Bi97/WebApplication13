using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers.User
{
    public class DonHangsController : Controller
    {
        
        ApplicationDbContext db = new ApplicationDbContext();
       
        // GET: DonHangs
        public ActionResult Index()
        {          
            var MaCH = User.TenCuaHang();
            
            
                var donHangs = (from s in db.DonHangs
                                where s.CuaHangId.ToString() == MaCH.ToString()
                                select s).Include(s => s.KhachHang).ToList();
                return View(donHangs);
            
            
        }
       
        public ActionResult Details(int id)
        {
            var CTDH = (from s in db.CTDonHangs
                        where s.DonhangId == id
                        select s).Include(s => s.SanPham).Include(s => s.DonHang);
            return View(CTDH);
        }

        // GET: DonHangs/Details/5
      
    }
}
