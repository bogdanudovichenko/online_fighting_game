using GameServer.Configurations;
using System;
using System.Data.SQLite;

namespace GameServer.Repositories.Abstract
{
    public abstract class SqliteRepository : IDisposable
    {
        protected readonly SQLiteConnection _connect = new SQLiteConnection(DbConfig.Connection);

        public SqliteRepository()
        {
            _connect.Open();
        }

        public void Dispose()
        {
            _connect.Dispose();
        }
    }
}