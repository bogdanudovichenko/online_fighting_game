using GameServer.Configurations;
using GameServer.Models.Game;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace GameServer.Controllers
{
    [Authorize]
    public class PlayerProfileController : Controller
    {
        public async Task<ViewResult> Index()
        {
            Player player = await RepositoriesFactory.PlayerRepository.FindAsync(User.Identity.Name);
            return View(player);
        }
    }
}