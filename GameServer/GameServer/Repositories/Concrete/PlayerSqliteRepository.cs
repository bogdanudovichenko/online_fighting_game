using System.Collections.Generic;
using GameServer.Models.Game;
using Dapper;
using System.Linq;
using System.Threading.Tasks;
using GameServer.Repositories.Interfaces;
using System;

namespace GameServer.Repositories.Concrete
{
    public sealed class PlayerSqliteRepository : GenericSqliteRepository<Player>, IPlayerRepository
    {
        private const string TableName = "Players";

        public async Task<Player> FindAsync(string login)
        {
            string query = $"SELECT * FROM {TableName} WHERE login=@login";
            IEnumerable<Player> players = await _connect.QueryAsync<Player>(query, new { login });
            return players.FirstOrDefault();
        }

        public async Task<IEnumerable<Player>> GetOnlinePlayers()
        {
            bool isOnline = true;
            string query = $"SELECT * FROM {TableName} WHERE isOnline=@isOnline";
            IEnumerable<Player> players = await _connect.QueryAsync<Player>(query, new { isOnline });
            return players;
        }

        public override async Task<bool> UpdateAsync(Player player)
        {
            string query = $"UPDATE {TableName} SET login = @Login, hashedPassword = @HashedPassword, isOnline = @IsOnline WHERE Id = @Id";
            IEnumerable<int> results = await _connect.QueryAsync<int>(query, player);
            return results.Any();
        }
    }
}