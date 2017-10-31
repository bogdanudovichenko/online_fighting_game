using System.Threading.Tasks;
using GameServer.Models.Game;
using GameServer.Repositories.Interfaces;
using System.Collections.Generic;
using Dapper;
using System.Linq;

namespace GameServer.Repositories.Concrete
{
    public class RoomSqliteRepository : GenericSqliteRepository<GameRoom>, IRoomRepository
    {
        private const string TableName = "GameRooms";

        public async Task<GameRoom> FindRoomByPlayerIdAsync(int playerId)
        {
            string query = $"SELECT * FROM {TableName} WHERE player1Id=@playerId OR player2Id=@playerId";
            IEnumerable<GameRoom> rooms = await _connect.QueryAsync<GameRoom>(query, new { playerId });
            return rooms?.FirstOrDefault();
        }

        public async override Task<bool> UpdateAsync(GameRoom gameRoom)
        {
            string query = $"UPDATE {TableName} SET Player1Id = @Player1Id, Player2Id = @Player2Id, RoomStatus = @RoomStatus, Player1Ready=@Player1Ready, Player2Ready=@Player2Ready WHERE Id = @Id";
            IEnumerable<int> results = await _connect.QueryAsync<int>(query, gameRoom);
            return results.Any();
        }
    }
}