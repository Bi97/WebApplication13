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
        private ApplicationDbContext db = new ApplicationDbContext();
        // GET: BanHang
        public ActionResult BanHang()
        { 
            return View();
        }
        /* public ActionResult index()
         {
             return View();
         }*/

        //tìm kiếm

        public ActionResult Index()
        {
           
            return View();
        }

    }
}