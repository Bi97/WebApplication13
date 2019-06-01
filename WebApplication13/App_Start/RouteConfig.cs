using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebApplication13
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
           
         
            //------------------------------Sản Phẩm---------------------------//
            routes.MapRoute(
              name: "SanPham",
              url: "San-Pham/{Action}",
              defaults: new { controller = "SanPhams", action = "Index", id = UrlParameter.Optional }
          );

         //=====================================Thống Kê=============================================================//
         

            //------------------------------default---------------------
            routes.MapRoute(
                name: "Default",
                url: "{Controller}/{action}",
                defaults: new { controller = "Account", action = "login", id = UrlParameter.Optional }
            );



        }
    }
}
