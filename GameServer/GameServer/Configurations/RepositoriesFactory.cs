using GameServer.Repositories.Concrete;
using GameServer.Repositories.Interfaces;

namespace GameServer.Configurations
{
    public static class RepositoriesFactory
    {
        public static IPlayerRepository PlayerRepository => new PlayerSqliteRepository();
        public static IRoomRepository RoomRepository => new RoomSqliteRepository();
    }
}