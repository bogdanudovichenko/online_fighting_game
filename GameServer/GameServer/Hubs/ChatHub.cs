using Microsoft.AspNet.SignalR;

namespace GameServer.Hubs
{
    public class ChatHub : BaseHub
    {
        [Authorize]
        public void Send(string message)
        {
            Clients.All.AddMessage(PlayerName, message);
        }
    }
}