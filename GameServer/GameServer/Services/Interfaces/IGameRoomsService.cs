using GameServer.Models.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameServer.Services.Interfaces
{
    public interface IGameRoomsService
    {
        Task<IEnumerable<GameRoomViewModel>> GetAllForViewAsync();
        Task CreateRoomAsync(int playerId);
        Task JoinRoomAsync(int roomId, int playerId);
        Task LeaveRoomAsync(int playerId);
        Task IamReadyAsync(int playerId);
    }
}
