/**
 * Root Vercel Serverless Entrypoint for /api routes
 */
'use strict';
process.env.VERCEL = process.env.VERCEL || '1';

const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('../backend/src/app.cjs');
module.exports = app;
