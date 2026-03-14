import { v4 as uuidv4 } from 'uuid';
import type { LogLevel, LogEvent, LogContext, ObservabilityConfig } from './types';
import { defaultConfig, getAppVersion, STORAGE_KEYS } from './config';

/**
 * Observability Logger - A Sentry-like logging service
 * 
 * Features:
 * - Multiple log levels (info, warn, error)
 * - Automatic context capture (URL, userAgent, timestamp, version)
 * - Session correlation ID
 * - Data sanitization
 * - Rate limiting and deduplication
 * - LocalStorage persistence
 * - Mock endpoint transport
 */
class ObservabilityLogger {
  private config: ObservabilityConfig;
  private correlationId: string;
  private lastErrors: Map<string, number> = new Map();
  private rateLimitedUntil: number = 0;

  constructor(config: Partial<ObservabilityConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.correlationId = this.getOrCreateCorrelationId();
    this.setupGlobalHandlers();
  }

  /**
   * Get or create a session correlation ID
   */
  private getOrCreateCorrelationId(): string {
    const stored = sessionStorage.getItem(STORAGE_KEYS.CORRELATION_ID);
    if (stored) return stored;
    
    const newId = uuidv4();
    sessionStorage.setItem(STORAGE_KEYS.CORRELATION_ID, newId);
    return newId;
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        event.reason instanceof Error 
          ? event.reason 
          : new Error(String(event.reason)),
        { type: 'unhandledrejection' }
      );
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      // Ignore errors from browser extensions or cross-origin scripts
      if (!event.filename || event.filename.includes('extension://')) return;
      
      this.captureException(
        event.error || new Error(event.message),
        { 
          type: 'global_error',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      );
    });
  }

  /**
   * Sanitize sensitive data from context
   */
  private sanitize(data: unknown): unknown {
    if (data === null || data === undefined) return data;
    
    if (typeof data === 'string') return data;
    
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }
    
    if (typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const lowerKey = key.toLowerCase();
        if (this.config.sanitizeKeys.some(k => lowerKey.includes(k.toLowerCase()))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitize(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Check if we should deduplicate this error
   */
  private shouldDeduplicate(errorKey: string): boolean {
    const now = Date.now();
    const lastSeen = this.lastErrors.get(errorKey);
    
    if (lastSeen && (now - lastSeen) < this.config.deduplicationWindowMs) {
      return true;
    }
    
    this.lastErrors.set(errorKey, now);
    
    // Cleanup old entries
    if (this.lastErrors.size > 100) {
      const cutoff = now - this.config.deduplicationWindowMs;
      for (const [key, time] of this.lastErrors.entries()) {
        if (time < cutoff) this.lastErrors.delete(key);
      }
    }
    
    return false;
  }

  /**
   * Check rate limiting
   */
  private isRateLimited(): boolean {
    const now = Date.now();
    if (now < this.rateLimitedUntil) return true;
    this.rateLimitedUntil = now + this.config.rateLimitMs;
    return false;
  }

  /**
   * Create a log event with automatic context
   */
  private createEvent(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEvent {
    return {
      id: uuidv4(),
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? (this.sanitize(context) as LogContext) : undefined,
      correlationId: this.correlationId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      appVersion: getAppVersion(),
      stack: error?.stack,
    };
  }

  /**
   * Save event to storage
   */
  private saveEvent(event: LogEvent): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const events: LogEvent[] = stored ? JSON.parse(stored) : [];
      
      events.unshift(event);
      
      // Keep only the latest maxEvents
      if (events.length > this.config.maxEvents) {
        events.length = this.config.maxEvents;
      }
      
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('[Observability] Failed to save event to storage:', e);
    }
  }

  /**
   * Send event to endpoint (mock)
   */
  private async sendToEndpoint(event: LogEvent): Promise<void> {
    if (!this.config.endpoint) return;
    
    try {
      // Mock sending to endpoint
      console.log('[Observability] Would send to endpoint:', this.config.endpoint, event);
      
      // In real implementation:
      // await fetch(this.config.endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });
    } catch (e) {
      console.error('[Observability] Failed to send event to endpoint:', e);
    }
  }

  /**
   * Process and record an event
   */
  private record(event: LogEvent): void {
    if (!this.config.enabled && import.meta.env.PROD) return;
    
    // Always log to console in development
    if (import.meta.env.DEV) {
      const logFn = event.level === 'error' ? console.error : event.level === 'warn' ? console.warn : console.info;
      logFn(`[Observability:${event.level.toUpperCase()}]`, event.message, event);
    }
    
    this.saveEvent(event);
    this.sendToEndpoint(event);
  }

  /**
   * Log an info event
   */
  info(message: string, context?: LogContext): void {
    const event = this.createEvent('info', message, context);
    this.record(event);
  }

  /**
   * Log a warning event
   */
  warn(message: string, context?: LogContext): void {
    const event = this.createEvent('warn', message, context);
    this.record(event);
  }

  /**
   * Log an error event
   */
  error(message: string, context?: LogContext): void {
    if (this.isRateLimited()) return;
    
    const event = this.createEvent('error', message, context);
    this.record(event);
  }

  /**
   * Capture an exception with full stack trace
   */
  captureException(error: Error, context?: LogContext & { componentStack?: string }): void {
    const errorKey = `${error.name}:${error.message}`;
    if (this.shouldDeduplicate(errorKey)) return;
    if (this.isRateLimited()) return;
    
    const event = this.createEvent('error', error.message, context, error);
    
    if (context?.componentStack) {
      event.componentStack = context.componentStack;
    }
    
    this.record(event);
  }

  /**
   * Get all stored events
   */
  getEvents(): LogEvent[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear all stored events
   */
  clearEvents(): void {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
  }

  /**
   * Get the current session correlation ID
   */
  getCorrelationId(): string {
    return this.correlationId;
  }

  /**
   * Update configuration
   */
  configure(config: Partial<ObservabilityConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Enable logging
   */
  enable(): void {
    this.config.enabled = true;
  }

  /**
   * Disable logging
   */
  disable(): void {
    this.config.enabled = false;
  }
}

// Export singleton instance
export const logger = new ObservabilityLogger();

// Export class for custom instances
export { ObservabilityLogger };
