/**
 * Root Vercel Serverless Entrypoint for /api routes
 * Hardened for Vercel Lambda cold-starts, monorepo bundling, and graceful error recovery
 */
'use strict';
process.env.VERCEL = process.env.VERCEL || '1';

const path = require('path');

// Safe dotenv loading (production env variables are injected by Vercel directly)
try {
  const dotenv = require('dotenv');
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {
  // Non-fatal if dotenv or env files are absent
}

let app = null;
let bootError = null;

try {
  app = require('../backend/src/app.cjs');
} catch (err) {
  bootError = err;
  console.error('[Vercel Serverless Cold Boot Fatal Error]:', err);
}

module.exports = (req, res) => {
  if (bootError) {
    console.error('[Vercel Serverless Boot Failure Serving Request]:', bootError);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        success: false,
        code: 'SERVERLESS_BOOT_ERROR',
        message: 'Serverless initialization failed: ' + (bootError.message || String(bootError)),
        details: bootError.stack ? bootError.stack.split('\n').slice(0, 6) : []
      });
    }
    return;
  }

  try {
    return app(req, res);
  } catch (handlerErr) {
    console.error('[Vercel Serverless Uncaught Handler Error]:', handlerErr);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        success: false,
        code: 'HANDLER_ERROR',
        message: 'Request execution error: ' + (handlerErr.message || String(handlerErr))
      });
    }
  }
};

