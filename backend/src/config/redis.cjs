const redisManager = require('../utils/redisManager');
const logger = require('../utils/logger');

// Initialize Redis early and await it before binding the HTTP server.
const redisReadyPromise = (async () => {
    try {
        await redisManager.initialize();
        logger.info('Redis initialized successfully');
        return redisManager;
    } catch (error) {
        logger.error(`Redis initialization failed: ${error.message}`);
        logger.warn('⚠️ Redis unavailable; falling back to in-memory store.');
        return redisManager;
    }
})();

module.exports = {
    redisManager,
    redisReadyPromise
};
