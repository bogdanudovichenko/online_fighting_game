using GameServer.Models.ViewModels;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace GameServer.Extensions
{
    public static class EnumerableExtensions
    {
        public static string ToJson(this IEnumerable<GameRoomViewModel> gameRooms)
        {
            return JsonConvert.SerializeObject(gameRooms);
        }
    }
}