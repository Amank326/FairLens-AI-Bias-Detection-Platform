const crypto = require('crypto');

/**
 * Cache Service (In-Memory Simulation for Redis)
 * Stores analysis results against a hash of the dataset payload
 * to save API costs and improve response times.
 */
class CacheService {
  constructor() {
    this.cache = new Map();
  }

  // Generate a deterministic hash for the incoming data
  generateHash(datasetSummary, metrics) {
    const dataString = JSON.stringify({ datasetSummary, metrics });
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  get(hash) {
    const item = this.cache.get(hash);
    if (!item) return null;
    
    // Optional: Add TTL expiry check here 
    if (Date.now() > item.expiresAt) {
      this.cache.delete(hash);
      return null;
    }
    
    return item.data;
  }

  set(hash, data, ttlMs = 86400000) { // Default 24 hours caching
    this.cache.set(hash, {
      data,
      expiresAt: Date.now() + ttlMs
    });
  }
}

module.exports = new CacheService();