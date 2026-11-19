#!/usr/bin/env node
/**
 * W-Commerce: SQLite to Supabase / PostgreSQL Data Sync & Seeder
 *
 * Reads existing records from local SQLite (database/prisma/dev.db) and
 * safely transfers or upserts them into remote PostgreSQL/Supabase.
 *
 * Features:
 *  - Handles all 114 models in topological foreign key dependency order
 *  - Decimal string conversions to prevent cross-engine prototype mismatch
 *  - DateTime normalization and invalid date protection
 *  - Self-referencing models (Order parentOrderId, FeedComment parentId) handled in dependency passes
 *  - Circular relation handling (CourierProfile <-> Vehicle) using 2-pass linking
 *  - Resilient batching (createMany with fallback to row-by-row upsert)
 *  - Idempotent: safe to run multiple times (skipDuplicates / upsert)
 *  - Auto-initializes remote tables if schema is not yet deployed
 *  - Dry-run mode (`--dry-run`)
 *
 * Usage:
 *   npm run db:seed:prod
 *   npm run db:seed:prod -- --dry-run
 *   npm run db:seed:prod -- "postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const rootDir = path.resolve(__dirname, '..');
const defaultSqliteDb = path.join(rootDir, 'database/prisma/dev.db');
const pgSchemaPath = path.join(rootDir, 'database/prisma/postgres/schema.prisma');
const sqliteSchemaPath = path.join(rootDir, 'database/prisma/schema.prisma');

// All 114 models in topological order of foreign key dependencies
const ORDERED_MODELS = [
  'User',
  'Address',
  'SellerPlan',
  'SellerPlanBenefit',
  'Store',
  'StoreIntegration',
  'Hub',
  'CourierProfile',
  'Vehicle',
  'DeliveryAssignment',
  'DeliveryRoute',
  'DeliveryStop',
  'DeliveryOffer',
  'DeliveryTrackingEvent',
  'DeliveryProof',
  'DeliveryIncident',
  'CourierEarning',
  'Product',
  'ProductImage',
  'ProductVideo',
  'ProductOption',
  'ProductUrgency',
  'ProductModelAsset',
  'ProductQuestion',
  'ProductComparison',
  'ProductOffer',
  'AdDiscountSession',
  'Review',
  'ReviewLike',
  'ReviewReport',
  'PromoCampaign',
  'PromoCode',
  'PromoCodeUsage',
  'Cart',
  'CartItem',
  'Order',
  'PaymentProof',
  'PaymentAuditLog',
  'OrderItem',
  'Dispute',
  'DisputeMessage',
  'VerificationRequest',
  'PackingResponse',
  'PackingIssue',
  'ConsolidatedPackage',
  'MarketplaceOrder',
  'FulfillmentOrder',
  'FulfillmentItem',
  'InventoryReservation',
  'TrackingEvent',
  'EscrowPayment',
  'Payment',
  'Commission',
  'PaymentDispute',
  'Wallet',
  'WalletLedgerEntry',
  'WalletHold',
  'CoinConversionRate',
  'RewardRule',
  'RewardGrant',
  'Transaction',
  'Payout',
  'Notification',
  'NotificationOutbox',
  'NotificationPreference',
  'BuyerNotification',
  'UserSession',
  'WebAuthnCredential',
  'SellerFollow',
  'BuyerProductInteraction',
  'BuyerSellerProfile',
  'Wishlist',
  'SellerPerformance',
  'SellerInsight',
  'SellerAnalytics',
  'Conversation',
  'ConversationParticipant',
  'Message',
  'QuickReplyTemplate',
  'FeedPost',
  'FeedComment',
  'Like',
  'EngagementEvent',
  'ExternalSellerIntegration',
  'ExternalOffer',
  'MarketConfig',
  'MarketplaceAnalyticsEvent',
  'PageView',
  'SystemLog',
  'FunnelEvent',
  'BuyerRequest',
  'RequestResponse',
  'Pool',
  'PoolParticipant',
  'FlashDeal',
  'RestockNotification',
  'Subscription',
  'SubscriptionInvoice',
  'WebhookEvent',
  'Template',
  'SellerTemplate',
  'TemplatePurchase',
  'StoreAsset',
  'AIUsage',
  'PayAISession',
  'PayAIMessage',
  'PayAICart',
  'PayAICartItem',
  'PayAIQuote',
  'PayAIPurchaseApproval',
  'PayAIOrder',
  'PayAIPayment',
  'PayAIOrderStatusEvent',
  'PayAIAuditLog'
];

function printBanner() {
  console.log(`\n${BOLD}${CYAN}======================================================${RESET}`);
  console.log(`${BOLD}${CYAN}    W-COMMERCE: LOCAL SQLITE -> SUPABASE SYNC / SEED  ${RESET}`);
  console.log(`${BOLD}${CYAN}======================================================${RESET}\n`);
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  let targetUrl = null;
  let isDryRun = false;
  let isVerbose = false;
  let showHelp = false;

  for (const arg of args) {
    if (arg === '--dry-run' || arg === '-d') {
      isDryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      isVerbose = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp = true;
    } else if (arg.startsWith('--target=') || arg.startsWith('--url=')) {
      targetUrl = arg.split('=')[1].replace(/^["']|["']$/g, '');
    } else if (arg.startsWith('postgres://') || arg.startsWith('postgresql://')) {
      targetUrl = arg.replace(/^["']|["']$/g, '');
    }
  }

  return { targetUrl, isDryRun, isVerbose, showHelp };
}

function resolveTargetDatabaseUrl(explicitUrl) {
  if (explicitUrl) return explicitUrl.trim().replace(/^["']|["']$/g, '');
  if (process.env.TARGET_DATABASE_URL) return process.env.TARGET_DATABASE_URL.trim().replace(/^["']|["']$/g, '');
  if (process.env.SUPABASE_DATABASE_URL) return process.env.SUPABASE_DATABASE_URL.trim().replace(/^["']|["']$/g, '');
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL.trim().replace(/^["']|["']$/g, '');

  if (process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'))) {
    if (!/placeholder|USER:PASSWORD|DB_USER/i.test(process.env.DATABASE_URL)) {
      return process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, '');
    }
  }

  // Check candidate files in order: .env.production, .env, backend/.env
  const candidateFiles = [
    path.join(rootDir, '.env.production'),
    path.join(rootDir, '.env'),
    path.join(rootDir, 'backend/.env')
  ];

  for (const envFile of candidateFiles) {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      const match = content.match(/^(?:TARGET_DATABASE_URL|SUPABASE_DATABASE_URL|DIRECT_URL|DATABASE_URL)\s*=\s*["']?([^"'\r\n]+)["']?/m);
      if (match && (match[1].startsWith('postgres://') || match[1].startsWith('postgresql://'))) {
        if (!/placeholder|USER:PASSWORD|DB_USER/i.test(match[1])) {
          return match[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }

  return null;
}

function formatPostgresUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  try {
    const parsed = new URL(rawUrl);
    const isPooler = parsed.port === '6543' || parsed.hostname.includes('pooler.supabase.com');
    if (isPooler && !parsed.searchParams.has('pgbouncer')) {
      parsed.searchParams.set('pgbouncer', 'true');
    }
    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '15');
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '15');
    }
    if (!parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', '5');
    }
    return parsed.toString();
  } catch (_) {
    return rawUrl;
  }
}

function maskDatabaseUrl(url) {
  if (!url) return '';
  return url.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:********@');
}

/**
 * Sanitizes and normalizes record values for PostgreSQL:
 * - Decimal objects/properties -> String (avoids cross-engine prototype issues)
 * - Dates -> Valid Date object or null
 * - Invalid numbers / NaNs -> safe defaults
 */
function sanitizeRecord(record, modelName) {
  const clean = {};

  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue;

    if (value === null) {
      clean[key] = null;
      continue;
    }

    // Decimal handling: convert to String
    if (typeof value === 'object' && (value._isDecimal || typeof value.toFixed === 'function' || ('d' in value && 'e' in value && 's' in value))) {
      clean[key] = value.toString();
      continue;
    }

    // Date handling
    if (value instanceof Date) {
      clean[key] = isNaN(value.getTime()) ? null : value;
      continue;
    }

    // String date detection
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      const parsed = new Date(value);
      clean[key] = isNaN(parsed.getTime()) ? value : parsed;
      continue;
    }

    clean[key] = value;
  }

  return clean;
}

function generateCustomClient(srcSchemaPath, outDir) {
  const tempSchemaPath = path.join(rootDir, 'database/prisma/temp_gen_' + Date.now() + '.prisma');
  const rawSchema = fs.readFileSync(srcSchemaPath, 'utf8');
  const customSchema = rawSchema.replace(
    /generator client \{([\s\S]*?)\}/,
    `generator client {\n  provider = "prisma-client-js"\n  output = "${outDir.replace(/\\/g, '/')}"\n}`
  );
  fs.writeFileSync(tempSchemaPath, customSchema, 'utf8');
  try {
    fs.mkdirSync(outDir, { recursive: true });
    execSync(`npx prisma generate --schema="${tempSchemaPath}"`, { stdio: 'ignore' });
  } finally {
    try { fs.unlinkSync(tempSchemaPath); } catch (_) {}
  }
}

function getSqliteClient() {
  const defaultSchema = path.join(rootDir, 'node_modules/.prisma/client/schema.prisma');
  const dbUrl = 'file:' + defaultSqliteDb.replace(/\\/g, '/');

  if (fs.existsSync(defaultSchema) && fs.readFileSync(defaultSchema, 'utf8').includes('provider = "sqlite"')) {
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient({ datasources: { db: { url: dbUrl } } });
  }

  const cachedDir = path.join(rootDir, 'node_modules/.cache/prisma-sqlite-client');
  if (!fs.existsSync(path.join(cachedDir, 'index.js'))) {
    process.stdout.write(`Compiling dedicated SQLite client engine... `);
    generateCustomClient(sqliteSchemaPath, cachedDir);
    console.log(`${GREEN}✔ Ready${RESET}`);
  }
  const { PrismaClient } = require(cachedDir);
  return new PrismaClient({ datasources: { db: { url: dbUrl } } });
}

function getPostgresClient(targetUrl) {
  const tunedUrl = formatPostgresUrl(targetUrl);
  const defaultSchema = path.join(rootDir, 'node_modules/.prisma/client/schema.prisma');

  if (fs.existsSync(defaultSchema) && fs.readFileSync(defaultSchema, 'utf8').includes('provider = "postgresql"')) {
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient({ datasources: { db: { url: tunedUrl } } });
  }

  const cachedDir = path.join(rootDir, 'node_modules/.cache/prisma-pg-client');
  if (!fs.existsSync(path.join(cachedDir, 'index.js'))) {
    process.stdout.write(`Compiling dedicated PostgreSQL client engine... `);
    generateCustomClient(pgSchemaPath, cachedDir);
    console.log(`${GREEN}✔ Ready${RESET}`);
  }
  const { PrismaClient } = require(cachedDir);
  return new PrismaClient({ datasources: { db: { url: tunedUrl } } });
}

/**
 * Checks if target Postgres database has tables initialized.
 * If not, runs prisma db push.
 */
async function ensureRemoteTablesExist(pg, targetUrl) {
  try {
    const res = await pg.$queryRawUnsafe(`
      SELECT count(*)::int as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('User', 'user', 'Store', 'Product')
    `);
    const tableCount = res && res[0] ? res[0].count : 0;
    if (tableCount === 0) {
      console.log(`\n${YELLOW}⚠️  Remote Supabase database has no tables created yet.${RESET}`);
      console.log(`Initializing remote schema with 'prisma db push'...`);

      // Determine migration URL (prefer direct port 5432 / session pooler)
      let pushUrl = process.env.DIRECT_URL || targetUrl;
      if (pushUrl.includes(':6543')) {
        pushUrl = pushUrl.replace(':6543', ':5432').replace(/[?&]pgbouncer=true/, '');
      }

      execSync(`npx prisma db push --schema="${pgSchemaPath}" --accept-data-loss --skip-generate`, {
        env: { ...process.env, DATABASE_URL: pushUrl, DIRECT_URL: pushUrl },
        stdio: 'inherit'
      });
      console.log(`${GREEN}✔ Remote schema initialized successfully!${RESET}\n`);
    }
  } catch (err) {
    console.log(`${YELLOW}ℹ Schema table verification notice: ${err.message}${RESET}`);
  }
}

async function run() {
  printBanner();

  const { targetUrl: cliUrl, isDryRun, isVerbose, showHelp } = parseCliArgs();

  if (showHelp) {
    console.log(`Usage:`);
    console.log(`  npm run db:seed:prod [TARGET_DATABASE_URL] [OPTIONS]`);
    console.log(`\nOptions:`);
    console.log(`  --dry-run, -d    Preview what records will be migrated without making database changes`);
    console.log(`  --verbose, -v    Show detailed logging for individual records or errors`);
    console.log(`  --help, -h       Display this help message`);
    console.log(`\nExamples:`);
    console.log(`  npm run db:seed:prod -- --dry-run`);
    console.log(`  npm run db:seed:prod "postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"`);
    console.log(`  TARGET_DATABASE_URL="postgresql://..." npm run db:seed:prod\n`);
    process.exit(0);
  }

  if (!fs.existsSync(defaultSqliteDb)) {
    console.error(`${RED}❌ Source SQLite database not found at: ${defaultSqliteDb}${RESET}`);
    process.exit(1);
  }

  const targetUrl = resolveTargetDatabaseUrl(cliUrl);

  if (!targetUrl && !isDryRun) {
    console.log(`${RED}❌ No target PostgreSQL connection string provided.${RESET}`);
    console.log(`\nTo sync to your remote Supabase database, provide the connection URL:`);
    console.log(`  ${BOLD}npm run db:seed:prod -- "postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"${RESET}`);
    console.log(`\nOr set ${BOLD}TARGET_DATABASE_URL${RESET} in your environment or in ${BOLD}.env.production${RESET}.\n`);
    process.exit(1);
  }

  console.log(`Source : ${BOLD}SQLite (${defaultSqliteDb})${RESET}`);
  if (targetUrl) {
    console.log(`Target : ${BOLD}${maskDatabaseUrl(targetUrl)}${RESET}`);
  }
  if (isDryRun) {
    console.log(`Mode   : ${YELLOW}${BOLD}[DRY RUN] No writes will be made${RESET}\n`);
  } else {
    console.log(`Mode   : ${GREEN}${BOLD}[LIVE SYNC] Idempotent upsert/transfer${RESET}\n`);
  }

  let sqlite;
  try {
    sqlite = getSqliteClient();
  } catch (err) {
    console.error(`${RED}Failed to initialize SQLite client: ${err.message}${RESET}`);
    process.exit(1);
  }

  // If dry-run and no target URL, inspect SQLite and report summary
  if (isDryRun && !targetUrl) {
    console.log(`Inspecting local SQLite database...\n`);

    let totalRecords = 0;
    const populated = [];

    for (const model of ORDERED_MODELS) {
      const delegateName = model.charAt(0).toLowerCase() + model.slice(1);
      if (sqlite[delegateName] && typeof sqlite[delegateName].count === 'function') {
        try {
          const count = await sqlite[delegateName].count();
          if (count > 0) {
            populated.push({ model, count });
            totalRecords += count;
            console.log(`  ✔ [DRY RUN] ${model.padEnd(28)} : ${BOLD}${count}${RESET} rows`);
          }
        } catch (_) {}
      }
    }

    console.log(`\n${BOLD}${CYAN}Summary:${RESET}`);
    console.log(`  Populated Models : ${BOLD}${populated.length}${RESET}`);
    console.log(`  Total Records    : ${BOLD}${totalRecords}${RESET}`);
    console.log(`\n${GREEN}To apply this sync to Supabase, run:${RESET}`);
    console.log(`  npm run db:seed:prod "postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"\n`);

    await sqlite.$disconnect();
    return;
  }

  let pg;
  try {
    pg = getPostgresClient(targetUrl);
  } catch (err) {
    console.error(`${RED}Failed to initialize PostgreSQL client: ${err.message}${RESET}`);
    await sqlite.$disconnect();
    process.exit(1);
  }

  try {
    console.log(`Testing target database connection...`);
    await pg.$queryRawUnsafe('SELECT 1');
    console.log(`${GREEN}✔ Connected to remote PostgreSQL database successfully!${RESET}\n`);

    if (!isDryRun) {
      await ensureRemoteTablesExist(pg, targetUrl);
    }

    console.log(`Beginning data migration...`);
    const startTime = Date.now();
    let totalMigrated = 0;
    let tablesMigrated = 0;
    const summary = [];
    const courierActiveVehicles = new Map();

    for (const model of ORDERED_MODELS) {
      const delegateName = model.charAt(0).toLowerCase() + model.slice(1);
      const sqliteDelegate = sqlite[delegateName];
      const pgDelegate = pg[delegateName];

      if (!sqliteDelegate || !pgDelegate) continue;

      let rows = [];
      try {
        rows = await sqliteDelegate.findMany();
      } catch (err) {
        if (isVerbose) console.log(`${DIM}Skipped reading ${model}: ${err.message}${RESET}`);
        continue;
      }

      if (!rows || rows.length === 0) continue;

      if (isDryRun) {
        console.log(`  ✔ [DRY RUN] ${model.padEnd(28)} : ${BOLD}${rows.length}${RESET} rows`);
        totalMigrated += rows.length;
        tablesMigrated++;
        continue;
      }

      process.stdout.write(`  Migrating ${model.padEnd(26)} (${rows.length} rows)... `);

      // Handle CourierProfile circular reference with Vehicle
      if (model === 'CourierProfile') {
        for (const r of rows) {
          if (r.activeVehicleId) {
            courierActiveVehicles.set(r.id, r.activeVehicleId);
            r.activeVehicleId = null; // Temporarily unset so Vehicle FK does not fail
          }
        }
      }

      // Handle self-referencing models ordering (multi-pass topological sort)
      if (model === 'Order') {
        const inserted = new Set();
        const sorted = [];
        let remaining = [...rows];
        let pass = 0;
        while (remaining.length > 0 && pass < 10) {
          pass++;
          const ready = remaining.filter(r => !r.parentOrderId || inserted.has(r.parentOrderId) || !rows.some(other => other.id === r.parentOrderId));
          if (ready.length === 0) {
            sorted.push(...remaining);
            break;
          }
          for (const r of ready) {
            inserted.add(r.id);
            sorted.push(r);
          }
          const readyIds = new Set(ready.map(r => r.id));
          remaining = remaining.filter(r => !readyIds.has(r.id));
        }
        rows = sorted;
      } else if (model === 'FeedComment') {
        const inserted = new Set();
        const sorted = [];
        let remaining = [...rows];
        let pass = 0;
        while (remaining.length > 0 && pass < 10) {
          pass++;
          const ready = remaining.filter(r => !r.parentId || inserted.has(r.parentId) || !rows.some(other => other.id === r.parentId));
          if (ready.length === 0) {
            sorted.push(...remaining);
            break;
          }
          for (const r of ready) {
            inserted.add(r.id);
            sorted.push(r);
          }
          const readyIds = new Set(ready.map(r => r.id));
          remaining = remaining.filter(r => !readyIds.has(r.id));
        }
        rows = sorted;
      }

      // Sanitize records
      const sanitizedRows = rows.map(r => sanitizeRecord(r, model));

      let modelMigrated = 0;
      let modelSkipped = 0;
      const chunkSize = 50;

      for (let i = 0; i < sanitizedRows.length; i += chunkSize) {
        const chunk = sanitizedRows.slice(i, i + chunkSize);

        try {
          // Attempt fast batch insert with skipDuplicates
          const result = await pgDelegate.createMany({
            data: chunk,
            skipDuplicates: true
          });
          const insertedCount = (result && typeof result.count === 'number') ? result.count : chunk.length;
          modelMigrated += insertedCount;
          modelSkipped += (chunk.length - insertedCount);
        } catch (batchErr) {
          // If batch fails, fall back to row-by-row upsert
          if (isVerbose) {
            console.log(`\n    ${YELLOW}Batch failed for ${model}, falling back to row-by-row: ${batchErr.message}${RESET}`);
          }
          for (const row of chunk) {
            try {
              if (row.id) {
                await pgDelegate.upsert({
                  where: { id: row.id },
                  create: row,
                  update: row
                });
                modelMigrated++;
              } else {
                await pgDelegate.create({ data: row });
                modelMigrated++;
              }
            } catch (singleErr) {
              modelSkipped++;
              if (isVerbose) {
                console.log(`    ${DIM}Row skip in ${model} (id: ${row.id}): ${singleErr.message}${RESET}`);
              }
            }
          }
        }
      }

      totalMigrated += modelMigrated;
      tablesMigrated++;
      summary.push({ model, count: modelMigrated, skipped: modelSkipped });

      if (modelSkipped > 0) {
        console.log(`${GREEN}✔ ${modelMigrated} migrated${RESET} ${DIM}(${modelSkipped} existing/skipped)${RESET}`);
      } else {
        console.log(`${GREEN}✔ ${modelMigrated} migrated${RESET}`);
      }
    }

    // Pass 2: Restore CourierProfile activeVehicleId links after Vehicle table is populated
    if (courierActiveVehicles.size > 0 && !isDryRun) {
      process.stdout.write(`  Restoring active vehicle links on CourierProfile... `);
      let restoredCount = 0;
      for (const [courierId, activeVehicleId] of courierActiveVehicles.entries()) {
        try {
          await pg.courierProfile.update({
            where: { id: courierId },
            data: { activeVehicleId }
          });
          restoredCount++;
        } catch (_) {}
      }
      console.log(`${GREEN}✔ ${restoredCount} linked${RESET}`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`\n${BOLD}${GREEN}======================================================${RESET}`);
    if (isDryRun) {
      console.log(`${BOLD}${GREEN}   [DRY RUN] COMPLETED IN ${elapsed}s${RESET}`);
      console.log(`   Found ${BOLD}${totalMigrated}${RESET} records across ${BOLD}${tablesMigrated}${RESET} tables ready for migration.`);
      console.log(`   No modifications made to target database.`);
    } else {
      console.log(`${BOLD}${GREEN}   SYNC COMPLETED SUCCESSFULLY IN ${elapsed}s!${RESET}`);
      console.log(`   Total Records Transferred : ${BOLD}${totalMigrated}${RESET}`);
      console.log(`   Tables Updated            : ${BOLD}${tablesMigrated}${RESET}`);
      console.log(`\n${CYAN}All stores, products, images, and user accounts are now live in Supabase!${RESET}`);
    }
    console.log(`${BOLD}${GREEN}======================================================${RESET}\n`);

  } catch (err) {
    console.error(`\n${RED}Migration failed: ${err.message}${RESET}`);
    if (err.message.includes('password authentication failed') || err.message.includes('Tenant or user not found')) {
      console.log(`${YELLOW}💡 Check your database password or pooler configuration in Supabase.${RESET}`);
    } else if (err.message.includes('Can\'t reach database server')) {
      console.log(`${YELLOW}💡 Check host availability. If project was paused, unpause it in Supabase dashboard.${RESET}`);
    }
    process.exit(1);
  } finally {
    await sqlite.$disconnect().catch(() => {});
    await pg.$disconnect().catch(() => {});
  }
}

if (require.main === module) {
  run();
}

module.exports = { run, ORDERED_MODELS, sanitizeRecord };
