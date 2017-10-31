using GameServer.Models.Auth;
using System.Threading.Tasks;

namespace GameServer.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResultModel> RegisterAsync(RegisterModel registerModel);
        Task<AuthResultModel> CanLoginAsync(LoginModel loginModel);
    }
}