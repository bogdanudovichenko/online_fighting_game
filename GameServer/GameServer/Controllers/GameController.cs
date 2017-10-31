using System.Web.Mvc;

namespace GameServer.Controllers
{
    public class GameController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}