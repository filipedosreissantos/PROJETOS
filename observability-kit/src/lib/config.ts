import type { ObservabilityConfig } from './types';

/**
 * Default configuration for the Observability Kit
 */
export const defaultConfig: ObservabilityConfig = {
  enabled: import.meta.env.PROD || import.meta.env.VITE_OBSERVABILITY_ENABLED === 'true',
  storageKey: 'observability_events',
  maxEvents: 500,
  maxMetrics: 100,
  endpoint: import.meta.env.VITE_OBSERVABILITY_ENDPOINT,
  sanitizeKeys: ['password', 'token', 'secret', 'authorization', 'cookie', 'apiKey', 'api_key', 'accessToken', 'access_token'],
  rateLimitMs: 1000,
  deduplicationWindowMs: 5000,
};

/**
 * Performance thresholds based on Web Vitals recommendations
 * https://web.dev/vitals/
 */
export const performanceThresholds = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  INP: { good: 200, needsImprovement: 500 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

/**
 * Storage keys for IndexedDB/LocalStorage
 */
export const STORAGE_KEYS = {
  EVENTS: 'observability_events',
  METRICS: 'observability_metrics',
  CORRELATION_ID: 'observability_correlation_id',
} as const;

/**
 * Get the current app version from environment
 */
export function getAppVersion(): string {
  return import.meta.env.VITE_APP_VERSION || '0.0.0';
}
