using GameServer.Helpers;
using System;
using System.Web.Http;

namespace GameServer.Controllers
{
    public class PlayerController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetMyId()
        {
            try
            {
                return Ok(PlayerHelper.PlayerId);
            }
            catch(Exception)
            {
                return BadRequest("Internal server error");
            }
        }
    }
}