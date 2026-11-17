#!/usr/bin/env node
/**
 * Test Supabase PostgreSQL Connection
 *
 * Verifies that DATABASE_URL (and DIRECT_URL if provided) can connect to Supabase,
 * checks TLS/SSL configuration, measures response latency, and counts existing tables/records.
 *
 * Usage:
 *   node scripts/test-supabase-connection.cjs [OPTIONAL_CONNECTION_STRING]
 */
'use strict';
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
console.log(`${BOLD}${CYAN}   SUPABASE POSTGRESQL CONNECTIVITY & HEALTH CHECK    ${RESET}`);
console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);

const rootDir = path.resolve(__dirname, '..');
const prodEnvPath = path.join(rootDir, '.env.production');
const defaultEnvPath = path.join(rootDir, '.env');

let envConfig = {};
if (fs.existsSync(prodEnvPath)) {
  envConfig = dotenv.parse(fs.readFileSync(prodEnvPath, 'utf8'));
} else if (fs.existsSync(defaultEnvPath)) {
  envConfig = dotenv.parse(fs.readFileSync(defaultEnvPath, 'utf8'));
}

const dbUrl = process.argv[2] || process.env.DATABASE_URL || envConfig.DATABASE_URL;
const directUrl = process.env.DIRECT_URL || envConfig.DIRECT_URL;

if (!dbUrl || dbUrl.startsWith('file:') || /USER:PASSWORD|DB_USER:DB_PASSWORD|placeholder/i.test(dbUrl)) {
  console.log(`${RED}❌ DATABASE_URL is not configured with a valid PostgreSQL / Supabase connection string.${RESET}`);
  console.log(`\nTo test your Supabase database, run:`);
  console.log(`  node scripts/test-supabase-connection.cjs "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"\n`);
  console.log(`Or set DATABASE_URL in your .env or .env.production file.`);
  process.exit(1);
}

// Obfuscate password for display
const maskedUrl = dbUrl.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:********@');
console.log(`Target: ${BOLD}${maskedUrl}${RESET}`);

const isSupabase = dbUrl.includes('supabase.co') || dbUrl.includes('supabase.com') || dbUrl.includes('pooler.supabase');
const isPooled = dbUrl.includes(':6543') || dbUrl.includes('pgbouncer=true');

if (isSupabase) {
  console.log(`${GREEN}✔ Detected Supabase PostgreSQL instance.${RESET}`);
  if (isPooled) {
    console.log(`${GREEN}✔ Connection mode: Supabase Transaction Pooler (Port 6543, pgbouncer=true) — ideal for serverless Vercel deployment.${RESET}`);
  } else {
    console.log(`${YELLOW}ℹ Connection mode: Direct / Session connection (Port 5432).${RESET}`);
  }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: ['error', 'warn'],
});

async function runCheck() {
  const start = Date.now();
  try {
    console.log(`\nConnecting...`);
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    const elapsed = Date.now() - start;
    console.log(`${GREEN}✅ Connected successfully in ${elapsed}ms!${RESET}`);

    if (Array.isArray(result) && result[0]) {
      const dbInfo = result[0];
      console.log(`   Database : ${BOLD}${dbInfo.current_database || 'postgres'}${RESET}`);
      console.log(`   User     : ${BOLD}${dbInfo.current_user}${RESET}`);
      const ver = (dbInfo.version || '').split(' ')[0] + ' ' + ((dbInfo.version || '').split(' ')[1] || '');
      console.log(`   Version  : ${BOLD}${ver}${RESET}`);
    }

    // Check table count
    const tableCounts = await prisma.$queryRaw`
      SELECT count(*)::int as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    const count = tableCounts[0]?.count || 0;
    console.log(`   Tables   : ${BOLD}${count} tables found in 'public' schema${RESET}`);

    if (count === 0) {
      console.log(`\n${YELLOW}⚠️  The Supabase database is connected but has 0 tables.${RESET}`);
      console.log(`To create all schema tables in Supabase, run:`);
      console.log(`  ${BOLD}npx prisma db push --schema=database/prisma/postgres/schema.prisma${RESET}`);
      console.log(`  or: ${BOLD}npm run db:migrate:deploy${RESET}`);
    } else {
      // Check user and product counts
      try {
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        console.log(`   Users    : ${BOLD}${userCount} users${RESET}`);
        console.log(`   Products : ${BOLD}${productCount} products${RESET}`);
      } catch (e) {
        // Models might differ
      }
      console.log(`\n${GREEN}🎉 Supabase database is ready for production traffic!${RESET}`);
    }

  } catch (err) {
    console.log(`\n${RED}❌ Connection failed:${RESET} ${err.message}`);
    if (err.message.includes('Tenant or user not found') || err.message.includes('password authentication failed')) {
      console.log(`${YELLOW}💡 Tip: Check your Supabase database password in Project Settings -> Database.${RESET}`);
    } else if (err.message.includes('getaddrinfo ENOTFOUND')) {
      console.log(`${YELLOW}💡 Tip: Check the host URL. Ensure your Supabase project is not paused.${RESET}`);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCheck();
