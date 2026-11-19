# Sync Localhost SQLite Data to Remote Supabase PostgreSQL

This guide explains how to migrate all your existing localhost data (stores, products, users, addresses, orders, wallets, etc.) from local SQLite (`database/prisma/dev.db`) directly into your remote **Supabase** (PostgreSQL) production database.

---

## 📌 Clarification: Prisma vs. Database Engine

A common point of confusion is: *"Is my data in Prisma or Supabase?"*

- **Prisma is the ORM (Object-Relational Mapping tool)**: It is the TypeScript/JavaScript query library and schema manager used to talk to databases. It is **not** a database itself.
- **SQLite (`database/prisma/dev.db`)**: This is the local file-based database used during localhost development. It currently contains **17,258 records across 60 tables**, including:
  - Real seller stores (*"TIRIMISIYU KALID's Shop"*, *"Fakunle Faruq's Shop"*, etc.)
  - 142 real products (chicken breast strips, watches, electronics, fashion)
  - 227 product images and assets
  - Users, buyer profiles, addresses, wallets, and PayAI sessions
- **Supabase (PostgreSQL)**: This is your remote cloud database intended for production and the live deployed website. When you first create a Supabase project, it starts with **0 records**. Unless you run the sync seeder, your deployed site connects to an empty database, causing stores and products to disappear on the live site.

The sync command copies **all 17,258 records from your local SQLite into Supabase** with complete relational integrity preserved.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get your Supabase Connection String

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and go to **Project Settings** (gear icon in sidebar) ➔ **Database**.
3. Scroll to **Connection string** and select **URI**.
4. Choose the appropriate connection mode:
   - **Transaction Pooler (Port 6543)** *(Recommended for serverless & Vercel)*:
     ```text
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - **Session / Direct (Port 5432)**:
     ```text
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
5. Replace `[YOUR-PASSWORD]` with your Supabase database password.

> [!TIP]
> If your password contains special characters such as `@`, `#`, `?`, or `%`, make sure it is URL-encoded (e.g., `@` becomes `%40`, `#` becomes `%23`).

---

### Step 2: Preview the Data (Dry Run)

Before modifying the remote database, run a dry-run preview to inspect all records that will be transferred:

**Using npm:**
```bash
npm run db:sync:dry-run
```

**Using PowerShell:**
```powershell
.\scripts\sync-to-supabase.ps1 -DryRun
```

**Output preview:**
```text
======================================================
    W-COMMERCE: LOCAL SQLITE -> SUPABASE SYNC / SEED  
======================================================

Source : SQLite (C:\Users\...\database\prisma\dev.db)
Mode   : [DRY RUN] No writes will be made

Inspecting local SQLite database...

  ✔ [DRY RUN] User                         : 251 rows
  ✔ [DRY RUN] Address                      : 3 rows
  ✔ [DRY RUN] SellerPlan                   : 3 rows
  ✔ [DRY RUN] Store                        : 70 rows
  ✔ [DRY RUN] Product                      : 142 rows
  ✔ [DRY RUN] ProductImage                 : 227 rows
  ✔ [DRY RUN] Order                        : 33 rows
  ✔ [DRY RUN] OrderItem                    : 35 rows
  ✔ [DRY RUN] Wallet                       : 118 rows
  ✔ [DRY RUN] PayAIOrder                   : 705 rows
  ...

Summary:
  Populated Models : 60
  Total Records    : 17,258
```

---

### Step 3: Run the Live Sync to Supabase

Run the sync tool with your Supabase connection string:

**Using npm:**
```bash
npm run db:seed:prod -- "postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Using PowerShell helper:**
```powershell
.\scripts\sync-to-supabase.ps1 "postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

*(You can also use `npm run db:migrate-data` or `.\scripts\sync-to-supabase.sh` on Linux/macOS).*

#### Alternative: Configure `.env.production`
If you save your Supabase URL in `.env.production`:
```env
DATABASE_URL="postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```
You can simply run:
```bash
npm run db:seed:prod
```

---

## ⚙️ How the Sync Engine Works

The migration engine (`scripts/seed-from-sqlite.cjs`) includes specialized guards for cross-database transfers:

1. **Auto-Table Detection (`prisma db push`)**:
   Checks whether public tables (`User`, `Store`, `Product`) exist in Supabase. If missing, it automatically deploys the PostgreSQL schema (`database/prisma/postgres/schema.prisma`) using session mode before syncing.
2. **Topological Foreign Key Dependency Ordering**:
   Migrates models in strict foreign key order (`User` ➔ `Store` ➔ `Product` ➔ `ProductImage` ➔ `Order` ➔ `OrderItem` ➔ `Wallet`, etc.) to prevent relational constraint violations.
3. **Circular Foreign Key Resolution (`CourierProfile` ↔ `Vehicle`)**:
   `Vehicle.courierProfileId` is required, while `CourierProfile.activeVehicleId` is optional. The sync engine inserts `CourierProfile` first with `activeVehicleId = null`, inserts `Vehicle`, and then restores the active vehicle links in a second pass.
4. **Self-Referencing Hierarchies (`Order` & `FeedComment`)**:
   Multi-pass topological sort ensures root orders (`parentOrderId == null`) are migrated before sub-orders, and root comments before replies.
5. **Data Sanitization**:
   - Converts SQLite `Decimal` objects to string representations to prevent cross-engine precision and prototype mismatch.
   - Cleans and normalizes ISO date strings and handles invalid dates safely.
6. **Resilient Batching & Upsert**:
   - Inserts in chunks of 50 using `createMany({ skipDuplicates: true })`.
   - If a chunk encounters conflicts, automatically falls back to row-by-row `upsert` so existing records are updated while new records are inserted.
   - Safe to run multiple times without creating duplicate records.

---

## 🌐 Production & Vercel Configuration

Ensure your production environment variables (e.g. in Vercel Project Settings ➔ Environment Variables) are set:

| Variable | Recommended Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` | Transaction pooler for serverless Express queries |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres` | Direct connection for migrations (`prisma migrate` / `prisma db push`) |
| `NODE_ENV` | `production` | Enables production caching, security headers, and connection pooling |

### Connection Pooling & Error Resilience in `prismaClient.js`
In `backend/src/utils/prismaClient.js`:
- In Vercel serverless, connection limit is tuned to `connection_limit=1` to prevent exhausting Supabase connections.
- Timeouts are enforced (`connect_timeout=15`, `pool_timeout=15`) so stalled queries do not hang lambda functions.
- If Supabase is sleeping or undergoing maintenance, queries fail gracefully as HTTP `503 Service Unavailable` instead of crashing the Node/Express server.

---

## 🔍 Verification & Testing

### 1. Test Supabase Connectivity Directly
Run the health check tool:
```bash
npm run db:test-supabase "postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```
**Expected result:**
```text
✅ Connected successfully in 142ms!
   Database : postgres
   User     : postgres.[YOUR-REF]
   Version  : PostgreSQL 15.8
   Tables   : 114 tables found in 'public' schema
```

### 2. Verify Live Frontend
1. Open your deployed live URL (e.g. `https://your-domain.com/feed` or `/stores`).
2. Refresh the page:
   - **"TIRIMISIYU KALID's Shop"** and all 70 stores display with their banners, avatars, and bios.
   - All 142 products (chicken breast strips, watches, electronics) display with their prices and images.
   - Existing localhost user logins work with their existing passwords and wallets.

---

## ❓ Troubleshooting & FAQ

### 1. `Error: password authentication failed for user "postgres"`
- **Cause**: The password in the connection string is incorrect or contains unencoded special characters.
- **Fix**: In the Supabase Dashboard, go to **Project Settings** ➔ **Database** ➔ **Database password** and click **Reset password**. If your password has symbols like `@` or `#`, encode them (e.g. `@` ➔ `%40`).

### 2. `Error: Can't reach database server at aws-0-...pooler.supabase.com`
- **Cause**: Free tier Supabase projects pause after 7 days of inactivity.
- **Fix**: Log in to the [Supabase Dashboard](https://supabase.com/dashboard) and click **Restore / Unpause project**. Wait ~1 minute and rerun the sync command.

### 3. `Error: prepared statement "s0" already exists`
- **Cause**: Missing `?pgbouncer=true` parameter when connecting to Supabase transaction pooler on port 6543.
- **Fix**: Ensure your URL ends with `?pgbouncer=true`. The updated `prismaClient.js` and `seed-from-sqlite.cjs` automatically append this parameter if missing.

### 4. Can I run the sync multiple times?
- **Yes!** The sync tool is fully idempotent. Records that already exist in Supabase are safely skipped or upserted without duplication.
