using GameServer.Models.Game;
using GameServer.Repositories.Abstract;
using GameServer.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Dapper.FastCrud;
using System;

namespace GameServer.Repositories.Concrete
{
    public class GenericSqliteRepository<T> : SqliteRepository, IGenericRepository<T> where T : Entity
    {
        public virtual async Task<IReadOnlyList<T>> GetAllAsync()
        {
            IEnumerable<T> entities = await _connect.FindAsync<T>();
            return entities.ToList();
        }

        public virtual async Task<T> FindAsync(int id)
        {
            IReadOnlyList<T> entities = await GetAllAsync();
            return entities.FirstOrDefault(e => e.Id == id);
        }

        public virtual async Task CreateAsync(T entity)
        {
            try
            {
                await _connect.InsertAsync(entity);
            }
            catch (Exception ex)
            {
                if (!ex.Message.Contains("no such function: SCOPE_IDENTITY"))
                {
                    throw;
                }
            }
        }

        public virtual async Task<bool> UpdateAsync(T entity)
        {
            return await _connect.UpdateAsync(entity);
        }

        public virtual async Task<bool> RemoveAsync(int id)
        {
            T entity = await FindAsync(id);
            return await _connect.DeleteAsync(entity);
        }
    }
}