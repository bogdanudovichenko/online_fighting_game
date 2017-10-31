using System.Web;

namespace GameServer.Configurations
{
    public static class DbConfig
    {        
        public static string Connection = "Data Source=" + HttpContext.Current.Request.PhysicalApplicationPath + @"Data\GameServerDb.db3";
    }
}