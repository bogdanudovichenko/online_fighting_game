using Dapper;
using GameServer.Configurations;
using GameServer.Data.Initializers.Interfaces;
using GameServer.Models.Auth;
using GameServer.Services.Interfaces;
using System;
using System.Data.SQLite;
using System.Linq;

namespace GameServer.Data.Initializers.Concrete
{
    public sealed class SqliteInitializer : IDbInitializer
    {
        private readonly SQLiteConnection _connect = new SQLiteConnection(DbConfig.Connection);
        private const string PLAYERS = "Players";
        private const string GAME_ROOMS = "GameRooms";

        public SqliteInitializer()
        {
            _connect.Open();
        }

        public void Dispose()
        {
            _connect.Dispose();
        }

        public void Initialize()
        {
            if (!_TableExists(PLAYERS))
            {
                _CreatePlayersTable();
                _InsertTestValuesToPlayersTable();
            }

            if(!_TableExists(GAME_ROOMS))
            {
                _CreateGameRoomsTable();
                _InsertTestValuesToGameRoomsTable();
            }
        }

        private bool _TableExists(string tableName)
        {
            string query = "SELECT name FROM sqlite_master WHERE type = 'table' AND name = @tableName";
            return _connect.Query<dynamic>(query, new { tableName }).Any();
        }

        public void _CreatePlayersTable()
        {
            string query = $"CREATE TABLE {PLAYERS}(Id INTEGER PRIMARY KEY NOT NULL, Login TEXT NOT NULL, HashedPassword TEXT NOT NULL, IsOnline INT NOT NULL)";
            _connect.Execute(query);
        }

        public void _CreateGameRoomsTable()
        {
            string query = $"CREATE TABLE {GAME_ROOMS}(Id INTEGER PRIMARY KEY NOT NULL, Player1Id INT, Player2Id INT, RoomStatus INT NOT NULL, Player1Ready INT NOT NULL, Player2Ready INT NOT NULL)";
            _connect.Execute(query);
        }

        public void _InsertTestValuesToPlayersTable()
        {
            IAuthService authService = ServicesFactory.AuthService;

            authService.RegisterAsync(new RegisterModel
            {
                Login = "TestPlayer1",
                Password = "12345"
            }).Wait();

            authService.RegisterAsync(new RegisterModel
            {
                Login = "TestPlayer2",
                Password = "12345"
            }).Wait();

            authService.RegisterAsync(new RegisterModel
            {
                Login = "TestPlayer3",
                Password = "12345"
            }).Wait();
        }

        public void _InsertTestValuesToGameRoomsTable()
        {
            string room1Query = $"INSERT INTO {GAME_ROOMS} (Player1Id, Player2Id, RoomStatus, Player1Ready, Player2Ready) VALUES (1, 2, 0, 0, 0)";
            string room2Query = $"INSERT INTO {GAME_ROOMS} (Player1Id, Player2Id, RoomStatus, Player1Ready, Player2Ready) VALUES (3, NULL, 0, 0, 0)";

            _connect.Execute(room1Query);
            _connect.Execute(room2Query);
        }
    }
}