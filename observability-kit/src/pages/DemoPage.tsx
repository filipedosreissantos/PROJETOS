import { useState } from 'react';
import type { ReactNode } from 'react';
import { logger } from '../lib';

/**
 * Component that throws an error on purpose (for testing Error Boundary)
 */
function BuggyComponent(): ReactNode {
  throw new Error('This is a test error from a buggy component! 💀');
}

/**
 * Demo Page - Test all observability features
 */
export function DemoPage() {
  const [showBuggy, setShowBuggy] = useState(false);

  // Test logging functions
  const handleLogInfo = () => {
    logger.info('User clicked the info button', {
      action: 'demo_info_click',
      timestamp: Date.now(),
      customData: { foo: 'bar' },
    });
    alert('Info event logged! Check the Observability page.');
  };

  const handleLogWarning = () => {
    logger.warn('This is a warning message', {
      action: 'demo_warning_click',
      severity: 'medium',
      suggestion: 'Consider improving performance',
    });
    alert('Warning event logged! Check the Observability page.');
  };

  const handleLogError = () => {
    logger.error('Something went wrong in the demo', {
      action: 'demo_error_click',
      errorCode: 'DEMO_001',
      details: 'This is a simulated error',
    });
    alert('Error event logged! Check the Observability page.');
  };

  const handleCaptureException = () => {
    try {
      throw new Error('This is a caught exception for demo purposes');
    } catch (error) {
      logger.captureException(error as Error, {
        action: 'demo_exception',
        caught: true,
      });
      alert('Exception captured! Check the Observability page.');
    }
  };

  const handleUnhandledRejection = () => {
    // This will trigger the global unhandledrejection handler
    Promise.reject(new Error('Unhandled promise rejection demo'));
    alert('Unhandled rejection triggered! Check the Observability page.');
  };

  const handleTriggerErrorBoundary = () => {
    setShowBuggy(true);
  };

  const handleTestSanitization = () => {
    logger.info('Testing data sanitization', {
      username: 'pharaoh',
      password: 'super_secret_123', // Should be redacted
      apiKey: 'sk-1234567890', // Should be redacted
      token: 'jwt_token_here', // Should be redacted
      normalData: 'this is visible',
    });
    alert('Event with sensitive data logged! Check if password/token are redacted in Observability page.');
  };

  // If buggy component is triggered, throw to test Error Boundary
  if (showBuggy) {
    return <BuggyComponent />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="text-5xl mb-4 animate-float">𓆣</div>
        <h1 className="text-2xl font-bold text-[var(--color-papyrus)] mb-2">
          Sacred Demonstrations
        </h1>
        <p className="text-[var(--color-pharaoh-gold)] opacity-70">
          Test all observability features in action
        </p>
      </div>

      {/* Logging Section */}
      <div className="card-papyrus p-6">
        <h2 className="text-xl font-bold text-[var(--color-nile-blue-dark)] mb-4 flex items-center gap-2">
          <span>📜</span> Logger API
        </h2>
        <p className="text-[var(--color-temple-stone)] mb-6">
          Test the logging methods. All events are captured with automatic context.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <button onClick={handleLogInfo} className="btn-nile text-sm">
            Log Info
          </button>
          <button 
            onClick={handleLogWarning} 
            className="px-4 py-2 rounded border-2 text-sm font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #FF8C00 0%, #CC7000 100%)',
              borderColor: '#FF8C00',
              color: '#1A1A1A',
            }}
          >
            Log Warning
          </button>
          <button 
            onClick={handleLogError}
            className="px-4 py-2 rounded border-2 text-sm font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',
              borderColor: '#8B0000',
              color: '#F4E9D5',
            }}
          >
            Log Error
          </button>
          <button onClick={handleCaptureException} className="btn-pharaoh text-sm">
            Capture Exception
          </button>
        </div>
      </div>

      {/* Error Triggers Section */}
      <div className="card-papyrus p-6">
        <h2 className="text-xl font-bold text-[var(--color-nile-blue-dark)] mb-4 flex items-center gap-2">
          <span>💀</span> Error Triggers
        </h2>
        <p className="text-[var(--color-temple-stone)] mb-6">
          Test error handling mechanisms including Error Boundary and global handlers.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleTriggerErrorBoundary}
            className="px-4 py-2 rounded border-2 text-sm font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',
              borderColor: '#D4AF37',
              color: '#F4E9D5',
            }}
          >
            💥 Trigger Error Boundary
          </button>
          <button 
            onClick={handleUnhandledRejection}
            className="px-4 py-2 rounded border-2 text-sm font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #8B0000 0%, #5C0000 100%)',
              borderColor: '#D4AF37',
              color: '#F4E9D5',
            }}
          >
            ⚡ Unhandled Promise Rejection
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-[var(--color-papyrus-light)] rounded border border-[var(--color-ra-warning)]">
          <p className="text-sm text-[var(--color-temple-stone)]">
            <strong>Note:</strong> Triggering the Error Boundary will replace this page with an error fallback. 
            Use the "Try Again" button to recover.
          </p>
        </div>
      </div>

      {/* Data Sanitization Section */}
      <div className="card-papyrus p-6">
        <h2 className="text-xl font-bold text-[var(--color-nile-blue-dark)] mb-4 flex items-center gap-2">
          <span>🔐</span> Data Sanitization
        </h2>
        <p className="text-[var(--color-temple-stone)] mb-6">
          Test automatic sanitization of sensitive data (passwords, tokens, API keys).
        </p>
        
        <button onClick={handleTestSanitization} className="btn-pharaoh text-sm">
          Test Sanitization
        </button>
        
        <div className="mt-4 p-4 bg-[var(--color-papyrus-light)] rounded">
          <p className="text-sm text-[var(--color-temple-stone)]">
            Click the button and check the Observability page. 
            Fields like <code className="bg-[var(--color-papyrus-dark)] px-1 rounded">password</code>, 
            <code className="bg-[var(--color-papyrus-dark)] px-1 rounded">token</code>, and 
            <code className="bg-[var(--color-papyrus-dark)] px-1 rounded">apiKey</code> should show as 
            <code className="bg-[var(--color-papyrus-dark)] px-1 rounded">[REDACTED]</code>.
          </p>
        </div>
      </div>

      {/* Code Examples */}
      <div className="card-papyrus p-6">
        <h2 className="text-xl font-bold text-[var(--color-nile-blue-dark)] mb-4 flex items-center gap-2">
          <span>📖</span> Usage Examples
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[var(--color-nile-blue-dark)] mb-2">Basic Logging</h3>
            <pre className="json-viewer text-sm">
{`import { logger } from './lib';

// Log info
logger.info('User logged in', { userId: '123' });

// Log warning
logger.warn('API response slow', { latency: 2500 });

// Log error
logger.error('Failed to fetch data', { endpoint: '/api/users' });

// Capture exception
try {
  throw new Error('Something broke');
} catch (error) {
  logger.captureException(error, { context: 'checkout' });
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-[var(--color-nile-blue-dark)] mb-2">Error Boundary</h3>
            <pre className="json-viewer text-sm">
{`import { AppErrorBoundary } from './components/errors';

function App() {
  return (
    <AppErrorBoundary
      onError={(error, info) => {
        // Custom error handling
        console.log('Error caught:', error);
      }}
    >
      <YourApp />
    </AppErrorBoundary>
  );
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Decorative Footer */}
      <div className="text-center text-[var(--color-pharaoh-gold)] text-2xl tracking-widest opacity-60">
        𓃭 𓆣 𓊖 𓇳 𓆸
      </div>
    </div>
  );
}

export default DemoPage;
