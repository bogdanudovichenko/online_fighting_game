using System.Linq;
using System.Security.Claims;
using System.Web;

namespace GameServer.Helpers
{
    public static class PlayerHelper
    {
        public static int? PlayerId
        {
            get
            {
                string id = ((ClaimsIdentity)HttpContext.Current.User.Identity).Claims.FirstOrDefault(c => c.Type.Contains("nameidentifier"))?.Value;
                if (string.IsNullOrEmpty(id)) return null;
                else return int.Parse(id);
            }
        }
    }
}