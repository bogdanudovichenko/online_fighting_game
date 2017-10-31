using GameServer.Services.Concrete;
using GameServer.Services.Interfaces;

namespace GameServer.Configurations
{
    public static class ServicesFactory
    {
        public static IAuthService AuthService => new AuthService();
        public static IGameRoomsService GameRoomsService = new GameRoomsService();
    }
}