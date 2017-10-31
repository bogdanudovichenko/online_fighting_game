using GameServer.Services.Interfaces;
using System;
using System.Collections.Generic;
using GameServer.Models.ViewModels;
using System.Threading.Tasks;
using GameServer.Repositories.Interfaces;
using GameServer.Configurations;
using GameServer.Models.Game;
using System.Linq;
using GameServer.Enums;

namespace GameServer.Services.Concrete
{
    public class GameRoomsService : IGameRoomsService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IRoomRepository _roomRepository;

        public GameRoomsService()
        {
            _playerRepository = RepositoriesFactory.PlayerRepository;
            _roomRepository = RepositoriesFactory.RoomRepository;
        }

        public async Task<IEnumerable<GameRoomViewModel>> GetAllForViewAsync()
        {
            IEnumerable<GameRoom> rooms = await _roomRepository.GetAllAsync();
            IEnumerable<Player> players = await _playerRepository.GetAllAsync();

            return rooms.Select(r => new GameRoomViewModel
            {
                Id = r.Id,
                Player1 = new PlayerForRoomViewModel
                {
                    Id = r.Player1Id,
                    PlayerName = players.FirstOrDefault(p => p.Id == r.Player1Id)?.Login
                },
                Player2 = new PlayerForRoomViewModel
                {
                    Id = r.Player2Id,
                    PlayerName = players.FirstOrDefault(p => p.Id == r.Player2Id)?.Login
                },
                RoomStatus = r.RoomStatus
            }).ToList();
        }

        public async Task CreateRoomAsync(int playerId)
        {
            GameRoom gameRoom = await _roomRepository.FindRoomByPlayerIdAsync(playerId);
            if (gameRoom != null) return;

            var room = new GameRoom
            {
                Player1Id = playerId
            };

            await _roomRepository.CreateAsync(room);
        }

        public async Task JoinRoomAsync(int roomId, int playerId)
        {
            try
            {
                GameRoom room = await _roomRepository.FindAsync(roomId);
                if (room == null) return;
                
                if (room.Player2Id == null || room.Player2Id == 0) room.Player2Id = playerId;
                else if (room.Player1Id == null || room.Player1Id == 0) room.Player1Id = playerId;

                await _roomRepository.UpdateAsync(room);
            }
            catch (Exception)
            {
                throw new Exception("Error when try join to the rom");
            }
        }

        public async Task LeaveRoomAsync(int playerId)
        {
            GameRoom room = await _roomRepository.FindRoomByPlayerIdAsync(playerId);
            if (room == null) return;

            if (room.Player1Id == playerId)
            {
                room.Player1Id = 0;
                room.Player1Ready = false;
            }
            else if (room.Player2Id == playerId)
            {
                room.Player2Id = 0;
                room.Player2Ready = false;
            }

            if (room.Player1Id != null || room.Player2Id != null || room.Player1Id != 0 || room.Player2Id != 0) await _roomRepository.UpdateAsync(room);
            else await _roomRepository.RemoveAsync(room.Id);
        }

        public async Task IamReadyAsync(int playerId)
        {
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
        }
    }
}