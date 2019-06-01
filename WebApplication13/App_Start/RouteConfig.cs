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

          
          
            //default
            routes.MapRoute(
                name: "TrangChuAdmin",
                url: "Admin/{action}",
                defaults: new { controller = "Admin", action = "Index", id = UrlParameter.Optional }
            );

            //default
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "login", id = UrlParameter.Optional }
            );
        }
    }
}
