using GameServer.Configurations;
using GameServer.Helpers;
using GameServer.Models.Game;
using GameServer.Repositories.Interfaces;
using GameServer.Services.Interfaces;
using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GameServer.Hubs
{
    public abstract class BaseHub : Hub
    {
        protected static readonly List<ConnectionModel> _connections = new List<ConnectionModel>();
        protected readonly IPlayerRepository _playerRepository = RepositoriesFactory.PlayerRepository;
        protected readonly IGameRoomsService _gameRoomsService = ServicesFactory.GameRoomsService;

        public override Task OnConnected()
        {
            string connectionId = Context.ConnectionId;
            _connections.Add(new ConnectionModel { ConnectionId = connectionId, PlayerId = PlayerId });
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string connectionId = Context.ConnectionId;
            ConnectionModel connection = _connections.FirstOrDefault(c => c.ConnectionId == connectionId);
            if (connection != null) _connections.Remove(connection);
            return base.OnDisconnected(stopCalled);
        }

        protected string PlayerName => Context.User.Identity.Name;
        protected bool IsUserIsAuthenticated => Context.User.Identity.IsAuthenticated;

        protected async Task<Player> GetPlayerAsync()
        {
            return await _playerRepository.FindAsync(PlayerName);
        }

        protected async Task<int> GetPlayerFromDataBaseIdAsync()
        {
            Player player = await GetPlayerAsync();
            return player != null ? player.Id : 0;
        }

        protected int? PlayerId => PlayerHelper.PlayerId;

        protected List<string> GetConnectionsIdListByPlayersIdList(IEnumerable<int> playersIdList)
        {
            return _connections.Where(c => c.PlayerId.HasValue && playersIdList.Contains(c.PlayerId.Value)).Select(c => c.ConnectionId).ToList();
        }

        protected string GetConnectionIdByPlayerId(int playerId)
        {
            return GetConnectionsIdListByPlayersIdList(new[] { playerId })?.FirstOrDefault();
        }
    }
}