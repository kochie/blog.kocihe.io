// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
// import { ProfilingIntegration } from '@sentry/profiling-node'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn:
        SENTRY_DSN ||
        'https://93d1763e43d24b2885baed0a99a74b02@o157203.ingest.sentry.io/5779239',
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate
      integrations: [
        // Add profiling integration to list of integrations
        // new ProfilingIntegration(),
      ],
      // ...
      // Note: if you want to override the automatic release value, do not set a
      // `release` value here - use the environment variable `SENTRY_RELEASE`, so
      // that it will also get attached to your source maps
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn:
        SENTRY_DSN ||
        'https://93d1763e43d24b2885baed0a99a74b02@o157203.ingest.sentry.io/5779239',
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1.0,
      // ...
      // Note: if you want to override the automatic release value, do not set a
      // `release` value here - use the environment variable `SENTRY_RELEASE`, so
      // that it will also get attached to your source maps
    })
  }
}