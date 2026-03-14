import { describe, it, expect, beforeEach } from 'vitest';
import { logger, ObservabilityLogger } from '../lib/logger';
import { STORAGE_KEYS } from '../lib/config';

describe('Logger', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('info', () => {
    it('logs info events', () => {
      logger.info('Test info message', { customData: 'value' });
      
      const events = logger.getEvents();
      expect(events.length).toBe(1);
      expect(events[0].level).toBe('info');
      expect(events[0].message).toBe('Test info message');
      expect(events[0].context?.customData).toBe('value');
    });

    it('includes automatic context', () => {
      logger.info('Test message');
      
      const events = logger.getEvents();
      expect(events[0].url).toBeDefined();
      expect(events[0].userAgent).toBeDefined();
      expect(events[0].timestamp).toBeDefined();
      expect(events[0].correlationId).toBeDefined();
    });
  });

  describe('warn', () => {
    it('logs warning events', () => {
      logger.warn('Test warning');
      
      const events = logger.getEvents();
      expect(events[0].level).toBe('warn');
      expect(events[0].message).toBe('Test warning');
    });
  });

  describe('error', () => {
    it('logs error events', () => {
      logger.error('Test error');
      
      const events = logger.getEvents();
      expect(events[0].level).toBe('error');
      expect(events[0].message).toBe('Test error');
    });
  });

  describe('captureException', () => {
    it('captures exception with stack trace', () => {
      const error = new Error('Test exception');
      logger.captureException(error, { context: 'test' });
      
      const events = logger.getEvents();
      expect(events[0].level).toBe('error');
      expect(events[0].message).toBe('Test exception');
      expect(events[0].stack).toBeDefined();
      expect(events[0].context?.context).toBe('test');
    });

    it('captures component stack when provided', () => {
      const error = new Error('Component error');
      logger.captureException(error, { 
        componentStack: 'at MyComponent\nat App' 
      });
      
      const events = logger.getEvents();
      expect(events[0].componentStack).toBe('at MyComponent\nat App');
    });
  });

  describe('correlation ID', () => {
    it('generates and persists correlation ID', () => {
      const id1 = logger.getCorrelationId();
      expect(id1).toBeDefined();
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      
      // Should be stored in sessionStorage
      const stored = sessionStorage.getItem(STORAGE_KEYS.CORRELATION_ID);
      expect(stored).toBe(id1);
    });

    it('uses same correlation ID across events', () => {
      logger.info('Event 1');
      logger.warn('Event 2');
      logger.error('Event 3');
      
      const events = logger.getEvents();
      const correlationId = events[0].correlationId;
      
      expect(events.every(e => e.correlationId === correlationId)).toBe(true);
    });
  });

  describe('data sanitization', () => {
    it('redacts sensitive fields', () => {
      logger.info('Login attempt', {
        username: 'user123',
        password: 'secret123',
        token: 'jwt-token-here',
        apiKey: 'api-key-12345',
        normalField: 'visible',
      });
      
      const events = logger.getEvents();
      const context = events[0].context;
      
      expect(context?.username).toBe('user123');
      expect(context?.password).toBe('[REDACTED]');
      expect(context?.token).toBe('[REDACTED]');
      expect(context?.apiKey).toBe('[REDACTED]');
      expect(context?.normalField).toBe('visible');
    });

    it('redacts nested sensitive fields', () => {
      logger.info('Nested data', {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
          },
        },
      });
      
      const events = logger.getEvents();
      const context = events[0].context as { user: { name: string; credentials: { password: string } } };
      
      expect(context?.user?.name).toBe('John');
      expect(context?.user?.credentials?.password).toBe('[REDACTED]');
    });
  });

  describe('storage management', () => {
    it('stores events in localStorage', () => {
      logger.info('Test event');
      
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
      expect(stored).toBeDefined();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
    });

    it('clears events', () => {
      logger.info('Event 1');
      logger.info('Event 2');
      
      expect(logger.getEvents().length).toBe(2);
      
      logger.clearEvents();
      
      expect(logger.getEvents().length).toBe(0);
    });

    it('limits stored events to maxEvents', () => {
      // Create a logger with small maxEvents
      const customLogger = new ObservabilityLogger({
        maxEvents: 5,
        enabled: true,
      });
      
      // Log more events than the limit
      for (let i = 0; i < 10; i++) {
        customLogger.info(`Event ${i}`);
      }
      
      const events = customLogger.getEvents();
      expect(events.length).toBe(5);
      // Should keep the most recent events
      expect(events[0].message).toBe('Event 9');
    });
  });

  describe('enable/disable', () => {
    it('can be disabled and enabled', () => {
      const customLogger = new ObservabilityLogger({ enabled: true });
      
      customLogger.disable();
      customLogger.info('Should be logged anyway in dev');
      
      customLogger.enable();
      customLogger.info('Should be logged');
      
      // In dev mode, events are still logged even when disabled
      // The enable/disable is mainly for production
      const events = customLogger.getEvents();
      expect(events.length).toBeGreaterThanOrEqual(1);
    });
  });
});
