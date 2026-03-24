const { getCache, setCache } = require('../config/redis');

const cache = (ttlSeconds = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Namespace cache key by user ID if logged in, or 'guest' if anonymous
    const userId = req.user ? req.user._id.toString() : 'guest';
    const key = `cache:${userId}:${req.originalUrl || req.url}`;
    try {
      const cachedData = await getCache(key);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }
      
      // Override res.json to capture the response body
      res.originalJson = res.json;
      res.json = (body) => {
        // Check if status code is 200 and request succeeded before caching
        if (res.statusCode === 200 && body && body.success) {
          setCache(key, body, ttlSeconds).catch(err => {
            console.error(`Failed to cache key ${key}:`, err.message);
          });
        }
        return res.originalJson(body);
      };
      
      next();
    } catch (err) {
      console.warn(`Cache middleware warning for key ${key}:`, err.message);
      next();
    }
  };
};

module.exports = cache;
