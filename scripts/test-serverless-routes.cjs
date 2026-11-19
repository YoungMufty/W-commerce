/**
 * Verification test script for Vercel serverless deployment setup
 */
'use strict';
process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';

const app = require('../api/index.js');
const http = require('http');

async function runTests() {
  console.log('--- Starting Vercel Serverless Route Audit & Test ---');
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Ephemeral test server running at ${baseUrl}`);

  const endpoints = [
    { name: 'Health check', path: '/api/v1/health', expectedStatus: [200, 503] },
    { name: 'Root health check', path: '/health', expectedStatus: [200, 503] },
    { name: 'Products endpoint', path: '/api/v1/products', expectedStatus: [200] },
    { name: 'Feed endpoint', path: '/api/v1/feed', expectedStatus: [200] },
    { name: 'Store by ID (mock id)', path: '/api/v1/stores/store-sample-123', expectedStatus: [200, 404] },
    { name: 'Google Auth initiation', path: '/api/v1/auth/google', headers: { Accept: 'application/json' }, expectedStatus: [200, 302] },
    { name: 'Non-existent route', path: '/api/v1/non-existent-route-404', expectedStatus: [404] }
  ];

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const url = new URL(ep.path, baseUrl);
      const res = await new Promise((resolve, reject) => {
        const req = http.get(url, { headers: ep.headers || {} }, (resp) => {
          let data = '';
          resp.on('data', chunk => data += chunk);
          resp.on('end', () => resolve({ statusCode: resp.statusCode, headers: resp.headers, body: data }));
        });
        req.on('error', reject);
        req.setTimeout(5000, () => {
          req.destroy(new Error('Request timed out'));
        });
      });

      let json = null;
      try {
        json = JSON.parse(res.body);
      } catch (e) {
        // May be redirect HTML
      }

      const statusOk = ep.expectedStatus.includes(res.statusCode);
      if (statusOk) {
        console.log(`✅ [${res.statusCode}] ${ep.name} (${ep.path})`);
        if (json) {
          console.log(`   Sample response: success=${json.success}, status=${json.status || 'N/A'}, count=${json.count !== undefined ? json.count : 'N/A'}`);
        }
        passed++;
      } else {
        console.error(`❌ [${res.statusCode}] ${ep.name} (${ep.path}) - Expected: ${ep.expectedStatus.join(', ')}`);
        console.error(`   Body: ${res.body.slice(0, 200)}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ ${ep.name} (${ep.path}) threw error: ${err.message}`);
      failed++;
    }
  }

  // Test global error handler resilience
  console.log('\n--- Testing Global Error Handler Resilience ---');
  // POST invalid JSON to /api/v1/products or another endpoint to trigger express error handler
  try {
    const res = await new Promise((resolve, reject) => {
      const postReq = http.request(`${baseUrl}/api/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve({ statusCode: resp.statusCode, body: data }));
      });
      postReq.on('error', reject);
      postReq.write('{ invalid json: "broken'); // Malformed JSON triggers express body-parser SyntaxError
      postReq.end();
    });

    const parsed = JSON.parse(res.body);
    if ((res.statusCode === 400 || res.statusCode === 500) && parsed.success === false && parsed.message) {
      console.log(`✅ Global Error Handler caught body parser / unexpected error: status=${res.statusCode}, message="${parsed.message}"`);
      passed++;
    } else {
      console.error(`❌ Unexpected error response: ${res.statusCode} ${res.body}`);
      failed++;
    }
  } catch (err) {
    console.error(`❌ Global error test threw exception: ${err.message}`);
    failed++;
  }

  server.close();

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
