#!/usr/bin/env node
/**
 * W-Commerce Production Environment & Connectivity Pre-Flight Validator
 * Run before deploying to production:
 *   node scripts/validate-production-env.cjs
 *   or: npm run env:validate
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const rootDir = path.resolve(__dirname, '..');
const prodEnvPath = path.join(rootDir, '.env.production');
const defaultEnvPath = path.join(rootDir, '.env');

console.log(`\n${BOLD}${BLUE}======================================================${RESET}`);
console.log(`${BOLD}${BLUE}   W-COMMERCE PRODUCTION PRE-FLIGHT VALIDATOR         ${RESET}`);
console.log(`${BOLD}${BLUE}======================================================${RESET}\n`);

let envConfig = {};
let loadedFrom = '';

if (fs.existsSync(prodEnvPath)) {
  const fileContent = fs.readFileSync(prodEnvPath, 'utf8');
  envConfig = dotenv.parse(fileContent);
  loadedFrom = '.env.production';
} else if (fs.existsSync(defaultEnvPath)) {
  const fileContent = fs.readFileSync(defaultEnvPath, 'utf8');
  envConfig = dotenv.parse(fileContent);
  loadedFrom = '.env';
}

// Also overlay process.env so CI/CD environment variables take precedence
const env = { ...envConfig, ...process.env };

if (loadedFrom) {
  console.log(`Loaded environment definitions from: ${BOLD}${loadedFrom}${RESET}\n`);
} else {
  console.log(`${YELLOW}Note: No .env.production file found. Checking current process.env variables.${RESET}\n`);
}

const errors = [];
const warnings = [];
const passes = [];

function check(key, name, validator) {
  const val = (env[key] || '').trim();
  const res = validator(val);
  if (res === true) {
    passes.push(`${key}: ${name}`);
  } else if (typeof res === 'string' && res.startsWith('WARN:')) {
    warnings.push(`${key} (${name}): ${res.replace('WARN:', '').trim()}`);
  } else {
    errors.push(`${key} (${name}): ${typeof res === 'string' ? res : 'Missing or invalid'}`);
  }
}

function isPlaceholder(val) {
  if (!val) return true;
  return /replace|placeholder|your_|changeme|xxx|<.*>|todo|dummy/i.test(val);
}

// 1. Core Server Configuration
check('NODE_ENV', 'Node Environment', (v) => {
  if (v === 'production') return true;
  return 'Must be set to "production"';
});

check('PORT', 'Server Port', (v) => {
  const p = Number(v || 5000);
  if (p > 0 && p < 65536) return true;
  return 'Invalid port number';
});

check('FRONTEND_URL', 'Frontend Domain URL', (v) => {
  if (!v) return 'Missing FRONTEND_URL';
  if (isPlaceholder(v)) return 'Contains placeholder. Provide your real HTTPS domain.';
  if (v.startsWith('https://')) return true;
  if (v.startsWith('http://localhost') || v.startsWith('http://127.0.0.1')) {
    return 'WARN: Using localhost URL. Acceptable for staging/local testing, but requires https:// for live production.';
  }
  return 'Must start with https://';
});

// 2. Cryptographic Security Secrets
check('JWT_SECRET', 'JWT Authentication Secret', (v) => {
  if (!v) return 'Missing JWT_SECRET';
  if (isPlaceholder(v)) return 'Contains placeholder. Generate a strong 64+ char random string.';
  if (v.length < 64) return `Must be at least 64 characters (current length: ${v.length})`;
  return true;
});

check('SESSION_SECRET', 'Express Session Secret', (v) => {
  if (!v) return 'Missing SESSION_SECRET';
  if (isPlaceholder(v)) return 'Contains placeholder. Generate a strong 64+ char random string.';
  if (v.length < 64) return `Must be at least 64 characters (current length: ${v.length})`;
  return true;
});

check('AES_ENCRYPTION_KEY', 'Database Field AES Encryption Key', (v) => {
  if (!v) return 'WARN: AES_ENCRYPTION_KEY not set. Sensitive user KYC/bank fields will not be encrypted at rest.';
  if (isPlaceholder(v)) return 'Contains placeholder text.';
  return true;
});

check('FILE_ENCRYPTION_KEY', 'File Encryption Key', (v) => {
  if (!v) return 'WARN: FILE_ENCRYPTION_KEY not set. Document file encryption will be bypassed.';
  if (isPlaceholder(v)) return 'Contains placeholder text.';
  return true;
});

// 3. Database & Caching
check('DATABASE_URL', 'PostgreSQL Database Connection', (v) => {
  if (!v) return 'Missing DATABASE_URL';
  if (v.startsWith('file:') || v.endsWith('.db') || v.endsWith('.sqlite')) {
    return 'SQLite database is NOT permitted in production. Must use PostgreSQL (postgresql://...).';
  }
  if (v.startsWith('postgresql://') || v.startsWith('postgres://')) {
    if (isPlaceholder(v)) return 'Contains placeholder credentials (e.g. USER:PASSWORD@DB_HOST).';
    return true;
  }
  return 'Must be a valid PostgreSQL connection string starting with postgresql://';
});

check('DIRECT_URL', 'PostgreSQL Direct Connection (Optional / Supabase)', (v) => {
  if (!v) return 'WARN: DIRECT_URL not set. If using Supabase transaction pooler (port 6543) for DATABASE_URL, set DIRECT_URL to port 5432 for migrations.';
  if (v.startsWith('postgresql://') || v.startsWith('postgres://')) return true;
  return 'WARN: DIRECT_URL should be a PostgreSQL connection string.';
});

check('REDIS_URL', 'Redis Session & Pub/Sub Store', (v) => {
  if (!v) return 'WARN: REDIS_URL not set. System will fall back to in-memory store (state lost on restarts/scaling).';
  if (isPlaceholder(v)) return 'WARN: Contains placeholder Redis host.';
  if (v.startsWith('redis://') || v.startsWith('rediss://')) return true;
  return 'WARN: Redis URL should begin with redis:// or rediss://';
});

// 4. Payment Gateways
const stripeSecret = env.STRIPE_SECRET_KEY || '';
const paystackSecret = env.PAYSTACK_SECRET_KEY || '';
const paypalClient = env.PAYPAL_CLIENT_ID || '';

if (!stripeSecret && !paystackSecret && !paypalClient) {
  warnings.push('PAYMENTS: No payment gateways (Stripe, Paystack, PayPal) are configured. All checkouts will fail.');
} else {
  if (stripeSecret) {
    if (isPlaceholder(stripeSecret)) {
      warnings.push('STRIPE: STRIPE_SECRET_KEY contains placeholder text.');
    } else if (stripeSecret.startsWith('sk_test_')) {
      warnings.push('STRIPE: STRIPE_SECRET_KEY is a TEST key (sk_test_). Replace with live key (sk_live_) before accepting real customer payments.');
    } else {
      passes.push('STRIPE: Configured with live secret key');
    }
  }

  if (paystackSecret) {
    if (isPlaceholder(paystackSecret)) {
      warnings.push('PAYSTACK: PAYSTACK_SECRET_KEY contains placeholder text.');
    } else if (paystackSecret.startsWith('sk_test_')) {
      warnings.push('PAYSTACK: PAYSTACK_SECRET_KEY is a TEST key (sk_test_). Replace with live key (sk_live_) before accepting real customer payments.');
    } else {
      passes.push('PAYSTACK: Configured with live secret key');
    }
  }
}

// 5. Cloud Storage (Cloudinary / S3)
check('CLOUDINARY_CLOUD_NAME', 'Cloudinary Image Cloud Name', (v) => {
  if (!v || isPlaceholder(v)) {
    return 'WARN: Cloudinary not configured. Uploaded product images will be stored locally and lost on container redeployment.';
  }
  return true;
});

// 6. External APIs (Gemini & Qloo)
check('GEMINI_API_KEY', 'Google Gemini AI Key', (v) => {
  if (!v || isPlaceholder(v)) {
    return 'WARN: GEMINI_API_KEY not configured. PayAI smart recommendations will run in fallback heuristic mode.';
  }
  return true;
});

check('QLOO_API_KEY', 'Qloo Taste Intelligence API Key', (v) => {
  if (!v || isPlaceholder(v)) {
    return 'WARN: QLOO_API_KEY not configured. Taste and cultural affinity signals will fall back to local heuristics.';
  }
  return true;
});

// Print Results
console.log(`${BOLD}Passed Checks (${passes.length}):${RESET}`);
passes.forEach(p => console.log(`  ${GREEN}✔ [PASS]${RESET} ${p}`));

if (warnings.length > 0) {
  console.log(`\n${BOLD}Warnings / Recommendations (${warnings.length}):${RESET}`);
  warnings.forEach(w => console.log(`  ${YELLOW}▲ [WARN]${RESET} ${w}`));
}

if (errors.length > 0) {
  console.log(`\n${BOLD}Critical Production Blockers (${errors.length}):${RESET}`);
  errors.forEach(e => console.log(`  ${RED}✖ [FAIL]${RESET} ${e}`));
  console.log(`\n${BOLD}${RED}Result: FAILED. Fix the critical blockers above before deploying to production.${RESET}\n`);
  process.exit(1);
} else {
  console.log(`\n${BOLD}${GREEN}Result: READY! All mandatory production environment requirements passed.${RESET}\n`);
  process.exit(0);
}
