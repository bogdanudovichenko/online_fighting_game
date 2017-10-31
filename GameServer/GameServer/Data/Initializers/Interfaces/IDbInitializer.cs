using System;

namespace GameServer.Data.Initializers.Interfaces
{
    public interface IDbInitializer : IDisposable 
    {
        void Initialize();
    }
}
