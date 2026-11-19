#!/usr/bin/env node
/**
 * Automatically ensures the generated Prisma Client matches the current DATABASE_URL
 * (SQLite for local dev, PostgreSQL for production / Supabase).
 *
 * Runs in < 15ms if already in sync.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');

// Load environment variables if not already set
function loadEnv() {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const envPaths = isProd
    ? [
        path.join(root, '.env.production'),
        path.join(root, '.env')
      ]
    : [
        path.join(root, 'backend/.env'),
        path.join(root, '.env'),
        path.join(root, '.env.local')
      ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.DIRECT_URL || '';
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://') || Boolean(process.env.VERCEL);
const targetProvider = isPostgres ? 'postgresql' : 'sqlite';
const targetSchema = isPostgres
  ? path.join(root, 'database/prisma/postgres/schema.prisma')
  : path.join(root, 'database/prisma/schema.prisma');

// Provide compile-time environment fallbacks for Prisma client code generation.
// Prisma generator parses datasource env() references, but does not connect to the database.
if (isPostgres) {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.SUPABASE_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
  }
  if (!process.env.DIRECT_URL) {
    process.env.DIRECT_URL = process.env.DATABASE_URL;
  }
} else {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./dev.db';
  }
}

// Ensure postgres schemas are up to date before generation
if (isPostgres) {
  const syncScript = path.join(__dirname, 'sync-postgres-schema.cjs');
  if (fs.existsSync(syncScript)) {
    try {
      require(syncScript);
    } catch (_) {
      // Non-fatal if require cannot re-execute
    }
  }
}

// Check compiled schema in node_modules/.prisma/client/schema.prisma and activeProvider in index.js
const clientSchemaPath = path.join(root, 'node_modules/.prisma/client/schema.prisma');
const clientIndexPath = path.join(root, 'node_modules/.prisma/client/index.js');

let needsGeneration = true;
if (fs.existsSync(clientSchemaPath) && fs.existsSync(clientIndexPath)) {
  const clientSchemaContent = fs.readFileSync(clientSchemaPath, 'utf8');
  const dsMatch = clientSchemaContent.match(/datasource\s+\w+\s*\{[^}]*provider\s*=\s*["']([^"']+)["']/);
  const clientIndexContent = fs.readFileSync(clientIndexPath, 'utf8');
  const activeMatch = clientIndexContent.match(/"activeProvider":\s*"([^"]+)"/);

  const schemaProvider = dsMatch ? dsMatch[1] : null;
  const indexProvider = activeMatch ? activeMatch[1] : null;

  if (schemaProvider === targetProvider && indexProvider === targetProvider) {
    needsGeneration = false;
  }
}

if (needsGeneration) {
  console.log(`[ensure-prisma-client] Prisma Client provider mismatch. Recompiling client for ${targetProvider}...`);
  try {
    const relSchema = path.relative(root, targetSchema);
    const localPrismaBin = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'prisma.cmd' : 'prisma');
    const prismaCmd = fs.existsSync(localPrismaBin) ? `"${localPrismaBin}"` : 'npx prisma';

    execSync(`${prismaCmd} generate --schema="${relSchema}"`, {
      cwd: root,
      env: { ...process.env },
      stdio: 'inherit'
    });
    console.log(`[ensure-prisma-client] ✅ Successfully generated Prisma Client for ${targetProvider}`);
  } catch (err) {
    console.error(`[ensure-prisma-client] ❌ Failed to generate Prisma Client:`, err.message);
    if (process.env.VERCEL) {
      console.warn('[ensure-prisma-client] Running on Vercel — skipping (build command will handle generation).');
    } else {
      process.exit(1);
    }
  }
} else {
  // Already in sync
}
