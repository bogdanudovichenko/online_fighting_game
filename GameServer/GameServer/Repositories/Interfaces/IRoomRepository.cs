using GameServer.Models.Game;
using System.Threading.Tasks;

namespace GameServer.Repositories.Interfaces
{
    public interface IRoomRepository : IGenericRepository<GameRoom>
    {
        Task<GameRoom> FindRoomByPlayerIdAsync(int playerId);
    }
}
