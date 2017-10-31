using GameServer.Configurations;
using GameServer.Helpers;
using GameServer.Services.Interfaces;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace GameServer.Controllers
{
    [Authorize]
    public class GameRoomsController : ApiController
    {
        private readonly IGameRoomsService _gameRoomsService;

        public GameRoomsController()
        {
            _gameRoomsService = ServicesFactory.GameRoomsService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetAll()
        {
            try
            {
                return Ok(await _gameRoomsService.GetAllForViewAsync());
            }
            catch(Exception)
            {
                return BadRequest("Internal server error");
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> CreateRoom()
        {
            try
            {
                int? playerId = PlayerId;
                if(playerId.HasValue) await _gameRoomsService.CreateRoomAsync(playerId.Value);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Internal server error");
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> JoinRoom(int roomId)
        {
            try
            {
                int? playerId = PlayerId;
                if (playerId.HasValue) await _gameRoomsService.JoinRoomAsync(roomId, playerId.Value);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Internal server error");
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> LeaveRoom(int roomId)
        {
            try
            {
                int? playerId = PlayerId;
                if (playerId.HasValue) await _gameRoomsService.LeaveRoomAsync(playerId.Value);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Internal server error");
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> IamReady(int roomId)
        {
            try
            {
                int? playerId = PlayerId;
                if (playerId.HasValue) await _gameRoomsService.IamReadyAsync(playerId.Value);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest("Internal server error");
            }
        }

        protected int? PlayerId => PlayerHelper.PlayerId;
    }
}