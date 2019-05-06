using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication13.Controllers.User
{
    public class UserController : Controller
    {
        // GET: TrangChuUser
        public ActionResult Index()
        {
            return View();
        }
    }
}