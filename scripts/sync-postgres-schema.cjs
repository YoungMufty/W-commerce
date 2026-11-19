#!/usr/bin/env node
/**
 * Keeps the production PostgreSQL Prisma schema in sync with the dev (SQLite) schema.
 *
 *   node scripts/sync-postgres-schema.cjs          -> (re)write database/prisma/postgres/schema.prisma
 *   node scripts/sync-postgres-schema.cjs --check  -> exit 1 if the postgres schema is out of date (use in CI)
 *
 * database/prisma/schema.prisma           = source of truth (SQLite, local dev)
 * database/prisma/postgres/schema.prisma  = GENERATED (PostgreSQL, production). Do not edit by hand.
 * database/prisma/postgres/migrations     = PostgreSQL migration history applied by `prisma migrate deploy`.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'database/prisma/schema.prisma');
const outDir = path.join(root, 'database/prisma/postgres');
const out = path.join(outDir, 'schema.prisma');
const backendPrismaDir = path.join(root, 'backend/prisma');
const backendOut = path.join(backendPrismaDir, 'schema.prisma');

const HEADER = `// ============================================================================
// GENERATED FILE - DO NOT EDIT.
// Source: database/prisma/schema.prisma  (run: node scripts/sync-postgres-schema.cjs)
// Production PostgreSQL schema. Migrations live in ./migrations
// ============================================================================
`;

function build() {
  const raw = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
  const ds = /datasource\s+db\s*\{[^}]*\}/.exec(raw);
  if (!ds) throw new Error('datasource block not found in schema.prisma');
  if (!/provider\s*=\s*"sqlite"/.test(ds[0])) throw new Error('Expected dev schema to use sqlite provider');
  const pgDatasource = 'datasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")\n}';
  return HEADER + raw.replace(ds[0], pgDatasource);
}

const next = build();
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').replace(/\r\n/g, '\n') : '';
  const curBackend = fs.existsSync(backendOut) ? fs.readFileSync(backendOut, 'utf8').replace(/\r\n/g, '\n') : '';
  if (cur !== next || curBackend !== next) {
    console.error('PostgreSQL Prisma schemas (database/prisma/postgres and backend/prisma) are out of date. Run: node scripts/sync-postgres-schema.cjs');
    process.exit(1);
  }
  console.log('postgres schemas are in sync');
} else {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(out, next, 'utf8');
  console.log('wrote', path.relative(root, out));

  // Also sync to backend/prisma/schema.prisma so Vercel includes it in the serverless bundle
  fs.mkdirSync(backendPrismaDir, { recursive: true });
  fs.writeFileSync(backendOut, next, 'utf8');
  console.log('wrote', path.relative(root, backendOut));
}
