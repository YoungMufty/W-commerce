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
  const envPaths = [
    path.join(root, '.env'),
    path.join(root, 'backend/.env'),
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

const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://') || Boolean(process.env.VERCEL);
const targetProvider = isPostgres ? 'postgresql' : 'sqlite';
const targetSchema = isPostgres
  ? path.join(root, 'database/prisma/postgres/schema.prisma')
  : path.join(root, 'database/prisma/schema.prisma');

// Check compiled schema in node_modules/.prisma/client/schema.prisma
const clientSchemaPath = path.join(root, 'node_modules/.prisma/client/schema.prisma');

let needsGeneration = true;
if (fs.existsSync(clientSchemaPath)) {
  const clientSchemaContent = fs.readFileSync(clientSchemaPath, 'utf8');
  const dsMatch = clientSchemaContent.match(/datasource\s+\w+\s*\{[^}]*provider\s*=\s*["']([^"']+)["']/);
  if (dsMatch && dsMatch[1] === targetProvider) {
    needsGeneration = false;
  }
}

if (needsGeneration) {
  console.log(`[ensure-prisma-client] Prisma Client provider mismatch. Recompiling client for ${targetProvider}...`);
  try {
    const relSchema = path.relative(root, targetSchema);
    execSync(`npx prisma generate --schema="${relSchema}"`, {
      cwd: root,
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
