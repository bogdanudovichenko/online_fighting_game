 using System;
using GameServer.Models.Auth;
using GameServer.Services.Interfaces;
using GameServer.Repositories.Interfaces;
using GameServer.Configurations;
using System.Threading.Tasks;
using GameServer.Models.Game;
using System.Text;

namespace GameServer.Services.Concrete
{
    public class AuthService : IAuthService
    {
        public async Task<AuthResultModel> RegisterAsync(RegisterModel registerModel)
        {
            try
            {
                using (IPlayerRepository playerRepository = RepositoriesFactory.PlayerRepository)
                {
                    Player player = await playerRepository.FindAsync(registerModel.Login);

                    if (player != null)
                    {
                        return new AuthResultModel
                        {
                            Success = false,
                            Field = nameof(registerModel.Login),
                            ErrorMessage = $"Игрок с логином \"{registerModel.Login}\" уже есть"
                        };
                    }

                    player = new Player
                    {
                        Login = registerModel.Login,
                        HashedPassword = _CreatePasswordHash(registerModel.Password)
                    };

                    await playerRepository.CreateAsync(player);
                    return new AuthResultModel { PlayerId = player.Id };
                }
            }
            catch (Exception)
            {
                return new AuthResultModel
                {
                    Success = false,
                    Field = nameof(registerModel.PasswordConfirm),
                    ErrorMessage = $"Произошла неизвестная ошибка при регистрации, попробуйте позже."
                };
            }
        }

        public async Task<AuthResultModel> CanLoginAsync(LoginModel loginModel)
        {
            try
            {
                using (IPlayerRepository playerRepository = RepositoriesFactory.PlayerRepository)
                {
                    Player player = await playerRepository.FindAsync(loginModel.Login);

                    if (player == null)
                    {
                        return new AuthResultModel
                        {
                            Success = false,
                            Field = nameof(loginModel.Login),
                            ErrorMessage = $"Игрок с логином \"{loginModel.Login}\" не найден"
                        };
                    }

                    if (player.HashedPassword != _CreatePasswordHash(loginModel.Password))
                    {
                        return new AuthResultModel
                        {
                            Success = false,
                            Field = nameof(loginModel.Password),
                            ErrorMessage = $"Пароль введен не верно"
                        };
                    }

                    return new AuthResultModel { PlayerId = player.Id };
                }
            }
            catch (Exception)
            {
                return new AuthResultModel
                {
                    Success = false,
                    Field = nameof(loginModel.Password),
                    ErrorMessage = $"Произошла неизвестная ошибка при авторизации, попробуйте позже."
                };
            }
        }

        private string _CreatePasswordHash(string password)
        {
            var bytes = new UTF8Encoding().GetBytes(password);
            var hashBytes = System.Security.Cryptography.MD5.Create().ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }
    }
}