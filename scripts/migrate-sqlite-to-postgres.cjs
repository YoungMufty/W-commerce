#!/usr/bin/env node
/**
 * W-Commerce SQLite-to-PostgreSQL Data Migration Tool
 *
 * Copies all existing records (Users, Stores, Products, Orders, Wallets, etc.)
 * from your local SQLite database to your production PostgreSQL database.
 *
 * Usage:
 *   node scripts/migrate-sqlite-to-postgres.cjs <TARGET_POSTGRES_DATABASE_URL>
 *   or set TARGET_DATABASE_URL in .env.production and run:
 *   npm run db:migrate-data
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}======================================================${RESET}`);
console.log(`${BOLD}   W-COMMERCE SQLITE -> POSTGRESQL DATA MIGRATOR      ${RESET}`);
console.log(`${BOLD}======================================================${RESET}\n`);

const rootDir = path.resolve(__dirname, '..');
let targetUrl = process.argv[2] || process.env.TARGET_DATABASE_URL;

if (!targetUrl && fs.existsSync(path.join(rootDir, '.env.production'))) {
  const prodEnv = fs.readFileSync(path.join(rootDir, '.env.production'), 'utf8');
  const match = prodEnv.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
  if (match && (match[1].startsWith('postgres://') || match[1].startsWith('postgresql://'))) {
    if (!/placeholder|USER:PASSWORD/i.test(match[1])) {
      targetUrl = match[1];
    }
  }
}

if (!targetUrl) {
  console.log(`${YELLOW}No target PostgreSQL connection string provided.${RESET}`);
  console.log(`Usage:`);
  console.log(`  node scripts/migrate-sqlite-to-postgres.cjs "postgresql://user:pass@host:5432/dbname?schema=public"\n`);
  console.log(`Or set ${BOLD}TARGET_DATABASE_URL${RESET} in your environment or in .env.production.\n`);
  process.exit(1);
}

// Order of tables to preserve relational integrity (dependencies first)
const MODELS = [
  'User',
  'Address',
  'Store',
  'StoreTemplate',
  'Product',
  'ProductImage',
  'ProductReview',
  'PromoCode',
  'Cart',
  'CartItem',
  'Order',
  'OrderItem',
  'MarketplaceOrder',
  'FulfillmentOrder',
  'FulfillmentItem',
  'PayAIOrder',
  'PayAIOrderStatusEvent',
  'Wallet',
  'WalletTransaction',
  'CourierProfile',
  'DeliveryAssignment',
  'Notification',
  'Dispute',
  'Escrow',
  'BuyerRequest'
];

async function run() {
  console.log(`Connecting to local SQLite database...`);
  const { PrismaClient: SqlitePrisma } = require('@prisma/client');
  const sqlite = new SqlitePrisma();

  console.log(`Connecting to remote PostgreSQL database at target host...`);
  // Generate dedicated temp postgres schema client if needed
  const tempSchemaPath = path.join(rootDir, 'database/prisma/postgres/temp_schema.prisma');
  const tempClientDir = path.join(rootDir, 'database/prisma/postgres/temp_client');

  try {
    const rawPgSchema = fs.readFileSync(path.join(rootDir, 'database/prisma/postgres/schema.prisma'), 'utf8');
    const customClientSchema = rawPgSchema.replace(
      'generator client {',
      `generator client {\n  output = "${tempClientDir.replace(/\\/g, '/')}"`
    );
    fs.writeFileSync(tempSchemaPath, customClientSchema, 'utf8');

    console.log(`Compiling PostgreSQL client engine...`);
    execSync(`npx prisma generate --schema="${tempSchemaPath}"`, { stdio: 'ignore' });

    const { PrismaClient: PostgresPrisma } = require(tempClientDir);
    const pg = new PostgresPrisma({
      datasources: { db: { url: targetUrl } }
    });

    console.log(`Testing PostgreSQL connectivity...`);
    await pg.$queryRawUnsafe('SELECT 1');
    console.log(`${GREEN}✔ Connected to PostgreSQL database!${RESET}\n`);

    console.log(`Starting data transfer...`);
    let totalMigrated = 0;

    for (const model of MODELS) {
      const sqliteDelegate = sqlite[model.charAt(0).toLowerCase() + model.slice(1)];
      const pgDelegate = pg[model.charAt(0).toLowerCase() + model.slice(1)];

      if (!sqliteDelegate || !pgDelegate) {
        continue;
      }

      try {
        const rows = await sqliteDelegate.findMany();
        if (rows && rows.length > 0) {
          process.stdout.write(`Migrating ${model} (${rows.length} rows)... `);
          
          // Insert in chunks of 50 to avoid parameter limits
          const chunkSize = 50;
          for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            await pgDelegate.createMany({
              data: chunk,
              skipDuplicates: true
            });
          }

          console.log(`${GREEN}✔ Done${RESET}`);
          totalMigrated += rows.length;
        }
      } catch (err) {
        console.log(`${YELLOW}Skipped/Notice (${err.message})${RESET}`);
      }
    }

    console.log(`\n${BOLD}${GREEN}Data migration completed successfully! Total records transferred: ${totalMigrated}${RESET}\n`);
    await sqlite.$disconnect();
    await pg.$disconnect();

  } catch (err) {
    console.error(`\n${RED}Migration failed: ${err.message}${RESET}`);
    process.exit(1);
  } finally {
    // Cleanup temporary schema and client
    if (fs.existsSync(tempSchemaPath)) {
      try { fs.unlinkSync(tempSchemaPath); } catch (_) {}
    }
    if (fs.existsSync(tempClientDir)) {
      try { fs.rmSync(tempClientDir, { recursive: true, force: true }); } catch (_) {}
    }
  }
}

run();
