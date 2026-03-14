/**
 * Types for the Observability Kit
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEvent {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  correlationId: string;
  url: string;
  userAgent: string;
  appVersion: string;
  stack?: string;
  componentStack?: string;
}

export interface WebVitalMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: string;
  correlationId: string;
}

export interface PerformanceThresholds {
  CLS: { good: number; needsImprovement: number };
  FCP: { good: number; needsImprovement: number };
  FID: { good: number; needsImprovement: number };
  INP: { good: number; needsImprovement: number };
  LCP: { good: number; needsImprovement: number };
  TTFB: { good: number; needsImprovement: number };
}

export interface ObservabilityConfig {
  enabled: boolean;
  storageKey: string;
  maxEvents: number;
  maxMetrics: number;
  endpoint?: string;
  sanitizeKeys: string[];
  rateLimitMs: number;
  deduplicationWindowMs: number;
}

export interface ErrorInfo {
  componentStack?: string;
}
