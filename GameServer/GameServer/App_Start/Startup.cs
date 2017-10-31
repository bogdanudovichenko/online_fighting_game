using GameServer.Configurations;
using GameServer.Data.Initializers.Interfaces;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using System.Web.Http;

[assembly: OwinStartup(typeof(GameServer.App_Start.Startup))]
namespace GameServer.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = "ApplicationCookie",
                LoginPath = new PathString("/Auth/Login"),
                LogoutPath = new PathString("/Auth/Logout")
            });

            app.MapSignalR();

            using (IDbInitializer dbInitializer = InitializersManager.DbInitializer)
            {
                dbInitializer.Initialize();
            }
        }
    }
}