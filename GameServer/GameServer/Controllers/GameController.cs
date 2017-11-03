using System.Web.Mvc;

namespace GameServer.Controllers
{
    [Authorize]
    public class GameController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}