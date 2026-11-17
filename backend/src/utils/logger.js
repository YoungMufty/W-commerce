const winston = require('winston');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Ensure stats directory exists (use os.tmpdir() in serverless to prevent EROFS)
const logDir = isServerless 
    ? path.join(os.tmpdir(), 'w-commerce-logs')
    : path.join(__dirname, '../../../logs');

try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
} catch (e) {
    // In serverless / read-only environment, ignore directory creation failures
}

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let metaText = '';
    if (meta && Object.keys(meta).length > 0) {
        try {
            metaText = ` ${JSON.stringify(meta)}`;
        } catch (error) {
            metaText = ` ${JSON.stringify({ meta: 'unserializable' })}`;
        }
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}${metaText}`;
});

// Configure Winston transports
// Console transport is ALWAYS added so cloud environments (Vercel, Railway, Docker) capture logs via stdout/stderr
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            process.env.NODE_ENV !== 'production' ? winston.format.colorize() : winston.format.uncolorize(),
            logFormat
        )
    })
];

// In non-serverless environments or if directory is writable, also add file transports safely
if (!isServerless) {
    try {
        transports.push(
            new winston.transports.File({
                filename: path.join(logDir, 'error.log'),
                level: 'error'
            }),
            new winston.transports.File({
                filename: path.join(logDir, 'combined.log')
            })
        );
    } catch (e) {
        // Ignore file transport failures on read-only environments
    }
}

// Configure Winston
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports
});

// Stream for Morgan (HTTP request logger)
logger.stream = {
    write: function (message) {
        logger.info(message.trim());
    }
};

module.exports = logger;
