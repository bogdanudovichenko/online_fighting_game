using GameServer.Configurations;
using GameServer.Models.Auth;
using GameServer.Services.Interfaces;
using Microsoft.Owin.Security;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace GameServer.Controllers
{
    public class AuthController : Controller
    {
        private readonly IAuthService _authService = ServicesFactory.AuthService;
        private IAuthenticationManager AuthenticationManager => HttpContext.GetOwinContext().Authentication;

        #region Register
        public ViewResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterModel registerModel)
        {
            if (!ModelState.IsValid)
            {
                return View(registerModel);
            }

            AuthResultModel authResultModel = await _authService.RegisterAsync(registerModel);

            if (!authResultModel.Success)
            {
                ModelState.AddModelError(authResultModel.Field, authResultModel.ErrorMessage);
                return View(registerModel);
            }

            return RedirectToAction("Login");
        }
        #endregion

        #region Login
        public ViewResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginModel loginModel)
        {
            if (!ModelState.IsValid)
            {
                return View(loginModel);
            }

            AuthResultModel authResultModel = await _authService.CanLoginAsync(loginModel);

            if (!authResultModel.Success)
            {
                ModelState.AddModelError(authResultModel.Field ?? "Ошибка", authResultModel.ErrorMessage);
                return View(loginModel);
            }

            var claim = new ClaimsIdentity("ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            claim.AddClaim(new Claim(ClaimTypes.NameIdentifier, authResultModel.PlayerId.ToString(), ClaimValueTypes.String));
            claim.AddClaim(new Claim(ClaimsIdentity.DefaultNameClaimType, loginModel.Login, ClaimValueTypes.String));
            claim.AddClaim(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider","OWIN Provider", ClaimValueTypes.String));

            AuthenticationManager.SignOut();
            AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = true }, claim);
            return RedirectToAction("Index", "PlayerProfile");
        }

        public ActionResult Logout()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Login", "Auth");
        }
        #endregion
    }
}