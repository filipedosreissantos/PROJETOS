import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { v4 as uuidv4 } from 'uuid';
import type { WebVitalMetric } from './types';
import { performanceThresholds, STORAGE_KEYS } from './config';
import { logger } from './logger';

type MetricName = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';

/**
 * Get the rating for a metric value based on thresholds
 */
function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = performanceThresholds[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Save a web vital metric to storage
 */
function saveMetric(metric: WebVitalMetric): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.METRICS);
    const metrics: WebVitalMetric[] = stored ? JSON.parse(stored) : [];
    
    metrics.unshift(metric);
    
    // Keep only latest 100 metrics
    if (metrics.length > 100) {
      metrics.length = 100;
    }
    
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  } catch (e) {
    console.error('[WebVitals] Failed to save metric:', e);
  }
}

/**
 * Process a web vital metric
 */
function handleMetric(metric: Metric): void {
  const name = metric.name as MetricName;
  const rating = getRating(name, metric.value);
  
  const webVitalMetric: WebVitalMetric = {
    id: uuidv4(),
    name,
    value: metric.value,
    rating,
    timestamp: new Date().toISOString(),
    correlationId: logger.getCorrelationId(),
  };
  
  saveMetric(webVitalMetric);
  
  // Log to observability system
  logger.info(`Web Vital: ${name}`, {
    value: metric.value,
    rating,
    delta: metric.delta,
    navigationType: metric.navigationType,
  });
  
  // Log warning for poor metrics
  if (rating === 'poor') {
    logger.warn(`Poor ${name} score detected`, {
      value: metric.value,
      threshold: performanceThresholds[name],
    });
  }
}

/**
 * Get all stored web vital metrics
 */
export function getMetrics(): WebVitalMetric[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.METRICS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all stored metrics
 */
export function clearMetrics(): void {
  localStorage.removeItem(STORAGE_KEYS.METRICS);
}

/**
 * Get the latest metric for each type
 */
export function getLatestMetrics(): Record<MetricName, WebVitalMetric | null> {
  const metrics = getMetrics();
  const latest: Record<MetricName, WebVitalMetric | null> = {
    CLS: null,
    FCP: null,
    INP: null,
    LCP: null,
    TTFB: null,
  };
  
  for (const metric of metrics) {
    if (!latest[metric.name]) {
      latest[metric.name] = metric;
    }
  }
  
  return latest;
}

/**
 * Get metrics history for a specific type
 */
export function getMetricHistory(name: MetricName, limit: number = 10): WebVitalMetric[] {
  const metrics = getMetrics();
  return metrics
    .filter((m) => m.name === name)
    .slice(0, limit);
}

/**
 * Calculate average for a metric type
 */
export function getMetricAverage(name: MetricName): number | null {
  const history = getMetricHistory(name, 20);
  if (history.length === 0) return null;
  
  const sum = history.reduce((acc, m) => acc + m.value, 0);
  return sum / history.length;
}

/**
 * Initialize web vitals tracking
 */
export function initWebVitals(): void {
  // Core Web Vitals
  onCLS(handleMetric);
  onLCP(handleMetric);
  onINP(handleMetric);
  
  // Other metrics
  onFCP(handleMetric);
  onTTFB(handleMetric);
  
  logger.info('Web Vitals tracking initialized');
}

export { performanceThresholds };
