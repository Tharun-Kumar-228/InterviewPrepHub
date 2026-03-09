const Redis = require('ioredis');

let redisClient = null;
let isRedisEnabled = process.env.REDIS_ENABLED === 'true';

// In-memory fallback cache
const localCache = new Map();

if (isRedisEnabled) {
  try {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully.');
    });

    redisClient.on('error', (err) => {
      console.warn('Redis connection error. Falling back to in-memory caching.', err.message);
      isRedisEnabled = false;
    });
  } catch (error) {
    console.warn('Could not initialize Redis. Falling back to in-memory caching.', error.message);
    isRedisEnabled = false;
  }
} else {
  console.log('Redis is disabled. Using in-memory fallback cache.');
}

const getCache = async (key) => {
  if (isRedisEnabled && redisClient) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Redis GET Error:', err);
      return localCache.get(key) || null;
    }
  } else {
    const item = localCache.get(key);
    if (item && item.expiry > Date.now()) {
      return item.value;
    } else if (item) {
      localCache.delete(key); // Clean expired
    }
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 300) => {
  if (isRedisEnabled && redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.error('Redis SET Error:', err);
      localCache.set(key, {
        value,
        expiry: Date.now() + ttlSeconds * 1000
      });
    }
  } else {
    localCache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000
    });
  }
};

const delCache = async (key) => {
  if (isRedisEnabled && redisClient) {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error('Redis DEL Error:', err);
      localCache.delete(key);
    }
  } else {
    localCache.delete(key);
  }
};

const invalidatePattern = async (pattern) => {
  console.log(`Invalidating cache pattern: ${pattern}`);
  if (isRedisEnabled && redisClient) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        console.log(`Deleted ${keys.length} keys from Redis.`);
      }
    } catch (err) {
      console.error('Redis keys/del pattern error:', err);
      // fallback invalidate local
      invalidateLocalPattern(pattern);
    }
  } else {
    invalidateLocalPattern(pattern);
  }
};

const invalidateLocalPattern = (pattern) => {
  const regexString = pattern.replace(/\*/g, '.*');
  const regex = new RegExp(`^${regexString}$`);
  let count = 0;
  for (const key of localCache.keys()) {
    if (regex.test(key)) {
      localCache.delete(key);
      count++;
    }
  }
  console.log(`Deleted ${count} keys from in-memory cache.`);
};

module.exports = {
  getCache,
  setCache,
  delCache,
  invalidatePattern,
  isRedisActive: () => isRedisEnabled
};
