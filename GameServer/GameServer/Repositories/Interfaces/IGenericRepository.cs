using GameServer.Models.Game;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameServer.Repositories.Interfaces
{
    public interface IGenericRepository<T> : IDisposable where T : Entity
    {
        Task<T> FindAsync(int id);
        Task<IReadOnlyList<T>> GetAllAsync();

        Task CreateAsync(T entity);
        Task<bool> UpdateAsync(T entity);
        Task<bool> RemoveAsync(int id);
    }
}