const Sentry = require("@sentry/node");

let integrations = [];
try {
  const { nodeProfilingIntegration } = require("@sentry/profiling-node");
  if (typeof nodeProfilingIntegration === 'function') {
    integrations.push(nodeProfilingIntegration());
  }
} catch (e) {
  // Profiling native addon may not be compiled in serverless / read-only environment
}

const rawDsn = process.env.SENTRY_DSN?.trim();
const validDsn = (rawDsn && !rawDsn.includes('REPLACE'))
  ? rawDsn
  : "https://edd804001db47618f14e156b1fd12cc2@o4512157730209792.ingest.us.sentry.io/4512158102913024";

try {
  Sentry.init({
    dsn: validDsn,
    integrations,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || (process.env.NODE_ENV === 'production' ? '0.1' : '1.0')),
    profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || (process.env.NODE_ENV === 'production' ? '0.1' : '1.0')),
    enabled: Boolean(validDsn) && !process.env.VERCEL, // Avoid overhead in ephemeral serverless invocations
  });
} catch (e) {
  // Gracefully degrade if Sentry fails to initialize
}
