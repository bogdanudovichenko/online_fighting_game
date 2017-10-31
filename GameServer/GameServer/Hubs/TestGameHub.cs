using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameServer.Hubs
{
    public class TestGameHub : Hub
    {
        protected static readonly List<string> _connections = new List<string>();

        public override Task OnConnected()
        {
            string connectionId = Context.ConnectionId;
            _connections.Add(connectionId);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string connectionId = Context.ConnectionId;
            _connections.Remove(connectionId);
            return base.OnDisconnected(stopCalled);
        }

        public void DoActions(string actionsJson)
        {
            Clients.All.SentActions(actionsJson);
        }
    }
}