#!/usr/bin/env node
/**
 * W-Commerce SQLite-to-PostgreSQL Data Migration Tool
 *
 * Copies all existing records (Users, Stores, Products, Orders, Wallets, PayAI, etc.)
 * from your local SQLite database to your production PostgreSQL / Supabase database.
 *
 * Usage:
 *   node scripts/migrate-sqlite-to-postgres.cjs <TARGET_POSTGRES_DATABASE_URL>
 *   or set TARGET_DATABASE_URL in .env.production and run:
 *   npm run db:migrate-data
 */
'use strict';

// Delegate to the comprehensive seed-from-sqlite engine
require('./seed-from-sqlite.cjs');
