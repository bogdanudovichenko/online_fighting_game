using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using GameServer.Models.Game;
using GameServer.Repositories.Interfaces;
using GameServer.Configurations;
using GameServer.Models.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System;
using GameServer.Extensions;
using GameServer.Enums;

namespace GameServer.Hubs
{
    [Authorize]
    public class GameHub : BaseHub
    {
        private readonly IRoomRepository _roomRepository = RepositoriesFactory.RoomRepository;

        public async override Task OnConnected()
        {
            try
            {
                await _SwitchPlayerToOnline();
                await base.OnConnected();
            }
            catch (Exception)
            {
                throw new Exception("Error when connect to hub");
            }
        }

        public async override Task OnDisconnected(bool stopCalled)
        {
            try
            {
                await _SwithPlayerToOffline();
                await LeaveRoom();
                await base.OnDisconnected(stopCalled);
            }
            catch (Exception)
            {
                throw new Exception("Error when disconnected from hub");
            }
        }

        #region room

        public async Task GetRooms()
        {
            IEnumerable<GameRoomViewModel> rooms = await _gameRoomsService.GetAllForViewAsync();
            Clients.Caller.SentRooms(rooms);
        }

        public async Task CreateRoom()
        {
            try
            {
                int? playerId = PlayerId;
                if(playerId.HasValue) await _gameRoomsService.CreateRoomAsync(playerId.Value);

                IEnumerable<GameRoomViewModel> rooms = await _gameRoomsService.GetAllForViewAsync();
                Clients.All.SentRooms(rooms);
            }
            catch (Exception)
            {
                throw new Exception("Error when try create room");
            }
        }

        public async Task JoinRoom(int roomId)
        {
            try
            {
                int? playerId = PlayerId;
                if (playerId.HasValue) await _gameRoomsService.JoinRoomAsync(roomId, playerId.Value);

                IEnumerable<GameRoomViewModel> rooms = await _gameRoomsService.GetAllForViewAsync();
                Clients.All.SentRooms(rooms);
            }
            catch (Exception)
            {
                throw new Exception("Error when try join to the rom");
            }
        }

        public async Task LeaveRoom()
        {
            int? playerId = PlayerId;
            if(playerId.HasValue) await _gameRoomsService.LeaveRoomAsync(playerId.Value);

            IEnumerable<GameRoomViewModel> rooms = await _gameRoomsService.GetAllForViewAsync();
            Clients.All.SentRooms(rooms);
        }

        public async Task IamReady()
        {
            int playerId = await GetPlayerFromDataBaseIdAsync();
            GameRoom gameRoom = await _roomRepository.FindRoomByPlayerIdAsync(playerId);
            if (gameRoom == null) return;

            if (gameRoom.Player1Id == playerId)
            {
                gameRoom.Player1Ready = true;
            }
            else if (gameRoom.Player2Id == playerId)
            {
                gameRoom.Player2Ready = true;
            }

            await _roomRepository.UpdateAsync(gameRoom);

            IEnumerable<GameRoomViewModel> rooms = await _gameRoomsService.GetAllForViewAsync();
            Clients.All.SentRooms(rooms);

            if (gameRoom.IsFull)
            {
                gameRoom.RoomStatus = (int)GameRoomStatus.InBattle;
                await _roomRepository.UpdateAsync(gameRoom);
                List<string> connectionsIdList = GetConnectionsIdListByPlayersIdList(new int[] { gameRoom.Player1Id.Value, gameRoom.Player2Id.Value });
                Clients.Clients(connectionsIdList).StartBattle();
            }
        }

        #endregion room

        #region Battle
        public async Task DoActions(GameAction action)
        {
            if (!PlayerId.HasValue) return;
            int playerId = PlayerId.Value;

            GameRoom gameRoom = await _roomRepository.FindRoomByPlayerIdAsync(playerId);
            if (gameRoom == null || !gameRoom.Player1Id.HasValue || gameRoom.Player1Id == 0 || !gameRoom.Player2Id.HasValue || gameRoom.Player2Id == 0) return;

            int playerRecipientId = gameRoom.Player1Id == playerId ? gameRoom.Player2Id.Value : gameRoom.Player1Id.Value;
            
            List<string> connectionsIdList = GetConnectionsIdListByPlayerId(playerRecipientId);
            Clients.Clients(connectionsIdList).SentActions(action);
        }
        #endregion Battle

        private async Task _SwitchPlayerToOnline()
        {
            Player player = await _playerRepository.FindAsync(PlayerName);
            player.IsOnline = true;
            await _playerRepository.UpdateAsync(player);
        }

        private async Task _SwithPlayerToOffline()
        {
            Player player = await _playerRepository.FindAsync(PlayerName);
            player.IsOnline = false;
            await _playerRepository.UpdateAsync(player);
        }
    }
}