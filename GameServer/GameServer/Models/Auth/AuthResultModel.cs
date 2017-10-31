namespace GameServer.Models.Auth
{
    public class AuthResultModel
    {
        public bool Success { get; set; } = true;
        public string Field { get; set; }
        public string ErrorMessage { get; set; }
        public int PlayerId { get; set; }
    }
}