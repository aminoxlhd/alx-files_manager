const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
  }

  isAlive() {
    return this.client.ready;
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.setex(key, duration, value);
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  async del(key) {
    try {
      const deleted = await this.client.del(key);
      return deleted === 1;
    } catch (error) {
      console.error('Error deleting key from Redis:', error);
      return false;
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
