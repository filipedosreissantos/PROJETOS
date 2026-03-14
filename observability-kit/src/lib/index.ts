// Types
export type {
  LogLevel,
  LogContext,
  LogEvent,
  WebVitalMetric,
  PerformanceThresholds,
  ObservabilityConfig,
  ErrorInfo,
} from './types';

// Logger
export { logger, ObservabilityLogger } from './logger';

// Config
export { defaultConfig, performanceThresholds, STORAGE_KEYS, getAppVersion } from './config';

// Web Vitals
export {
  initWebVitals,
  getMetrics,
  clearMetrics,
  getLatestMetrics,
  getMetricHistory,
  getMetricAverage,
} from './webVitals';
