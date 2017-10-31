using GameServer.Models.Game;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GameServer.Repositories.Interfaces
{
    public interface IPlayerRepository : IGenericRepository<Player>
    {
        Task<Player> FindAsync(string login);
        Task<IEnumerable<Player>> GetOnlinePlayers();
    }
}