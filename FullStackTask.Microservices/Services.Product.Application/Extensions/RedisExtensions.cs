using StackExchange.Redis;

namespace Shared.Kernel.Extensions
{
    public static class RedisExtensions
    {
        /// <summary>
        /// Belirli bir pattern'e uyan (örn: products_*) tüm cache key'lerini siler.
        /// </summary>
        public static async Task RemoveByPatternAsync(this IConnectionMultiplexer redisConnection, string pattern)
        {
            var endpoints = redisConnection.GetEndPoints();
            var server = redisConnection.GetServer(endpoints.First());
            var keys = server.Keys(pattern: pattern).ToArray();

            if (keys.Any())
            {
                await redisConnection.GetDatabase().KeyDeleteAsync(keys);
            }
        }
    }
}
