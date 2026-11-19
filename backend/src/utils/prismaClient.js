'use strict';
const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const globalForPrisma = globalThis;
const isProduction = process.env.NODE_ENV === 'production';
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

/**
 * Resolves and tunes the database connection string for PostgreSQL / Supabase:
 * - Checks DATABASE_URL, SUPABASE_DATABASE_URL, DIRECT_URL
 * - For Supabase PgBouncer pooler (port 6543 or pooler.supabase.com): automatically appends pgbouncer=true
 * - Serverless (Vercel / Lambda): connection_limit=1 to prevent connection pool exhaustion
 * - Production: connection_limit=5
 * - Connect and pool timeouts: connect_timeout=15, pool_timeout=15 to prevent hanging queries
 */
function resolveAndOptimizeDatabaseUrl() {
    let url = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.DIRECT_URL;
    if (!url) return null;

    url = url.trim().replace(/^["']|["']$/g, '');

    // Optimize PostgreSQL / Supabase URLs
    if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
        try {
            const parsed = new URL(url);
            const isPooler = parsed.port === '6543' || parsed.hostname.includes('pooler.supabase.com');

            // PgBouncer requires pgbouncer=true in transaction pooler mode
            if (isPooler && !parsed.searchParams.has('pgbouncer')) {
                parsed.searchParams.set('pgbouncer', 'true');
            }

            // Connection pool limit tuning
            if (!parsed.searchParams.has('connection_limit')) {
                if (isServerless) {
                    parsed.searchParams.set('connection_limit', '1');
                } else if (isProduction) {
                    parsed.searchParams.set('connection_limit', '5');
                }
            }

            // Connection and pool timeouts (15 seconds)
            if (!parsed.searchParams.has('connect_timeout')) {
                parsed.searchParams.set('connect_timeout', '15');
            }
            if (!parsed.searchParams.has('pool_timeout')) {
                parsed.searchParams.set('pool_timeout', '15');
            }

            return parsed.toString();
        } catch (_) {
            return url;
        }
    }

    return url;
}

const activeDatabaseUrl = resolveAndOptimizeDatabaseUrl();
if (activeDatabaseUrl) {
    process.env.DATABASE_URL = activeDatabaseUrl;
}

// In production, only log errors and warnings — query logging leaks SQL and is a performance sink.
const prismaLogLevels = isProduction
    ? ['error', 'warn']
    : (process.env.LOG_QUERIES === 'true' ? ['query', 'error', 'warn'] : ['error', 'warn']);

const clientOptions = {
    log: prismaLogLevels,
};

if (activeDatabaseUrl) {
    clientOptions.datasources = {
        db: {
            url: activeDatabaseUrl,
        },
    };
}

let basePrisma = globalForPrisma.__basePrisma;
if (!basePrisma) {
    basePrisma = new PrismaClient(clientOptions);
    globalForPrisma.__basePrisma = basePrisma;
}

// ── Query-level connection error guard ───────────────────────────────────────
// Catches transient connection drops and pool timeouts without crashing Express.
const extendedPrisma = basePrisma.$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                try {
                    return await query(args);
                } catch (err) {
                    const isConnError = (
                        (typeof err.code === 'string' && (err.code.startsWith('P1') || err.code === 'P2024')) ||
                        err.name === 'PrismaClientInitializationError' ||
                        err.name === 'PrismaClientRustPanicError' ||
                        err.message?.includes('Connection pool timed out') ||
                        err.message?.includes('Server has closed the connection') ||
                        err.message?.includes('Can\'t reach database server') ||
                        err.message?.includes('connect ECONNREFUSED')
                    );

                    if (isConnError) {
                        logger.error(`[Prisma:ConnectionFailure] ${model}.${operation} failed: ${err.message}`);
                    }
                    // Re-throw so Express error handler catches it cleanly as AppError (503)
                    throw err;
                }
            }
        }
    }
});

const prisma = globalForPrisma.prisma || extendedPrisma;

// ── In-memory fallback delegates for optional/extended models ────────────────
function createInMemoryDelegate() {
    const store = [];
    const matchesWhere = (item, where) => {
        if (!where) return true;
        return Object.entries(where).every(([k, v]) => {
            if (v && typeof v === 'object' && !(v instanceof Date)) return true;
            return item[k] === v;
        });
    };
    return {
        findUnique: async ({ where } = {}) => store.find(i => matchesWhere(i, where)) || null,
        findFirst: async ({ where } = {}) => store.find(i => matchesWhere(i, where)) || null,
        findMany: async ({ where, take, skip } = {}) => {
            let res = store.filter(i => matchesWhere(i, where));
            if (skip) res = res.slice(skip);
            if (take) res = res.slice(0, take);
            return res;
        },
        create: async ({ data } = {}) => {
            const record = { id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date(), updatedAt: new Date(), ...data };
            store.push(record);
            return record;
        },
        update: async ({ where, data } = {}) => {
            const idx = store.findIndex(i => matchesWhere(i, where));
            if (idx === -1) return { ...where, ...data };
            store[idx] = { ...store[idx], ...data, updatedAt: new Date() };
            return store[idx];
        },
        updateMany: async ({ where, data } = {}) => {
            let count = 0;
            store.forEach((item, idx) => {
                if (matchesWhere(item, where)) {
                    store[idx] = { ...item, ...data, updatedAt: new Date() };
                    count++;
                }
            });
            return { count };
        },
        upsert: async ({ where, create, update } = {}) => {
            const idx = store.findIndex(i => matchesWhere(i, where));
            if (idx !== -1) {
                store[idx] = { ...store[idx], ...update, updatedAt: new Date() };
                return store[idx];
            }
            const record = { id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date(), updatedAt: new Date(), ...create };
            store.push(record);
            return record;
        },
        delete: async ({ where } = {}) => {
            const idx = store.findIndex(i => matchesWhere(i, where));
            if (idx === -1) return null;
            return store.splice(idx, 1)[0];
        },
        deleteMany: async ({ where } = {}) => {
            const initial = store.length;
            for (let i = store.length - 1; i >= 0; i--) {
                if (matchesWhere(store[i], where)) store.splice(i, 1);
            }
            return { count: initial - store.length };
        },
        count: async ({ where } = {}) => store.filter(i => matchesWhere(i, where)).length,
    };
}

[
    'courierReview',
    'auditLog',
    'session',
    'domainEvent',
    'paymentIntent',
    'nigeriaLocation',
    'courierLocationHistory',
].forEach((modelName) => {
    if (!prisma[modelName]) {
        prisma[modelName] = createInMemoryDelegate();
    }
});

// Always assign to globalThis so serverless invocations and module reloads reuse the singleton instance
globalForPrisma.prisma = prisma;

// ── Graceful disconnect on process exit ──────────────────────────────────────
// Prevents "Connection pool timed out" on clean restarts.
let isDisconnecting = false;
async function disconnectPrisma() {
    if (isDisconnecting) return;
    isDisconnecting = true;
    try {
        if (basePrisma) {
            await basePrisma.$disconnect();
        }
        logger.info('[Prisma] Disconnected from database');
    } catch (e) {
        // ignore disconnect errors during shutdown
    }
}

process.on('SIGTERM', disconnectPrisma);
process.on('SIGINT', disconnectPrisma);

// ── Startup connectivity check ───────────────────────────────────────────────
// Verifies connection at startup with exponential backoff retries.
// In serverless, Vercel, or production with sleeping Supabase, warns clearly
// and runs in degraded mode instead of calling process.exit(1) to prevent crash loops.
async function verifyDatabaseConnection(retries = 3, delayMs = 2000) {
    if (!process.env.DATABASE_URL) {
        logger.error('[Prisma] ❌ DATABASE_URL is not configured. Database operations will be unavailable.');
        logger.warn('[Prisma] ⚠️ Running in degraded mode without DATABASE_URL');
        return false;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await basePrisma.$queryRaw`SELECT 1`;
            logger.info('[Prisma] ✅ Database connection verified');
            return true;
        } catch (err) {
            if (attempt < retries) {
                logger.warn(`[Prisma] Database connection attempt ${attempt}/${retries} failed: ${err.message}. Retrying in ${delayMs}ms...`);
                await new Promise(r => setTimeout(r, delayMs));
                delayMs = Math.min(delayMs * 2, 10000); // exponential backoff, max 10s
            } else {
                logger.error(`[Prisma] ❌ Could not connect to database after ${retries} attempts: ${err.message}`);
                // In serverless, Vercel, or production with sleeping Supabase, warn but do not hard-crash the container
                logger.warn('[Prisma] ⚠️ Running in degraded mode without verified database connection. Requests will attempt dynamic connection.');
                return false;
            }
        }
    }
}

module.exports = prisma;
module.exports.basePrisma = basePrisma;
module.exports.verifyDatabaseConnection = verifyDatabaseConnection;
module.exports.disconnectPrisma = disconnectPrisma;
module.exports.resolveAndOptimizeDatabaseUrl = resolveAndOptimizeDatabaseUrl;
