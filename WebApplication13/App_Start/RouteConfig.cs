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
            //=====================================Giới Thiệu=============================================================//
            routes.MapRoute(
                name: "GioiThieu",
                url: "Trang-Gioi-Thieu",
                defaults: new { controller = "GioiThieu", action = "Index", id = UrlParameter.Optional }
            );
            //------------------------------default---------------------//

            routes.MapRoute(
                name: "Default",
                url: "{Controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "login", id = UrlParameter.Optional }
            );
        }
    }
}
