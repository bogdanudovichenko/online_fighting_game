namespace GameServer.Models.Game
{
    public class GameRoom : Entity
    {
        public int? Player1Id { get; set; }
        public int? Player2Id { get; set; }
        public int RoomStatus { get; set; }
        public bool Player1Ready { get; set; }
        public bool Player2Ready { get; set; }

        public bool IsFull => Player1Ready && Player2Ready && Player1Id.HasValue && Player2Id.HasValue && Player1Id != 0 && Player2Id != 0;

        public bool IsEmpty => (!Player1Id.HasValue && !Player2Id.HasValue) || (Player1Id == 0 && Player2Id == 0) || (!Player1Id.HasValue && Player2Id == 0) || (Player1Id == 0 && !Player2Id.HasValue);
    }
}