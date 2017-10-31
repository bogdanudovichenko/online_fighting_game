using Newtonsoft.Json;

namespace GameServer.Models.ViewModels
{
    public class GameRoomViewModel
    {
        public int Id { get; set; }
        public PlayerForRoomViewModel Player1 { get; set; }
        public PlayerForRoomViewModel Player2 { get; set; }
        public int RoomStatus { get; set; }
    }
}