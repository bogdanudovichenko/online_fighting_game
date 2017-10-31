using GameServer.Data.Initializers.Concrete;
using GameServer.Data.Initializers.Interfaces;

namespace GameServer.Configurations
{
    public static class InitializersManager
    {
        public static IDbInitializer DbInitializer => new SqliteInitializer();
    }
}