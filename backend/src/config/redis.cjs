const redisManager = require('../utils/redisManager');
const logger = require('../utils/logger');

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Initialize Redis early and await it before binding the HTTP server.
// In serverless, avoid any startup blocks
const redisReadyPromise = (async () => {
    if (isServerless) {
        return redisManager;
    }
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
