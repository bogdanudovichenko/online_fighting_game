namespace GameServer.Models.Game
{
    public class Player : Entity
    {
        public string Login { get; set; }
        public string HashedPassword { get; set; }
        public bool IsOnline { get; set; }
    }
}